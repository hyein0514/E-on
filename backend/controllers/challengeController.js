const { Op } = require('sequelize');
const db = require('../models');
const { ChallengeInterest, ChallengeVision, Interests, Visions, Challenge, ChallengeDay, Attachment, ParticipatingChallenge, User, Bookmark } = db;

// const Challenge     = require('../models/Challenge');
// const ChallengeDay  = require('../models/ChallengeDay');
// const Attachment      = require('../models/Attachment');
// const Interests       = require('../models/Interests');
// const Visions         = require('../models/Visions');
// const User  = require('../models/User');
// const Bookmark = require('../models/Bookmark');
// const ParticipatingChallenge = require('../models/ParticipatingChallenge');
// const ChallengeInterest = require('../models/ChallengeInterest');
// const ChallengeVision = require('../models/ChallengeVision');


/* ───────────────────────── 챌린지 개설 ───────────────────────── */
exports.create = async (req, res, next) => {
  const body = req.body.meta ? JSON.parse(req.body.meta) : req.body;
  const files = req.files ?? []
  
  try {
    //필수값 검증
    const {
      title, description,
      minimum_age, maximum_age, maximum_people,
      application_deadline, start_date, end_date,
      is_recuming = false, repeat_type = null,
      intermediate_participation = false,
      creator_contact,
      user_id, 
      days = [],
      interestIds = [],             
      visionIds   = []              
    } = body; 

    /*  필수값 검증 */
    if (!title || !description || !creator_contact || !user_id) {
      return res.status(400).json({ error: '필수 필드 누락' });
    }

    // 트랜잭션 시작
    //t는 트랜잭션 나타내는 객체로, 모든 쿼리에 {transaction:t} 옵션을 넘김
    const result = await Challenge.sequelize.transaction(async (t) => {
      // Challenge INSERT
      const challenge = await Challenge.create({
        title, description,
        minimum_age, maximum_age, maximum_people,
        application_deadline, start_date, end_date,
        is_recuming, repeat_type,
        intermediate_participation,
        creator_contact,
        user_id 
      }, { transaction: t });

      // 요일 INSERT -> days배열요소 d하나당 {챌린지 id,요일}객체 만들어서 bulkcreate로 한번에 삽입
      if (is_recuming && days.length) {
        const bulk = days.map(d => ({
          challenge_id: challenge.challenge_id,
          day_of_week : d
        }));
        await ChallengeDay.bulkCreate(bulk, { transaction: t });
      }
      console.log("프론트에서 넘어온 interestIds:", interestIds);
      console.log("프론트에서 넘어온 visionIds:", visionIds);

      // 관심/진로 매핑
      if (interestIds.length) await challenge.addInterests(interestIds, { transaction: t });
      if (visionIds.length)   await challenge.addVisions(visionIds,   { transaction: t });
  
       // 첨부파일
       if (files.length) {
        const attachRows = files.map(f => ({
          challenge_id    : challenge.challenge_id,
          attachment_name : f.originalname,
          url             : `/uploads/${f.filename}`,   // 실제 경로 or CDN URL
          attachment_type : f.mimetype.startsWith('image') ? '이미지' : '기타'
        }));
        await Attachment.bulkCreate(attachRows, { transaction:t });
      }
      // 최종결과 재조회
      return Challenge.findByPk(challenge.challenge_id, {
        include:[
          { model:ChallengeDay, as:'days', attributes:['day_of_week'] },
          { model:Attachment , as:'attachments', attributes:['attachment_id','url','attachment_type'] }
        ],
        transaction: t
      });
    });
    res.status(201).json({
      challenge_id: result.challenge_id,
      title: result.title,
      description: result.description,
      minimum_age: result.minimum_age,
      maximum_age: result.maximum_age,
      maximum_people: result.maximum_people,
      application_deadline: result.application_deadline,
      start_date: result.start_date,
      end_date: result.end_date,
      is_recuming: result.is_recuming,
      repeat_type: result.repeat_type,
      activity_types: {
        interests: interestIds,
        visions  : visionIds
      },
      days: result.days.map(d => d.day_of_week),
      attachments  : result.attachments,
      intermediate_participation: result.intermediate_participation,
      challenge_state: result.challenge_state,
      created_at: result.created_at,
      user_id: result.user_id,
      creator_contact: result.creator_contact,
    });
  } catch (err) {
    console.error('▶▶ SQL Error Message:', err.parent?.sqlMessage || err.message);
    next(err);
  }
};

/* ───────────────────────── 챌린지 조회 ───────────────────────── */

exports.list = async (req, res, next) => {
  try {
    /* ── 1) 쿼리 파라미터 ───────────────────────── */
    const keyword    = req.query.q      || "";
    const state      = req.query.state;
    const dateStr    = req.query.date;

    const minAge =
      req.query.minAge !== undefined && req.query.minAge !== ""
        ? Number(req.query.minAge)
        : null;
    const maxAge =
      req.query.maxAge !== undefined && req.query.maxAge !== ""
        ? Number(req.query.maxAge)
        : null;

    const page       = Number(req.query.page)  || 1;
    const limit      = Number(req.query.limit) || 20;
    const offset     = (page - 1) * limit;

    const interestId = req.query.interestId ? Number(req.query.interestId) : null;
    const visionId   = req.query.visionId   ? Number(req.query.visionId)   : null;
    const userId     = req.query.user_id    ? Number(req.query.user_id)    : null;


    /* ── 2) where 객체 구성 ───────────────────────── */
    const where = {};

    // 키워드 필터
    if (keyword) {
      where[Op.or] = [
        { challenge_title:       { [Op.like]: `%${keyword}%` } },
        { challenge_description: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 상태 필터
    if (state) {
      where.challenge_state = state;
    }

    // 날짜 필터
    if (dateStr) {
      const target = new Date(dateStr);
      where.start_date = { [Op.lte]: target };
      where.end_date   = { [Op.gte]: target };
    }

    // 나이 필터
    if (minAge !== null) {
    where.minimum_age = { [Op.gte]: minAge };
    }
    if (maxAge !== null) {
      where.maximum_age = { [Op.lte]: maxAge };
    }

    /* ── 3) include 배열 구성 ───────────────────────── */
    const include = [
      {
        model: ChallengeDay,
        as: 'days',
        attributes: ['day_of_week']
      },
      {
        model: Attachment,
        as: 'attachments',
        attributes: ['url']
      }
    ];

    // 3-1) 관심사 필터
    if (interestId) {
      include.push({
        model: Interests,
        as: 'interests',
        required: true,
        through: {
          model: ChallengeInterest,
          as: 'ChallengeInterest',
          where: { interest_id: interestId },
          attributes: []       // 조인 테이블(in Steering) 데이터 노출 안 함
        },
        attributes: ['interest_id', 'interest_detail']
      });
    } else {
      // 필터가 없을 때라도 순수한 관심사 정보만 포함
      include.push({
        model: Interests,
        as: 'interests',
        through: { attributes: [] }, // 조인 테이블 데이터 숨김
        attributes: ['interest_id', 'interest_detail']
      });
    }

    // 3-2) 비전 필터
    if (visionId) {
      include.push({
        model: Visions,
        as: 'visions',
        required: true,
        through: {
          model: ChallengeVision,
          as: 'ChallengeVision',
          where: { vision_id: visionId },
          attributes: []      // 조인 테이블 데이터 숨김
        },
        attributes: ['vision_id', 'vision_detail']
      });
    } else {
      include.push({
        model: Visions,
        as: 'visions',
        through: { attributes: [] }, // 조인 테이블 데이터 숨김
        attributes: ['vision_id', 'vision_detail']
      });
    }

    /* ── 4) 조회 & 페이징 ───────────────────────── */
    const { count, rows } = await Challenge.findAndCountAll({
      where,
      include,
      distinct: true,               // 조인으로 인한 중복 방지
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    /* ── 5) 로그인 유저 참여정보 매핑 ───────────────────────── */
    let participationsMap = {};
    if (userId) {
      const challengeIds = rows.map((c) => c.challenge_id);
      const participations = await ParticipatingChallenge.findAll({
        where: {
          challenge_id: challengeIds,
          user_id:      userId
        }
      });
      participationsMap = participations.reduce((acc, p) => {
        acc[p.challenge_id] = p;
        return acc;
      }, {});
    }

    /* ── 6) my_participation 필드 추가 ───────────────────────── */
    rows.forEach((row) => {
      if (userId) {
        const p = participationsMap[row.challenge_id];
        row.setDataValue(
          'my_participation',
          p
            ? {
                participating_id:    p.participating_id,
                participating_state: p.participating_state
              }
            : null
        );
      }
    });

    /* ── 7) 결과 응답 ───────────────────────── */
    res.json({
      totalItems:  count,
      challenges:  rows,
      totalPages:  Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    next(err);
  }
};




/* ───────────────────────── 챌린지 상세조회 ───────────────────────── */
exports.detail = async (req, res, next) => {
  try {
    const id = req.params.id;

    const userId = req.query.user_id;

     // (1) 공통 include 항목들
    const includeArr = [
      {
        model: User,
        as: "creator",
        attributes: ["user_id", "name", "email"]
      },
      {
        model: ChallengeDay,
        as: "days",
        attributes: ["day_of_week"]
      },
      {
        model: Attachment,
        as: "attachments",
        attributes: ["attachment_id", "url", "attachment_type"]
      },
      {
        model: Interests,
        as: "interests",
        through: { attributes: [] },
        attributes: ["interest_id", "interest_detail"]
      },
      {
        model: Visions,
        as: "visions",
        through: { attributes: [] },
        attributes: ["vision_id", "vision_detail"]
      }
    ];

    // (2) userId가 정의되어 있을 때만, ParticipatingChallenge를 include
    if (userId !== undefined) {
      includeArr.push({
        model: ParticipatingChallenge,
        as: "participants", // Challenge 모델에서 정의된 alias
        where: { user_id: userId },
        required: false,
        attributes: ["participating_id", "participating_state"]
      });
    }

    // (3) findByPk 호출
    const challenge = await Challenge.findByPk(id, {
      include: includeArr
    });

    if (!challenge) {
      return res.status(404).json({ error: "존재하지 않는 챌린지" });
    }

    // (4) 북마크 여부 체크
    let is_bookmarked = false;
    if (userId) {
      const bookmark = await Bookmark.findOne({
        where: { challenge_id: id, user_id: userId }
      });
      is_bookmarked = !!bookmark;
    }

    // (5) my_participation 재구성
    let myParticipation = null;
    if (userId !== undefined && challenge.participants && challenge.participants.length > 0) {
      // participants[0]에 해당 userId의 참여 레코드가 들어옴
      const pc = challenge.participants[0];
      myParticipation = {
        participating_id:    pc.participating_id,
        participating_state: pc.participating_state
      };
    }
    

    // const challenge = await Challenge.findByPk(id, {
    //   include: [
    //     { model: User,           as: 'creator',   attributes: ['user_id','name','email'] },
    //     { model: ChallengeDay,   as: 'days',      attributes: ['day_of_week'] },
    //     { model: Attachment,     as: 'attachments',
    //       attributes: ['attachment_id','url','attachment_type'] },
    //     { model: Interests,      as: 'interests',
    //       through:{ attributes:[] }, attributes:['interest_id','interest_detail'] },
    //     { model: Visions,        as: 'visions',
    //       through:{ attributes:[] }, attributes:['vision_id','vision_detail'] },
    //       {
    //       model: ParticipatingChallenge,
    //       as: "participants",  // alias
    //       where: { user_id: userId },
    //       required: false,         // userId 참여 기록이 없어도 챌린지를 리턴하기 위해 false
    //       attributes: ["participating_id", "participating_state"]
    //     }
    //   ]
    // });

    

    // if (!challenge) return res.status(404).json({ error:'존재하지 않는 챌린지' });

    //  // ★ 여기서 북마크 여부 체크 (user_id 있으면)
    // // 북마크 여부 조회 (userId가 있을 때만)
    //   let is_bookmarked = false;
    //   if (userId) {
    //     const bookmark = await Bookmark.findOne({
    //       where: { challenge_id: id, user_id: userId }
    //     });
    //     is_bookmarked = !!bookmark;
    //   }

    //   let myParticipation = null;
    //    if (challenge.my_participation && challenge.my_participation.length > 0) {
    //   // 배열이지만 where:user_id이므로 인덱스 0에 값이 하나만 들어옴
    //   const mp = challenge.my_participation[0];
    //     myParticipation = {
    //       participating_id:    mp.participating_id,
    //       participating_state: mp.participating_state
    //     };
    //   }

    /* 응답 정리 */
    res.json({
      challenge_id: challenge.challenge_id,
      title       : challenge.title,
      description : challenge.description,
      age_range   : `${challenge.minimum_age} ~ ${challenge.maximum_age}`,
      maximum_people: challenge.maximum_people,
      application_deadline: challenge.application_deadline,
      duration    : { start: challenge.start_date, end: challenge.end_date },
      is_recuming : challenge.is_recuming,
      repeat_type : challenge.repeat_type,
      intermediate_participation: challenge.intermediate_participation,
      challenge_state: challenge.challenge_state,
      creator     : challenge.creator,                
      days        : challenge.days.map(d=>d.day_of_week),
      attachments : challenge.attachments,
      interests   : challenge.interests,
      visions     : challenge.visions,
      creator_contact: challenge.creator_contact,
      created_at  : challenge.created_at,
      is_bookmarked,
      my_participation: myParticipation,
    });
  } catch (err) {
    console.error('▶▶ SQL Error Message:', err.parent?.sqlMessage);
    next(err);
  }
};

/* ───────────────────────── 챌린지 수정 ───────────────────────── */
exports.update = async(req,res,next)=>{
  try{
    const id = req.params.id;
    const body = req.body;

    const challenge = await Challenge.findByPk(id);
    if (!challenge) return res.status(404).json({error:'챌린지 없음'});

    const updatetable = [
      'title','description','minimum_age','maximum_age',
      'maximum_people','application_deadline','start_date','end_date',
      'is_recuming','repeat_type','intermediate_participation',
      'creator_contact'
    ];
    updatetable.forEach(f => {if (body[f] !== undefined) challenge[f] = body[f];});

    // ── (2) ▶ challenge_state(상태) 업데이트 로직 추가 ──
    if (body.challenge_state !== undefined) {
      const newState = body.challenge_state;
      const allowed = ['ACTIVE', 'CLOSED', 'CANCELLED'];
      if (!allowed.includes(newState)) {
        return res.status(400).json({ error: '잘못된 상태 값' });
      }
      challenge.challenge_state = newState;
    }
    await challenge.save();
    // 요일 수정
    if (body.days){
      await ChallengeDay.destroy({where:{challenge_id:id}});
      if (body.is_recuming && body.days.length){
        await ChallengeDay.bulkCreate(
          body.days.map(d => ({challenge_id:id, day_of_week:d}))
        );
      }
    }

    // 관심/진로 매핑 수정
    if (body.interestIds) await challenge.setInterests(body.interestIds);
    if (body.visionIds  ) await challenge.setVisions  (body.visionIds  );

    res.json({ message:'수정 완료' });

  }catch(err){next(err);}
}


/* ───────────────────────── 챌린지 삭제 ───────────────────────── */
exports.remove = async(req,res,next)=>{
  try{
    const id = req.params.id;
    const rows = await Challenge.destroy({ where:{ challenge_id:id } });
    if (!rows) return res.status(404).json({ error:'챌린지 없음' });
    res.status(204).end();
  }catch(err){next(err);}
}

/* ───────────────────────── 챌린지 상태변경 ───────────────────────── */
exports.changeState = async(req,res,next)=>{
  try{
    const id    = req.params.id;
    const state = req.body.state;       // 'ACTIVE' | 'CLOSED' | 'CANCELLED'

    if (!['ACTIVE','CLOSED','CANCELLED'].includes(state))
      return res.status(400).json({ error:'잘못된 상태 값' });

    const challenge = await Challenge.findByPk(id);
    if (!challenge) return res.status(404).json({ error:'챌린지 없음' });

    challenge.challenge_state = state;
    await challenge.save();
    res.json({ challenge_id:id, challenge_state:state });

  }catch(err){next(err);}
}

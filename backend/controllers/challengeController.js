const { Op } = require('sequelize');
const Challenge     = require('../models/Challenge');
const ChallengeDay  = require('../models/ChallengeDay');
const Attachment      = require('../models/Attachment');
const Interests       = require('../models/Interests');
const Visions         = require('../models/Visions');
const VisionCategory   = require('../models/VisionCategory');
const InterestCategory = require('../models/InterestCategory');
const User  = require('../models/User');

//1) 챌린지 개설
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

//2) 챌린지 조회
exports.list = async (req, res, next) => {
  try {
    /* ── 1) 쿼리 파라미터 ───────────────────────── */
    const keyword      = req.query.q      || '';
    const state        = req.query.state;               // ACTIVE | CLOSED | CANCELLED
    const activityType = req.query.activityType;        // 교과 | 비교과 | 진로
    const dateStr      = req.query.date;                // YYYY-MM-DD
    const minAge       = req.query.minAge ? Number(req.query.minAge) : null;
    const maxAge       = req.query.maxAge ? Number(req.query.maxAge) : null;
    const page         = Number(req.query.page)  || 1;
    const limit        = Number(req.query.limit) || 20;
    const offset       = (page - 1) * limit;

    //DB에 보낼 where 객체 만들기
    const where = {};

    // 키워드 필터 (부분 일치)
    if (keyword) {
      where[Op.or] = [
        { title:       { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 상태 (모집중=ACTIVE, 마감=CLOSED, 취소=CANCELLED)
    if (state) where.challenge_state = state;

    // 날짜 (시작일<= 날짜 <= 종료일)
    if (dateStr) {
      const target = new Date(dateStr);
      where.start_date = { [Op.lte]: target };
      where.end_date   = { [Op.gte]: target };
    }

    // 나이
    if (minAge !== null) {
      where.maximum_age = { ...(where.maximum_age || {}), [Op.gte]: minAge };
    }
    if (maxAge !== null) {
      where.minimum_age = { ...(where.minimum_age || {}), [Op.lte]: maxAge };
    }

    /* ── 3) include (활동 타입 필터) ─────────────── */
    const include = [
      { model: ChallengeDay, as:'days', attributes:['day_of_week'] },
      { model: Attachment,   as:'attachments', attributes:['url'] }
    ];

    // 활동유형이 '교과'나 '비교과'인 경우 -> 관심 테이블에서
    if (activityType === '교과' || activityType === '비교과') {
      include.push({
        model: Interests,
        as: 'interests',
        required: true,
        include: [{
          model: InterestCategory,
          as: 'category',
          where: { category_name: activityType }
        }],
        attributes: []
      });
    } else if (activityType === '진로') {
      include.push({
        model: Visions,
        as: 'visions',
        required: true,
        include: [{
          model: VisionCategory,
          as: 'category',
          where: { category_name: '진로' }
        }],
        attributes: []
      });
    }
    /* ───────────────────────────────────────────── */

    /* ── 4) 조회 & 페이징 ───────────────────────── */
    const { count, rows } = await Challenge.findAndCountAll({
      where,
      include,
      distinct: true,                 // 중복 count 방지
      limit,
      offset,
      order:[['created_at','DESC']] //최신 등록순 정렬
    });

    /* ── 5) 응답 ────────────────────────────────── */
    res.json({
      total : count,
      page  : page,
      limit : limit,
      items : rows
    });
  } catch (err) {
    next(err);
  }
};

// 3) 챌린지 상세 조회
exports.detail = async (req, res, next) => {
  try {
    const id = req.params.id;

    const challenge = await Challenge.findByPk(id, {
      include: [
        { model: User,           as: 'creator',   attributes: ['user_id','name','email'] },
        { model: ChallengeDay,   as: 'days',      attributes: ['day_of_week'] },
        { model: Attachment,     as: 'attachments',
          attributes: ['attachment_id','url','attachment_type'] },
        { model: Interests,      as: 'interests',
          through:{ attributes:[] }, attributes:['interest_id','interest_detail'] },
        { model: Visions,        as: 'visions',
          through:{ attributes:[] }, attributes:['vision_id','vision_detail'] }
      ]
    });

    if (!challenge) return res.status(404).json({ error:'존재하지 않는 챌린지' });

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
      created_at  : challenge.created_at
    });
  } catch (err) {
    console.error('▶▶ SQL Error Message:', err.parent?.sqlMessage);
    next(err);
  }
};

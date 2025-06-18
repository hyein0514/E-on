const { Op } = require('sequelize');
const ParticipatingChallenge  = require('../models/ParticipatingChallenge');
const ParticipatingAttendance = require('../models/participatingAttendance');
const Challenge               = require('../models/Challenge');
const User = require('../models/User');


/*  출석 추가 -------------------------------------------------- */
exports.add = async (req, res, next) => {
  try {
    const partId = req.params.id;
    const { attendance_date, attendance_state, memo } = req.body;

     if (!['출석', '결석'].includes(attendance_state)) {
      return res.status(400).json({ error: 'attendance_state must be 출석, 결석, or 지각' });
    }

    // 참여 존재 여부
    const part = await ParticipatingChallenge.findByPk(partId);
    if (!part) return res.status(404).json({ error:'참여 기록 없음' });

    // 중복 출석 방지 (같은 날짜에 이미 기록?)
    const dup = await ParticipatingAttendance.findOne({
      where:{ participating_id: partId, attendance_date }
    });
    if (dup) return res.status(409).json({ error:'이미 해당 날짜 출석이 있습니다.' });

    const row = await ParticipatingAttendance.create({
      participating_id: partId,
      attendance_date,
      attendance_state,
      memo
    });
    res.status(201).json(row);
  } catch (err) { next(err); }
};

/* 챌린지별 출석 조회 ---------------------------------------- */
exports.listByChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const { date, from, to } = req.query;   // YYYY-MM-DD

    // 1) 챌린지 존재 여부
    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) return res.status(404).json({ error: '챌린지 없음' });

    let dateCondition = undefined;
    if (date) {
      dateCondition = { attendance_date: date };
    } else if (from || to) {
      dateCondition = {
        attendance_date: {
          [Op.between]: [from || '1000-01-01', to || '9999-12-31']
        }
      };
    }

    /* 3) 쿼리 : 참여자 전체 + (해당 날짜/기간의) 출석 LEFT JOIN */
    const rows = await ParticipatingChallenge.findAll({
      where: {
        challenge_id: challengeId,
        participating_state: { [Op.in]: ['신청', '진행 중'] } 
      },
      include: [
        // 3-1) 유저 이름
        {
          model: User,
          as   : 'participant',
          attributes: ['user_id', 'name']
        },
        // 3-2) 출석 LEFT JOIN
        {
          model: ParticipatingAttendance,
          as   : 'attendances',        
          required: false,            
          where   : dateCondition      
        }
      ],
      order: [
        [{ model: User, as: 'participant' }, 'user_id', 'ASC'],
        [{ model: ParticipatingAttendance, as: 'attendances' }, 'attendance_date', 'ASC']
      ]
    });

    res.json(rows);
  } catch (err) {
    console.error('[Attendance.listByChallenge] Error message:', err.message);
    console.error(err.stack);
    return res.status(500).json({ error: err.message });
  }
};

/* 출석 수정 -------------------------------------------------- */
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
     console.log('🔵 PATCH 요청 도착! id:', req.params.id, 'body:', req.body);
    const { attendance_state, memo } = req.body;

    const row = await ParticipatingAttendance.findByPk(id);
    console.log('🔵 findByPk 결과:', row);
    if (!row) return res.status(404).json({ error:'출석 기록 없음' });

    if (attendance_state) row.attendance_state = attendance_state;
    if (memo !== undefined) row.memo = memo;
    await row.save();
    res.json(row);
  } catch (err) { next(err); }
};


/*  출석 삭제 -------------------------------------------------- */
exports.remove = async (req, res, next) => {
  try {
    const attendanceId = req.params.id;
    const row = await ParticipatingAttendance.findByPk(attendanceId);
    if (!row) return res.status(404).json({ error: '출석 기록 없음' });

    await row.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};


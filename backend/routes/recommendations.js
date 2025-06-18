//recommendations.js
const express = require('express');
const router = express.Router();
const { sequelize } = require('../database/db');

// GET /api/recommendations/:userId
router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    // 1. 사용자 나이 가져오기
    const [userResult] = await sequelize.query(
      'SELECT age FROM User WHERE user_id = ?',
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    const user = userResult;

    if (!user) {
      return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }

    const userAge = user.age;

    // 2. 챌린지 추천 쿼리 실행
    const recommendations = await sequelize.query(
`
      SELECT 
          c.challenge_id,
          c.challenge_title,
          c.challenge_description,
          c.minimum_age,
          c.maximum_age,
          c.challenge_state,
          c.start_date,
          c.end_date,
          c.application_deadline,
          c.is_recuming,
          c.intermediate_participation,
          CASE
              WHEN mi.matched = 1 AND mv.matched = 1 THEN 2
              WHEN mi.matched = 1 OR mv.matched = 1 THEN 1
              ELSE 0
          END AS match_score
      FROM Challenge c
      LEFT JOIN (
          SELECT DISTINCT ci.challenge_id, 1 AS matched
          FROM Challenge_Interest ci
          INNER JOIN SelectInterests si ON ci.interest_id = si.interest_id
          WHERE si.user_id = ?
      ) mi ON c.challenge_id = mi.challenge_id
      LEFT JOIN (
          SELECT DISTINCT cv.challenge_id, 1 AS matched
          FROM Challenge_Vision cv
          INNER JOIN SelectVisions sv ON cv.vision_id = sv.vision_id
          WHERE sv.user_id = ?
      ) mv ON c.challenge_id = mv.challenge_id
      WHERE 
          c.challenge_state = 'ACTIVE'
          AND c.minimum_age <= ?
          AND c.maximum_age >= ?
          AND (mi.matched = 1 OR mv.matched = 1)
      ORDER BY match_score DESC, c.start_date ASC
      `,
      {
        replacements: [userId, userId, userAge, userAge],
        type: sequelize.QueryTypes.SELECT
      }
    );

  


    return res.status(200).json(recommendations);
  } catch (err) {
    console.error('❌ 추천 오류:', err.message);
    res.status(500).json({ message: '추천 실패', dev: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database/db');

// 관심분야 선택
router.post('/selectInterest', async (req, res) => {
    const { userId, interestId } = req.body;
    try {
    await db.query(
        'INSERT INTO SelectInterests (user_id, interest_id) VALUES (?, ?)', [userId, interestId]
    );
    res.status(201).json({ message: '관심분야 선택 완료' });
} catch (err) {
    console.error('❌ 관심분야 선택 오류:', err.message);
    res.status(500).json({ error: '관심분야 선택 실패' });
}
});

// 진로희망 선택
router.post('/selectVision', async (req, res) => {
    const { userId, visionId } = req.body;

    try {
    await db.query(
        'INSERT INTO SelectVisions (user_id, vision_id) VALUES (?, ?)',
        [userId, visionId]
    );
    res.status(201).json({ message: '진로희망 선택 완료' });
} catch (err) {
    console.error('❌ 진로희망 선택 오류:', err.message);
    res.status(500).json({ error: '진로희망 선택 실패' });
}
});

module.exports = router;

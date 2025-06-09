// routes/user.js
const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const { getMyInfo, updateMyInfo } = require('../controllers/user');

const router = express.Router();

// 내 정보 조회 (이미 구현되어 있다면 생략)
router.get('/me', isLoggedIn, getMyInfo);

// 내 정보 수정
router.put('/me', isLoggedIn, updateMyInfo);

module.exports = router;

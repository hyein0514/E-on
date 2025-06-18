const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const { isLoggedIn, isNotLoggedIn } = require('../middleware/auth');

// 회원가입
router.post('/join/step1', isNotLoggedIn, authCtrl.signupStep1);
router.post('/join/step2', isNotLoggedIn, authCtrl.signupStep2);
router.post('/join/email', isNotLoggedIn, authCtrl.sendEmailCode);
router.post('/verify-email', isNotLoggedIn, authCtrl.verifyEmailCode);
router.post('/join/step3', isNotLoggedIn, authCtrl.signupStep3);

// 로그인 / 로그아웃
router.post('/login', isNotLoggedIn, authCtrl.login);   // 로그인은 로그인 안 한 사람만
router.post('/logout', isLoggedIn, authCtrl.logout);    // 로그아웃은 로그인한 사람만

module.exports = router;

const express = require('express');
const router  = express.Router();
const authCtrl = require('../controllers/auth');
const { signupStep3 } = require('../controllers/auth');
const { isNotLoggedIn } = require('../middleware/auth');

// router.post('/join/step1',    isNotLoggedIn, signupStep1);
// router.post('/join/step2',    isNotLoggedIn, signupStep2);
// router.post('/join/email',    isNotLoggedIn, sendEmailCode);
// router.post('/verify-email',  isNotLoggedIn, verifyEmailCode);
router.post('/join/step3',    isNotLoggedIn, signupStep3);

// 로그인
router.post('/login', authCtrl.login);

// 로그아웃
router.post('/logout', authCtrl.logout);

module.exports = router;

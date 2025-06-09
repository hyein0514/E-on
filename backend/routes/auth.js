const express = require('express');
const passport = require('passport');
const { signupStep1, signupStep2, sendEmailCode, verifyEmailCode, signupStep3, login, logout } = require('../controllers/auth');
const { isLoggedIn, isNotLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.post('/join/step1',    isNotLoggedIn, signupStep1);
router.post('/join/step2',    isNotLoggedIn, signupStep2);
router.post('/join/email',    isNotLoggedIn, sendEmailCode);
router.post('/verify-email',  isNotLoggedIn, verifyEmailCode);
router.post('/join/step3',    isNotLoggedIn, signupStep3);

router.post('/login',         isNotLoggedIn, login);
router.get('/logout',         isLoggedIn,    logout);

router.get('/kakao',          passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao',{failureRedirect:'/login?error'}));
router.get('/google',         passport.authenticate('google',{scope:['email','profile']}));
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/login?error'}));
router.get('/naver',          passport.authenticate('naver'));
router.get('/naver/callback', passport.authenticate('naver',{failureRedirect:'/login?error'}));

module.exports = router;

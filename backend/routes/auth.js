const express = require('express');
const router  = express.Router();
const authCtrl = require('../controllers/auth');
const { isNotLoggedIn } = require('../middleware/auth');

router.post('/join/step1',    isNotLoggedIn, authCtrl.signupStep1);
router.post('/join/step2',    isNotLoggedIn, authCtrl.signupStep2);
router.post('/join/email',    isNotLoggedIn, authCtrl.sendEmailCode);
router.post('/verify-email',  isNotLoggedIn, authCtrl.verifyEmailCode);
router.post('/join/step3',    isNotLoggedIn, authCtrl.signupStep3);

router.post('/login',         isNotLoggedIn, login);
router.get('/logout',         isLoggedIn,    logout);

router.get('/kakao',          passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao',{failureRedirect:'/login?error'}));
router.get('/google',         passport.authenticate('google',{scope:['email','profile']}));
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/login?error'}));
router.get('/naver',          passport.authenticate('naver'));
router.get('/naver/callback', passport.authenticate('naver',{failureRedirect:'/login?error'}));

// router.get("/refresh", authCtrl.refresh)

module.exports = router;

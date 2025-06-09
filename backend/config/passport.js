const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const KakaoStrategy  = require('passport-kakao').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy  = require('passport-naver').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = () => {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try { done(null, await User.findByPk(id)); }
    catch (e) { done(e); }
  });

  // Local
  passport.use(new LocalStrategy(
    { usernameField:'email', passwordField:'password' },
    async (email, password, done) => {
      try {
        const user = await User.scope('withPassword').findOne({ where:{ email }});
        if (!user) return done(null, false, { message:'가입되지 않은 회원입니다.' });
        if (!await bcrypt.compare(password, user.password))
          return done(null, false, { message:'비밀번호가 일치하지 않습니다.' });
        done(null, user);
      } catch (e) { done(e); }
    }
  ));

  // Kakao
  passport.use(new KakaoStrategy({
      clientID: process.env.KAKAO_ID,
      clientSecret: process.env.KAKAO_SECRET,
      callbackURL: '/auth/kakao/callback',
      scope: ['profile_nickname','profile_image','account_email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const ex = await User.findOne({ where:{ sns_id:profile.id, provider:'kakao' }});
        if (ex) return done(null, ex);
        const newUser = await User.create({
          email: profile._json?.kakao_account?.email || null,
          password: null, provider:'kakao', sns_id:profile.id,
          kakao_nickname:profile.displayName,
          kakao_profile_image:profile._json?.properties?.profile_image || null,
          name:profile.displayName||'카카오 사용자',
          nickname:'', profileImage:null
        });
        done(null, newUser);
      } catch (e) { done(e); }
    }
  ));

  // Google
  passport.use(new GoogleStrategy({
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:'/auth/google/callback'
    },
    async (_accessToken,_refreshToken,profile,done)=>{
      try {
        const ex = await User.findOne({ where:{ sns_id:profile.id, provider:'google' }});
        if (ex) return done(null, ex);
        const newUser = await User.create({
          email:profile.emails?.[0]?.value||null,
          password:null, provider:'google', sns_id:profile.id,
          google_nickname:profile.displayName,
          google_profile_image:profile.photos?.[0]?.value||null,
          name:profile.displayName||'구글 사용자',
          nickname:'', profileImage:null
        });
        done(null,newUser);
      } catch (e) { done(e); }
    }
  ));

  // Naver
  // passport.use(new NaverStrategy({
  //     clientID:process.env.NAVER_CLIENT_ID,
  //     clientSecret:process.env.NAVER_CLIENT_SECRET,
  //     callbackURL:'/auth/naver/callback'
  //   },
  //   async (_a,_r,profile,done)=>{
  //     try {
  //       const ex = await User.findOne({ where:{ sns_id:profile.id, provider:'naver' }});
  //       if (ex) return done(null, ex);
  //       const newUser = await User.create({
  //         email:profile.emails?.[0]?.value||null,
  //         password:null, provider:'naver', sns_id:profile.id,
  //         naver_nickname:profile.displayName,
  //         naver_profile_image:profile._json?.profile_image||null,
  //         name:profile.displayName||'네이버 사용자',
  //         nickname:'', profileImage:null
  //       });
  //       done(null,newUser);
  //     } catch(e){ done(e); }
  //   }
  // ));
};

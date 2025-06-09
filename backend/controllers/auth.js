const bcrypt = require('bcrypt');
const passport = require('passport');
const transporter = require('../config/mail');
const User = require('../models/User');

exports.signupStep1 = (req,res)=>{ req.session.signup={ userType:req.body.userType }; res.json({success:true}); };
exports.signupStep2 = (req,res)=>{
  if (!req.session.signup) return res.status(400).json({message:'Step1 먼저'});
  req.session.signup.agreements = req.body.agreements;
  res.json({success:true});
};
exports.sendEmailCode = async (req,res,next)=>{
  try {
    const code = Math.floor(100000+Math.random()*900000).toString();
    req.session.emailCode=code; req.session.emailForCode=req.body.email;
    await transporter.sendMail({
      from:`"E-ON"<${process.env.SMTP_USER}>`,
      to:req.body.email,
      subject:'이메일 인증번호',
      html:`<p>인증번호: <strong>${code}</strong></p>`
    });
    res.json({success:true});
  } catch(e){ next(e); }
};
exports.verifyEmailCode = (req,res)=>{
  if (req.body.email!==req.session.emailForCode||req.body.code!==req.session.emailCode)
    return res.status(400).json({success:false,message:'불일치'});
  res.json({success:true});
};
exports.signupStep3=async(req,res,next)=>{
  const {name,email,code,password,confirm}=req.body;
  const su=req.session.signup||{};
  if (!su.userType||!su.agreements) return res.status(400).json({message:'이전단계'});
  if (email!==req.session.emailForCode||code!==req.session.emailCode)
    return res.status(400).json({message:'이메일/코드 오류'});
  if (password!==confirm) return res.status(400).json({message:'비번불일치'});
  try {
    if (await User.findOne({where:{email}}))
      return res.status(409).json({message:'이미사용중'});
    const newUser=await User.create({
      email,name,password,nickname:name,
      userType:su.userType,agreements:su.agreements
    });
    delete req.session.signup; delete req.session.emailCode;
    res.status(201).json({success:true,user:newUser.toJSON()});
  } catch(e){ next(e); }
};
exports.login=(req,res,next)=>{
  passport.authenticate('local',(err,user,info)=>{
    if(err) return next(err);
    if(!user) return res.status(401).json({message:info.message});
    req.login(user,err2=> err2? next(err2): res.json({success:true,user:user.toJSON()}));
  })(req,res,next);
};
exports.logout=(req,res,next)=>{
  req.logout(err=>err? next(err): res.json({success:true}));
};

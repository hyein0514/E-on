exports.isLoggedIn = (req,res,next)=>{
  if (req.isAuthenticated()) return next();
  res.status(403).json({ message:'로그인 필요' });
};
exports.isNotLoggedIn = (req,res,next)=>{
  if (!req.isAuthenticated()) return next();
  res.status(403).json({ message:'이미 로그인 상태' });
};

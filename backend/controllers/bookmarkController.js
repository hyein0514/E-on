const Bookmark = require('../models/Bookmark');

/* 17) 북마크 추가 -------------------------------------------- */
exports.add = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const userId      = req.body.user_id;      // 실서비스는 req.user.id

    const [row, created] = await Bookmark.findOrCreate({
      where:{ challenge_id: challengeId, user_id: userId }
    });
    if (!created) return res.status(409).json({ error:'이미 북마크됨' });
    res.status(201).json({ message:'북마크 추가', challenge_id:challengeId });
  } catch (err) { next(err); }
};

/* 18) 북마크 해제 -------------------------------------------- */
exports.remove = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const userId      = req.body.user_id;

    const rows = await Bookmark.destroy({
      where:{ challenge_id: challengeId, user_id: userId }
    });
    if (!rows) return res.status(404).json({ error:'북마크 없음' });
    res.status(204).end();
  } catch (err) { next(err); }
};

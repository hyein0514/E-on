const Review    = require('../models/Review');
const Challenge = require('../models/Challenge');

/* 13) 리뷰 작성 ----------------------------------------------- */
exports.create = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const userId      = req.body.user_id;        // 실제론 req.user.id
    const { rating_stars, text } = req.body;

    // (선택) 한 사용자가 같은 챌린지에 리뷰 한 번만 허용
    const dup = await Review.findOne({ where:{ challenge_id:challengeId, user_id:userId } });
    if (dup) return res.status(409).json({ error:'이미 리뷰를 작성했습니다.' });

    const row = await Review.create({
      challenge_id: challengeId,
      user_id: userId,
      rating_stars,
      text
    });
    res.status(201).json(row);
  } catch (err) { next(err); }
};

/* 14) 리뷰 목록 ----------------------------------------------- */
exports.list = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const rows = await Review.findAll({
      where:{ challenge_id: challengeId },
      order:[['review_date','DESC']]
    });
    res.json(rows);
  } catch (err) { next(err); }
};

/* 15) 리뷰 수정 ----------------------------------------------- */
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { rating_stars, text } = req.body;

    const row = await Review.findByPk(id);
    if (!row) return res.status(404).json({ error:'리뷰 없음' });

    if (rating_stars !== undefined) row.rating_stars = rating_stars;
    if (text !== undefined)         row.text = text;
    row.is_edited = true;
    row.review_date = new Date();
    await row.save();
    res.json(row);
  } catch (err) { next(err); }
};

/* 16) 리뷰 삭제 ----------------------------------------------- */
exports.remove = async (req, res, next) => {
  try {
    const id   = req.params.id;
    const rows = await Review.destroy({ where:{ review_id:id }});
    if (!rows) return res.status(404).json({ error:'리뷰 없음' });
    res.status(204).end();
  } catch (err) { next(err); }
};

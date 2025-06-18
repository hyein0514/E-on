const Review    = require('../models/Review');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

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
      where: { challenge_id: challengeId },
      include: [
        {
          model: User,
          as       : 'writer',         // Review.belongsTo(User, { as: 'user' })
          attributes: ['user_id', 'name']
        }
      ],
      order: [['review_date', 'DESC']]
    });

    /* 이제 rows 안에 { review_id, rating_stars, text, …, user: { user_id, name } } 형태로 내려옴 */
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/* 15) 리뷰 수정 ----------------------------------------------- */
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const loginUserId = req.user.user_id;
    const { rating_stars, text } = req.body;

    const row = await Review.findByPk(id);
    if (!row) return res.status(404).json({ error:'리뷰 없음' });

    if (row.user_id !== loginUserId) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

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
    const id = req.params.id;
    const loginUserId = req.user.user_id; 
    const row = await Review.findByPk(id);
    if (!row) return res.status(404).json({ error: '리뷰 없음' });

    if (row.user_id !== loginUserId) {
      return res.status(403).json({ error: '삭제 권한이 없습니다.' });
    }

    await row.destroy();

    console.log(`[리뷰 삭제] 리뷰ID:${id} by 유저:${loginUserId}`);
    res.status(204).send(); 
  } catch (err) {
    console.error('리뷰 삭제 중 오류:', err); 
    res.status(500).json({ error: '리뷰 삭제 중 서버 오류가 발생했습니다.' });
  }
};


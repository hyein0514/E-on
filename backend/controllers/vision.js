// controllers/vision.js
const { Visions, SelectVisions } = require('../models'); // ✅ Visions와 SelectVisions 불러오기

/**
 * [GET] /api/visions/my
 * 내가 선택한 진로희망 조회
 */
exports.getMy = async (req, res, next) => {
  try {
    const rows = await SelectVisions.findAll({
      where: { user_id: req.user.user_id }, // ✅ 현재 로그인한 사용자 기준
      include: [{ 
        model: Visions, 
        attributes: ['vision_id', 'vision_detail', 'category_code'] // ✅ 진로 상세 정보 포함
      }]
    });

    // ✅ response는 vision_id 배열만 전달 (관심사 API 구조와 통일)
    const my = rows.map(r => r.Vision.vision_id);

    res.json({ success: true, my });
  } catch (err) {
    next(err); // ✅ 에러 처리 미들웨어로 넘김
  }
};

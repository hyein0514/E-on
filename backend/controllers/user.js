// controllers/user.js
const bcrypt = require('bcrypt');
const { User } = require('../models');

/**
 * [PUT] /api/user/me
 * Body: { name, emailNotification, currentPassword }
 */
exports.updateMyInfo = async (req, res, next) => {
  const { name, emailNotification, currentPassword } = req.body;

  // 1) 입력 검증
  if (!currentPassword) {
    return res.status(400).json({ message: '현재 비밀번호를 입력해주세요.' });
  }
  const nameRegex = /^[가-힣a-zA-Z ]{2,10}$/;
  if (name && !nameRegex.test(name)) {
    return res.status(400).json({ message: '이름은 2~10자 한글 또는 영문만 가능합니다.' });
  }

  try {
    // 2) 현재 pw 확인
    const user = await User.scope('withPassword').findByPk(req.user.user_id);
    const match = await bcrypt.compare(currentPassword, user.pw);
    if (!match) {
      return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 3) 업데이트
    await User.update(
      {
        ...(name && { name }),
        emailNotification: emailNotification === undefined ? user.emailNotification : emailNotification
      },
      { where: { user_id: req.user.user_id } }
    );

    return res.json({ success: true, message: '회원 정보가 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

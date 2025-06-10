// backend/controllers/notification.js
const { NotificationSetting } = require('../models');

/**
 * [GET] /api/notification
 * 사용자가 저장한 알림 설정을 불러옵니다.
 */
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await NotificationSetting.findAll({
      where: { user_id: req.user.id },
      attributes: ['type', 'enabled']
    });
    return res.json({ success: true, settings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '알림 설정 조회 실패' });
  }
};

/**
 * [PUT] /api/notification
 * Body: [{ type: string, enabled: boolean }, ...]
 * 사용자가 보낸 배열로 기존 설정을 모두 삭제하고 새로 저장합니다.
 */
exports.updateSettings = async (req, res, next) => {
  const updates = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).json({ message: '유효한 요청 형식이 아닙니다.' });
  }
  try {
    // 기존 설정 삭제
    await NotificationSetting.destroy({ where: { user_id: req.user.id } });
    // 새로 bulk insert
    const bulkData = updates.map(u => ({
      user_id: req.user.id,
      type: u.type,
      enabled: u.enabled
    }));
    await NotificationSetting.bulkCreate(bulkData);
    return res.json({ success: true, message: '알림 설정이 저장되었습니다.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '알림 설정 저장 실패' });
  }
};

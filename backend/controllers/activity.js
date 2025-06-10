// controllers/activity.js
const { ActivityHistory } = require('../models');
const { Op } = require('sequelize');

/**
 * [GET] /api/activity/history
 * Query Params: type, period, search
 */
exports.getHistory = async (req, res, next) => {
  try {
    const { type = 'all', period = '3month', search = '' } = req.query;
    const where = { user_id: req.user.user_id };

    // activity_type 필터
    if (type !== 'all') {
      where.activity_type = type;
    }

    // 기간 필터
    if (period !== 'all') {
      const now = new Date();
      let from;
      if (period === '1month') from = new Date(now.setMonth(now.getMonth() - 1));
      if (period === '3month') from = new Date(now.setMonth(now.getMonth() - 3));
      if (period === '6month') from = new Date(now.setMonth(now.getMonth() - 6));
      if (from) where.date = { [Op.gte]: from };
    }

    // 검색어 필터
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    const history = await ActivityHistory.findAll({
      where,
      order: [['date', 'DESC']],
      limit: 100
    });

    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

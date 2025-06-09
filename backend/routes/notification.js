// backend/routes/notification.js
const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const notificationController = require('../controllers/notification');

const router = express.Router();

// GET 알림 설정
router.get('/', isLoggedIn, notificationController.getSettings);

// PUT 알림 설정 저장
router.put('/', isLoggedIn, notificationController.updateSettings);

module.exports = router;

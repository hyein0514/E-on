// routes/activity.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/activity');
const { isLoggedIn } = require('../middlewares/auth');

// [GET] /api/activity/history
router.get('/history', isLoggedIn, ctrl.getHistory);

module.exports = router;

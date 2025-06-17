// routes/visionRoutes.js (신규)
const express = require('express');
const router = express.Router();
const visionController = require('../controllers/vision');

router.get('/my', visionController.getMy); // ✅ [GET] /api/visions/my

module.exports = router;

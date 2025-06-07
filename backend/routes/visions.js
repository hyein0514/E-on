const express = require('express');
const router = express.Router();
const visionController = require('../controllers/visionController');

// GET /api/visions
router.get('/', visionController.getAll);

module.exports = router;

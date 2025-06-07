const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');

// GET /api/interests
router.get('/', interestController.getAll);

module.exports = router;

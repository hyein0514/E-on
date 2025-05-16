const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/participationController');

router.post('/challenges/:id/participations',ctrl.join);
router.patch('/participations/:id', ctrl.cancel);
module.exports = router;
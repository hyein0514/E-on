const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/participationController');

router.post('/challenges/:id', ctrl.join);
router.patch('/:id', ctrl.cancel);
router.get('/:id', ctrl.getOne); // 챌린지 조회

router.get('/challenge/:challengeId/user/:userId', ctrl.getParticipationByUserAndChallenge);

module.exports = router;

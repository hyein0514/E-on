const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/participationController');
const attendanceCtrl = require('../controllers/attendanceController');


router.patch('/:id', ctrl.cancel);
router.get('/:id', ctrl.getOne); // 챌린지 조회

//출석 추가
router.post('/:id/attendances', attendanceCtrl.add); //출석 추가

module.exports = router;
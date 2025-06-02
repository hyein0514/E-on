const express = require('express');
const ctrl    = require('../controllers/attendanceController');
const router = express.Router();

router.post('/participations/:id/attendances', ctrl.add); //출석 추가
router.get('/challenges/:id/attendance', ctrl.listByChallenge); // 출석 조회
router.patch('/attendances/:id', ctrl.update); // 출석 수정
router.delete('/attendances/:id', ctrl.remove); //출석 삭제


module.exports = router;
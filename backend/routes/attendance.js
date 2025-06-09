const express = require('express');
const ctrl    = require('../controllers/attendanceController');
const router = express.Router();

router.patch('/:id', ctrl.update); // 출석 수정
router.delete('/:id', ctrl.remove); //출석 삭제


module.exports = router;
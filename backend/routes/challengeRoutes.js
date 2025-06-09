// routes/challengeRoutes.js
const express = require('express');
const multer  = require('multer');
const upload  = multer({ dest:'uploads/' });  
const ctrl    = require('../controllers/challengeController');

const router = express.Router();

router.post(
    '/',
    upload.array('files'),            
    ctrl.create
  );

router.get('/', ctrl.list); // 챌린지 조회
router.get('/:id', ctrl.detail); // 챌린지 상세 조회
router.patch('/:id', ctrl.update); //챌린지 수정
router.delete('/:id', ctrl.remove); 
router.patch('/:id/state', ctrl.changeState); //상태변경

module.exports = router;

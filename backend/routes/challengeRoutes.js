// routes/challengeRoutes.js
const express = require('express');
const multer  = require('multer');
const upload  = multer({ dest:'uploads/' });  
const ctrl    = require('../controllers/challengeController');

const router = express.Router();

// router.post(
//     '/challenges',
//     upload.array('files'),            
//     ctrl.create
//   );

// router.get('/challenges', ctrl.list); // 챌린지 조회
// router.get('/challenges/:id', ctrl.detail); // 챌린지 상세 조회
// router.patch('/challenges/:id', ctrl.update); //챌린지 수정
// router.delete('/challenges/:id', ctrl.remove); 
// router.patch('/challenges/:id/state', ctrl.changeState); //상태변경

router.post(
  '/',                  // ✅ /api/challenges (multipart)
  upload.array('files'),
  ctrl.create
);

router.get('/',          ctrl.list);       // ✅ GET /api/challenges
router.get('/:id',       ctrl.detail);    
router.patch('/:id',     ctrl.update);
router.delete('/:id',    ctrl.remove);
router.patch('/:id/state', ctrl.changeState);


module.exports = router;

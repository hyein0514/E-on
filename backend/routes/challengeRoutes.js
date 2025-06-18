// routes/challengeRoutes.js
const express = require('express');
const multer  = require('multer');
const upload  = multer({ dest: 'uploads/' });

// 각 기능별 컨트롤러 로드
const challengeCtrl     = require('../controllers/challengeController');
const attachmentCtrl    = require('../controllers/attachmentController');
const attendanceCtrl    = require('../controllers/attendanceController');
const bookmarkCtrl      = require('../controllers/bookmarkController');
const reviewCtrl        = require('../controllers/reviewController');
const participationCtrl = require('../controllers/participationController');

const router = express.Router();

// 1. 챌린지 생성

// router.post(
//   '/',
//   upload.array('files'),
//   challengeCtrl.create
// );

router.post(
  '/',
  upload.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'consents', maxCount: 1 }
  ]),
  challengeCtrl.create
);

// 2. 챌린지 조회
router.get('/', challengeCtrl.list);

// 3. 챌린지 상세 조회
router.get('/:id', challengeCtrl.detail);

// 4. 챌린지 수정
router.patch('/:id', challengeCtrl.update);

// 5. 챌린지 삭제
router.delete('/:id', challengeCtrl.remove);

// 6. 상태 변경
router.patch('/:id/state', challengeCtrl.changeState);

// 7. 첨부파일 업로드
router.post(
  '/:id/attachments',
  upload.fields([
    { name: 'photos',   maxCount: 5 },
    { name: 'consents', maxCount: 1 }
  ]),
  attachmentCtrl.add
);

// 8. 첨부파일 목록 조회
router.get('/:id/attachments', attachmentCtrl.list);

// 9. 챌린지별 출석 조회
router.get('/:id/attendance', attendanceCtrl.listByChallenge);

// 10. 북마크 추가
router.post('/:id/bookmarks', bookmarkCtrl.add);

// 11. 북마크 해제
router.delete('/:id/bookmarks', bookmarkCtrl.remove);

// 12. 리뷰 작성
router.post('/:id/reviews', reviewCtrl.create);

// 13. 리뷰 목록 조회
router.get('/:id/reviews', reviewCtrl.list);

// 14. 참여 신청
router.post('/:id/participations', participationCtrl.join);

// 15. 특정 유저 참여 조회
router.get('/:challengeId/user/:userId', participationCtrl.getParticipationByUserAndChallenge);

// router.get('/challenge/:challengeId/user/:userId', ctrl.getParticipationByUserAndChallenge);

module.exports = router;
const router = require('express').Router();
const ctrl   = require('../controllers/reviewController');

router.post  ('/challenges/:id/reviews', ctrl.create);   // 13. 작성
router.get   ('/challenges/:id/reviews', ctrl.list);     // 14. 목록
router.patch ('/reviews/:id',            ctrl.update);   // 15. 수정
router.delete('/reviews/:id',            ctrl.remove);   // 16. 삭제

module.exports = router;

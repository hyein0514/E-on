const router = require('express').Router();
const ctrl   = require('../controllers/reviewController');


router.patch ('/:id',            ctrl.update);   // 15. 수정
router.delete('/:id',            ctrl.remove);   // 16. 삭제

module.exports = router;
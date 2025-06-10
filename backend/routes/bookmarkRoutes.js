const router = require('express').Router();
const ctrl   = require('../controllers/bookmarkController');

router.post   ('/challenges/:id/bookmarks', ctrl.add);    // 17. 추가
router.delete ('/challenges/:id/bookmarks', ctrl.remove); // 18. 해제

module.exports = router;

const express = require('express');
const router  = express.Router();
const upload = require('../config/multer');
const ctrl    = require('../controllers/attachmentController');

// router.post('/challenges/:id/attachments',upload.array('files'), ctrl.add);
router.post(
  '/challenges/:id/attachments',
  upload.fields([
    { name: 'photos',   maxCount: 5 },
    { name: 'consents', maxCount: 1 }
  ]),
  ctrl.add
);
router.get('/challenges/:id/attachments',ctrl.list);
router.delete('/:id',ctrl.remove);

module.exports = router;

const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const ctrl    = require('../controllers/attachmentController');
const upload = multer({ dest: 'uploads/' });

router.post('/challenges/:id/attachments',upload.array('files'), ctrl.add);
router.get('/challenges/:id/attachments',ctrl.list);
router.delete('/attachments/:id',ctrl.remove);

module.exports = router;

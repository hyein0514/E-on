const express = require('express');
const router  = express.Router();
const upload = require('../config/multer');
const ctrl    = require('../controllers/attachmentController');


router.delete('/:id',ctrl.remove);

module.exports = router;

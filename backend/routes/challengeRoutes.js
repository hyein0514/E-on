// routes/challengeRoutes.js
const express = require('express');
const multer  = require('multer');
const upload  = multer({ dest:'uploads/' });  
const ctrl    = require('../controllers/challengeController');

const router = express.Router();

router.post(
    '/challenges',
    upload.array('files'),            
    ctrl.create
  );

router.get('/challenges', ctrl.list);

module.exports = router;

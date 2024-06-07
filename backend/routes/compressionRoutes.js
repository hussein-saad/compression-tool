const express = require('express');
const multer = require('multer');
const compressionController = require('../controllers/compressionController');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/compress', upload.single('file'), compressionController.compress);
router.post(
  '/decompress',
  upload.single('file'),
  compressionController.decompress
);

module.exports = router;

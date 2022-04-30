var express = require('express');
var router = express.Router();
const RequestController = require('../../controllers/request');
const authUtil = require('../../middleware/authUtil');
const multer = require('multer');
const upload = multer({
    dest: 'upload/'
});

router.post('/', authUtil.checkToken, upload.single('image'), RequestController.requestNewVinyl);

module.exports = router;
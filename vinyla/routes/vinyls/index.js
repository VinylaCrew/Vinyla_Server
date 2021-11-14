var express = require('express');
var router = express.Router();
const VinylController = require('../../controllers/vinyl');
const authUtil = require('../../modules/authUtil');

router.post('/', VinylController.save);
router.get('/search', authUtil.checkToken, VinylController.search);
router.get('/search/:id', authUtil.checkToken, VinylController.detail);
router.get('/home/', authUtil.checkToken, VinylController.home);

module.exports = router;
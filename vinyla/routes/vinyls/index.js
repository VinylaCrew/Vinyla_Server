var express = require('express');
var router = express.Router();
const VinylController = require('../../controllers/vinyl');
const authUtil = require('../../middleware/authUtil');

router.post('/', authUtil.checkToken, VinylController.save);
router.post('/rep', authUtil.checkToken, VinylController.rep);
router.delete('/:id', authUtil.checkToken, VinylController.deleteVinyl);
router.get('/search', authUtil.checkToken, VinylController.search);
router.get('/search/:id', authUtil.checkToken, VinylController.detail);
router.get('/home', authUtil.checkToken, VinylController.home);
router.get('/my', authUtil.checkToken, VinylController.my);

module.exports = router;
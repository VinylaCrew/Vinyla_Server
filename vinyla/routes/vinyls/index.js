var express = require('express');
var router = express.Router();
const VinylController = require('../../controllers/vinyl');

router.post('/', VinylController.save);
router.get('/search', VinylController.search);
router.get('/search/:id', VinylController.detail);
router.get('/home/:userIdx', VinylController.home);

module.exports = router;
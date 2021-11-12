var express = require('express');
var router = express.Router();
const VinylController = require('../../controllers/vinyl');

// router.get('/home', VinylController.home);
router.get('/search', VinylController.search);
router.get('/search/:id', VinylController.detail);
router.get('/home/:userIdx', VinylController.home);

module.exports = router;
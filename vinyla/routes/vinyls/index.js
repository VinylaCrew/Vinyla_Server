var express = require('express');
var router = express.Router();
const VinylController = require('../../controllers/vinyl');

// router.get('/home', VinylController.home);
router.get('/search', VinylController.search);

module.exports = router;
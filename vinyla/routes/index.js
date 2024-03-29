var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.use('/users', require('./users'));
router.use('/vinyls', require('./vinyls'));
router.use('/requests', require('./requests'));

module.exports = router;

var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/user');

router.post('/signin', UserController.signIn);
router.post('/signup', UserController.signUp);
router.post('/check', UserController.duplicateCheck);
router.post('/member', UserController.isMember);

module.exports = router;
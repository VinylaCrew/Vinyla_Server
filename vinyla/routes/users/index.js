var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/user');
const authUtil = require('../../middleware/authUtil');

router.post('/signin', UserController.signIn);
router.post('/signup', UserController.signUp);
router.post('/check', UserController.duplicateCheck);
router.post('/member', UserController.isMember);
router.get('/mypage', authUtil.checkToken, UserController.myPage);
router.patch('/mypage/notice', authUtil.checkToken, UserController.changeNotice);

module.exports = router;
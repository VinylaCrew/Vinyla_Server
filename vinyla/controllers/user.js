const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const jwt = require('../modules/jwt');
const UserModel = require('../models/user');

module.exports = {
    signIn: async(req, res) => {
        const {fuid, fcmToken} = req.body;
        if(!fuid || !fcmToken){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const user = await UserModel.signIn(req.body);
        if(user === undefined){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_USER));
        }
        const userIdx = user.userIdx;
        const {token, _} = await jwt.sign({userIdx, fuid});
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, 
            {token: token, nickname: user.nickname, subscribeAgreed: user.subscribeAgreed}));
    },

    signUp: async(req,res) => {
        const {fuid, sns, nickname, instaId, fcmToken, subscribeAgreed} = req.body;
        if(!fuid || !sns || !nickname || !fcmToken || subscribeAgreed == null){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if(sns != "Google" || sns != "Apple" || sns != "Facebook"){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const userIdx = await UserModel.signUp(req.body);
        if (userIdx === -1) {
            return await res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        const {token, _} = await jwt.sign({userIdx, fuid});
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_USER, 
            {token: token, nickname: nickname, subscribeAgreed: subscribeAgreed}));
    },

    duplicateCheck: async(req, res) => {
        const {nickname} = req.body;
        if(!nickname){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const isDuplicate = await UserModel.duplicateCheck(nickname);
        if(!isDuplicate){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_NICKNAME));
        }
        
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_DUPLICATE, {nickname: nickname}));
    },

    isMember: async(req, res) => {
        const {fuid, sns} = req.body;
        if(!fuid || !sns){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if(sns != "Google" && sns != "Facebook" && sns != "Apple"){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MEMBER_CHECK_FAIL));
        }
        const isMember = await UserModel.isMember(fuid, sns);
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MEMBER_CHECK_SUCCESS, {isMember: isMember}));
    }
};
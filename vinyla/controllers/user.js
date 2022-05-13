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
        if(sns != "Google" && sns != "Apple" && sns != "Facebook"){
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
        const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
        if(nickname.length < 2 || nickname.length > 20 || !regex.test(nickname)){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.INVALID_NICKNAME));
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
    },

    myPage: async(req, res) => {
        const userIdx = (await req.decoded).valueOf(0).idx;
        if(!userIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }
        try{
            const myPageResult = await UserModel.myPage(userIdx);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MYPAGE_SUCCESS, myPageResult));
        } catch(err){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MYPAGE_FAIL));
        }
    },

    changeNotice: async(req, res) => {
        const userIdx = (await req.decoded).valueOf(0).idx;
        const {subscribeAgreed} = req.body
        if(!userIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }
        if(subscribeAgreed == null){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        try{
            await UserModel.changeNotice(userIdx, subscribeAgreed);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CHANGE_NOTICE_SUCCESS));
        } catch(err){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.CHANGE_NOTICE_FAIL));
        }
        
    }
};
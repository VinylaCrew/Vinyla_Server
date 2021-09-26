const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const jwt = require('../modules/jwt');
const UserModel = require('../models/user');

module.exports = {
    signIn: async(req, res) => {
        const {nickname, sns} = req.body;
        if(!nickname){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const user = await UserModel.signIn(req.body);
        if(user[0] === undefined){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_USER));
        }

        const userIdx = user[0].userIdx;

        const {token, _} = await jwt.sign({userIdx, sns});
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {userIdx: userIdx, token: token}));
    },

    signUp: async(req,res) => {
        const {nickname, profileUrl, instaId, sns} = req.body;
        if(!nickname){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const userIdx = await UserModel.signUp(req.body);
        if (userIdx === -1) {
            return await res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        const {token, _} = await jwt.sign({userIdx, sns});
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_USER, {userIdx: userIdx, token: token}));
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
    }
};
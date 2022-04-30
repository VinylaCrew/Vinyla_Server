const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const RequestModel = require('../models/request');

module.exports = {
    requestNewVinyl: async(req, res) => {
        const userIdx = (await req.decoded).valueOf(0).idx;
        const image = req.file.path;
        const {title, artist, memo} = req.body;
        if(!userIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }
        if(!title || !artist || image === undefined){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const type = req.file.mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png'){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.UNSUPPORTED_TYPE));
        }
        try{
            const requestResult = await RequestModel.requestNewVinyl(userIdx, image, title, artist, memo);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REQUEST_NEW_VINYL_SUCCESS, {requestIdx: requestResult}));
        } catch (err) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.REQUEST_NEW_VINYL_FAIL));
        }
    }

}
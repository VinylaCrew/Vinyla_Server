const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const VinylModel = require('../models/vinyl');
// const { catch } = require('../config/database');

module.exports = {
    search: async(req, res) => {
        const q = req.query.q;
        if(!q){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        try{
            const searchResult = await VinylModel.search(q);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DISCOGS_SEARCH_SUCCESS, searchResult));
        } catch(err){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DISCOGS_SEARCH_FAIL));
        }
    },

    detail: async(req, res) => {
        const id = req.params.id;
        if(!id){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        try{
            const searchDetailResult = await VinylModel.detail(id);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DISCOGS_SEARCH_DETAIL_SUCCESS, searchDetailResult));
        } catch(err){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DISCOGS_SEARCH_DETAIL_FAIL));
        }
    },

    home: async(req, res) => {
        const userIdx = req.params.userIdx; // 일단 user id, 추후 토큰으로 교체
        
        try{
            const homeResult = await VinylModel.home(userIdx);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.HOME_SUCCESS, homeResult));
        } catch(err) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.HOME_FAIL));
        }
        
    }
};

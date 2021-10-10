const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const VinylModel = require('../models/vinyl');

module.exports = {
    search: async(req, res) => {
        const q = req.query.q;
        if(!q){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const searchResult = await VinylModel.search(q);
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DISCOGS_SEARCH_SUCCESS, searchResult));
    },

    detail: async(req, res) => {
        const id = req.params.id;
        if(!id){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const searchDetailResult = await VinylModel.detail(id);
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DISCOGS_SEARCH_DETAIL_SUCCESS, searchDetailResult));
    }
};

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
    }
};

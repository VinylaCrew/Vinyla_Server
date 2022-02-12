const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const VinylModel = require('../models/vinyl');
// const { catch } = require('../config/database');

module.exports = {
    search: async(req, res) => {
        const q = req.query.q;
        const userIdx = (await req.decoded).valueOf(0).idx;
        console.log(userIdx);
        if(!userIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }
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
        const userIdx = (await req.decoded).valueOf(0).idx;
        if(!userIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }
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
        const userIdx = (await req.decoded).valueOf(0).idx;
        if(!userIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }
        try{
            const homeResult = await VinylModel.home(userIdx);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.HOME_SUCCESS, homeResult));
        } catch(err) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.HOME_FAIL));
        }
    },

    save: async(req, res) => {
        const newVinylInfo = req.body;
        const userIdx = (await req.decoded).valueOf(0).idx;
        if(!userIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }
        try{
            const saveResult = await VinylModel.save(newVinylInfo, userIdx);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.VINYL_SAVE_SUCCESS, {vinylIdx: saveResult}));
        } catch(err) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.VINYL_SAVE_FAIL));
        }

    },

    my: async(req, res) => {
        const userIdx = (await req.decoded).valueOf(0).idx;
        if(!userIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }
        try{
            const myResult = await VinylModel.my(userIdx);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_VINYL_SUCCESS, myResult));
        } catch(err){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MY_VINYL_FAIL));
        }
    },

    deleteVinyl: async(req, res) => {
        const id = req.params.id;
        const userIdx = (await req.decoded).valueOf(0).idx;
        if(!userIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }
        if(!id){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        try{
            await VinylModel.deleteVinyl(userIdx, id);
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_VINYL_SUCCESS, {id: id}));
        } catch(err){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_VINYL_FAIL));
        }
    }
};

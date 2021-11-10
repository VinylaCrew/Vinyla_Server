const pool = require('../modules/pool');
const request = require('request');
const discogsKey = require('../config/discogsKey');
const Discogs = require('disconnect').Client;
const vinylSearchDto = require('../data/dto/vinylSearchDto');
const vinylSearchDetailDto = require('../data/dto/vinylSearchDetailDto');
// const { catch } = require('../config/database');

const vinyl = {
    search: async(q) => {
        const dis = new Discogs({
            consumerKey: discogsKey.key,
            consumerSecret: discogsKey.secret
        });

        try{
            const db = await dis.database().search({q: q, type: 'release'});
            const data = db.results;
            let results = [];
            Promise.all(data.map(async(elem) => {
                elem.artist = elem.title.split('-')[0].trim();
                elem.title = elem.title.split('-')[1].trim();
                results.push({
                    'id': elem.id,
                    'thumb': elem.thumb,
                    'title': elem.title,
                    'artist': elem.artist
                });
                results.map(vinylSearchDto);                
            }));
            return results;
        }
        catch(err){
            console.log('[VINYLSEARCH] err: ' + err);
            throw err;
        }
    },
    
    detail: async(id) => {
        const dis = new Discogs({
            consumerKey: discogsKey.key,
            consumerSecret: discogsKey.secret
        });
        
        try{
            const db = await dis.database().getRelease(id);
            let result = [];
            let tl = [];

            const primaryImg = db.images.find(elem => {
                if(elem.type === 'primary'){
                    return true;
                }
            }).uri;

            db.tracklist.forEach(elem => {
                tl.push(elem.title);
            });

            const [rate, rateCount] = await findRate(id);

            result.push({
                "id": db.id,
                "title": db.title,
                "artist": db.artists[0].name,
                "image": primaryImg,
                "year": db.year,
                "genres": db.genres,
                "tracklist": tl
            });
            result[0].rate = rate;
            result[0].rateCount = rateCount;
            result.map(vinylSearchDetailDto);
            return result[0];
        }
        catch(err){
            console.log('[VINYLSEARCHDETAIL] err: ' + err);
            throw err;
        }

        async function findRate(id){
            const rateInfo = [];
            try{
                const sql = `SELECT rate, rateCount FROM vinyl WHERE id = ?`;
                const value = [id];
                const rs = await pool.queryParam_Parse(sql, value);
                if(rs[0]){
                    rateInfo.push(rs[0].rate);
                    rateInfo.push(rs[0].rateCount);
                }
                else{
                    rateInfo.push(0);
                    rateInfo.push(0);
                }
                return rateInfo;
            } catch(err) {
                console.log('[SEARCHDETAILRATE] err: ' + err);
                throw err;
            }
        }
    }
};

module.exports = vinyl;
const pool = require('../modules/pool');
const request = require('request');
const discogsKey = require('../config/discogsKey');
const Discogs = require('disconnect').Client;
const vinylSearchDto = require('../data/dto/vinylSearchDto');
const vinylSearchDetailDto = require('../data/dto/vinylSearchDetailDto');

const vinyl = {
    search: (q) => {
        const dis = new Discogs({
            consumerKey: discogsKey.key,
            consumerSecret: discogsKey.secret
        });

        return new Promise((resolve, reject) => {
            const db = dis.database();
            db.search({q: q, type: 'release'})
            .then(res => {
                const data = res.results;
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
                resolve(results);
            })
            .catch(err => {
                console.log('[VINYLSEARCH] err' + err);
                reject(err);
            });
        });

    },
    detail: (id) => {
        const dis = new Discogs({
            consumerKey: discogsKey.key,
            consumerSecret: discogsKey.secret
        });

        return new Promise((resolve, reject) => {
            const db = dis.database();
            db.getRelease(id)
            .then(res => {
                let result = [];
                const primary = res.images.find(elem => {
                    if(elem.type === 'primary'){
                        return true;
                    }
                }).uri;
                
                let rate, rateCount;
                findRate(id)
                .then(rateRes => {
                    result.push({
                        "id": res.id,
                        "title": res.title,
                        "artist": res.artists[0].name,
                        "image": primary,
                        "year": res.year,
                        "genres": res.genres,
                        "tracklist": res.tracklist
                    });
                    if(rateRes == 0){
                        result[0].rate = 0;
                        result[0].rateCount = 0;
                    }
                    else{
                        result[0].rate = rate;
                        result[0].rateCount = rateCount;
                    }
                    result.map(vinylSearchDetailDto);
                    resolve(result[0]);
                });
            })
            .catch(err => {
                console.log('[VINYLSEARCHDETAIL] err' + err);
                reject(err);
            });

        });

        async function findRate(id){
            try{
                const sql = `SELECT rate, rateCount FROM vinyl WHERE id = ?`;
                const value = [id];
                const rs = await pool.queryParam_Parse(sql, value);
                if(rs[0]){
                    return rs[0].rate, rs[0].rateCount;
                }
                else{
                    return 0;
                }
            } catch(err) {
                console.log('[SEARCHDETAILRATE] err: ' + err);
                throw err;
            }
        }

    }
};

module.exports = vinyl;
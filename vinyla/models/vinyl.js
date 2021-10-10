const pool = require('../modules/pool');
const request = require('request');
const discogsKey = require('../config/discogsKey');
const Discogs = require('disconnect').Client;
const vinylSearchDto = require('../data/dto/vinylSearchDto');

const vinyl = {
    search: (q) => {

        var dis = new Discogs({
            consumerKey: discogsKey.key,
            consumerSecret: discogsKey.secret
        });

        // return new Promise((resolve, reject) => {
        //     const db = new Discogs().database();
        //     const auth = new Discogs({
        //         consumerKey: discogsKey.key,
        //         consumerSecret: discogsKey.secret
        //     });
        //     db.search({query: q, options: auth})
        //     .then(res => {
        //         console.log(res);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        // })

        // var db = dis.database();
        // db.getRelease(1)
        //     .then(function(release){
        //         return db.getArtist(release.artists[0].id);
        //     })
        //     .then(function(artist){
        //         console.log(artist.name);
        //     });

        // db.search(q, function(err, data){
        //     console.log(q);
            
        // });

        // return new Promise((resolve, reject)=>{
        //     const options = {
        //         'uri' : `https://api.discogs.com/database/search`,
        //         'method' : 'GET',
        //         'headers' : {
        //             // 'Authorization' : `KakaoAK ${ak}`,
        //             'Authorization' : `Discogs key=${discogsKey.key}, secret=${discogsKey.secret}`
        //         },
        //         'qs' : {
        //             'q' : `${q}`,
        //             'type' : `release`,
        //             'key' : `${discogsKey.key}`,
        //             'secret' : `${discogsKey.secret}`
        //         }
        //     };
            
        //     request(options, async (err, result)=>{
        //         const jsonResult = JSON.parse(result.body);
        //         console.log(jsonResult);
        //         if(err) {
        //             console.log('request err : ' + err);
        //             reject(err)
        //         }
        //         else resolve(jsonResult);
        //     })
        // })

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
            .catch(err =>{
                console.log('[VINYLSEARCH] err' + err);
                reject(err);
            });
        })

    }
};

module.exports = vinyl;
const pool = require('../modules/pool');
const request = require('request');
const discogsKey = require('../config/discogsKey');
const Discogs = require('disconnect').Client;
const vinylSearchDto = require('../data/dto/vinylSearchDto');
const vinylSearchDetailDto = require('../data/dto/vinylSearchDetailDto');
const vinylVO = require('../data/vo/vinylVO');
const userVO = require('../data/vo/userVO');
const rankVO = require('../data/vo/rankVO');
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

        
    },

    home: async(userIdx) => {
        let result = {};
        try {
            //myVinyl
            const query = `SELECT * FROM vinyl WHERE vinylIdx = (SELECT vinylIdx FROM user_vinyl WHERE userIdx = ? AND myVinyl = 1)`;
            const value = [userIdx];
            const rs = await pool.queryParam_Parse(query, value);
            rs.map(vinylVO);
            result.myVinyl = rs[0];
            
            //recentVinyls
            const query2 = `SELECT A.* FROM vinyl A JOIN(
                                SELECT vinylIdx FROM user_vinyl WHERE userIdx = ? AND myVinyl = 0
                                ORDER BY diggedAt DESC LIMIT 4) B
                                ON A.vinylIdx = B.vinylIdx
                            `;
            const rs2 = await pool.queryParam_Parse(query2, value);
            let recent = [];
            Promise.all(rs2.map(async(elem) => {
                recent.push(elem);
            }));
            rs2.map(vinylVO);
            result.recentVinyls = rs2;

            //userInfo
            const query3 = `SELECT * FROM user WHERE userIdx = ?`;
            const rs3 = await pool.queryParam_Parse(query3, value);
            const rankIdx = rs3[0].rankIdx;
            rs3.map(userVO);
            result.userInfo = rs3;

            //rankInfo
            const query4 = `SELECT * FROM rank WHERE rankIdx = ?`;
            const value4 = [rankIdx];
            const rs4 = await pool.queryParam_Parse(query4, value4);
            rs4.map(rankVO);
            result.rankInfo = rs4;

            //genreInfo
            const query5 = `SELECT G.genreName FROM genre G JOIN(
                                SELECT A.genreIdx FROM user_genre A JOIN(
                                    SELECT MAX(genreNum) AS g FROM user_genre WHERE userIdx = ? GROUP BY userIdx
                                ) B
                                WHERE A.genreNum = B.g
                            ) C
                            ON G.genreIdx = C.genreIdx`;
            const rs5 = await pool.queryParam_Parse(query5, value);
            const genres = [];
            Promise.all(rs5.map(async(elem) => {
                genres.push(elem.genreName);
            }));
            result.genreInfo = genres;

            return result;

        } catch(err) {
            console.log('[HOME] err: ' + err);
            throw err;
        }
    },

    save: async(newVinylInfo) => {
        const {
            id,
            title,
            artist,
            image,
            year,
            genres,
            tracklist,
            rate,
            comment
        } = newVinylInfo;

        let vinylIdx = await findVinyl(id);

        // if) DB(vinyl)에 없으면
        if(!vinylIdx){
            // vinyl에 새로 추가
            const query = `INSERT INTO vinyl(title, imageUrl, artist, rate, rateCount, id, year) VALUES(?, ?, ?, ?, ?, ?, ?)`;
            const values = [title, image, artist, rate, 1, id, year];
            const rs = await pool.queryParam_Parse(query, values);

            vinylIdx = rs.insertId;
            console.log("new vinyl! ", vinylIdx);
            
            // track 추가
            for(track in tracklist){
                const query2 = `INSERT INTO track(vinylIdx, title) VALUES(?, ?)`;
                const values2 = [vinylIdx, track];
                const rs2 = await pool.queryParam_Parse(query2, values2);
            }
            
            console.log("tracklist push finish");
        }
        
        // else) DB에 있으면
        else{
            // vinyl의 rate 정보 업데이트
            const query = `UPDATE vinyl SET rate = ?, rateCount = rateCount+1 WHERE vinylIdx = ?`;
            const value = [rate, vinylIdx];
            const rs = await pool.queryParam_Parse(query, value);

        }
        
        // user_vinyl에 추가

        // 지금꺼 장르들 genre 에서 찾아서 user_genre에 추가 (genreNum 업데이트)
        // vinyl_genre 추가

        // user 에 vinylNum 업데이트 + rank 정보 업데이트

        

    }
};

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
};

async function findVinyl(id){
    // id = 2726;
    try{
        const query = `SELECT vinylIdx FROM vinyl WHERE id = ?`;
        const value = [id];
        const rs = await pool.queryParam_Parse(query, value);
        if(rs[0]){
            return rs[0].vinyIdx;
        }
        else{
            return 0;
        }
    } catch(err) {
        
    }
};

module.exports = vinyl;
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

    save: async(newVinylInfo, userIdx) => {
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

        try{
            let vinyl = await findVinyl(id);
            let vinylIdx = vinyl.vinylIdx;

            // vinyl TB에 없으면
            if(!vinylIdx){
                // vinyl에 새로 추가
                const query = `INSERT INTO vinyl(title, imageUrl, artist, rate, rateCount, id, year) VALUES(?, ?, ?, ?, ?, ?, ?)`;
                const values = [title, image, artist, rate, 1, id, year];
                const rs = await pool.queryParam_Parse(query, values);
                vinylIdx = rs.insertId;
                
                // track 추가
                for(t in tracklist){
                    const query2 = `INSERT INTO track(vinylIdx, title) VALUES(?, ?)`;
                    const values2 = [vinylIdx, tracklist[t]];
                    await pool.queryParam_Parse(query2, values2);
                }
                
                // genre TB 검색해서 genreName별 genreIdx 찾기
                for(g in genres){
                    const query = `SELECT genreIdx FROM genre WHERE genreName = ?`;
                    const value = [genres[g]];
                    const rs = await pool.queryParam_Parse(query, value);
                    const genreIdx = rs[0].genreIdx;

                    if(hasGenre(userIdx, genreIdx) == 0){ // user_genre 에 없으면 새로 등록
                        const query3 = `INSERT INTO user_genre(userIdx, genreIdx, genreNum) VALUES(?, ?, ?)`;
                        const value3 = [userIdx, genreIdx, 1];
                        await pool.queryParam_Parse(query3, value3);
                    }
                    else{ // user_genre 에 있으면 업데이트
                        const query3 = `UPDATE user_genre SET genreNum = genreNum + 1 WHERE userIdx = ? AND genreIdx = ?`;
                        const value3 = [userIdx, genreIdx];
                        await pool.queryParam_Parse(query3, value3);
                    }

                    // vinyl_genre TB 에 추가
                    const query4 = `INSERT INTO vinyl_genre(vinylIdx, genreIdx) VALUES(?, ?)`;
                    const value4 = [vinylIdx, genreIdx];
                    await pool.queryParam_Parse(query4, value4);
                }

            }
            
            // vinyl TB 에 있으면
            else{
                // user_vinyl에 존재하면 err. 이전에 갖고 있지 않은 바이닐이어야 함.
                if(!hasVinyl(userIdx, vinylIdx)){
                    // console.log(userIdx, vinylIdx);
                    throw err;
                }

                // vinyl TB 의 rate 정보 업데이트
                let [prevRate, prevRateCount] = await findRate(id);
                let total = prevRate * prevRateCount;
                total = total + rate;
                prevRateCount = prevRateCount + 1;
                const newRate = total / prevRateCount;

                const query = `UPDATE vinyl SET rate = ?, rateCount = ? WHERE vinylIdx = ?`;
                const value = [newRate, prevRateCount, vinylIdx];
                await pool.queryParam_Parse(query, value);

                // genre TB 검색해서 genreName별 genreIdx 찾기
                for(g in genres){
                    const query = `SELECT genreIdx FROM genre WHERE genreName = ?`;
                    const value = [genres[g]];
                    const rs = await pool.queryParam_Parse(query, value);
                    const genreIdx = rs[0].genreIdx;
                    const existGenre = await hasGenre(userIdx, genreIdx)

                    if(existGenre.exist == 0){ // user_genre 에 없으면 새로 등록
                        const query3 = `INSERT INTO user_genre(userIdx, genreIdx, genreNum) VALUES(?, ?, ?)`;
                        const value3 = [userIdx, genreIdx, 1];
                        await pool.queryParam_Parse(query3, value3);
                    }
                    else{ // user_genre 에 있으면 업데이트
                        const query3 = `UPDATE user_genre SET genreNum = genreNum + 1 WHERE userIdx = ? AND genreIdx = ?`;
                        const value3 = [userIdx, genreIdx];
                        await pool.queryParam_Parse(query3, value3);
                    }
                }
            }
            
            // user_vinyl TB 에 추가
            const query = `INSERT INTO user_vinyl(userIdx, vinylIdx, myVinyl, rate, comment) VALUES(?, ?, ?, ?, ?)`;
            const value = [userIdx, vinylIdx, 0, rate, comment];
            await pool.queryParam_Parse(query, value);

            // user TB 업데이트
            const query2 = `UPDATE user SET rankIdx = ?, vinylNum = vinylNum + 1 WHERE userIdx = ?`;
            const rank = await setRank(userIdx);
            const value2 = [rank, userIdx];
            await pool.queryParam_Parse(query2, value2);

            return vinylIdx;

        } catch(err){
            console.log('[SAVEVINYL] err: ' + err);
            throw err;

        }
        
        
    },

    my: async(userIdx) => {
        try{
            const query = `SELECT vinyl.vinylIdx, title, imageUrl, artist, id
                           FROM vinyla.user_vinyl JOIN vinyla.vinyl
                           WHERE user_vinyl.vinylIdx = vinyl.vinylIdx AND user_vinyl.userIdx = ?`;
            const value = [userIdx];
            const rs = await pool.queryParam_Parse(query, 3);

            const result = {};
            result.userIdx = userIdx;
            let myVinyls = [];
            Promise.all(rs.map(async(elem) => {
                myVinyls.push(elem);
            }));
            result.myVinyls = myVinyls;
            return result;

        } catch(err) {
            console.log('[MY] err: ' + err);
            throw err;
        }
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
        console.log('[FUNC-findRate] err: ' + err);
        throw err;
    }
};

async function hasVinyl(userIdx, vinylIdx){
    try{
        const query = `SELECT * FROM user_vinyl WHERE userIdx = ? AND vinylIdx = ?`;
        const value = [userIdx, vinylIdx];
        const rs = await pool.queryParam_Parse(query, value);
        if(rs[0]){
            return true;
        }
        else return false;
    } catch(err){
        console.log('[FUNC - hasVinyl] err: ' + err);
        throw err;
    }
};

async function hasGenre(userIdx, genreIdx){
    try{
        const query2 = `SELECT IF(COUNT(*) > 0, genreNum, 0) AS exist
                        FROM vinyla.user_genre WHERE userIdx = ? AND genreIdx = ?`;
        const value2 = [userIdx, genreIdx];
        const rs2 = await pool.queryParam_Parse(query2, value2);
        return rs2[0];
    } catch(err){
        console.log('[FUNC - hasGenre] err: ' + err);
        throw err;
    }
};

async function findVinyl(id){
    // id = 2726;
    try{
        const query = `SELECT vinylIdx FROM vinyl WHERE id = ?`;
        const value = [id];
        const rs = await pool.queryParam_Parse(query, value);
        return rs[0];
    } catch(err) {
        console.log('[FUNC - findVinyl] err: ' + err);
        throw err;
    }
};

async function findGenreNum(userIdx, genreIdx){
    try{
        const query = `SELECT genreNum FROM user_genre WHERE userIdx = ? AND genreIdx = ?`;
        const value = [userIdx, genreIdx];
        const rs = await pool.queryParam_Parse(query, value);
        return rs[0];
    } catch(err){
        console.log('[FUNC - findGenreNum] err: ' + err);
        throw err;
    }
};

async function setRank(userIdx){
    try{
        const query = `SELECT CASE WHEN vinylNum < 2 THEN 1
                                    WHEN vinylNum < 10 THEN 2
                                    WHEN vinylNum < 50 THEN 3
                                    WHEN vinylNum < 500 THEN 4
                                    ELSE 5
                        END AS rankIdx
                        FROM user
                        WHERE userIdx = ?`;
        const value = [userIdx];
        const rs = await pool.queryParam_Parse(query, value);
        return rs[0].rankIdx;
        
    } catch(err){
        console.log('[FUNC - setRank] err: ' + err);
        throw err;
    }
}

module.exports = vinyl;
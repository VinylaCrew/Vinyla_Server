const pool = require('../modules/pool');

const user = {
    signIn : async({fuid, fcmToken}) => {
        try{
            const sql = `UPDATE user SET fcmToken = ? WHERE fuid = ?`;
            const value = [fcmToken, fuid];
            await pool.queryParam_Parse(sql, value);
            const sql2 = `SELECT userIdx, nickname, subscribeAgreed FROM user WHERE fuid = ?`;
            const value2 = [fuid];
            const rs2 = await pool.queryParam_Parse(sql2, value2);
            return rs2[0];
        } catch (err){
            console.log('[SIGNIN] err: ' + err);
            throw err;
        }
    },
    
    signUp : async({fuid, sns, nickname, instaId, fcmToken, subscribeAgreed}) => {
        try{
            const sql = `INSERT INTO user(fuid, sns, nickname, instaId, fcmToken, subscribeAgreed)
                         VALUES(?, ?, ?, ?, ?, ?)`;
            const values = [fuid, sns, nickname, instaId, fcmToken, subscribeAgreed];
            const rs = await pool.queryParam_Parse(sql, values);
            return rs.insertId;
        } catch (err){
            console.log('[SIGNUP] err: ' + err);
            throw err;
        }
    },

    duplicateCheck : async(nickname) => {
        try{
            const sql = `SELECT COUNT(*) as cnt FROM user WHERE nickname = ?`;
            const value = [nickname];
            const rs = await pool.queryParam_Parse(sql, value);
            if(rs[0].cnt == 0){
                return true;
            }
            else{
                return false;
            }
        } catch (err) {
            console.log('[DUPLICATECHECK] err: ' + err);
            throw err;
        }
    },

    isMember : async(fuid, sns) => {
        try{
            const sql = `SELECT COUNT(*) AS cnt FROM user WHERE fuid = ? AND sns = ?`;
            const value = [fuid, sns];
            const rs = await pool.queryParam_Parse(sql, value);
            if(rs[0].cnt > 0){
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log('[ISMEMBER] err: ' + err);
            throw err;
        }
    }
};

module.exports = user;
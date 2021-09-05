const pool = require('../modules/pool');

const user = {
    signIn : async({nickname, sns}) => {
        if(sns === undefined){
            sns = 'Google';
        }
        try{
            const sql = `SELECT userIdx FROM user WHERE nickname = ? AND sns = ?`;
            const values = [nickname, sns];
            const rs = await pool.queryParam_Parse(sql, values);
            console.log(rs);
            return rs;
        } catch (err){
            console.log('[SIGNIN] err: ' + err);
            throw err;
        }

    },
    
    signUp : async({nickname, profileUrl, instaId, sns}) => {
        if(sns === undefined){
            sns = 'Google';
        }

        try{
            const sql = `INSERT INTO user(nickname, profileUrl, instaId, sns) VALUES(?, ?, ?, ?)`;
            const values = [nickname, profileUrl, instaId, sns];
            const rs = await pool.queryParam_Parse(sql, values);

            return rs.insertId;
        } catch (err){
            console.log('[SIGNUP] err: ' + err);
            throw err;
        }
    }
};

module.exports = user;
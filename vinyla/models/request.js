const pool = require('../modules/pool');
const requestVO = require('../data/vo/requestVO');

const request = {
    requestNewVinyl: async(userIdx, image, title, artist, memo) => {
        try{
            const query = `INSERT INTO request(title, artist, image, memo, userIdx) VALUES(?, ?, ?, ?, ?)`;
            const value = [title, artist, image, memo, userIdx];
            const rs = await pool.queryParam_Parse(query, value);
            return rs.insertId;
        } catch (err) {
            console.log('[REQUESTNEWVINYL] err: ' + err);
            throw err;
        }
    }
};

module.exports = request;
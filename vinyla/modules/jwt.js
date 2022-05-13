const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretkey').secretKey;
const options = require('../config/secretkey').options;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    sign: async ({userIdx, fuid}) => {
        const payload = {
            idx: userIdx,
            fuid: fuid
        };
        const result = {
            token: jwt.sign(payload, secretKey, options),
            refreshToken: randToken.uid(256)
        };
        return result;
    },
    verify: async (token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                return TOKEN_INVALID;
            } else {
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}

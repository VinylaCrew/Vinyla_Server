const poolPromise = require('../config/database');

module.exports = { 
    queryParam: async (query) => {
        return new Promise ( async (resolve, reject) => {
            try {
                const pool = await poolPromise;
                const connection = await pool.getConnection();
                try {
                    const result = await connection.query(query);
                    // pool.releaseConnection(connection);
                    connection.release();
                    resolve(result);
                } catch (err) {
                    // pool.releaseConnection(connection);
                    connection.release();
                    reject(err);
                }
            } catch (err) {
                reject(err);
            }
        });
    },
    queryParamArr: async (query, value) => {
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await poolPromise;
                const connection = await pool.getConnection();
                try {
                    const result = await connection.query(query, value);
                    // pool.releaseConnection(connection);
                    connection.release();
                    resolve(result);
                } catch (err) {
                    // pool.releaseConnection(connection);
                    connection.release();
                    reject(err);
                }
            } catch (err) {
                reject(err);
            }
        });
    },
    queryParam_Parse: async (query, value) => {
        let result = null;
        try {
            const pool = await poolPromise;
            const connection = await pool.getConnection();
            try {
                result = await connection.query(query, value) || null;
            } catch (queryError) {
                connection.rollback(() => {});
                if(queryError.errno == 1452) {
                    result = new NoReferencedRowError();
                }
                console.log(queryError);
            }
            connection.release();
            // pool.releaseConnection(connection);
        } catch (connectionError) {
            console.log(connectionError);   
        }
        if(result instanceof Error) {
            throw result;
        }
        if(!result) {
            throw new DatabaseError();
        }
        return result;
    },
    Transaction: async (...args) => {
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await poolPromise;
                const connection = await pool.getConnection();
                try {
                    await connection.beginTransaction();
                    args.forEach(async (it) => await it(connection));
                    await connection.commit();
                    // pool.releaseConnection(connection);
                    connection.release();
                    resolve(result);
                } catch (err) {
                    await connection.rollback()
                    // pool.releaseConnection(connection);
                    connection.release();
                    reject(err);
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}
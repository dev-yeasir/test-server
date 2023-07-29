const createUserTableQuery = require('../../model/usersModel');
const { pool } = require('../connection');

const createUserTable = async () => {
    try {
        await pool.query(createUserTableQuery);
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = { createUserTable };

const mysql = require('mysql2');

// create Connection pools
const pool = mysql
    .createPool({
        host: process.env.MySQL_HOST,
        user: process.env.MySQL_USER,
        password: process.env.MySQL_PASSWORD,
        database: process.env.MySQL_DATABASE,
    })
    .promise();

// Test the database connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        console.log(`${process.env.MySQL_DATABASE} has been  successfully connected as database`);
    } catch (err) {
        console.error('Error connecting to MySQL:', err);
    }
};

module.exports = { pool, testConnection };

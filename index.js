/*
  Name: Code Tikki Express Server
  Description: This is a Code Tikki Express server and connected to MySQl as a database
  Date: 2023-07-26
*/

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./database/connection');

// Import all routes below
const userRouter = require('./routes/usersRouter');
// Import all model query below
const { createUserTable } = require('./database/Table/usersTable');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
);
app.use(express.json());
// routers
app.get('/', async (req, res) => {
    res.send('hello arafat');
});
app.get('/test', async (req, res) => {
    res.send('hello from test');
});
app.use('/users', userRouter);
// Default error handler middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(500).json({ error: 'Something went wrong' });
});

// start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} `);
});
// test database connection
testConnection();
// create db  table
createUserTable();

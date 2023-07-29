const express = require('express');
const {
    registerUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
} = require('../controller/usersController');

const router = express.Router();
// users register
router.post('/register', registerUser);
// verify user email
router.get('/verify/:token', verifyEmail);
// users login
router.post('/login', loginUser);

// get a single user
router.get('/:email');

// get all users
router.get('/all');
// forgot password
router.post('/forgot-password', forgotPassword);
// rest password
router.post('/reset-password/:token', resetPassword);
module.exports = router;

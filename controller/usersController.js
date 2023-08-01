const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { pool } = require('../database/connection');
const { generateVerificationToken } = require('../utils/generateVerificationToken');
const { sendVerificationEmail } = require('../utils/EmailVerificationTemp');
const sendPasswordResetEmail = require('../utils/passwordResetEmail');
// user registration controller
const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const joinDate = new Date();
        const id = `CT-${uuidv4().slice(0, 6).toUpperCase()}`;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // check existing user
        const [existingUser] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR userName = ?',
            [email, userName]
        );
        if (existingUser.length) {
            if (existingUser[0].email === email) {
                return res.status(400).json({ status: false, message: 'Email already registered' });
            }
            if (existingUser[0].userName === userName) {
                return res.status(400).json({ status: false, message: 'Username already exist' });
            }
        }
        await pool.query(
            'INSERT INTO users (id,  userName, email, password, joinDate) VALUES (?,?,?,?,?)',
            [id, userName, email, hashedPassword, joinDate]
        );
        // generate verification token
        const verificationToken = generateVerificationToken(userName, email);
        // send verification email
        await sendVerificationEmail(email, verificationToken);
        return res.status(200).json({ status: true, message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Registration failed',
        });
        console.log(error.message);
    }
};

// Email Verification controller
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        pool.query('UPDATE users SET isVerified = 1 WHERE email = ? ', [decodedToken.email]);
        return res.status(200).json({ status: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        console.log(error.message);
        return res.status(400).json({ status: false, message: 'Invalid or expired token' });
    }
};

// user login controller
const loginUser = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        // Check if the user exists in the database based on email or username
        const [user] = await pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [
            usernameOrEmail,
            usernameOrEmail,
        ]);
        // Check if the user was found
        if (!user.length) {
            return res.status(401).json({ status: false, message: 'User not found' });
        }
        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            return res.status(401).json({ status: false, message: 'Incorrect password' });
        }
        const token = generateVerificationToken(user[0].userName, user[0].email);
        if (token) {
            return res
                .status(200)
                .json({ status: true, message: 'Authentication successful', access_token: token });
        }
        res.status(401).json({
            status: false,
            message: 'Authentication failed!',
        });
    } catch {
        return res.status(500).json({ error: 'Server error' });
    }
};

// Forgot Password controller
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists in the database
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!user.length) {
            return res.status(400).json({ status: false, message: 'User not found' });
        }

        // Generate a password reset token
        const userName = '';
        const passwordResetToken = generateVerificationToken(userName, email);

        // Send password reset email with the token
        await sendPasswordResetEmail(email, passwordResetToken);

        return res.status(200).json({ status: true, message: 'Password reset email sent.' });
    } catch (error) {
        return res
            .status(500)
            .json({ status: false, message: 'Unable to send password reset email.' });
    }
};

// reset password controller
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        await pool.query('UPDATE users SET password = ? WHERE email = ?', [
            hashedPassword,
            decodedToken.email,
        ]);

        return res.status(200).json({ status: true, message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: 'Invalid or expired token' });
    }
};
module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
};

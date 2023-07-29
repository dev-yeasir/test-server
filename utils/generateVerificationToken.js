const jwt = require('jsonwebtoken');

function generateVerificationToken(userName, email) {
    return jwt.sign({ userName, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = {
    generateVerificationToken,
};

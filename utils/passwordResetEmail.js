const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: 'Password Reset',
        html: `<p>Click the following link to reset your password:</p>
             <a href="http://localhost:5000/users/reset-password/${token}">Reset Password</a>`,
    };

    await transporter.sendMail(mailOptions);
};
module.exports = sendPasswordResetEmail;

const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: 'smtppro.zoho.in',
        secure: true,
        port: 465,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `Code Tikki <${process.env.SMTP_USERNAME}>`,
        to: email,
        subject: 'Email Verification',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                /* Global Styles */
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f2f2f2;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                }
                h1 {
                    color: #333333;
                }
                p {
                    color: #666666;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    
                    border-radius: 5px;
                    
                }
                .logo {
                    display: block;
                    margin: 0 auto;
                    max-width: 200px;
                    max-hight: 200px
                }
                
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://res.cloudinary.com/dhlmvpkua/image/upload/v1690819409/logo.02a0d2c24e06c839106f_vffvnl.png" alt="Company Logo" class="logo">
                <h1>Email Verification</h1>
                <p>Thank you for signing up with us! To complete your registration, please click the button below to verify your email address.</p>
                <p>If you did not sign up for an account with us, you can safely ignore this email.</p>
                <p><a style="text-decoration: none; color: white;  background-color: #EE842E;" href="http://localhost:5173/user/verify/${token}" class="button">Verify Email</a></p>
                <p>Alternatively, you can copy and paste the following link into your web browser:</p>
                <p><a href="#">http://localhost:5173/user/verify/${token}</a></p>
                <p>Thank you,</p>
                <p>Code Tikki Team</p>
            </div>
        </body>
        </html>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };

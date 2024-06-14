const nodemailer = require('nodemailer');
require('../.env');

/**
 * Create trasporter 
 * Service -> gmail service
 * host -> smtp protocol
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_ADRESS,
        pass: process.env.PASSWORD
    }
});

/**
 * 
 * @param {*} to Which user will the email go to?
 * @param {*} subject Subject
 * @param {*} text Text, Content
 */
const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: {
            name: "YourMailSenderName",
            address: process.env.MAIL_ADRESS
        },
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Mail dont send:', error);
    }
}

module.exports = sendMail;
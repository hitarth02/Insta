const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email , title , body) => {
    try {
        const transporter = nodemailer.createTransport(
            {
                host: process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            }
        );
        
        let mailInfo = await transporter.sendMail(
            {
                from:"Instagram - By Hitarth",
                to: email,
                subject: title,
                html: `${body}`,
            }
        );
        console.log(mailInfo);

    } catch (error) {
        console.log(error);
        console.log("Error in mailSender functionality...");
    }
};

module.exports = mailSender;
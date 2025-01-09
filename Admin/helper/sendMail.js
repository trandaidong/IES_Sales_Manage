const nodemailer = require('nodemailer');
module.exports.sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'daidong.tran15@gmail.com',
            pass: 'luit rduf smyk xbus'
        }
    });

    const mailOptions = {
        from: 'daidong.tran15@gmail.com',
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}
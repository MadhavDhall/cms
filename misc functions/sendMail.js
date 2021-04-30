const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })
// const nodemailer = require('nodemailer');
// smtpTransport = require('nodemailer-smtp-transport');

// const transporter = nodemailer.createTransport(smtpTransport({
//     service: "gmail",
//     host:"smtp.gmail.com",
//     auth: {
//         user: process.env.SEND_EMAIL,
//         pass: process.env.SEND_EMAIL_PASS
//     }
// }))

// const sendMail = async (mailOptions) => {
//     try {
//         const options = {
//             from: process.env.SEND_EMAIL,
//             ...mailOptions
//         }
//         console.log(options);
//         transporter.sendMail(options, function (error, info) {
//             console.log(info);
//             if (error) console.log(error);
//             return error ? false : true
//         });
//     } catch (e) {
//         console.log(e);
//     }
// }
// let options = { to: "", subject: "", html: "", text: "" }
// const sendMail = (options) => {
//     options = options
// }



// send({
//     user: process.env.SEND_EMAIL,
//     pass: process.env.SEND_EMAIL_PASS,
//     ...options
// }, (error, result, fullResult) => {
//     if (error) console.error(error);
//     console.log(result);
// })
const send = require('gmail-send')({
    user: process.env.SEND_EMAIL,
    pass: process.env.SEND_EMAIL_PASS
})

const sendMail = async(options) => {
    try {
        const res = await send(options)
        console.log(res);
        return true
    } catch (error) {
        console.log(error);
        return "Mail send Failed"
    }
}

module.exports = sendMail
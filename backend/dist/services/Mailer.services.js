"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRemainingTime = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async (reciever, subject, article) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_APP_PASS,
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: reciever,
        subject: subject,
        html: article
    };
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
};
exports.sendMail = sendMail;
const formatRemainingTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return minutes > 0 ? `${minutes}min ${seconds}s` : `${seconds}s`;
};
exports.formatRemainingTime = formatRemainingTime;
//# sourceMappingURL=Mailer.services.js.map
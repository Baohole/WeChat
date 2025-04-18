import nodemailer from 'nodemailer'

export const sendMail = async (reciever: string, subject: string, article: string) => {
    const transporter = nodemailer.createTransport({
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

    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}

export const formatRemainingTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return minutes > 0 ? `${minutes}min ${seconds}s` : `${seconds}s`;
  };
import nodemailer from 'nodemailer';

class MailClient {
    static sendVerifyToken = (to: string, token: string) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        })

        const options = {
            from: process.env.MAIL_USER,
            to: to,
            subject: "Verification Token",
            text: `Token: ${ token }`
        }

        transporter.sendMail(options, (err, info) => {
            if (err) throw Error(err.message);
        })
    }

    static sendResetPasswordToken = (to: string, token: string) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        })

        const options = {
            from: process.env.MAIL_USER,
            to: to,
            subject: "Reset-Password Token",
            text: `Reset-Password-Token: ${ token }`
        }

        transporter.sendMail(options, (err, info) => {
            if (err) throw Error(err.message);
        })
    }
}

export default MailClient;
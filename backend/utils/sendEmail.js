// sendEmail.js — poora replace karo
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',  // ← Brevo
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"JobBridge" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #6A38C2;">JobBridge</h2>
                    <div style="background: #f3f0ff; padding: 15px; border-radius: 8px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #6A38C2; margin: 20px 0;">
                        ${message}
                    </div>
                    <p style="color: #9ca3af; font-size: 13px;">Valid for 10 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Email send failed:", error);
        return false;
    }

};

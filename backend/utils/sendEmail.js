import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE, // e.g., 'gmail'
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            text: message,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6d28d9;">JobBridge Password Reset</h2>
                    <p>You requested a password reset. Use the OTP below to proceed:</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #6d28d9; margin: 20px 0;">
                        ${message}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
        return true;

    } catch (error) {
        console.error("Email send failed:", error);
        return false;
    }
};

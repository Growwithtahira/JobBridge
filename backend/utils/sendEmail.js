import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',  // ← service hatao, host use karo
            port: 465,               // ← 587 se 465
            secure: true,            // ← 465 ke liye true
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
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6d28d9;">JobBridge</h2>
                    <p>${subject}</p>
                    <div style="background: #f3f0ff; padding: 15px; border-radius: 8px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #6A38C2; margin: 20px 0;">
                        ${message}
                    </div>
                    <p style="color: #9ca3af; font-size: 13px;">Valid for 10 minutes. Do not share with anyone.</p>
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

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
            },
            body: JSON.stringify({
                sender: {
                    name: 'JobBridge',
                    email: process.env.SMTP_MAIL
                },
                to: [{ email }],
                subject,
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: 0 auto;">
                        <div style="background: #6A38C2; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
                            <h1 style="color: white; margin: 0; font-size: 22px;">JobBridge</h1>
                        </div>
                        <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <h2 style="color: #111827; margin-top: 0;">${subject}</h2>
                            <div style="background: #f3f0ff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                                <p style="font-size: 36px; font-weight: bold; color: #6A38C2; letter-spacing: 10px; margin: 0;">${message}</p>
                            </div>
                            <p style="color: #9ca3af; font-size: 13px;">Valid for 10 minutes. Do not share with anyone.</p>
                        </div>
                    </div>
                `
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("Brevo API error:", err);
            return false;
        }

        console.log(`Email sent to ${email}`);
        return true;

    } catch (error) {
        console.error("Email send failed:", error);
        return false;
    }
};
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📩 إرسال إيميل التحقق
export async function sendVerificationEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `"Xstructure Care" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Verify your email - Xstructure",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Verify your email</h2>
        <p>Here is your verification code:</p>
        <h1 style="color:#4f46e5">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  });
}

// 📩 إرسال إيميل إعادة التعيين
export async function sendResetEmail(to: string, name: string, resetLink: string) {
  await transporter.sendMail({
    from: `"Xstructure Care" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Password Reset - Xstructure",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hello ${name},</h2>
        <p>You requested a password reset.</p>
        <a href="${resetLink}" style="background:#4f46e5;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p style="color:gray;font-size:12px;">If you didn’t request this, ignore this email.</p>
      </div>
    `,
  });
}

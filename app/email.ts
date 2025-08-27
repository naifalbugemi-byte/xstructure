import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// إنشاء transporter باستخدام SMTP تبع Outlook
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // ايميلك مثل care@xstructure.ai
    pass: process.env.EMAIL_PASS, // الباسورد اللي حطيته
  },
});

// قالب الترحيب
export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <div style="font-family: Arial; padding:20px;">
      <h2>🎉 Welcome to Xstructure</h2>
      <p>Hi ${name},</p>
      <p>We’re excited to have you on board! 🚀<br>
      Your account has been successfully created.</p>
      <a href="https://xstructure.ai/login" 
         style="background:#4f46e5;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">
         Login to Dashboard
      </a>
      <p style="margin-top:20px;">Best regards,<br>The Xstructure Team</p>
    </div>
  `;

  return transporter.sendMail({
    from: `"Xstructure" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to Xstructure 🎉",
    html,
  });
}

// قالب إعادة تعيين كلمة المرور
export async function sendResetEmail(to: string, name: string, resetLink: string) {
  const html = `
    <div style="font-family: Arial; padding:20px;">
      <h2>🔒 Reset Your Password</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click below:</p>
      <a href="${resetLink}" 
         style="background:#dc2626;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">
         Reset Password
      </a>
      <p style="margin-top:20px;">If you didn’t request this, ignore this email.</p>
      <p>Stay secure,<br>The Xstructure Team</p>
    </div>
  `;

  return transporter.sendMail({
    from: `"Xstructure" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password 🔑",
    html,
  });
}

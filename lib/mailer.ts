import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // لازم false مع TLS
  auth: {
    user: process.env.SMTP_USER, // ايميلك على اوتلوك/مايكروسوفت
    pass: process.env.SMTP_PASS, // باسورد الحساب أو App Password
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// 📩 إرسال ايميل ترحيبي
export async function sendWelcomeEmail(to: string) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Welcome!",
    text: "Welcome to our platform 🎉",
  });
}

// 📩 إرسال ايميل عام (تستخدمه للكود وغيره)
export async function sendBusinessEmail(to: string, subject: string, text: string) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}

// Aliases
export const sendVerificationEmail = sendWelcomeEmail;
export const sendEmail = sendBusinessEmail;

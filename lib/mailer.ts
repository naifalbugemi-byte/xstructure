import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// الأساسيات
export async function sendWelcomeEmail(to: string) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Welcome!",
    text: "Welcome to our platform 🎉",
  });
}

export async function sendBusinessEmail(to: string, subject: string, text: string) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}

// alias للدوال اللي الأكواد تستدعيها
export const sendVerificationEmail = sendWelcomeEmail;
export const sendEmail = sendBusinessEmail;

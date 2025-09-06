import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ===== Transporters =====

// Care (Support)
const careTransporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // care@xstructure.ai
    pass: process.env.EMAIL_PASS,
  },
});

// Sales
const salesTransporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SALES_EMAIL_USER, // sales@xstructure.ai
    pass: process.env.SALES_EMAIL_PASS,
  },
});

// Hello (Welcome + Verification)
const helloTransporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.HELLO_EMAIL_USER, // hello@xstructure.ai
    pass: process.env.HELLO_EMAIL_PASS,
  },
});

// ===== Helpers =====
function wrapTemplate(title: string, body: string) {
  return `
    <div style="background:#0f172a;padding:40px 20px;font-family:Inter,Arial,sans-serif;color:#f1f5f9;">
      <div style="max-width:600px;margin:auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid rgba(59,130,246,0.3);">
        <div style="background:linear-gradient(to right,#3b82f6,#06b6d4);padding:20px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:1px;">Xstructure.ai</h1>
        </div>
        <div style="padding:30px;">
          <h2 style="color:#fff;font-size:22px;margin-bottom:20px;">${title}</h2>
          ${body}
        </div>
        <div style="background:#0f172a;padding:15px;text-align:center;font-size:12px;color:#94a3b8;">
          © ${new Date().getFullYear()} Xstructure.ai. All rights reserved.
        </div>
      </div>
    </div>
  `;
}

// ===== Templates =====

// Welcome Email
export async function sendWelcomeEmail(to: string, name: string) {
  const body = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Welcome to <strong>Xstructure</strong> 🚀<br>We’re excited to have you onboard!</p>
    <p style="margin:30px 0;text-align:center;">
      <a href="https://xstructure.ai/login"
         style="background:linear-gradient(to right,#3b82f6,#06b6d4);color:#fff;padding:12px 28px;text-decoration:none;border-radius:8px;font-weight:600;">
         Go to Dashboard
      </a>
    </p>
    <p style="color:#cbd5e1;">Your journey of AI-powered content creation starts now.</p>
  `;

  return helloTransporter.sendMail({
    from: `"Xstructure" <${process.env.HELLO_EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to Xstructure",
    html: wrapTemplate("Welcome to Xstructure", body),
  });
}

// Verification Email
export async function sendVerificationEmail(to: string, code: string) {
  const body = `
    <p>Use the verification code below to activate your account:</p>
    <h2 style="font-size:32px;letter-spacing:6px;text-align:center;color:#3b82f6;margin:20px 0;">${code}</h2>
    <p style="color:#cbd5e1;">This code will expire in 10 minutes.</p>
  `;

  return helloTransporter.sendMail({
    from: `"Xstructure" <${process.env.HELLO_EMAIL_USER}>`,
    to,
    subject: "🔑 Verify Your Xstructure Account",
    html: wrapTemplate("Verify Your Email", body),
  });
}

// Reset Password Email
export async function sendResetEmail(to: string, name: string, resetLink: string) {
  const body = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset your password. Click the button below:</p>
    <p style="margin:30px 0;text-align:center;">
      <a href="${resetLink}"
         style="background:#dc2626;color:#fff;padding:12px 28px;text-decoration:none;border-radius:8px;font-weight:600;">
         Reset Password
      </a>
    </p>
    <p style="color:#cbd5e1;">If you didn’t request this, you can ignore this email.</p>
  `;

  return careTransporter.sendMail({
    from: `"Xstructure Care" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔒 Reset Your Password",
    html: wrapTemplate("Reset Your Password", body),
  });
}

// Sales Auto Reply
export async function sendSalesReply(to: string, name: string) {
  const body = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for contacting our <strong>Sales Team</strong> about the Business Plan.<br>
    This plan is currently under development. We’ll notify you once full details are available.</p>
    <p style="margin-top:20px;">We appreciate your patience 🙏</p>
  `;

  return salesTransporter.sendMail({
    from: `"Xstructure Sales" <${process.env.SALES_EMAIL_USER}>`,
    to,
    subject: "📢 Business Plan Inquiry Received",
    html: wrapTemplate("Business Plan Inquiry", body),
  });
}

// Care Auto Reply
export async function sendCareReply(to: string, name: string) {
  const body = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>We’ve received your support request. Our Care Team is reviewing your issue and will update you shortly.</p>
    <p style="margin-top:20px;">Stay tuned, we’ll get back to you as soon as possible ✅</p>
  `;

  return careTransporter.sendMail({
    from: `"Xstructure Care" <${process.env.EMAIL_USER}>`,
    to,
    subject: "📩 Support Request Received",
    html: wrapTemplate("We Got Your Request", body),
  });
}

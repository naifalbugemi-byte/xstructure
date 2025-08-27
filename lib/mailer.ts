import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail(to: string, name?: string) {
  return transporter.sendMail({
    from: `"XSTRUCTURE" <${process.env.MAIL_USER}>`,
    to,
    subject: "Welcome to XSTRUCTURE 🚀",
    html: `<h1>Welcome ${name || ""}</h1><p>Your account has been created.</p>`,
  });
}

export async function sendBusinessEmail(to: string, company?: string) {
  return transporter.sendMail({
    from: `"XSTRUCTURE" <${process.env.MAIL_USER}>`,
    to,
    subject: "Business Request Received",
    html: `<p>We received your request${company ? ` from ${company}` : ""}. We'll contact you soon.</p>`,
  });
}

import { sendWelcomeEmail, sendResetEmail } from "../../lib/mailer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// transporter للايميل العادي (نفس اللي استخدمته في send-test.ts)
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

async function main() {
  try {
    const to = "care@xstructure.ai"; // 👈 غيرها لأي إيميلك تبغى تستقبل عليه
    const name = "Biggieme 🦁";
    const resetLink = "https://xstructure.ai/reset/123456";

    // 1️⃣ Test email عادي
    await transporter.sendMail({
      from: `"Xstructure" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🚀 Test Email from Xstructure",
      text: "This is a simple test email to confirm SMTP is working ✅",
    });
    console.log("✅ Test email sent!");

    // 2️⃣ Welcome email
    await sendWelcomeEmail(to, name);
    console.log("✅ Welcome email sent!");

    // 3️⃣ Reset email
    await sendResetEmail(to, name, resetLink);
    console.log("✅ Reset email sent!");
    
  } catch (err) {
    console.error("❌ Failed to send some email:", err);
  }
}

main();

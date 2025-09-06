import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // sales@xstructure.ai
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Xstructure Business" <${process.env.EMAIL_USER}>`,
      to: "sales@xstructure.ai", // كل رسائل البزنس تروح هنا
      subject: `Business Inquiry: ${subject}`,
      html: `
        <h2>🏢 New Business Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    if (!email) {
      console.log("[server] ❌ No recipients defined (email missing)");
      return null;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587, // common SMTP port (use 465 for SSL)
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Studynotion | CodeHelp" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log(
      "[server] ✅ Email sent successfully:",
      info.response || info.messageId
    );

    return info;
  } catch (error) {
    console.error("[server] ❌ Email send failed:", error.message);
    return null;
  }
};

module.exports = mailSender;

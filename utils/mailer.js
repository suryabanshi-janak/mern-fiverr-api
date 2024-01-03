const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (email, subject, htmlTemplate) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };

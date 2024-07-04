const nodemailer = require('nodemailer');
const config = require('config');
const emailConfig = config.get('emailConfig');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

const sendEmail = async (receiverEmail, emailSubject, emailBody, cc = []) => {
  try {
    const mailOptions = {
      from: emailConfig.user,
      to: receiverEmail,
      cc: cc.join(', '),
      subject: emailSubject,
      html: emailBody,
      
    };
    await transporter.sendMail(mailOptions);
    return true; 
  } catch (error) {
    console.error('Error sending email:', error);
    return false; 
  }
};

module.exports = { sendEmail };
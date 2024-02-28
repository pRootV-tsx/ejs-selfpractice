const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create Transporter

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //   2) Create Mail Options

  const mailOptions = {
    from: '"Pruthviraj Chauhan" <makeitrealpc@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
    // html: '<b>Hello world?</b>',
  };

  //  3) Send the mail using transporter
  await transporter.sendMail(mailOptions);
};

module.exports(sendEmail);

const nodemailer = require("nodemailer");

exports.sendEmail = (req, res, next) => {
  //   console.log("test");
  //   console.log("request came");
  console.log(req.body);
  const data = { user: req.body.data, mailOptions: req.body.mailOptions };
  sendMail(data, info => {
    console.log(`The mail has been sent and the id is ${info.messageId}`);
    res.send(info);
  });
};

async function sendMail(object, callback) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "clemsontruckers@gmail.com",
      pass: "themamba"
    }
  });

  let mailOptions = {
    from: '"Truckers @ Clemson"<clemsontruckers@gmail.com>',
    to: object.user.email,
    subject: object.mailOptions.subject,
    html: object.mailOptions.message
  };

  let info = await transporter.sendMail(mailOptions);

  callback(info);
}

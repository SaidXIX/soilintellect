const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD
  }
})

const sendMail = (to, subject, html) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.MAILER_EMAIL,
      to,
      subject,
      html
    }

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log('Server is ready to take our messages')
      }
    })

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        console.log('Email sent: ' + info.response)
        resolve(info)
      }
    })
  })
}

module.exports = {
  sendMail
}

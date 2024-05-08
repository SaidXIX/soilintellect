const { signAccessToken, verifyAccessToken } = require('./jwt')
const { hashPassword, comparePassword } = require('./hash')
const { sendMail } = require('./mail/nodemailer-config')
const { verifyEmailTemplate } = require('./mail/verify-email-template')
const { passwordResetTemplate } = require('./mail/password-reset-template')

module.exports = {
  signAccessToken,
  verifyAccessToken,
  hashPassword,
  comparePassword,
  sendMail,
  verifyEmailTemplate,
  passwordResetTemplate
}

const { googleOAuth } = require('./google-auth')
const { register } = require('./register')
const { login } = require('./login')
const { verify } = require('./verify-email')
const { passwordResetEmail } = require('./request-password-reset')
const { passwordReset } = require('./password-reset')

module.exports = {
  googleOAuth,
  register,
  login,
  verify,
  passwordResetEmail,
  passwordReset
}

const crypto = require('crypto')

const verificationTokenGenerator = () => {
  return crypto.randomBytes(32).toString('hex')
}

module.exports = {
  verificationTokenGenerator
}

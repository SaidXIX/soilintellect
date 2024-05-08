const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  handler: (req, res) => {
    return res.status(429).json({
      error: 'You sent too many requests. Please wait a while then try again'
    })
  }
})

module.exports = {
  apiLimiter
}

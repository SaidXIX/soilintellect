const router = require('express').Router()
const { googleOAuth, register, login, verify, passwordResetEmail, passwordReset } = require('./controllers/_index')

router.post('/google', googleOAuth)
router.post('/register', register)
router.post('/login', login)
router.post('/verify', verify)
router.post('/password-reset-email', passwordResetEmail)
router.post('/password-reset', passwordReset)

module.exports = router

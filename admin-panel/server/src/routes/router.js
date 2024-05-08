const router = require('express').Router()

const auth = require('../modules/auth/route')
const predict = require('../modules/predict/route')

router.use('/auth', auth)
router.use('/predict', predict)

module.exports = router

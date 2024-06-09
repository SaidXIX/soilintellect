const router = require('express').Router()

const auth = require('../modules/auth/route')
const predict = require('../modules/predict/route')
const zone = require('../modules/zone/route')

router.use('/auth', auth)
router.use('/predict', predict)
router.use('/zone', zone)

module.exports = router

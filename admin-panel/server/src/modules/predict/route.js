const router = require('express').Router()
const { verifyAuthorization } = require('../../middlewares/auth')

const { ManualPrediction } = require('./controller')

router.post('/manual', verifyAuthorization, ManualPrediction)

module.exports = router

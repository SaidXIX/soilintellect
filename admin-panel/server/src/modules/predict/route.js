const router = require('express').Router()
const { verifyAuthorization } = require('../../middlewares/auth')

const { ManualPrediction, InstantPrediction } = require('./controller')

router.post('/manual', verifyAuthorization, ManualPrediction)
router.get('/instant/:id', verifyAuthorization, InstantPrediction)

module.exports = router

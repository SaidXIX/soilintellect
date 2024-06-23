const router = require('express').Router()
const { verifyAuthorization } = require('../../middlewares/auth')

const { ManualPrediction, InstantPrediction, AveragePrediction, GeneratePdf } = require('./controller')

router.post('/manual', verifyAuthorization, ManualPrediction)
router.get('/instant/:id', verifyAuthorization, InstantPrediction)
router.post('/average/:id', verifyAuthorization, AveragePrediction)
router.post('/generate-pdf', verifyAuthorization, GeneratePdf)

module.exports = router

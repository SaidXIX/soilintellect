const router = require('express').Router()
const { verifyAuthorization } = require('../../middlewares/auth')

const { getZones, addNewZone, removeZone, updateZone } = require('./controller')

router.get('/zones', verifyAuthorization, getZones)
router.post('/create', verifyAuthorization, addNewZone)
router.delete('/delete/:id', verifyAuthorization, removeZone)
router.post('/update/:id', verifyAuthorization, updateZone)

module.exports = router

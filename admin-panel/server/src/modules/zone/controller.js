const httpStatus = require('../../utils/http-status')
const { getUserZones, createZone, deleteZone, updateZone } = require('./service')

exports.getZones = async (req, res, next) => {
  try {
    const userId = req.user.id
    const zones = await getUserZones({ userId })
    if (zones.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send({
        success: 'false',
        message: 'no zones found for this user'
      })
    } else {
      return res.status(httpStatus.OK).send({
        success: true,
        zones
      })
    }
  } catch (error) {
    return next({
      status: error.status || 500,
      errors: error.errors,
      message: error.message
    })
  }
}

exports.addNewZone = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { name, location, implant } = req.body
    const { zone } = await createZone({ userId, name, location, implant })
    if (zone) {
      return res.status(httpStatus.CREATED).send({
        success: true,
        message: 'Zone has been created successfully',
        zone: {
          name,
          location,
          implant
        }
      })
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error occured when trying to create the zone'
      })
    }
  } catch (error) {
    return next({
      status: error.status || 500,
      errors: error.errors,
      message: error.message
    })
  }
}

exports.removeZone = async (req, res, next) => {
  try {
    const userId = req.user.id
    const zoneId = req.params.id
    const { deletedZone } = await deleteZone({ userId, zoneId })
    if (deletedZone) {
      return res.status(httpStatus.OK).send({
        success: true,
        message: 'zone deleted successfully'
      })
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error occured when trying to create the zone'
      })
    }
  } catch (error) {
    return next({
      status: error.status || 500,
      errors: error.errors,
      message: error.message
    })
  }
}

exports.updateZone = async (req, res, next) => {
  try {
    const userId = req.user.id
    const zoneId = req.params.id
    const { name, implant, location } = req.body

    const { updatedZone } = await updateZone({ userId, zoneId, name, location, implant })

    if (updatedZone) {
      return res.status(httpStatus.CREATED).send({
        success: true,
        message: 'Zone has been updated successfully',
        zone: {
          name,
          location,
          implant
        }
      })
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error occured when trying to create the zone'
      })
    }
  } catch (error) {
    return next({
      status: error.status || 500,
      errors: error.errors,
      message: error.message
    })
  }
}

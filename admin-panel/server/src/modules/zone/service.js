const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createError = require('http-errors')

exports.getUserZones = async ({ userId }) => {
  try {
    const zones = prisma.zone.findMany({
      where: {
        userId,
        deletedAt: null
      }
    })
    return zones
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.createZone = async ({ userId, name, implant, location }) => {
  try {
    const zone = await prisma.zone.create({
      data: {
        name,
        implant,
        location,
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
    return { zone }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.deleteZone = async ({ zoneId, userId }) => {
  try {
    const deletedZone = await prisma.zone.update({
      where: {
        id: zoneId,
        userId
      },
      data: {
        deletedAt: new Date()
      }
    })
    return { deletedZone }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.updateZone = async ({ zoneId, userId, name, implant, location }) => {
  try {
    const updatedZone = await prisma.zone.update({
      where: {
        id: zoneId,
        userId
      },
      data: {
        name,
        implant,
        location
      }
    })
    return { updatedZone }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

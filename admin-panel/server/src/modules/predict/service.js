const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createError = require('http-errors')

exports.getLastSample = async ({ userId, zoneId }) => {
  try {
    const lastSample = await prisma.sample.findFirst({
      where: {
        userId,
        zoneId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return { lastSample }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.getSamples = async ({ userId, zoneId, number, sortOrder }) => {
  try {
    const samples = await prisma.sample.findMany({
      where: {
        userId,
        zoneId
      },
      orderBy: {
        createdAt: sortOrder
      },
      take: number
    })
    return { samples }
  } catch (error) {
    console.error('Error in getSamples:', error)
    throw createError.InternalServerError()
  }
}

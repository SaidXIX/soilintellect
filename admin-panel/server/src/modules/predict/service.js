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

/* eslint-disable camelcase */
const { PrismaClient } = require('@prisma/client')
const createError = require('http-errors')
const axios = require('axios')

const prisma = new PrismaClient()

exports.getGoogleUser = async ({ access_token }) => {
  try {
    const response = await axios.get(
      `${process.env.GOOGLE_USER_INFO}?alt=json&access_token=${access_token}`
    )
    return { data: response.data }
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error?.response?.status === 401) {
        throw createError.Unauthorized()
      }
      throw createError.InternalServerError()
    }
    throw createError.InternalServerError()
  }
}
exports.getUserByEmail = async ({ email }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
        verified: true
      }
    })
    return { user }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.getNotVerifiedUserByEmail = async ({ email }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
        verified: false
      }
    })
    return { user }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.updateNotVerifiedUser = async ({ userId, newFirstName, newFamilyName, newHashedPassword, newVerficationToken }) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: newFirstName,
        familyName: newFamilyName,
        password: newHashedPassword,
        verificationToken: newVerficationToken
      }
    })
    return { user }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.createWithSocial = async ({
  email,
  firstName,
  familyName,
  providerId
}) => {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        familyName,
        verified: true,
        socialProfiles: {
          create: {
            provider: 'GOOGLE',
            providerId
          }
        }
      }
    })
    return { user }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}
exports.createUser = async ({
  firstName,
  familyName,
  email,
  hashedPassword,
  verificationToken
}) => {
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        familyName,
        email,
        password: hashedPassword,
        verificationToken
      }
    })
    return { user }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.getUserByToken = async ({ verificationToken }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        verificationToken
      }
    })
    return { user }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.markUserAsVerified = async ({ userId }) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        verified: true,
        verificationToken: null
      }
    })
    return { user }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.updatePasswordResetToken = async ({ userId, passwordResetToken }) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken,
        passwordResetTokenExpiresAt: new Date(Date.now())
      }
    })
    return { user }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.getUserByResetToken = async ({ passwordResetToken }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        passwordResetToken
      }
    })
    return { user }
  } catch (error) {
    console.log(error)
    throw createError.InternalServerError()
  }
}

exports.resetPassword = async ({ userId, newPassword }) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null
      }
    })
    return { user }
  } catch (error) {
    throw createError.InternalServerError()
  }
}

/* eslint-disable camelcase */
const createError = require('http-errors')
const httpStatus = require('../../../utils/http-status')
const yup = require('yup')

const { getUserByResetToken, resetPassword } = require('../service')
const { signAccessToken, hashPassword } = require('../../../helpers/index')

exports.passwordReset = async (req, res, next) => {
  try {
    const { newPassword, passwordResetToken } = req.body
    const { user } = await getUserByResetToken({ passwordResetToken })

    if (!user) {
      return next(createError.BadRequest('Bad User Input'))
    }

    const oneHourAgo = new Date(Date.now() - 3600000)

    if (
      passwordResetToken === user.passwordResetToken &&
      oneHourAgo < user.passwordResetTokenExpiresAt
    ) {
      const hashedPassword = await hashPassword({ password: newPassword })
      const { user: userWithNewPassword } = await resetPassword({
        userId: user.id,
        newPassword: hashedPassword
      })
      const access_token = await signAccessToken({
        userId: userWithNewPassword.id,
        email: userWithNewPassword.email
      })
      return res.status(httpStatus.ACCEPTED).send({
        success: true,
        access_token,
        first_name: user.firstName,
        family_name: user.familyName
      })
    }
    return res.status(httpStatus.FORBIDDEN).send({
      success: false,
      message: 'Reset token is invalid'
    })
  } catch (error) {
    console.log(error)
    if (error instanceof yup.ValidationError) {
      return next({
        status: httpStatus.BAD_REQUEST,
        message: 'Input validation failed'
      })
    }
    return next({
      status: error.status || 500
    })
  }
}

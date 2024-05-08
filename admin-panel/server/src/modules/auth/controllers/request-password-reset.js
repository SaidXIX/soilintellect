/* eslint-disable camelcase */
const createError = require('http-errors')
const httpStatus = require('../../../utils/http-status')
const yup = require('yup')

const { getUserByEmail, updatePasswordResetToken } = require('../service')
const { sendMail, passwordResetTemplate } = require('../../../helpers/index')
const { getValidationErrors } = require('../../../utils/get-validation-errors')
const {
  verificationTokenGenerator
} = require('../../../utils/verification-token')
const { passwordResetSchema } = require('./_constants')

exports.passwordResetEmail = async (req, res, next) => {
  try {
    await passwordResetSchema.validate(req.body, {
      abortEarly: false,
      strict: true
    })
    const { email } = req.body
    const { user: userExists } = await getUserByEmail({ email })
    if (!userExists) {
      return next(createError.BadRequest('Bad User Input'))
    }
    const passwordResetToken = verificationTokenGenerator()
    const { user } = await updatePasswordResetToken({
      userId: userExists.id,
      passwordResetToken
    })
    await sendMail(
      user.email,
      'Password Reset on Soilintellect',
      passwordResetTemplate(user.firstName, user.passwordResetToken, user.email)
    )
    return res.status(httpStatus.OK).send({
      success: true,
      message: 'Check your email for verification '
    })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getValidationErrors({ errors: error.inner })
      return next({
        status: httpStatus.BAD_REQUEST,
        message: 'Input validation failed',
        errors
      })
    }
    return next({
      status: error.status || 500,
      errors: error.errors,
      message: error.message
    })
  }
}

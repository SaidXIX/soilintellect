/* eslint-disable camelcase */
const createError = require('http-errors')
const httpStatus = require('../../../utils/http-status')
const yup = require('yup')

const { getUserByEmail } = require('../service')
const { signAccessToken, comparePassword } = require('../../../helpers/index')
const { getValidationErrors } = require('../../../utils/get-validation-errors')
const { loginSchema } = require('./_constants')

exports.login = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false, strict: true })
    const { email, password } = req.body
    const { user } = await getUserByEmail({ email })

    if (!user) {
      return next(createError.BadRequest('Bad User Input'))
    }

    const { check } = await comparePassword({
      hashedPassword: user.password,
      password
    })
    if (!check) {
      return next(createError.BadRequest(' Bad User Input '))
    }

    const access_token = await signAccessToken({
      userId: user.id,
      email: user.email
    })
    return res.status(httpStatus.OK).send({
      success: true,
      access_token,
      first_name: user.firstName,
      family_name: user.familyName
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

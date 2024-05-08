/* eslint-disable camelcase */
const createError = require('http-errors')
const httpStatus = require('../../../utils/http-status')
const yup = require('yup')

const { getGoogleUser, createWithSocial, getUserByEmail } = require('../service')
const { signAccessToken } = require('../../../helpers/index')
const { getValidationErrors } = require('../../../utils/get-validation-errors')
const { googleTokenSchema } = require('./_constants')

exports.googleOAuth = async (req, res, next) => {
  try {
    await googleTokenSchema.validate(req.body, {
      abortEarly: false,
      strict: true
    })
    const { access_token } = req.body
    const { data } = await getGoogleUser({ access_token })

    if (!data.verified_email) {
      return next(createError.Forbidden('Google account is not verified'))
    }

    const { user } = await getUserByEmail({ email: data.email })
    if (!user) {
      const { user } = await createWithSocial({
        email: data.email,
        providerId: data.id,
        firstName: data.given_name,
        familyName: data.family_name
      })
      const access_token = await signAccessToken({
        userId: user.id,
        email: user.email
      })
      return res.status(httpStatus.CREATED).send({
        success: true,
        access_token,
        first_name: user.firstName,
        family_name: user.familyName
      })
    }
    const login_access_token = await signAccessToken({
      userId: user.id,
      email: user.email
    })
    return res.status(httpStatus.CREATED).send({
      success: true,
      access_token: login_access_token,
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

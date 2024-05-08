/* eslint-disable camelcase */
const createError = require('http-errors')
const httpStatus = require('../../../utils/http-status')
const yup = require('yup')

const {
  createUser,
  getUserByEmail,
  getNotVerifiedUserByEmail,
  updateNotVerifiedUser
} = require('../service')
const { hashPassword, sendMail, verifyEmailTemplate } = require('../../../helpers/index')
const { getValidationErrors } = require('../../../utils/get-validation-errors')
const { verificationTokenGenerator } = require('../../../utils/verification-token')
const { registerSchema } = require('./_constants')

exports.register = async (req, res, next) => {
  try {
    await registerSchema.validate(req.body, {
      abortEarly: false,
      strict: true
    })
    const { firstName, familyName, email, password } = req.body
    const { user: userExits } = await getUserByEmail({ email })
    if (userExits) {
      return next(
        createError.Conflict(
          'Email already in use. Please choose a different email address.'
        )
      )
    } else {
      const { user: userNotVerified } = await getNotVerifiedUserByEmail({
        email
      })
      if (userNotVerified) {
        const newHashedPasword = await hashPassword({ password })
        const newVerificationToken = verificationTokenGenerator()

        const { user: updatedNonVerifiedUser } = await updateNotVerifiedUser({
          userId: userNotVerified.id,
          newFirstName: firstName,
          newFamilyName: familyName,
          newHashedPassword: newHashedPasword,
          newVerficationToken: newVerificationToken
        })
        if (updatedNonVerifiedUser) {
          await sendMail(
            userNotVerified.email,
            'Soilintellect Email Verification',
            verifyEmailTemplate(
              updatedNonVerifiedUser.firstName,
              updatedNonVerifiedUser.verificationToken,
              userNotVerified.email
            )
          )

          return res.status(httpStatus.CREATED).send({
            success: true,
            message:
              'User updated successfully, check your email for verification '
          })
        }
      } else {
        const hashedPassword = await hashPassword({ password })
        const verificationToken = verificationTokenGenerator()
        const { user } = await createUser({
          firstName,
          familyName,
          email,
          hashedPassword,
          verificationToken
        })

        if (user) {
          await sendMail(
            user.email,
            'Email Verification',
            verifyEmailTemplate(
              user.firstName,
              user.verificationToken,
              user.email
            )
          )

          return res.status(httpStatus.CREATED).send({
            success: true,
            message:
              'User registered successfully, check your email for verification '
          })
        }
      }
    }

    return res.status(httpStatus.CONFLICT).send({
      success: false,
      message: 'Email already in use, please use another one'
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

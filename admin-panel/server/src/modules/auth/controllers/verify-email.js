/* eslint-disable camelcase */
const httpStatus = require('../../../utils/http-status')

const { getUserByToken, markUserAsVerified } = require('../service')
const { signAccessToken } = require('../../../helpers/index')

exports.verify = async (req, res, next) => {
  try {
    const { token } = req.body
    const { user } = await getUserByToken({ verificationToken: token })
    if (user) {
      await markUserAsVerified({ userId: user.id })
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
    } else {
      return res.status(httpStatus.FORBIDDEN).send({
        success: false,
        message: 'check your email again for a newer verification link'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

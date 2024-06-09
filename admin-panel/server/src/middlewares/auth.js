const createError = require('http-errors')
const { verifyAccessToken } = require('../helpers')
const { getUserByEmail } = require('../modules/auth/service')

exports.verifyAuthorization = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(createError.Unauthorized())
  }

  const authHeader = req.headers.authorization
  const bearerToken = authHeader.split(' ')
  const accessToken = bearerToken[1]

  try {
    const { email } = await verifyAccessToken({ accessToken })
    const { user } = await getUserByEmail({ email })

    if (!user) {
      return next(createError.Unauthorized())
    }

    delete user.password
    req.user = user

    next()
  } catch (error) {
    console.error('FROM THE MIDDLEWARE', error)
    return next(createError.Unauthorized())
  }
}

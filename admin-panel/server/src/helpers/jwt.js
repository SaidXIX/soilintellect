/* eslint-disable camelcase */
const JWT = require('jsonwebtoken')
const createError = require('http-errors')

exports.signAccessToken = ({ userId, email }) => {
  return new Promise((resolve, reject) => {
    const payload = { userId, email }
    const options = { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, options, (error, token) => {
      if (error) {
        reject(createError.InternalServerError())
      }
      resolve(token)
    })
  })
}

exports.verifyAccessToken = ({ accessToken }) => {
  return new Promise((resolve, reject) => {
    JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
      if (error) {
        console.log(error)
        reject(createError.Unauthorized())
      }
      const { userId, email } = payload
      resolve({ userId, email })
    })
  })
}

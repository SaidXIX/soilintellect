const argon2 = require('argon2')
const createError = require('http-errors')

exports.hashPassword = async ({ password }) => {
  try {
    const hash = argon2.hash(password)
    return hash
  } catch (error) {
    createError.InternalServerError()
  }
}

exports.comparePassword = async ({ hashedPassword, password }) => {
  try {
    const check = await argon2.verify(hashedPassword, password)
    if (!check) {
      return { check: false }
    } else {
      return { check: true }
    }
  } catch (error) {
    console.log(error)
  }
}

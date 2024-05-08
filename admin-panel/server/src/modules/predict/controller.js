/* eslint-disable camelcase */
const yup = require('yup')
const axios = require('axios')

const httpStatus = require('../../utils/http-status')
const { getValidationErrors } = require('../../utils/get-validation-errors')
const { predictionSchema } = require('./_constants')

exports.ManualPrediction = async (req, res, next) => {
  try {
    await predictionSchema.validate(req.body, { abortEarly: false, strict: true })
    const { N, P, K, temperature, humidity, ph } = req.body
    const structuredValues = [
      { value: N },
      { value: P },
      { value: K },
      { value: temperature },
      { value: humidity },
      { value: ph }
    ]

    const response = await axios.post(process.env.PREDICTION_MODEL_API, structuredValues)
    const result = response.data

    return res.status(httpStatus.OK).send({
      success: true,
      result
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

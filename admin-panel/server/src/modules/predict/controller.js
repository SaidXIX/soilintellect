/* eslint-disable camelcase */
const yup = require('yup')
const axios = require('axios')

const httpStatus = require('../../utils/http-status')
const { getValidationErrors } = require('../../utils/get-validation-errors')
const { predictionSchema } = require('./_constants')
const { getLastSample } = require('./service')

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

exports.InstantPrediction = async (req, res, next) => {
  try {
    const userId = req.user.id
    const zoneId = req.params.zoneId
    const { lastSample } = await getLastSample({ userId, zoneId })
    if (lastSample) {
      const { N, P, K, temperature, humidity, ph } = lastSample
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
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'error fetching for the last record'
      })
    }
  } catch (error) {
    return next({
      status: error.status || 500,
      errors: error.errors,
      message: error.message
    })
  }
}

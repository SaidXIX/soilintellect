/* eslint-disable camelcase */
const yup = require('yup')
const axios = require('axios')
const PDFDocument = require('pdfkit')
const path = require('path')

const httpStatus = require('../../utils/http-status')
const { getValidationErrors } = require('../../utils/get-validation-errors')
const { predictionSchema } = require('./_constants')
const { getLastSample, getSamples } = require('./service')

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
        result,
        sampleProperties: {
          N: parseFloat(lastSample.N),
          P: parseFloat(lastSample.P),
          K: parseFloat(lastSample.K),
          temperature: parseFloat(lastSample.temperature),
          humidity: parseFloat(lastSample.humidity),
          ph: parseFloat(lastSample.ph)
        }
      })
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'error fetching for the last record'
      })
    }
  } catch (error) {
    console.log(error)
    return next({
      status: error.status || 500,
      errors: error.errors,
      message: error.message
    })
  }
}

exports.AveragePrediction = async (req, res, next) => {
  try {
    const userId = req.user.id
    const zoneId = req.params.zoneId
    const { number, orderBy } = req.body

    const numSamples = parseInt(number, 10)
    const sortOrder = orderBy === 'asc' ? 'asc' : 'desc'

    if (isNaN(numSamples) || numSamples <= 0) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: 'Invalid number of samples'
      })
    }

    const { samples } = await getSamples({ userId, zoneId, number: numSamples, sortOrder })

    if (samples.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send({
        success: false,
        message: 'No records found'
      })
    }

    const averages = samples.reduce(
      (acc, sample) => {
        acc.N += sample.N
        acc.P += sample.P
        acc.K += sample.K
        acc.temperature += sample.temperature
        acc.humidity += sample.humidity
        acc.ph += sample.ph
        return acc
      },
      { N: 0, P: 0, K: 0, temperature: 0, humidity: 0, ph: 0 }
    )

    const numRecords = samples.length
    const avgValues = {
      N: averages.N / numRecords,
      P: averages.P / numRecords,
      K: averages.K / numRecords,
      temperature: averages.temperature / numRecords,
      humidity: averages.humidity / numRecords,
      ph: averages.ph / numRecords
    }

    const structuredValues = [
      { value: avgValues.N },
      { value: avgValues.P },
      { value: avgValues.K },
      { value: avgValues.temperature },
      { value: avgValues.humidity },
      { value: avgValues.ph }
    ]

    const response = await axios.post(process.env.PREDICTION_MODEL_API, structuredValues)
    const result = response.data

    return res.status(httpStatus.OK).send({
      success: true,
      result,
      averageValues: avgValues
    })
  } catch (error) {
    console.error('Error in AveragePrediction:', error)
    return next({
      status: error.status || 500,
      message: error.message,
      errors: error.errors
    })
  }
}

exports.GeneratePdf = async (req, res, next) => {
  try {
    const { prediction, sampleProperties, diagnostics } = req.body

    const doc = new PDFDocument()

    res.setHeader('Content-disposition', 'attachment; filename="prediction_data.pdf"')
    res.setHeader('Content-type', 'application/pdf')

    doc.pipe(res)

    const logoPath = path.resolve(__dirname, 'logo.png')
    doc.image(logoPath, 230, 25, { width: 150 })

    doc.fontSize(20).text('Full Report', { align: 'center', underline: true })
    doc.moveDown()

    const now = new Date()
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
    const formattedTime = now.toLocaleTimeString('en-US', { hour12: true })
    doc.fontSize(14).text(`Date: ${formattedDate}`, { align: 'center' })
    doc.fontSize(14).text(`Time: ${formattedTime}`, { align: 'center' })
    doc.moveDown()

    doc.fontSize(18).text('Soil Type:', { bold: true })
    prediction.T1.forEach((item) => {
      doc.fontSize(14).text(`${item.Class}: ${item.Probability}%`)
    })
    doc.moveDown()

    doc.fontSize(18).text('Crop Recommendation:', { bold: true })
    prediction.T2.forEach((item) => {
      doc.fontSize(14).text(`${item.Class}: ${item.Probability}%`)
    })
    doc.moveDown()

    doc.fontSize(18).text('Sample Properties:', { bold: true })
    Object.entries(sampleProperties).forEach(([key, value]) => {
      doc.fontSize(14).text(`${key}: ${value}`)
    })
    doc.moveDown()

    doc.fontSize(18).text('Diagnostics:', { bold: true })
    doc.fontSize(14).text('Soil and Water Requirements:', { underline: true })
    doc.text(diagnostics.soilWater)
    doc.moveDown()
    doc.fontSize(14).text('Planting and Maintenance:', { underline: true })
    doc.text(diagnostics.plantingMaintenance)

    doc.end()
  } catch (error) {
    console.error('Error in Generating pdf:', error)
    return next({
      status: error.status || 500,
      message: error.message,
      errors: error.errors
    })
  }
}

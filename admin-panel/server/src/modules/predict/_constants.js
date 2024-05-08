const Yup = require('yup')

const predictionSchema = Yup.object().shape({
  N: Yup.number()
    .min(0, 'N must be a non-negative number')
    .required('N is required'),
  P: Yup.number()
    .min(0, 'P must be a non-negative number')
    .required('P is required'),
  K: Yup.number()
    .min(0, 'K must be a non-negative number')
    .required('K is required'),
  temperature: Yup.number()
    .min(0, 'Temperature must be a non-negative number')
    .required('Temperature is required'),
  humidity: Yup.number()
    .min(0, 'Humidity must be a non-negative number')
    .required('Humidity is required'),
  ph: Yup.number()
    .min(0, 'PH must be a non-negative number')
    .max(14, 'PH cannot exceed 14')
    .required('PH is required')
})

module.exports = { predictionSchema }

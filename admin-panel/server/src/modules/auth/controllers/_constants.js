const yup = require('yup')

const googleTokenSchema = yup.object().shape({
  access_token: yup.string().typeError('access_token field must be string').required('access_token field is required')
})

const registerSchema = yup.object({
  firstName: yup.string()
    .trim()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must be less than 51 characters')
    .required('First name is required'),
  familyName: yup.string()
    .trim()
    .min(3, 'Family name must be at least 3 characters')
    .max(50, 'Family name must be less than 51 characters')
    .required('Family name is required'),
  email: yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/\d/, 'Password must contain a number')
    .required('Password is required')
})

const loginSchema = yup.object({
  email: yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string()
    .trim()
    .required('Password is required')
})

const passwordResetSchema = yup.object({
  email: yup.string()
    .email('Invalid email format')
    .required('Email is required')
})

module.exports = { googleTokenSchema, registerSchema, loginSchema, passwordResetSchema }

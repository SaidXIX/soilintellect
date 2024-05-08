import * as Yup from 'yup'

export const initialValues = {
  firstName: '',
  familyName: '',
  email: '',
  password: ''
}

export const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must be less than 51 characters')
    .required('First name is required'),
  familyName: Yup.string()
    .trim()
    .min(3, 'Family name must be at least 3 characters')
    .max(50, 'Family name must be less than 51 characters')
    .required('Family name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/\d/, 'Password must contain a number')
    .required('Password is required')
})

export const checkMail = {
  title: 'Welcome aboard! Your account has been registered.',
  description: "To ensure smooth sailing, please verify your email address by clicking the link in the confirmation email we've sent"
}

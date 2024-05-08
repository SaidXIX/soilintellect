import * as Yup from 'yup'

export const initialValues = {
  email: '',
  password: ''
}

export const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().trim().required('Password is required')
})

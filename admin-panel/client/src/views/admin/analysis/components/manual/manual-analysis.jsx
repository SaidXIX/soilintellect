import { useState } from 'react'

import { Button, Spinner, useColorModeValue, useToast } from '@chakra-ui/react'
import axios from 'axios'
import * as Yup from 'yup'

import { Form, Input } from '@components'
import { getCookies } from '@utils/cookies'

const ManualAnalysis = () => {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const { accessToken } = getCookies()

  const headers = {
    Authorization: `Bearer ${accessToken}`
  }

  const initialValues = {
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: ''
  }

  const validationSchema = Yup.object().shape({
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

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const numericValues = {
        N: parseFloat(values.N),
        P: parseFloat(values.P),
        K: parseFloat(values.K),
        temperature: parseFloat(values.temperature),
        humidity: parseFloat(values.humidity),
        ph: parseFloat(values.ph)
      }
      const response = await axios.post(import.meta.env.VITE_URL_MANUAL_PREDICTION_API, numericValues, { headers })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred, please try again later',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={handleSubmit}
    >
      <Input paddingY={1} name='N' label='Nitrogen' />
      <Input paddingY={1} name='P' label='Phosphorus' />
      <Input paddingY={1} name='K' label='Potassium' />
      <Input paddingY={1} name='temperature' label='Temperature' />
      <Input paddingY={1} name='humidity' label='Humidity' />
      <Input paddingY={1} name='ph' label='PH' />
      <Button
        marginY={2}
        _hover={{ bgColor: 'teal' }}
        color={useColorModeValue('white', 'black')}
        backgroundColor={useColorModeValue(
          'lightMode.primary',
          'darkMode.primary'
        )}
        width='100%'
        type='submit'
      >
        {loading ? <Spinner size='sm' /> : 'Start the test'}
      </Button>
    </Form>
  )
}

export default ManualAnalysis

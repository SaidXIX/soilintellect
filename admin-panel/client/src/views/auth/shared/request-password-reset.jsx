/* eslint-disable react/prop-types */
import { useState } from 'react'

import {
  VStack,
  Button,
  useColorModeValue,
  useToast,
  Spinner,
  Stack,
  Flex,
  Heading,
  Text,
  Image
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import axios from 'axios'

import { SoilIntellectLogo, SoilIntellectLogoDarkMode } from '@assets'
import { Input } from '@components'
import CheckEmail from './check-email'

const RequestPasswordReset = () => {
  const [loading, setLoading] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)

  const passwordResetTitle = 'Hello!'
  const passwordResetDescription = 'Please check your email, a password reset link has been sent to your inbox.'

  const navigate = useNavigate()
  const toast = useToast()

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required')
  })

  const initialValues = {
    email: '',
    password: ''
  }

  const handleSubmit = async values => {
    setLoading(true)
    axios
      .post(import.meta.env.VITE_URL_REQUEST_PASSWORD_RESET_API, {
        email: values.email
      })
      .then(response => {
        if (response.status === 200) {
          setRequestSuccess(true)
        } else {
          toast({
            title: 'Error',
            description: 'An Error occured, please try again later',
            status: 'error',
            duration: 9000,
            isClosable: true
          })
        }
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'An Error occured, please try again later',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      direction='column'
      padding={2}
      bgColor={useColorModeValue('gray.50', '#212121')}
    >
      { !requestSuccess
        ? <>
      <Image
        alignSelf='center'
        width='15rem'
        src={useColorModeValue(SoilIntellectLogo, SoilIntellectLogoDarkMode)}
        alt='soilintellect-logo'
      />
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bgColor={useColorModeValue('white', 'black')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          You&apos;ll get an email with a reset link
        </Text>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <VStack spacing={2}>
                <Input
                  type='email'
                  name='email'
                  label='Email'
                  placeholder='email@example.com'
                />
                <Button
                  _hover={{
                    backgroundColor: 'teal'
                  }}
                  color={useColorModeValue('white', 'black')}
                  type='submit'
                  backgroundColor={useColorModeValue(
                    'lightMode.primary',
                    'darkMode.primary'
                  )}
                  width='100%'
                >
                  {loading ? <Spinner size='sm' /> : 'Request reset'}
                </Button>
                <Button
                  _hover={{ backgroundColor: 'transparent' }}
                  alignSelf='start'
                  textDecor='underline'
                  padding={0}
                  justifyContent='start'
                  backgroundColor='transparent'
                  fontWeight={200}
                  fontSize='sm'
                  variant='ghost'
                  onClick={() => navigate('/login')}
                  color={useColorModeValue(
                    'lightMode.primary',
                    'darkMode.primary'
                  )}
                >
                  Go back
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Stack></>
        : <CheckEmail title={passwordResetTitle} description={passwordResetDescription}/>}
    </Flex>
  )
}

export default RequestPasswordReset

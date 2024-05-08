import { useState } from 'react'

import {
  Flex,
  VStack,
  Button,
  Heading,
  Image,
  useColorModeValue,
  Stack,
  Text,
  IconButton,
  useToast,
  Spinner
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { PiEyeFill, PiEyeSlashFill } from 'react-icons/pi'

import { Form, Input, ColorModeSwitcher } from '@components'
import {
  LoginSplitScreenImage,
  SoilIntellectLogo,
  SoilIntellectLogoDarkMode
} from '@assets'
import { setCookies } from '@utils/cookies'
import { initialValues, validationSchema } from './_constants'
import GoogleAuth from '../shared/google'
import axios from 'axios'

const LoginView = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async values => {
    setLoading(true)
    axios
      .post(import.meta.env.VITE_URL_LOGIN_API, {
        email: values.email,
        password: values.password
      })
      .then(response => {
        setCookies({
          accessToken: response.data.access_token,
          firstName: response.data.first_name,
          familyName: response.data.family_name
        })
        navigate('/')
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'An error occurred, please try again later',
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
    <Flex minH={'100vh'}>
      <VStack
        bg={useColorModeValue('gray.50', '#212121')}
        padding={4}
        textAlign='center'
        justifyContent='space-between'
        alignItems='center'
        width={{ base: '100%', md: '40%' }}
      >
        <Stack justifyContent='center' alignItems='center' width='100%'></Stack>
        <Stack width={{ base: '100%', md: '70%' }}>
          <Image
            alignSelf='center'
            width='15rem'
            src={useColorModeValue(
              SoilIntellectLogo,
              SoilIntellectLogoDarkMode
            )}
            alt='soilintellect-logo'
          />
          <Heading my={4}>Login to Soilintellect</Heading>
          <Form
            initialValues={initialValues}
            validationSchema={validationSchema}
            handleSubmit={handleSubmit}
          >
            <Input paddingY={4} name='email' placeholder='email@example.com' label='Email' />
            <Input paddingY={4} name='password' label='Password'
              InputElement={
                <IconButton
                  aria-label='show Password'
                  onClick={() => setShowPassword(!showPassword)}
                  colorScheme='gray'
                  color='#718096'
                  icon={showPassword ? <PiEyeFill /> : <PiEyeSlashFill />}
                />
              }
              type={showPassword ? 'text' : 'password'}
            />
            <Stack paddingY={2} width='100%' alignItems='end'>
              <Text
                as={Link}
                to='/request-password-reset'
                color={useColorModeValue(
                  'lightMode.primary',
                  'darkMode.primary'
                )}
              >
                Forgot password?
              </Text>
            </Stack>
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
              {loading ? <Spinner size='sm' /> : 'Login'}
            </Button>
            <GoogleAuth />
          </Form>
          <Text>
            New here?
            <Text
              as={Link}
              fontSize='bold'
              to='/signup'
              color={useColorModeValue('lightMode.primary', 'darkMode.primary')}
            >
              {' '}
              Create your account{' '}
            </Text>
          </Text>
        </Stack>
        <Stack justifyContent='center' alignItems='start' width='100%'>
          <ColorModeSwitcher />
        </Stack>
      </VStack>
      <VStack
        backgroundSize='cover'
        backgroundPosition='center'
        backgroundRepeat='no-repeat'
        backgroundImage={LoginSplitScreenImage}
        display={{ base: 'none', md: 'block' }}
        width='60%'
      ></VStack>
    </Flex>
  )
}

export default LoginView

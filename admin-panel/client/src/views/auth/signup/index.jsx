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
  Spinner,
  useToast
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { PiEyeFill, PiEyeSlashFill } from 'react-icons/pi'
import axios from 'axios'

import { Form, Input, ColorModeSwitcher } from '@components'
import { SignupSplitScreenImage, SoilIntellectLogo, SoilIntellectLogoDarkMode } from '@assets'
import { initialValues, validationSchema, checkMail } from './_constants'
import GoogleAuth from '../shared/google'
import CheckEmail from '../shared/check-email'

const SignupView = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const toast = useToast()

  const handleSubmit = async (values) => {
    setLoading(true)
    axios.post(import.meta.env.VITE_URL_REGISTER_API, {
      firstName: values.firstName,
      familyName: values.familyName,
      email: values.email,
      password: values.password
    })
      .then((response) => {
        if (response.status === 201) {
          setSignupSuccess(true)
        } else {
          toast({
            title: 'Error',
            description: 'Error occured, Please try again later',
            status: 'error',
            duration: 9000,
            isClosable: true
          })
        }
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Error occured, Please try again later',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      }).finally(() => {
        setLoading(false)
      })
  }

  return (
    <Flex minH={'100vh'}>
      { signupSuccess
        ? <CheckEmail title={checkMail.title} description={checkMail.description}/>
        : <VStack
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
          <Heading my={2}>Join Soilintellect</Heading>
          <Form
            initialValues={initialValues}
            validationSchema={validationSchema}
            handleSubmit={handleSubmit}
          >
            <Input paddingY={0.5} name='firstName' placeholder='John' label='First name' />
            <Input paddingY={0.5} name='familyName' placeholder='Doe' label='Last name' />
            <Input paddingY={0.5} name='email' placeholder='email@example.com' label='Email'
            />
            <Input paddingY={0.5} name='password' label='Password'
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
            <Stack paddingY={1} width='100%' alignItems='end'>
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
              marginY={1}
              _hover={{ bgColor: 'teal' }}
              color={useColorModeValue('white', 'black')}
              backgroundColor={useColorModeValue(
                'lightMode.primary',
                'darkMode.primary'
              )}
              width='100%'
              type='submit'
            >
              {loading ? <Spinner size='sm'/> : 'Register'}
            </Button>
            <GoogleAuth />
          </Form>
          <Text>
            Already have an account?
            <Text
              color={useColorModeValue('lightMode.primary', 'darkMode.primary')}
              as={Link}
              to='/login'
            >
              {' '}
              Login{' '}
            </Text>
          </Text>
        </Stack>
        <Stack justifyContent='center' alignItems='start' width='100%'>
          <ColorModeSwitcher />
        </Stack>
      </VStack>}
      <VStack
        backgroundSize='cover'
        backgroundPosition='center'
        backgroundRepeat='no-repeat'
        backgroundImage={SignupSplitScreenImage}
        display={{ base: 'none', md: 'block' }}
        width='60%'
      ></VStack>
    </Flex>
  )
}

export default SignupView

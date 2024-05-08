/* eslint-disable react/prop-types */
import { useState } from 'react'

import {
  Box,
  VStack,
  Button,
  useColorModeValue,
  Spinner,
  IconButton,
  Flex,
  Stack,
  Heading,
  Image,
  Text
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PiEyeFill, PiEyeSlashFill } from 'react-icons/pi'
import * as yup from 'yup'
import axios from 'axios'

import { Input } from '@components'
import { SoilIntellectLogo, SoilIntellectLogoDarkMode, Warning as WarningImg } from '@assets'
import { setCookies } from '@utils/cookies'

const PasswordReset = () => {
  const { t } = useTranslation('demo')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { token, email } = useParams()

  const validationSchema = yup.object({
    password: yup.string()
      .trim()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/\d/, 'Password must contain a number')
      .required('Password is required'),

    confirmPassword: yup.string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Passwords do not match. Please make sure both passwords are identical.')
  })

  const initialValues = {
    password: '',
    confirmPassword: ''
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    axios
      .post(import.meta.env.VITE_URL_PASSWORD_RESET_API, {
        newPassword: values.confirmPassword,
        passwordResetToken: token,
        email
      })
      .then(response => {
        if (response.status === 202) {
          setCookies({
            accessToken: response.data.access_token,
            firstName: response.data.first_name,
            familyName: response.data.family_name
          })
          navigate('/')
        } else {
          setError(true)
        }
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const handlePaste = (e) => {
    e.preventDefault()
  }
  return (
    <Flex
    minW='100vw'
    minH={'100vh'}
    align={'center'}
    justify={'center'}
    bg={useColorModeValue('gray.50', 'gray.800')}
    flexDirection="column"
  >
    { !error && <Stack spacing={10} mx={'auto'} minW={'30%'} py={12} px={6}>
      <Image src={useColorModeValue(SoilIntellectLogo, SoilIntellectLogoDarkMode)} height={'4em'} alt='nojoom-logo'/>
      <Heading
        textAlign="center"
        fontSize={{ base: 'xl', sm: '2xl', md: '3xl', lg: '3xl' }}
      >
        Enter new password
      </Heading>
    <Box
      rounded={'lg'}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <VStack spacing={2}>
              <Input
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
                name='password'
                label='Password'
              />
              <Input
                InputElement={
                  <IconButton
                    aria-label='show Password'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    colorScheme='gray'
                    color='#718096'
                    icon={showConfirmPassword ? <PiEyeFill /> : <PiEyeSlashFill />}
                  />
                }
                onPaste={handlePaste}
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                label='Confirm password'
              />
              <Button
                _hover={{
                  backgroundColor: useColorModeValue(
                    'lightMode.primary',
                    'orange'
                  )
                }}
                color={useColorModeValue('white', 'black')}
                type='submit'
                backgroundColor={useColorModeValue(
                  'lightMode.primary',
                  'darkMode.secondary'
                )}
                width='100%'
              >
                {loading ? <Spinner size='sm' /> : 'Confirm'}
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
    </Stack> }
     { error && <Stack alignItems='center' width={{ base: '100%', md: '50%' }} spacing={3}>
            <Image src={WarningImg} alt='check-email' height={{ base: '12em', md: '19em' }}/>
            <Text fontSize={{ base: 'xs', sm: 'xs', md: 'sm', lg: 'sm', xl: 'sm' }} textAlign='center'>{t('signup.verificationLinkExpiredMessage')}</Text>
            <Button _hover={{ backgroundColor: useColorModeValue('lightMode.primary', 'orange') }}
                color={useColorModeValue('white', 'black')}
                backgroundColor={useColorModeValue('blue.600', 'lightMode.secondary')}
                onClick={() => navigate('/login')}
                width='30%'
                fontWeight={200}
              >
              {t('getBack')}
            </Button>
        </Stack>
        }
    </Flex>
  )
}

export default PasswordReset

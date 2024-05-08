/* eslint-disable camelcase */
import { Button, useColorModeValue } from '@chakra-ui/react'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { GoogleIcon } from '@assets'
import { setCookies } from '@utils/cookies'

const GoogleAuth = () => {
  const navigate = useNavigate()
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      const { data } = await axios.post(import.meta.env.VITE_URL_GOOGLE_AUTH_API, {
        access_token
      })
      setCookies({
        accessToken: data.access_token,
        firstName: data.first_name,
        familyName: data.family_name
      })
      navigate('/')
    }
  })
  return (
      <Button
        variant='outline'
        width='100%'
        fontWeight='light'
        fontSize={{ base: '.7rem', sm: '.8rem', md: '.9rem' }}
        onClick={googleLogin}
        _hover={{ backgroundColor: useColorModeValue('') }}
        leftIcon={<GoogleIcon />}
        backgroundColor={useColorModeValue('#FFFFFF', '#131314')}
        color={useColorModeValue('#000000', '#FFFFFF')}
      >
        Continue with Google
      </Button>
  )
}

export default GoogleAuth

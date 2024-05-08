/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'

import { useParams, useNavigate } from 'react-router-dom'
import {
  Flex,
  useColorModeValue,
  Spinner,
  Image,
  Stack,
  Text,
  Button
} from '@chakra-ui/react'
import axios from 'axios'
import { setCookies } from '@utils/cookies'

import { Warning as WarningImg } from '@assets'

const VerifyEmailRedirect = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { token, email } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    setLoading(true)
    if (token) {
      axios
        .post(import.meta.env.VITE_URL_VERIFICATION_API, { token, email })
        .then(response => {
          setCookies({
            accessToken: response.data.access_token,
            firstName: response.data.first_name,
            familyName: response.data.family_name
          })
          navigate('/')
        })
        .catch(() => {
          setError(true)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [token])
  return (
    <Flex
      minW='100vw'
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
      flexDirection='column'
      textAlign='center'
      padding={2}
    >
      {loading && (
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='lightMode.primary'
          size='xl'
        />
      )}
      {error && (
        <Stack
          alignItems='center'
          width={{ base: '100%', md: '50%' }}
          spacing={3}
        >
          <Image
            src={WarningImg}
            alt='check-email'
            height={{ base: '12em', md: '19em' }}
          />
          <Text
            fontSize={{ base: 'xs', sm: 'xs', md: 'sm', lg: 'sm', xl: 'sm' }}
            textAlign='center'
          >
            The verification link you clicked seems to be expired. Don't worry,
            we've just sent you a new verification email! Please check your
            inbox again for the latest link.
          </Text>
          <Button
            _hover={{
              backgroundColor: 'teal'
            }}
            color={useColorModeValue('white', 'black')}
            backgroundColor={useColorModeValue(
              'lightMode.primary',
              'darkMode.secondary'
            )}
            onClick={() => navigate('/signup')}
            width='30%'
            fontWeight={200}
          >
            Go back
          </Button>
        </Stack>
      )}
    </Flex>
  )
}

export default VerifyEmailRedirect

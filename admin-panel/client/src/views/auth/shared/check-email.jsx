/* eslint-disable react/prop-types */
import { Flex, Image, Heading, Text, useColorModeValue } from '@chakra-ui/react'

import { CheckEmail as CheckEmailImg } from '@assets'

const CheckEmail = ({ title, description }) => {
  return (
    <Flex
      width={{ base: '100%', md: '40%' }}
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
      flexDirection='column'
      textAlign='center'
      padding={2}
    >
        <Image src={CheckEmailImg} alt='check-email' height={40} />
        <Heading fontSize='xl' textAlign='center'>{title}</Heading>
        <Text textAlign='center' fontSize='sm'>{description}</Text>
    </Flex>
  )
}

export default CheckEmail

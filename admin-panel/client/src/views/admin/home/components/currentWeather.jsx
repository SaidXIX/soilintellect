import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  HStack,
  Image,
  Spinner,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { TemperatureImage, WindImage, WindDirectionImage } from '@assets'
import axios from 'axios'

const CurrentWeather = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeZone, setTimeZone] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          'https://api.open-meteo.com/v1/forecast',
          {
            params: {
              latitude,
              longitude,
              current_weather: true,
              timezone: 'auto'
            }
          }
        )
        setWeather(response.data.current_weather)
        setTimeZone(response.data.timezone)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching weather data:', error)
        setError('Could not fetch weather data.')
        setLoading(false)
      }
    }

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords
            fetchWeather(latitude, longitude)
          },
          error => {
            console.error('Error getting location:', error)
            setError('Could not get location.')
            setLoading(false)
          }
        )
      } else {
        setError('Geolocation is not supported by this browser.')
        setLoading(false)
      }
    }

    getLocation()
  }, [])
  return (
    <Flex width='100%' mt={5} padding={5}>
      {loading
        ? (
        <Spinner size='xl' />
          )
        : error
          ? (
        <Text>{error}</Text>
            )
          : weather
            ? (
        <HStack width='100%' justifyContent='space-between'>
          <VStack
            justifyContent='center'
            padding={3}
            width='250px'
            alignItems='center'
            bgColor={useColorModeValue('white', 'black')}
            boxShadow='xl'
            borderRadius='0.5em'
            height='170px'
          >
            <Box>
              <Image src={TemperatureImage} height='4em' />
            </Box>
            <Text>{timeZone}</Text>
            <Text fontSize='2xl' fontWeight='bold'>{weather.temperature}°C</Text>
          </VStack>
          <VStack
            justifyContent='center'
            padding={3}
            alignItems='center'
            width='250px'
            bg={useColorModeValue('white', 'black')}
            boxShadow='xl'
            borderRadius='0.5em'
            height='170px'
          >
            <Box>
              <Image src={WindImage} height='4em' />
            </Box>
            <Text>Wind Speed</Text>
            <Text fontSize='2xl' fontWeight='bold'>{weather.windspeed}km/h</Text>
          </VStack>
          <VStack
            justifyContent='center'
            padding={3}
            alignItems='center'
            width='250px'
            bg={useColorModeValue('white', 'black')}
            boxShadow='xl'
            borderRadius='0.5em'
            height='170px'
          >
            <Box>
              <Image src={WindDirectionImage} height='4em' />
            </Box>
            <Text>Wind Direction</Text>
            <Box fontSize='2xl' fontWeight='bold'>{weather.winddirection}°</Box>
          </VStack>
        </HStack>
              )
            : (
        <Text>Could not fetch weather data.</Text>
              )}
    </Flex>
  )
}

export default CurrentWeather

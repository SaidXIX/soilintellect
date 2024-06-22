import { useState } from 'react'
import { Flex, Heading, HStack, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import { getCookies } from '@utils/cookies'
import { Farmer } from '@assets'
import './calendar.css'
import CurrentTime from './components/currentTime'
import CurrentWeather from './components/currentWeather'

const HomeSection = () => {
  const { firstName } = getCookies()
  const [date, setDate] = useState(new Date())

  return (
    <Flex width='100%' flexDirection='column'>
      <HStack width='100%' alignItems='start'>
        <VStack width='75%'>
          <HStack boxShadow='xl' height='9em' padding={5} width='100%' alignItems='center' justifyContent='space-between' bgGradient='linear(to-l, #00684A, #00ED64)' borderRadius='3em'>
            <Heading color='white'>Welcome {firstName}</Heading>
            <VStack>
              <Text color='white'>We hope you have a great day!</Text>
              <Text color='white'>Here&lsquo;s your personalized dashboard.</Text>
            </VStack>
            <Image src={Farmer} height='15em' />
          </HStack>
          <CurrentWeather />
        </VStack>
        <VStack width='25%'>
          <VStack alignItems='center' padding={2} width='100%' bgColor={useColorModeValue('white', 'black')} borderRadius='0.5em' boxShadow='xl'>
            <CurrentTime />
          </VStack>
          <VStack boxShadow='xl' padding={3} width='100%' bgColor={useColorModeValue('white', 'black')} borderRadius='0.5em'>
            <Calendar
              onChange={setDate}
              value={date}
              className='react-calendar'
              tileClassName={({ date, view }) => {
                if (view === 'month' && (date.getDay() === 0 || date.getDay() === 6)) {
                  return 'highlight'
                }
              }}
            />
          </VStack>
        </VStack>
      </HStack>
    </Flex>
  )
}

export default HomeSection

import { useEffect, useState } from 'react'
import { Text } from '@chakra-ui/react'

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])
  return (<Text>{currentTime.toLocaleTimeString()}</Text>)
}

export default CurrentTime

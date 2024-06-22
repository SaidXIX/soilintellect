/* eslint-disable react/prop-types */
import {
  Avatar,
  Badge,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  HStack,
  Icon,
  Progress,
  Stack,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { RiSeedlingFill } from 'react-icons/ri'
import { FaMountainSun, FaDownload } from 'react-icons/fa6'
import { MdOutlineRestartAlt } from 'react-icons/md'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import Diagnostic from './diagnostic'

ChartJS.register(ArcElement, Tooltip, Legend)

const ManualAnalysisResult = ({ predictionData, sampleProperties }) => {
  const pieChartData = {
    labels: predictionData.prediction.T2.map(item => item.Class),
    datasets: [
      {
        label: '% Soil type',
        data: predictionData.prediction.T2.map(item => item.Probability),
        backgroundColor: [
          'rgba(105, 206, 86, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ],
        borderColor: [
          'rgba(105, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  const soilProperties = [
    {
      soilName: 'Nitrogen',
      AvatarBgColor: '#8F8FFF',
      ProgressColorScheme: 'purple',
      value: sampleProperties.N
    },
    {
      soilName: 'Phosphorous',
      AvatarBgColor: '#FFA500',
      ProgressColorScheme: 'orange',
      value: sampleProperties.P
    },
    {
      soilName: 'Potassium',
      AvatarBgColor: '#ff57ab',
      ProgressColorScheme: 'pink',
      value: sampleProperties.K
    },
    {
      soilName: 'ph-Soil Acidity',
      AvatarBgColor: '#ffce1e',
      ProgressColorScheme: 'yellow',
      value: sampleProperties.ph
    },
    {
      soilName: 'Temperature',
      AvatarBgColor: '#E53E3E',
      ProgressColorScheme: 'red',
      value: sampleProperties.temperature
    },
    {
      soilName: 'Humidity',
      AvatarBgColor: '#3182CE',
      ProgressColorScheme: 'blue',
      value: sampleProperties.humidity
    }
  ]

  return (
    <Flex width='100%'>
      <Flex direction='column' width='70%' alignItems='start' paddingX={2}>
        <HStack width='100%' spacing={3} alignItems='stretch'>
          <Stack
            flex={1}
            boxShadow='lg'
            borderRadius='0.3em'
            justifyContent='space-between'
            bgColor={useColorModeValue('white', 'black')}
            padding={2}
          >
            <Text
              fontSize='sm'
              fontWeight='bold'
              color={useColorModeValue('lightMode.text', 'darkMode.text')}
            >
              Potential implants to consider
            </Text>
            <VStack alignItems='start' width='100%'>
              {predictionData.prediction.T1.map((item, index) => (
                <HStack key={index} width='100%'>
                  <CircularProgress
                    size='2em'
                    value={item.Probability}
                    color='green.400'
                  >
                    <CircularProgressLabel fontSize='0.4em'>
                      {item.Probability.toFixed(2)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text
                    fontSize='sm'
                    color={useColorModeValue('lightMode.text', 'darkMode.text')}
                  >
                    {item.Class}
                  </Text>
                </HStack>
              ))}
            </VStack>
            <Badge colorScheme='teal'>IMPLANT</Badge>
          </Stack>
          <Stack
            flex={1}
            boxShadow='lg'
            borderRadius='0.3em'
            justifyContent='space-between'
            bgColor={useColorModeValue('white', 'black')}
            padding={2}
          >
            <Text
              fontSize='sm'
              fontWeight='bold'
              color={useColorModeValue('lightMode.text', 'darkMode.text')}
            >
              Soil Percentage Composition
            </Text>
            <VStack width='100%'>
              <Pie style={{ height: '20px' }} data={pieChartData} />
            </VStack>
            <Badge colorScheme='orange'>SOIl TYPE</Badge>
          </Stack>
          <Stack
            flex={1}
            boxShadow='lg'
            borderRadius='0.3em'
            bgColor={useColorModeValue('white', 'black')}
            justifyContent='space-between'
            padding={2}
          >
            <Text
              fontSize='sm'
              fontWeight='bold'
              color={useColorModeValue('lightMode.text', 'darkMode.text')}
            >
              Overall Classification
            </Text>
            <HStack alignItems='center' width='100%' spacing={5}>
              <VStack alignItems='center' width='80%'>
                <Icon as={FaMountainSun} boxSize={9} color='orange.500' />
                <Text
                  fontSize='sm'
                  color={useColorModeValue('lightMode.text', 'darkMode.text')}
                >
                  Top Soil Type:{' '}
                  <Text fontWeight='bold'>{predictionData.Overall[1]}</Text>
                </Text>
              </VStack>
              <VStack alignItems='center' width='80%'>
                <Icon as={RiSeedlingFill} boxSize={9} color='teal.500' />
                <Text
                  fontSize='sm'
                  color={useColorModeValue('lightMode.text', 'darkMode.text')}
                >
                  Top Implant:{' '}
                  <Text fontWeight='bold'>{predictionData.Overall[0]}</Text>
                </Text>
              </VStack>
            </HStack>
            {/* <VStack>
              <Text fontSize='xs' textAlign='justify'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Officiis illum,
              </Text>
            </VStack> */}
            <Badge colorScheme='blue'>OVERALL CLASSIFICATION</Badge>
          </Stack>
        </HStack>
        <VStack
          padding={3}
          textAlign='justify'
          marginTop={4}
          width='100%'
          bgColor={useColorModeValue('white', 'black')}
          boxShadow='lg'
          borderRadius='0.3em'
        >
          <Diagnostic implantType={predictionData.prediction.T1[0].Class}/>
        </VStack>
        <VStack flex={1} alignItems='end' justifyContent='stretch' width='100%'>
          <HStack>
            <Button
                marginY={2}
                variant='outline'
                colorScheme='teal'
                size='sm'
                leftIcon={<FaDownload size={17}/>}
            >
                Download Report
            </Button>
            <Button
                marginY={2}
                _hover={{ bgColor: 'teal', color: 'white' }}
                color={useColorModeValue('white', 'black')}
                backgroundColor={useColorModeValue(
                  'lightMode.primary',
                  'darkMode.primary'
                )}
                size='sm'
                leftIcon={<MdOutlineRestartAlt size={22}/>}
            >
                Restart the test
            </Button>
          </HStack>
        </VStack>
      </Flex>
      <Flex
        direction='column'
        width='30%'
        padding={2}
        bgColor={useColorModeValue('white', 'black')}
        boxShadow='lg'
        borderRadius='0.3em'
      >
        <Text fontWeight='bold'>Soil sample details</Text>
        {soilProperties.map((item, index) => (
          <Stack paddingY={2} key={index} width='100%' alignItems='start'>
            <HStack width='100%'>
              <Avatar name={item.soilName} bgColor={item.AvatarBgColor} />
              <VStack alignItems='start' width='100%'>
                <Text fontSize='sm'>{item.soilName}</Text>
                <Progress
                  size='sm'
                  value={item.value}
                  width='100%'
                  colorScheme={item.ProgressColorScheme}
                  borderRadius='full'
                  max={500}
                />
                <Text fontSize='sm'>{item.value}</Text>
              </VStack>
            </HStack>
          </Stack>
        ))}
      </Flex>
    </Flex>
  )
}

export default ManualAnalysisResult

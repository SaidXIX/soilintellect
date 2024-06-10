import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, HStack } from '@chakra-ui/react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { IoChevronBackOutline } from 'react-icons/io5'

import AnalysisModal from './components/analysis-modal'
import ManualAnalysisResult from '../manual-analysis/components/result'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Sensor = () => {
  const { zoneId } = useParams()
  const [sensorData, setSensorData] = useState([])
  const [testSuccess, setTestSuccess] = useState(false)
  const [predictionData, setPredictionData] = useState(null)
  const [sampleProperties, setSampleProperties] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000')

    ws.onopen = () => {
      console.log('WebSocket connection established')
      ws.send(JSON.stringify({ type: 'getData', zoneId }))
    }

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data)
      console.log('Received data:', eventData)

      if (Array.isArray(eventData)) {
        // Handle initial array of data
        setSensorData(eventData)
      } else {
        // Handle single data point
        setSensorData(prevData => [...prevData, eventData])
      }
    }

    return () => {
      ws.close()
    }
  }, [zoneId])

  const hanldlePredictionExecuted = (predictionData, sampleProperties) => {
    setTestSuccess(true)
    setPredictionData(predictionData)
    setSampleProperties(sampleProperties)
  }
  return (
    <Box justifyContent='center' alignItems='center' width='100%' display='flex' flexDirection='column'>
      <HStack width='100%' justifyContent='space-between'>
        <Button onClick={() => navigate('/zone')} leftIcon={<IoChevronBackOutline/>} fontWeight={500} variant='outline' colorScheme='teal'>
          Back
        </Button>
       <AnalysisModal onPredictionExecuted={hanldlePredictionExecuted}/>
      </HStack>
      { testSuccess && <ManualAnalysisResult predictionData={predictionData} sampleProperties={sampleProperties}/>}
      {sensorData.length > 0 && !testSuccess && (
        <Box width='70%'>
          <Line data={{
            labels: sensorData.map(data => new Date(data.createdAt).toLocaleTimeString()),
            datasets: [
              {
                label: 'pH',
                data: sensorData.map(data => data.ph),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              },
              {
                label: 'pH 7',
                data: Array(sensorData.length).fill(7),
                borderColor: 'rgb(255, 0, 0)',
                fill: false
              }
            ]
          }}
          options={{
            scales: {
              yAxis: {
                min: 0,
                max: 14
              }
            }
          }} />
          <Line data={{
            labels: sensorData.map(data => new Date(data.createdAt).toLocaleTimeString()),
            datasets: [
              {
                label: 'N',
                data: sensorData.map(data => data.N),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
              }
            ]
          }} />
          <Line data={{
            labels: sensorData.map(data => new Date(data.createdAt).toLocaleTimeString()),
            datasets: [
              {
                label: 'P',
                data: sensorData.map(data => data.P),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
              }
            ]
          }} />
          <Line data={{
            labels: sensorData.map(data => new Date(data.createdAt).toLocaleTimeString()),
            datasets: [
              {
                label: 'K',
                data: sensorData.map(data => data.K),
                borderColor: 'rgb(255, 205, 86)',
                tension: 0.1
              }
            ]
          }} />
          <Line data={{
            labels: sensorData.map(data => new Date(data.createdAt).toLocaleTimeString()),
            datasets: [
              {
                label: 'Temperature',
                data: sensorData.map(data => data.temperature),
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.1
              }
            ]
          }}
          options={{
            scales: {
              yAxis: {
                min: -10,
                max: 100
              }
            }
          }} />
          <Line data={{
            labels: sensorData.map(data => new Date(data.createdAt).toLocaleTimeString()),
            datasets: [
              {
                label: 'Humidity',
                data: sensorData.map(data => data.humidity),
                borderColor: 'rgb(255, 159, 64)',
                tension: 0.1
              }
            ]
          }}
          options={{
            scales: {
              yAxis: {
                min: 0,
                max: 100
              }
            }
          }}
          />
        </Box>
      )}
    </Box>
  )
}

export default Sensor

// import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { Box, Text } from '@chakra-ui/react'
// import { Chart } from 'react-google-charts'

// const Sensor = () => {
//   const { zoneId } = useParams()
//   const [sensorData, setSensorData] = useState([])

//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:4000')

//     ws.onopen = () => {
//       console.log('WebSocket connection established')
//       ws.send(JSON.stringify({ type: 'getData', zoneId }))
//     }

//     ws.onmessage = (event) => {
//       const eventData = JSON.parse(event.data)
//       console.log('Received data:', eventData)

//       if (Array.isArray(eventData)) {
//         // Handle initial array of data
//         setSensorData(eventData)
//       } else {
//         // Handle single data point
//         setSensorData(prevData => [...prevData, eventData])
//       }
//     }

//     return () => {
//       ws.close()
//     }
//   }, [zoneId])

//   const formatChartData = (data, key) => {
//     return [
//       ['Time', key],
//       ...data.map(dataPoint => [new Date(dataPoint.createdAt).toLocaleTimeString(), dataPoint[key]])
//     ]
//   }

//   const chartOptions = {
//     curveType: 'function',
//     legend: { position: 'bottom' }
//   }

//   const phChartOptions = {
//     ...chartOptions,
//     title: 'pH Levels',
//     vAxis: { minValue: 0, maxValue: 14 }
//   }

//   return (
//     <Box>
//       {sensorData.length > 0 && (
//         <Box>
//           <Text>Temperature: {sensorData[sensorData.length - 1].temperature}</Text>
//           <Text>Humidity: {sensorData[sensorData.length - 1].humidity}</Text>
//           <Text>pH: {sensorData[sensorData.length - 1].ph}</Text>
//           <Text>N: {sensorData[sensorData.length - 1].N}</Text>
//           <Text>P: {sensorData[sensorData.length - 1].P}</Text>
//           <Text>K: {sensorData[sensorData.length - 1].K}</Text>
//         </Box>
//       )}
//       <Box mt={4}>
//         <Chart
//           chartType="LineChart"
//           width="100%"
//           height="400px"
//           data={formatChartData(sensorData, 'ph')}
//           options={phChartOptions}
//         />
//       </Box>
//       <Box mt={4}>
//         <Chart
//           chartType="LineChart"
//           width="100%"
//           height="400px"
//           data={formatChartData(sensorData, 'N')}
//           options={{ ...chartOptions, title: 'N Levels' }}
//         />
//       </Box>
//       <Box mt={4}>
//         <Chart
//           chartType="LineChart"
//           width="100%"
//           height="400px"
//           data={formatChartData(sensorData, 'P')}
//           options={{ ...chartOptions, title: 'P Levels' }}
//         />
//       </Box>
//       <Box mt={4}>
//         <Chart
//           chartType="LineChart"
//           width="100%"
//           height="400px"
//           data={formatChartData(sensorData, 'K')}
//           options={{ ...chartOptions, title: 'K Levels' }}
//         />
//       </Box>
//       <Box mt={4}>
//         <Chart
//           chartType="LineChart"
//           width="100%"
//           height="400px"
//           data={formatChartData(sensorData, 'temperature')}
//           options={{ ...chartOptions, title: 'Temperature Levels' }}
//         />
//       </Box>
//       <Box mt={4}>
//         <Chart
//           chartType="LineChart"
//           width="100%"
//           height="400px"
//           data={formatChartData(sensorData, 'humidity')}
//           options={{ ...chartOptions, title: 'Humidity Levels' }}
//         />
//       </Box>
//     </Box>
//   )
// }

// export default Sensor

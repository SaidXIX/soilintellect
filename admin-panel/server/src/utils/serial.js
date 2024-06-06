const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const port = new SerialPort({
  path: 'COM6',
  baudRate: 4800,
  autoOpen: false
})

port.open((err) => {
  if (err) {
    return console.error('Error opening port:', err.message)
  }
})

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

parser.on('data', (data) => {
  try {
    if (data.trim().startsWith('{') && data.trim().endsWith('}')) {
      const sensorData = JSON.parse(data)
      console.log('Parsed sensor data:', sensorData)
    } else {
    //   console.error('Invalid data format received:', data)
    }
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }
})

port.on('error', (err) => {
  console.error('Serial Port Error:', err.message)
})

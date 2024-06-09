const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const EventEmitter = require('events')
class DataEmitter extends EventEmitter {}
const dataEmitter = new DataEmitter()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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

let isSaving = false

setTimeout(() => {
  isSaving = true
  console.log('Time Delay has finished')
}, 2 * 1000)

parser.on('data', async (data) => {
  try {
    if (data.trim().startsWith('{') && data.trim().endsWith('}')) {
      const sensorData = JSON.parse(data)
      if (isSaving) {
        await saveToDatabase(sensorData)
        dataEmitter.emit('dataInserted', sensorData)
      }
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

const saveToDatabase = async (data) => {
  try {
    const { N, P, K, humidity, temperature, ph, userId, zoneId } = data

    await prisma.sample.create({
      data: {
        N: N ? parseFloat(N) : 0,
        P: P ? parseFloat(P) : 0,
        K: K ? parseFloat(K) : 0,
        humidity: humidity ? parseFloat(humidity) : 0,
        temperature: temperature ? parseFloat(temperature) : 0,
        ph: ph ? parseFloat(ph) : 0,
        user: {
          connect: {
            id: userId
          }
        },
        zone: {
          connect: {
            id: zoneId
          }
        }
      }
    })
    console.log('sensor data saved to database', data)
  } catch (error) {
    console.log('SAVING SENSOR DATA ERROR', error)
  }
}

module.exports = { dataEmitter }

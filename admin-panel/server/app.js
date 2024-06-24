// const HTTP = require('http')
// const chalk = require('chalk')
// const express = require('express')
// const cors = require('cors')
// const helmet = require('helmet')
// const cookieParser = require('cookie-parser')

// require('dotenv').config()
// const morganMiddlware = require('./src/utils/api-logger')
// const corsOptions = require('./src/utils/cors-options')
// const httpStatus = require('./src/utils/http-status')
// const { apiLimiter } = require('./src/utils/api-limiter')
// const routes = require('./src/routes/router')
// const normalizePort = require('./src/utils/normalize-port')
// require('./src/modules/sensor/serial')

// const app = express()
// const server = HTTP.createServer(app)
// app.use(cookieParser())
// app.use(helmet())
// app.use(cors(corsOptions))
// app.use(morganMiddlware)
// app.use(express.json())

// app.get('/api/health', (req, res) => {
//   res.status(httpStatus.OK).json({
//     status: 'OK',
//     message: 'Server is up and running'
//   })
// })

// app.use('/api', apiLimiter)
// app.use('/api', routes)

// const port = normalizePort(process.env.PORT || 4000)

// server.listen(port, () => {
//   console.log(`host: ${chalk.bgBlue(`http://localhost:${port}`)}`)
//   console.log(
//     `API Documentation: ${chalk.bgGreenBright(
//       `http://localhost:${port}/api/documentation`
//     )}`
//   )
// })

const HTTP = require('http')
const chalk = require('chalk')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const WebSocket = require('ws')
const { PrismaClient } = require('@prisma/client')

require('dotenv').config()
const morganMiddlware = require('./src/utils/api-logger')
const corsOptions = require('./src/utils/cors-options')
const httpStatus = require('./src/utils/http-status')
const { apiLimiter } = require('./src/utils/api-limiter')
const routes = require('./src/routes/router')
const normalizePort = require('./src/utils/normalize-port')
require('./serial')

const { dataEmitter } = require('./serial')

const app = express()
const server = HTTP.createServer(app)
const wss = new WebSocket.Server({ server })

const prisma = new PrismaClient()

app.use(cookieParser())
app.use(helmet())
app.use(cors(corsOptions))
app.use(morganMiddlware)
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(httpStatus.OK).json({
    status: 'OK',
    message: 'Server is up and running'
  })
})

// app.use('/api', apiLimiter)
app.use('/api', routes)

// WebSocket server
wss.on('connection', (ws) => {
  console.log('Client connected')

  ws.on('message', async (message) => {
    try {
      const { type, zoneId } = JSON.parse(message)

      if (type === 'getData') {
        // Fetch real-time data for the specified zone
        const data = await getRealTimeData(zoneId)
        // Send real-time data to the client
        ws.send(JSON.stringify(data))
      }

      dataEmitter.on('dataInserted', data => {
        const datawithTimeStamp = {
          ...data,
          createdAt: new Date().toISOString()
        }
        ws.send(JSON.stringify(datawithTimeStamp))
      })
    } catch (error) {
      console.error('Error processing message:', error)
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

const port = normalizePort(process.env.PORT || 4000)

server.listen(port, () => {
  console.log(`host: ${chalk.bgBlue(`http://localhost:${port}`)}`)
  console.log(
    `API Documentation: ${chalk.bgGreenBright(
      `http://localhost:${port}/api/documentation`
    )}`
  )
})

const getRealTimeData = async (zoneId) => {
  try {
    const data = await prisma.sample.findMany({
      where: { zoneId }
    })
    return data
  } catch (error) {
    console.error('Error fetching real-time data:', error)
    return []
  }
}

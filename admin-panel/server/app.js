const HTTP = require('http')
const chalk = require('chalk')
const express = require('express')
const socketIO = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

require('dotenv').config()
const morganMiddlware = require('./src/utils/api-logger')
const corsOptions = require('./src/utils/cors-options')
const httpStatus = require('./src/utils/http-status')
const { apiLimiter } = require('./src/utils/api-limiter')
const routes = require('./src/routes/router')
const normalizePort = require('./src/utils/normalize-port')
require('./src/modules/sensor/serial')

const app = express()
const server = HTTP.createServer(app)
const io = socketIO(server)

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

app.use('/api', apiLimiter)
app.use('/api', routes)

io.on('connection', (socket) => {
  console.log('CLIENT IS CONNECTED')
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

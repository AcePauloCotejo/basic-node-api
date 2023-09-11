import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import http from 'http'

import mongoose from 'mongoose'

import 'dotenv/config'

import router from './router'

// deepcode ignore UseCsurfForExpress: <please specify a reason of ignoring this>
const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(compression())
app.use(cors({ credentials: true }))
app.use(helmet())

// deepcode ignore HttpToHttps: <please specify a reason of ignoring this>
const server = http.createServer(app)

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080/')
})

const MONGO_URL= process.env.MONGO_URL

console.log('MONGO_URL: ', MONGO_URL)

mongoose.Promise = Promise
mongoose.connect(MONGO_URL)
mongoose.connection.on('mongoose connection error', (error: Error) => console.error('error: ', error))

app.use('/api', router())
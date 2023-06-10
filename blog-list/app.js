import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import config from './utils/config.js'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'

const app = express()
logger.info('Connecting to', config.MONGODB_URI)

try {
    await mongoose.connect(config.MONGODB_URI)
    logger.info('Connected to MongoDB')
} catch(exception){
    logger.error('Error connecting to MongoDB:', exception.message)
}

app.use(middleware.requestLogger)
app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import blogsRouter from './controllers/blogs.js'
import config from './utils/config.js'
import logger from './utils/logger.js'

const app = express()
logger.info('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

export default app

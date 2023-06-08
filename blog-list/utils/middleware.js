import morgan from 'morgan'
import logger from './logger.js'

const requestLogger = morgan('tiny')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError'){
        return response.status(400).json({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

const tokenHandler = (request, response, next) => {
    const authorization = request.get('authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }

    next()
}

export default { requestLogger, errorHandler, tokenHandler }

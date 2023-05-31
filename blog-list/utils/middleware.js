import morgan from 'morgan'
import logger from './logger.js'

const requestLogger = morgan('tiny')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError'){
        return response.status(400).send({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

export default { requestLogger, errorHandler }

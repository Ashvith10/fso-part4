import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import logger from './logger.js'
import User from '../models/user.js'

const requestLogger = morgan('tiny')

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'Unknown endpoint' })
}

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

const userExtractor = async (request, response, next) => {
    try{
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'Token invalid' })
        }

        request.user = await User.findById(decodedToken.id)
    } catch(exception) {
        next(exception)
    }
    next()
}

export default { requestLogger, unknownEndpoint, errorHandler, tokenHandler, userExtractor }

import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const userRouter = express.Router()

userRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    let error = ''

    if (!password) {
        error = '"password" is missing'
    } else if (password.length < 3) {
        error = '"password" must be at least 3 characters long'
    }

    if (error !== ''){
        next(new Error(error))
        return response.status(400).json({ error: error })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({ username, name, passwordHash })

    try{
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

userRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs')
    response.json(users)
})

export default userRouter

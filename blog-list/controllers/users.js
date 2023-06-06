import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const userRouter = express.Router()

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({ username, name, passwordHash })
    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

export default userRouter

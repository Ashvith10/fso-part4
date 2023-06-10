import { mongoose } from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import User from '../models/user.js'

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await helper.createNewUser(helper.newUser)
    })

    test('login succeeds if credentials are correct', async () => {
        const token = await helper.getUserToken(helper.newUser.username)

        const response = await api
            .post('/api/login')
            .send({
                username: helper.newUser.username,
                password: helper.newUser.password
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({
            token,
            username: helper.newUser.username,
            name: helper.newUser.name
        })
    })

    test('login fails if credentials are incorrect', async () => {
        const token = await helper.getUserToken(helper.newUser.username)

        const response = await api
            .post('/api/login')
            .send({ username: 'nottheuser', password: 'password' })
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(response.body).not.toEqual({
            token,
            username: helper.newUser.username,
            name: helper.newUser.name })
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})

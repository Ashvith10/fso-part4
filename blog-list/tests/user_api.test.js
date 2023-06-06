import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import User from '../models/user.js'

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('password', 10)
        const user = new User({ username: 'user', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ashvith',
            name: 'Ashvith Shetty',
            password: 'password'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    describe('user creation', () => {
        describe('succeeds when', () => {
            test('username is three characters or more', async () => {
                const newUser = {
                    username: 'ash',
                    name: 'Ashvith Shetty',
                    password: 'password'
                }

                const request = await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

                expect(request.body.username).toEqual(newUser.username)
                expect(request.body.name).toEqual(newUser.name)
            })

            test('password is three characters or more', async () => {
                const newUser = {
                    username: 'ashvith',
                    name: 'Ashvith Shetty',
                    password: 'pas'
                }

                const request = await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

                expect(request.body.username).toEqual(newUser.username)
                expect(request.body.name).toEqual(newUser.name)
            })
        })

        describe('fails when', () => {
            describe('username is', () => {
                test('missing', async () => {
                    const newUser = {
                        name: 'Ashvith Shetty',
                        password: 'password'
                    }

                    const request = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400)
                        .expect('Content-Type', /application\/json/)

                    expect(request.body)
                        .toEqual({ error: 'User validation failed: username: Path `username` is required.' })
                })

                test('less than three characters', async () => {
                    const newUser = {
                        username: 'as',
                        name: 'Ashvith Shetty',
                        password: 'password'
                    }

                    const request = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400)
                        .expect('Content-Type', /application\/json/)

                    expect(request.body)
                        .toEqual({ error: 'User validation failed: username: Path `username` (`as`) is shorter than the minimum allowed length (3).' })
                })
            })

            describe('password is', () => {
                test('missing', async () => {
                    const newUser = {
                        username: 'ashvith',
                        name: 'Ashvith Shetty'
                    }

                    const request = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400)
                        .expect('Content-Type', /application\/json/)

                    expect(request.body)
                        .toEqual({ 'error': '"password" is missing' })
                })

                test('less than three characters', async () => {
                    const newUser = {
                        username: 'ashvith',
                        name: 'Ashvith Shetty',
                        password: 'pa'
                    }

                    const request = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400)
                        .expect('Content-Type', /application\/json/)

                    expect(request.body)
                        .toEqual({ error: '"password" must be at least 3 characters long' })
                })
            })
        })
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})

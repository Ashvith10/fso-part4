import mongoose from 'mongoose'
import supertest from 'supertest'
import listHelper from '../utils/list_helper.js'
import app from '../app.js'
import Blog from '../models/blog.js'

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(listHelper.listWithManyBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('id exists in blogs', async () => {
    const response = await api.get('/api/blogs')

    response.body.map((blog) =>
        expect(blog.id).toBeDefined()
    )
})

afterAll(async () => {
    await mongoose.connection.close()
})

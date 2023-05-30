import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import Blog from '../models/blog.js'

const api = supertest(app)

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }
]

const newBlog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    likes: 10,
}

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('id exists in blogs', async () => {
    const response = await api.get('/api/blogs')

    response.body.map((blog) => expect(blog.id).toBeDefined())
})

test('post request creates a new blog', async () => {
    const request = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(response.body).toContainEqual(request.body)
})

test('if "likes" property is missing, default to zero', async () => {
    const { likes, ...newBlogWithoutLike } = newBlog
    const response = await api
        .post('/api/blogs')
        .send(newBlogWithoutLike)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
})

describe('if "title" or "url" properties are missing, respond with code 400', () => {
    test('if "title" is missing, respond with code 400', async () => {
        const { title, ...newBlogWithoutTitle } = newBlog

        await api
            .post('/api/blogs')
            .send(newBlogWithoutTitle)
            .expect(400)
    })


    test('if "url" is missing, respond with code 400', async () => {
        const { url, ...newBlogWithoutUrl } = newBlog

        await api
            .post('/api/blogs')
            .send(newBlogWithoutUrl)
            .expect(400)
    })

    test('if "title" and "url" are missing, respond with code 400', async () => {
        const { url, title, ...newBlogWithoutTitleOrUrl } = newBlog

        await api
            .post('/api/blogs')
            .send(newBlogWithoutTitleOrUrl)
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

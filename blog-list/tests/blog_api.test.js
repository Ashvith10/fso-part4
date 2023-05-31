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


describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('id exists in blogs', async () => {
        const response = await api.get('/api/blogs')

        response.body.map((blog) => expect(blog.id).toBeDefined())
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
            const postResponse = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const getResponse = await api.get('/api/blogs')

            expect(getResponse.body).toHaveLength(initialBlogs.length + 1)
            expect(getResponse.body).toContainEqual(postResponse.body)
        })

        test('default to zero if "likes" property is missing', async () => {
            const { likes, ...newBlogWithoutLike } = newBlog
            const response = await api
                .post('/api/blogs')
                .send(newBlogWithoutLike)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            expect(response.body.likes).toBe(0)
        })

        describe('responds with code 400', () => {
            test('if "title" is missing', async () => {
                const { title, ...newBlogWithoutTitle } = newBlog

                await api
                    .post('/api/blogs')
                    .send(newBlogWithoutTitle)
                    .expect(400)
            })


            test('if "url" is missing', async () => {
                const { url, ...newBlogWithoutUrl } = newBlog

                await api
                    .post('/api/blogs')
                    .send(newBlogWithoutUrl)
                    .expect(400)
            })

            test('if both "title" and "url" are missing', async () => {
                const { url, title, ...newBlogWithoutTitleOrUrl } = newBlog

                await api
                    .post('/api/blogs')
                    .send(newBlogWithoutTitleOrUrl)
                    .expect(400)
            })
        })
    })

    describe('deletion of a note', () => {
        test('suceeds with status code 204, if "id" is valid', async () => {
            const getResponseBeforeDelete = await api
                .get('/api/blogs')

            const randomIndex = Math.floor(Math.random()
                * getResponseBeforeDelete.body.length)
            const randomBlog = getResponseBeforeDelete.body[randomIndex]

            await api
                .delete(`/api/blogs/${randomBlog.id}`)
                .expect(204)

            const getResponseAfterDelete = await api
                .get('/api/blogs')

            expect(getResponseAfterDelete.body)
                .toHaveLength(getResponseBeforeDelete.body.length - 1)
            expect(getResponseAfterDelete.body).not.toContainEqual(randomBlog)
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

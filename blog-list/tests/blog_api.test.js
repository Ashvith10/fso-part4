import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import Blog from '../models/blog.js'

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('id exists in blogs', async () => {
        const response = await api.get('/api/blogs')

        response.body.map((blog) => expect(blog.id).toBeDefined())
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
            const postResponse = await api
                .post('/api/blogs')
                .send(helper.newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
            expect(blogsAtEnd).toContainEqual(postResponse.body)
        })

        test('default to zero if "likes" property is missing', async () => {
            const { likes, ...newBlogWithoutLike } = helper.newBlog
            const response = await api
                .post('/api/blogs')
                .send(newBlogWithoutLike)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            expect(response.body.likes).toBe(0)
        })

        describe('responds with code 400', () => {
            test('if "title" is missing', async () => {
                const { title, ...newBlogWithoutTitle } = helper.newBlog

                await api
                    .post('/api/blogs')
                    .send(newBlogWithoutTitle)
                    .expect(400)
            })


            test('if "url" is missing', async () => {
                const { url, ...newBlogWithoutUrl } = helper.newBlog

                await api
                    .post('/api/blogs')
                    .send(newBlogWithoutUrl)
                    .expect(400)
            })

            test('if both "title" and "url" are missing', async () => {
                const { url, title, ...newBlogWithoutTitleOrUrl } = helper.newBlog

                await api
                    .post('/api/blogs')
                    .send(newBlogWithoutTitleOrUrl)
                    .expect(400)
            })
        })
    })

    describe('deletion of a note', () => {
        test('suceeds with status code 204, if "id" is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const randomIndex = Math.floor(Math.random()
                * blogsAtStart.length)
            const randomBlog = blogsAtStart[randomIndex]

            await api
                .delete(`/api/blogs/${randomBlog.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
            expect(blogsAtEnd).not.toContainEqual(randomBlog)
        })
    })

    describe('updation of a note', () => {
        test('succeeds with a status code 200', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const randomIndex = Math.floor(Math.random()
                * blogsAtStart.length)
            const randomBlog = blogsAtStart[randomIndex]

            await api
                .put(`/api/blogs/${randomBlog.id}`)
                .send({ ...helper.newBlog })
                .expect(200)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(blogsAtEnd.length)
            expect(blogsAtEnd).not.toContainEqual(randomBlog)
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

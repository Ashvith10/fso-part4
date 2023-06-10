import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import User from '../models/user.js'
import Blog from '../models/blog.js'

const api = supertest(app)
let token

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        await helper.createNewUser(helper.newUser)
        const user = await User.findOne(
            { username: helper.newUser.username }
        )

        helper.initialBlogs.forEach(async (list) => {
            const blog = new Blog({ ...list, user: user._id })
            const newBlog = await blog.save()
            user.blogs = user.blogs.concat(newBlog.id)
        })

        await user.save()
        token = await helper.getUserToken(helper.newUser.username)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('id exists in blogs', async () => {
        const response = await api
            .get('/api/blogs')

        response.body.map((blog) => expect(blog.id).toBeDefined())
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
            const postResponse = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(helper.newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
            expect(blogsAtEnd).toContainEqual(postResponse.body)
        })

        test('defaults to zero if "likes" property is missing', async () => {
            const { likes, ...newBlogWithoutLike } = helper.newBlog

            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlogWithoutLike)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            expect(response.body.likes).toBe(0)
        })

        test('fails if "Authorization" header is missing', async () => {
            const { likes, ...newBlogWithoutLike } = helper.newBlog

            const response = await api
                .post('/api/blogs')
                .send(newBlogWithoutLike)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(response.body).toEqual({ error: 'jwt must be provided' })
        })

        describe('responds with code 400', () => {
            test('if "title" is missing', async () => {
                const { title, ...newBlogWithoutTitle } = helper.newBlog

                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newBlogWithoutTitle)
                    .expect(400)
            })

            test('if "url" is missing', async () => {
                const { url, ...newBlogWithoutUrl } = helper.newBlog

                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newBlogWithoutUrl)
                    .expect(400)
            })

            test('if both "title" and "url" are missing', async () => {
                const { url, title, ...newBlogWithoutTitleOrUrl } = helper.newBlog

                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newBlogWithoutTitleOrUrl)
                    .expect(400)
            })
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204, if "id" is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const randomIndex = Math.floor(Math.random()
                        * blogsAtStart.length)
            const randomBlog = blogsAtStart[randomIndex]

            await api
                .delete(`/api/blogs/${randomBlog.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
            expect(blogsAtEnd).not.toContainEqual(randomBlog)
        })

        test('fails with status code 400, if "id" is invalid', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const randomIndex = Math.floor(Math.random()
                        * blogsAtStart.length)
            const randomBlog = blogsAtStart[randomIndex]

            await api
                .delete('/api/blogs/bad-id')
                .set('Authorization', `Bearer ${token}`)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
            expect(blogsAtEnd).toContainEqual(randomBlog)
        })

        test('fails if "Authorization" header is missing', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const randomIndex = Math.floor(Math.random()
                        * blogsAtStart.length)
            const randomBlog = blogsAtStart[randomIndex]

            const response = await api
                .delete(`/api/blogs/${randomBlog.id}`)
                .expect(400)

            expect(response.body).toEqual({ error: 'jwt must be provided' })
        })
    })

    describe('updation of a blog', () => {
        test('succeeds with a status code 200 if "Authorization" header is provided', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const randomIndex = Math.floor(Math.random()
                * blogsAtStart.length)
            const randomBlog = blogsAtStart[randomIndex]

            await api
                .put(`/api/blogs/${randomBlog.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ ...helper.newBlog })
                .expect(200)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(blogsAtEnd.length)
            expect(blogsAtEnd).not.toContainEqual(randomBlog)
        })

        test('fails with a status code 400 if "id" is malformatted', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const randomIndex = Math.floor(Math.random()
                * blogsAtStart.length)
            const randomBlog = blogsAtStart[randomIndex]

            await api
                .put('/api/blogs/bad-id')
                .set('Authorization', `Bearer ${token}`)
                .send({ ...helper.newBlog })
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd).toHaveLength(blogsAtEnd.length)
            expect(blogsAtEnd).toContainEqual(randomBlog)
        })


        test('fails if "Authorization" header is missing', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const randomIndex = Math.floor(Math.random()
                * blogsAtStart.length)
            const randomBlog = blogsAtStart[randomIndex]

            const response = await api
                .put(`/api/blogs/${randomBlog.id}`)
                .send({ ...helper.newBlog })
                .expect(400)

            expect(response.body).toEqual({ error: 'jwt must be provided' })
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})


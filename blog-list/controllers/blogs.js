import express from 'express'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const blogsRouter = express.Router()

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async(request, response, next) => {
    const body = request.body
    let error = ''
    let status = 0

    try {
        if (!body.title && body.url) {
            error = '"title" is missing'
        } else if (body.title && !body.url) {
            error ='"url" is missing'
        } else if (!body.title && !body.url) {
            error ='"title" and "url" is missing'
        }

        if (!body.title || !body.url) {
            status = 400
        }

        const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

        if (!decodedToken.id) {
            error = 'Token invalid'
            status = 401
        }

        if (error !== ''){
            return response.status(status).json({ error: error })
        }

        const user = await User.findById(decodedToken.id)
        const blog = new Blog({ ...body, user: user._id })
        const newBlog = await blog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()

        response.status(201).json(newBlog)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.deleteOne({ _id: request.params.id })
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
            { ...request.body }, { new: true })
        response.json(updatedBlog)
    } catch(exception) {
        next(exception)
    }
})

export default blogsRouter

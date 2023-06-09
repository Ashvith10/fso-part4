import express from 'express'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const blogsRouter = express.Router()

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

        const decodedToken = jwt.verify(request.token, process.env.SECRET)

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
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'Token invalid' })
        }

        const user = await User.findById(decodedToken.id)
        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).json({ error: 'Blog does not exist' })
        }

        if (blog.user.toString() === user.id) {
            await Blog.deleteOne({ _id: request.params.id })
            response.status(204)
                .json({ error: 'Blog deleted successfully' })
        } else {
            response.status(403)
                .json({ error: 'You do not have the permission to delete' })
        }
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const updatedBlog = await Blog
            .findByIdAndUpdate(request.params.id,
                { ...request.body }, { new: true })
        response.json(updatedBlog)
    } catch(exception) {
        next(exception)
    }
})

export default blogsRouter

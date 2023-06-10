import express from 'express'
import middleware from '../utils/middleware.js'
import Blog from '../models/blog.js'

const blogsRouter = express.Router()

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogsRouter.post('/', middleware.tokenHandler, middleware.userExtractor, async(request, response, next) => {
    const body = request.body
    let error = ''

    try {
        if (!body.title && body.url) {
            error = '"title" is missing'
        } else if (body.title && !body.url) {
            error ='"url" is missing'
        } else if (!body.title && !body.url) {
            error ='"title" and "url" is missing'
        }

        if (error !== '') {
            return response.status(400).json({ error: error })
        }

        const user = request.user
        const blog = new Blog({ ...body, user: user._id })
        const newBlog = await blog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()

        response.status(201).json(newBlog)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', middleware.tokenHandler, middleware.userExtractor, async (request, response, next) => {
    try {
        const user = request.user
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

blogsRouter.put('/:id', middleware.tokenHandler, middleware.userExtractor, async (request, response, next) => {
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

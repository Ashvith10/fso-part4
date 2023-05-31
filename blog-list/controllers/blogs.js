import express from 'express'
import Blog from '../models/blog.js'

const blogsRouter = express.Router()

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async(request, response) => {
    const body = request.body
    let error = ''

    if (!body.title && body.url) {
        error = '"title" is missing'
    } else if (body.title && !body.url) {
        error ='"url" is missing'
    } else if (!body.title && !body.url) {
        error ='"title" and "url" is missing'
    }

    if (error !== ''){
        return response.status(400).json({ error: error })
    }

    const blog = new Blog(body)
    const newBlog = await blog.save()

    response.status(201).json(newBlog)
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

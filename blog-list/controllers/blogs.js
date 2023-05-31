import express from 'express'
import Blog from '../models/blog.js'

const blogsRouter = express.Router()

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {
    const body = request.body
    let error = []

    if (!body.title) {
        error.push('"title" is missing')
    }

    if (!body.url) {
        error.push('"url" is missing')
    }

    if (error.length > 0){
        return response.status(400).json({ error: error })
    }

    const blog = new Blog(body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

blogsRouter.delete('/:id', (request, response) => {
    Blog.deleteOne({ _id: request.params.id })
        .then(() => {
            response.status(204).end()
        })
})

export default blogsRouter

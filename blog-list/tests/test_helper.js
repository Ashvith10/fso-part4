import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Blog from '../models/blog.js'
import User from '../models/user.js'

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
    }
]

const newBlog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    likes: 10,
}

const newUser = {
    username: 'user',
    name: 'User',
    password: 'password'
}

const blogsInDb = async () => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1, id: 1 })
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const createNewUser  = async(userDetails) => {
    const passwordHash = await bcrypt.hash(userDetails.password, 10)
    const user = new User({
        username: userDetails.username,
        name: userDetails.name,
        passwordHash
    })

    await user.save()
}

const getUserToken = async (username) => {
    const user = await User.findOne({
        username: newUser.username
    })

    return jwt.sign({
        username: user.username,
        id:user._id
    }, process.env.SECRET)
}

export default { initialBlogs, newBlog, newUser, blogsInDb, usersInDb, createNewUser, getUserToken }

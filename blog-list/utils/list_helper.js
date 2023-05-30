const listWithNoBlog = []

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listWithUniqueBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    }
]

const listWithManyBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

const dummy = (blogs) => 1

const totalLikes = (blogs) =>
    blogs.reduce((prevBlogLikes, currentBlog) =>
        prevBlogLikes + currentBlog.likes, 0)

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        const { _id, __v, url, ...blog } = blogs.reduce((prevBlog, currentBlog) =>
            (prevBlog.likes > currentBlog.likes) ? prevBlog : currentBlog)
        return blog
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        const authorWithBlogCounts = blogs.reduce((orderedBlog, currentBlog) => {
            orderedBlog[currentBlog.author] = orderedBlog[currentBlog.author] + 1 || 1
            return orderedBlog
        }, {})
        const authorWithMaxCount = Object.keys(authorWithBlogCounts)
            .reduce((prevKey, currKey) =>
                (authorWithBlogCounts[prevKey] >= authorWithBlogCounts[currKey])
                    ? prevKey
                    : currKey)
        return { author: authorWithMaxCount, blogs: authorWithBlogCounts[authorWithMaxCount] }
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        const authorWithLikeCounts = blogs.reduce((orderedBlog, currentBlog) => {
            orderedBlog[currentBlog.author] = orderedBlog[currentBlog.author] + currentBlog.likes || currentBlog.likes
            return orderedBlog
        }, {})
        const authorWithMaxLikes = Object.keys(authorWithLikeCounts)
            .reduce((prevKey, currKey) =>
                (authorWithLikeCounts[prevKey] >= authorWithLikeCounts[currKey])
                    ? prevKey
                    : currKey)
        return { author:authorWithMaxLikes, likes: authorWithLikeCounts[authorWithMaxLikes] }
    }
}

export default { listWithNoBlog, listWithOneBlog, listWithUniqueBlogs,
    listWithManyBlogs, dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }

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

export default { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }

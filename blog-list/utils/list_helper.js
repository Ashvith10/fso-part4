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

export default { dummy, totalLikes, favoriteBlog }

const dummy = (blogs) => 1

const totalLikes = (blogs) =>
    blogs.reduce((prevBlogLikes, currentBlog) =>
        prevBlogLikes + currentBlog.likes, 0)

export default { dummy, totalLikes }

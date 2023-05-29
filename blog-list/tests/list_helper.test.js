import listHelper from '../utils/list_helper.js'

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(listHelper.listWithNoBlog)
        expect(result).toBe(0)
    })

    test('when list has only one blog, equals the like of that', () => {
        const result = listHelper.totalLikes(listHelper.listWithOneBlog)
        expect(result).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listHelper.listWithManyBlogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {
    test('when list is empty, return an empty object', () => {
        const result = listHelper.favoriteBlog(listHelper.listWithNoBlog)
        expect(result).toEqual({})
    })

    test('when list has only one blog, return the same value', () => {
        const result = listHelper.favoriteBlog(listHelper.listWithOneBlog)
        expect(result).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('of a bigger list returns the first largest value', () => {
        const result = listHelper.favoriteBlog(listHelper.listWithManyBlogs)
        expect(result).toEqual({
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12
        })
    })
})

describe('most blogs', () => {
    test('when list is empty, return an empty object', () => {
        const result = listHelper.mostBlogs(listHelper.listWithNoBlog)
        expect(result).toEqual({})
    })

    test('when list has only one blog, return 1', () => {
        const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })

    test('of a unique list returns 1', () => {
        const result = listHelper.mostBlogs(listHelper.listWithUniqueBlogs)
        expect(result).toEqual({
            author: 'Michael Chan',
            blogs: 1
        })
    })

    test('of a bigger list returns the max count', () => {
        const result = listHelper.mostBlogs(listHelper.listWithManyBlogs)
        expect(result).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
        })
    })
})

describe('most likes', () => {
    test('when list is empty, return an empty object', () => {
        const result = listHelper.mostLikes(listHelper.listWithNoBlog)
        expect(result).toEqual({})
    })

    test('when list has only one blog, return the like', () => {
        const result = listHelper.mostLikes(listHelper.listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('of a unique list returns the total count of likes', () => {
        const result = listHelper.mostLikes(listHelper.listWithUniqueBlogs)
        expect(result).toEqual({
            author: 'Michael Chan',
            likes: 7
        })
    })


    test('of a bigger list returns the total count of likes', () => {
        const result = listHelper.mostLikes(listHelper.listWithManyBlogs)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })
})

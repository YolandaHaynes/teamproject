const Post = require('../models/Post')
const User = require('../models/User')

module.exports = {
    getPosts: async(req, res) => {
        try {
            const postItems = await Post.find().sort({ postDate: "desc" }).lean()
            res.render('feed.ejs', { posts: postItems, user: req.user })
        } catch (err) {
            console.log(err)
        }
    },

    getLikedPosts: async(req, res) => {
        const uid = req.user.id
        try {
            const userInfo = await User.findOne({ _id: uid })
            // console.log("User", uid, userInfo)
            if (userInfo.likedPosts) {
                const postItems = userInfo.likedPosts
                postItems.sort((a, b) => {
                        if (a.postDate < b.postDate) { return -1 }
                        if (a.postDate > b.postDate) { return 1 }
                        return 0
                    })
                    // const postItems = await Post.find({_id:uid}).sort({postDate: 'desc'}).lean()
                res.render('feed.ejs', { posts: postItems, user: req.user })
            } else {
                res.redirect('/post')
            }
        } catch (err) {
            console.log(err)
        }
    },

    addLike: async(req, res) => {
        try {
            const uid = req.user.id
            const postId = req.body.postId
                //get the post with the matching id the add it to array of liked posts in the user model
            const post = await Post.findOne({ _id: postId })
            console.log(post)
                //check if the post is in the users liked posts if it's not increment the associated post likecount by one
            // const result = await User.findOne({ _id: uid, likedPosts: { $elemMatch: { _id: `ObjectId${postId}` } } })
            const result = await User.findOne({ _id: uid})

            console.log("Result", result)
            const isValid = result.likedPosts.every(post => post._id != postId);
            console.log(isValid)
            if (isValid) {
                post.likeCount+=1
                await Post.updateOne({ _id: post._id }, { likeCount:  post.likeCount })
                await User.updateOne({ _id: uid }, { $push: { likedPosts: post } })
            }
            res.json("Add Like")
        } catch (error) {
            console.log(error)
        }
    }
}
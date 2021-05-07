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

    addLike: async(req, res) => {
        try {
            const uid = req.user.id
            const postId = req.body.postId
            //get the post with the matching id the add it to array of liked posts in the user model
            const post = await Post.findOne({_id: postId})
            console.log(post)
            //check if the post is in the users liked posts if it's not increment the associated post likecount by one
            const result = await User.findOne({_id:uid, likedPosts: {$elemMatch: {_id:postId}}})
            console.log(result)
            if(!result) {
                await Post.updateOne({_id:post._id}, {likeCount: post.likeCount + 1})
                await User.updateOne({_id:uid}, {likedPosts:post})
            }
            res.json("Add Like")
        } catch (error) {
            console.log(error)
        }
    }
}
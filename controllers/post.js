const Post = require('../models/Post')
const cloudinary = require("../middleware/cloudinary")

module.exports = {
    getPosts: async(req, res) => {
        console.log(req.user)
        try {
            const postItems = await Post.find({ userId: req.user.id })
            console.log(req.user.id)
            res.render('post.ejs', { posts: postItems, user: req.user })
        } catch (err) {
            console.log(err)
        }
    },
    createPost: async(req, res) => {
        try {
            let imageUrl
            if (req.file) {
                const image = await cloudinary.uploader.upload(req.file.path)
                imageUrl = image.url
            } else {
                imageUrl = ""
            }

            await Post.create({
                title: req.body.imageTitle,
                imageUrl: imageUrl,
                userId: req.user.id, 
                postDate:Date.now() 
            })
            console.log('Post has been added!')
            res.redirect('/post')
        } catch (err) {
            console.log(err)
        }
    },

    updatePost: async(req, res) => {
        try {
            const id = req.body.id
            const newTitle = req.body.newTitle
            // console.log(req.body.id, req.body.title)
            await Post.updateOne({_id:{$eq:id}}, {$set:{title: newTitle}})
            // console.log('Post updated')
            res.json('Updated it')
        } catch (err) {
            console.log(err)
        }
    },

    deletePost: async(req, res) => {
        // console.log(req.body.imageId)
        try {
            await Post.findOneAndDelete({ _id: req.body.imageId })
            console.log('Deleted Post')
            res.json('Deleted It')
        } catch (err) {
            console.log(err)
        }
    }
}
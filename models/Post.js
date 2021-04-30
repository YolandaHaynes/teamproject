const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
        type:String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
  })
  
  module.exports = mongoose.model('Post', PostSchema)
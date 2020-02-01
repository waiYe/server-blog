const mongoose = require('mongoose')

const Schema = mongoose.Schema
const commentSchema = new Schema({
  "create_time": {
    type: String,
    required: false,
    default: Date.now
  },
  "user_id": {
    type: String,
    required: true
  },
  "username": {
    type: String,
    required: true
  },
  "blog_id": {
    type: String,
    required: true
  },
  "content": {
    type: String,
    required: true
  },
  "comment_user_id": {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Comment', commentSchema)

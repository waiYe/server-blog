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
  // "avatar": { //为了解决不能添加属性，不会真正的存数据进去
  //   type: String,
  //   required: false
  // },
  "comment_user_id": {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Comment', commentSchema)

const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    "create_time": {
        type: String,
        required: false,
        default: Date.now
    },
    "source_article": {
        type: String,
        required: true
    },
    "marked_article": {
        type: String,
        required: false,
        default: "default_MarkDown_article"
    },
    "blog_title": {
        type: String,
        required: true
    },
    "id_tag": {
        type: String,
        required: true
    },
    "id_comment": {
        type: String,
        required: true
    },
    "id_user": {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Blog', blogSchema)

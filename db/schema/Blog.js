const mongoose = require('mongoose')
const myLib = require('../../lib/myLib.js')

const Schema = mongoose.Schema

const blogSchema = new Schema({
    "create_time": {
        type: String,
        required: false,
        default: Date.now
    },
    "source_article": {
        type: String,
        required: true
    },
    "blog_title": {
        type: String,
        required: true
    },
    "blog_type": {
        type: Array,
        required: true
    },
    "author_name": {
        type: String,
        required: true
    },
    "id_author": {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Blog', blogSchema)

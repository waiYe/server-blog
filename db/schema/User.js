const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    "create_time": {
        type: String,
        required: false,
        default: Date.now
    },
    "user_name": {
        type: String,
        required: true
    },
    "password": {
        type: String,
        required: true
    },
    "avatar": { //用户头像base64码
        type: String,
        required: false
    },
    "type": {
        type: String,
        required: false
    },
    "token": {
      type: String,
      required: false
    }
})

module.exports = mongoose.model('User', userSchema)

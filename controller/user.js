const User = require('../db/schema/User.js')
const createToken = require('../token/createToken.js')

//查找所有用户
const findAllUsers = () => {
  return new Promise((resolve, reject) => {
    User.find({}, (err, doc) => {
      if(err){
        reject(err);
      }
      resolve(doc);
    });
  });
}

//根据用户名查找用户
const findUser = (username) => {
  return new Promise ((resolve, reject) => {
    User.findOne({"user_name": username}, (err, doc) => {
      if(err) {
        reject(err)
      }
      console.log(username)
      resolve(doc)
    })
  })
}

module.exports = {
  findAllUsers,
  findUser
}
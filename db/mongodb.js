const mongoose = require('mongoose')

const options = {
    authSource:'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: 'waiY_root',
    pass: '@68310795Bb'
}

// const dbUrl = 'mongodb://101.132.70.249:27017/db_blog'

// mongoose.connect('mongodb://localhost:27017/db_blog',options)
mongoose.connect('mongodb://101.132.70.249:27017/db_blog',options)
.then(
    () => {
        console.log("连接成功")
    },
    (err) => {console.log("连接失败："+ err)}
)


// for(let i =1; i<10; i++){
//     const blog = new Blog({
//         "source_article": "mongo 测试 "+i,
//         "blog_title": "mongo 测试 title "+i,
//         "id_tag": "1",
//         "id_comment": "2",
//         "id_user": "1"
//     })
    
//     blog.save((err,ret) => {
//         if(err) console.log(err)
//         console.log("保存成功")
//     })
// }


// Blog.find({}, (err, ret) => {
//     if(err) console.log('查询失败 '+err)
//     console.log(ret)
// })
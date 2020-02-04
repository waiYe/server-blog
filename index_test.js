const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
// const userController = require('./controller/user.js')
const checkToken = require('./token/checkToken.js')
const createToken = require('./token/createToken.js')
const myLib = require('./lib/myLib.js')

//mongodb数据库
require('./db/mongodb')
const Blog = require('./db/schema/Blog')
const User = require('./db/schema/User')
const Comment = require('./db/schema/Comment')
// const {findUser} = require('./controller/user.js')

const app = express()

// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'authorization,Content-Type');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Content-Type', 'application/json;charset=utf-8');
	if(req.method === 'OPTIONS') {
		return res.end('OK')
	}
	next();
});

app.use('/api/addArticle', checkToken)
app.use('/api/blog/updateArticle/', checkToken)
app.use('/api/blog/deleteArticle/:id_blog', checkToken)
app.use('/api/comment/addComment', checkToken)


//获取所有blog列表
app.get('/api/getArticle', (req, res) => {
	Blog.find({}, (err, ret) => {
		if (err) console.log('查询失败', err)
		ret.forEach(blog => {
			blog.create_time = myLib.getDateFormat("yyyy-MM-dd hh:mm:ss", parseInt(blog.create_time))
		});
		res.send(ret)
	})
})

//根据id获取单个blog信息
app.get('/api/getArticle/:id_blog', (req, res) => {
	const id_blog = req.params.id_blog
	Blog.find({ "_id": id_blog }, (err, ret) => {
		if (err) console.log('查询失败', err)
		if(!ret[0]) {
			return res.status(200).json({
				err_code: 404,
				message: '没有找到博客'
			})
		}
		ret[0].create_time = myLib.getDateFormat("yyyy-MM-dd hh:mm:ss", parseInt(ret[0].create_time))
		res.json(ret)
	})
})

//添加blog到数据库
app.post('/api/addArticle', (req, res) => {
	Blog.insertMany(req.body, (err, ret) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: err.message
			})
		}
		return res.status(200).json({
			err_code: 0,
			message: 'BLog 插入成功'
		})
	})
})

//修改blog的数据
app.post('/api/blog/updateArticle/:id_blog', (req, res) => {
	console.log(req.body)
	Blog.updateMany(
		{ "_id": req.body._id },
		{
			$set: req.body
		},
		(err, ret) => {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: err.message
				})
			}
			return res.status(200).json({
				err_code: 0,
				message: 'BLog 修改成功'
			})
		}
	)
})

//根据id删除blog数据
app.post('/api/blog/deleteArticle/', (req, res) => {
	const id_blog = req.body.id_blog
	const id_user = req.body.id_user
	let author_id = ''

	if(!id_blog || !id_user){
		res.status(401)
		return res.end('用户未登录')
	}


	Blog.find({ "_id": id_blog }, (err, ret) => {
		if (err) console.log('查询失败', err)
		author_id = ret[0].id_author
	})
	.then(()=>{
		if(author_id !== id_user) {
			return res.status(500).send({
				err_code: 500,
				message: '该博客不属于该用户'
			})
		}
		Blog.deleteMany({ "_id": id_blog }, (err, ret) => {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: err.message
				})
			}
			return res.status(200).json({
				err_code: 0,
				message: 'Blog 删除成功'
			})
		})
	})



})

//--------评论接口---------

//发表评论
app.post('/api/comment/addComment', (req, res) => {
	if(!req.body.content) {
		return res.status(200).json({
			err_code: 201,
			message: '回复内容不能为空'
		})
	}
	Comment.insertMany(req.body, (err, ret) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: err.message
			})
		}
		return res.status(200).json({
			err_code: 0,
			message: 'comment 发布成功'
		})
	})
})

//根据博客id，获取评论列表
app.get('/api/comment/getCommentById/:id', (req, res) => {
	const blog_id = req.params.id
	Comment.find({blog_id}, (err, ret) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: err.message
			})
		}
		ret.forEach(comment => {
			comment.create_time = myLib.getDateFormat("yyyy-MM-dd hh:mm:ss", parseInt(comment.create_time))
		});
		res.send(ret)
	})
})


//-------用户管理---------

//登录
app.post('/api/login', (req, res) => {
	
	const username = req.body.user_name
	const password = req.body.password
	User.findOne({"user_name": username}, (err, doc) => {
		if(err) {
			return res.status(500).json({
				err_code: 500,
				message: err.message
			})
		} else if (!doc) {
			return res.status(200).json({
				err_code: 1,
				message: '找不到用户'
			})
		} else {
			if(password !== doc.password) {
				return res.status(200).json({
					err_code: 2,
					message: '密码错误'
				})
			}else {
				//密码一致后，生成一个token，并保存到数据库中
				const token = createToken(username)
				doc.token = token
				new Promise((resolve, reject) => {
					doc.save((err) => { //保存到数据库
						if(err) { reject(err) }
						resolve()
					})
				})
				return res.status(200).json({
					err_code: 0,
					message: '登录成功',
					_id: doc._id,
					user_name: username,
					token,
					create_time: doc.create_time
				})
			}
		}
	})
})

//注册
app.post('/api/register', (req, res) => {
	User.insertMany(req.body, (err, ret) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: err.message
			})
		}
		return res.status(200).json({
			err_code: 0,
			message: 'User 注册成功'
		})
	})
})

//根据name查找用户
app.get('/api/user/getUserByName/:name', (req, res) => {
	User.find({user_name: req.params.name}, (err, ret) => {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: err.message
			})
		}
		if(ret[0]){
			return res.status(200).json({
				err_code: 5,
				message: '用户名已被注册'
			})
		}
		return res.status(200).json({
			err_code: 0,
			message: '用户名可用'
		})
	})
})

//获取所有用户
app.post('/api/user', (req, res) => {

})

//删除某个用户
app.post('/api/delUser', (req, res) => {

})



app.listen(3000, function () {
	console.log('app is running at port 3000.')
})
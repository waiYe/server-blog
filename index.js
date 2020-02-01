const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

//mysql数据库
const connection = require('./db/sql.js') 

const app = express()

// 解析 application/json
app.use(bodyParser.json()); 
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

// 设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

//获取所有blog列表
app.get('/api/getArticle', (req, res) => {
    connection.query('SELECT * from t_blog', (error, results, fields) => {
        res.json(results)
    })
})

//根据id获取单个blog信息
app.get('/api/getArticle/:id_blog', (req, res) => {
    const id_blog = req.params.id_blog
    connection.query('SELECT * from t_blog WHERE id ='+ id_blog, 
    (error, results, fields) => {
        res.json(results)
    })
})

//添加blog到数据库
app.post('/api/addArticle', (req, res) => {
    const queryText = 'INSERT INTO t_blog(create_time, source_article, blog_title, id_tag, id_comment, id_user) VALUE("'+req.body.create_time+'", "'+req.body.source_article+'", "'+req.body.blog_title+'", "'+req.body.id_tag+'", "'+req.body.id_comment+'", "'+req.body.id_user+'")'
    connection.query(queryText, (error, results, fields) => {
        if(error){
            console.log('插入失败')
        }else{
            console.log('成功')
        }
    })
})

app.listen(3000, function() {
    console.log('app is running at port 3000.')
})
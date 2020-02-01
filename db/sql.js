const mysql = require('mysql')

const connection = mysql.createConnection({
    host: '101.132.70.249',
    user: 'waiY_mysql',
    password: '@68310795Bb',
    database: 'db_blog'
})

module.exports = connection
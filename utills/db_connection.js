const mysql2 = require('mysql')
const db =  mysql2.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'chatio'
})


module.exports = db
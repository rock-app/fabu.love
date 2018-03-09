const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/app-publisher', (err) => {
    if (err) {
        console.log('Mongoose connection error: ' + err.message)
    } else {
        console.log('数据库连接成功')
    }
})

mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected')  
})

module.exports = mongoose
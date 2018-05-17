const mongoose = require('mongoose')
const Fawn = require("fawn");
import config from '../config';

var dbUrl = 'mongodb://localhost:27017/app-publisher';
if (config.dbUser) {
    dbUrl = `mongodb://${config.dbUser}:${config.dbPassword}@localhost:27017/app-publisher`;
}

mongoose.connect(dbUrl, (err) => {
    if (err) {
        console.log('Mongoose connection error: ' + err.message)
    } else {
        console.log('数据库连接成功')
    }
})

mongoose
    .connection
    .on('disconnected', function () {
        console.log('Mongoose connection disconnected')
    })
Fawn.init(mongoose);

module.exports = mongoose
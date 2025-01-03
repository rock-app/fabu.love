const mongoose = require('mongoose')
const Fawn = require("fawn");
import config from '../config';

let dbUrl = `mongodb://${ config.dbHost }:${ config.dbPort }/${ config.dbName }`;
if ( config.dbUser ) {
  dbUrl = `mongodb://${ config.dbUser }:${ config.dbPass }@${ config.dbHost }:${ config.dbPort }/${ config.dbName }`;
}

console.log(dbUrl)
mongoose.connect(dbUrl).then((result) => {
  console.log('数据库连接成功')
}).catch((e) => {
  console.log('Mongoose connection error: ' + e)
})

mongoose
  .connection
  .on('disconnected', function () {
    console.log('Mongoose connection disconnected')
  })
Fawn.init(dbUrl);

module.exports = mongoose

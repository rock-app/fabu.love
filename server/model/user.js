const mongoose = require('../db.js');
const Schema = mongoose.Schema;

var User = new Schema({
    userName: {type: String},
    password: {type: String},
    token: {type: String}
});

module.exports = mongoose.model('User', User);
const mongoose = require('../helper/db')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

var userSchema = {
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        index: true
    },
    token: {
        type: String
    },
    apiToken: {
        type: String
    },
    teams: [{
        _id: ObjectId,
        name: String,
        icon: String,
        role: {
            type: String,
            enum: ["owner", "manager", "guest"]
        }
    }],
    mobile: String,
    qq: String,
    company: String,
    career: String
}

module.exports = {
    User: mongoose.model('User', new Schema(userSchema)),
    userSchema: userSchema
}
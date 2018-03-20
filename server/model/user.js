const mongoose = require('../helper/db')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

var userSchema = {
  username: {
    type: String
  },
  password: {
    type: String
  },
  token: {
    type: String
  },
  teams: [
    {
      _id:ObjectId,
      name:String,
      icon:String,
      role: {
        type: String,
        enum: ["owner", "manager", "guest"]
      }
    }
  ]
}

module.exports = {
  User: mongoose.model('User', new Schema(userSchema)),
  userSchema: userSchema
}

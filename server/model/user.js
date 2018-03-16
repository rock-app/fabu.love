const mongoose = require('../helper/db')
const Schema = mongoose.Schema

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
  team: [
    {
      id: String,
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

const mongoose = require('../helper/db')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId


var teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    icon: String,
    creatorId: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    apps: [
        {
            _id: ObjectId,
            appName: String,
            icon: String
        }
    ],
    members: [
        {
            _id: ObjectId,
            username: String,
            role: {
                type: String,
                enum: ["owner", "manager", "guest"]
            }
        }
    ]
})


function autoAddCreator(params) {
    
}

module.exports = mongoose.model('Team', teamSchema);
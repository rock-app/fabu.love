const mongoose = require('../helper/db')
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
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
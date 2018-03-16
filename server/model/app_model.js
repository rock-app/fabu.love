const mongoose = require('../helper/db')
const Schema = mongoose.Schema
const Version = require('./version');

var appSchema = new Schema({
    platform: {
        type: String
    },
    bundleId: {
        type: String,
        index: true
    },
    bundleName: {
        type: String
    },
    appName:String,
    currentVersion: {
        type: String
    },
    creatorId: String,
    creator: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    icon: {
        type: String
    },
    describe: {
        type: String
    },
    updateAt: {
        type: Date
    },
    owner:{
        tag:{type:String,enum:["team","user"]}, // team / user 
        id:String //团队或者用户的id
    }
})

// appSchema.virtual('versions').get(function () {     return Version.find })

module.exports = mongoose.model('App', appSchema)
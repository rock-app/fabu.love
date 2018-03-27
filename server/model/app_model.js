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
    shortUrl:{
        type:String,
        unique: true
    },
    appLevel:String,
    ownerId:String,
    changelog:String,
    lastVersionCode:String,
    strategy:{
        updateMode:{type:String,default:'slient',enum:['slient','normal','force']},
        ipType:{type:String,default:'black',enum:['black','white']},
        ipList:[String],
        downloadCountLimit:Number
    }
})

// appSchema.virtual('versions').get(function () {     return Version.find })

module.exports = mongoose.model('App', appSchema)
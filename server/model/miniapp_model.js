const mongoose = require('../helper/db')
const Schema = mongoose.Schema


var miniappSchema = new Schema({
    platform: {
        type: String,
        default : 'weixin'
    },

    appName: String,
    appId:String,
    appSecret:String,
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
    ownerId: String,
    changelog: String,
    downloadCodeImage:[{remark:String,image:String,param:String,page:String}],

    releaseVersionId: String, //当前对外发布的最新版本号

    totalDownloadCount: { type: Number, default: 0 },
    todayDownloadCount: {
        date: { type: Date, default: Date.now },
        count: { type: Number, default: 0 }
    },
})

// appSchema.virtual('versions').get(function () {     return Version.find })

module.exports = mongoose.model('Miniapp', miniappSchema)
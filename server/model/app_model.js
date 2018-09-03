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
    appName: String,
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
    shortUrl: {
        type: String,
        unique: true
    },
    autoPublish: { //是否自动发布
        type: Boolean,
        default: false
    },
    installWithPwd: {
        Boolean,
        default: false
    },
    installPwd: {
        type: String
    },
    appLevel: String,
    ownerId: String,
    changelog: String,
    updateMode: {
        type: String,
        default: 'silent',
        enum: ['silent', 'normal', 'force']
    },
    releaseVersionCode: String, //当前对外发布的code号
    releaseVersionId: String, //当前对外发布的最新版本号
    grayReleaseVersionId: String,
    totalDownloadCount: { type: Number, default: 0 },
    todayDownloadCount: {
        date: { type: Date, default: Date.now },
        count: { type: Number, default: 0 }
    },
    grayStrategy: {
        ipType: {
            type: String,
            enum: ['black', 'white'],
            default: 'black'
        },
        ipList: [String],
        downloadCountLimit: Number,
        updateMode: {
            type: String,
            default: 'silent',
            enum: ['silent', 'normal', 'force']
        }
    }
})

// appSchema.virtual('versions').get(function () {     return Version.find })

module.exports = mongoose.model('App', appSchema)
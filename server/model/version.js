const mongoose = require('../helper/db');
const Schema = mongoose.Schema;

var versionSchema = new Schema({
    appId: String, //该版本的应用的id
    bundleId: {
        type: String,
        index: true
    },
    icon: String,
    versionStr: String,
    versionCode: String,
    uploadAt: {
        type: Date,
        default: Date.now
    },
    uploader: String,
    uploaderId: String,
    size: Number,
    active: Boolean,
    downloadUrl: String,
    downloadCount: { type: Number, default: 0 },
    fileDownloadUrl: String, //源文件下载地址
    installUrl: String, //应用包安装地址
    showOnDownloadPage: { type: Boolean, default: false },
    appLevel: String,
    changelog: String,
    md5: String,
    hidden: { type: Boolean, default: false },
    updateMode: { type: String, default: 'normal', enum: ['silent', 'normal', 'force'] },
});

module.exports = mongoose.model('Version', versionSchema);

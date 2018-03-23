const mongoose = require('../helper/db');
const Schema = mongoose.Schema;

var versionSchema = new Schema({
    appId:String, //该版本的应用的id
    bundleId:  {
        type: String,
        index: true
    },
    icon:String,
    versionStr: String,
    versionCode: String,
    uploadAt: {
        type: Date,
        default: Date.now
    },
    uploader: String,
    uploaderId:String,
    size: Number,
    active:Boolean,
    released:Boolean,
    downloadUrl: String,
    downloadCount: Number,
    fileDownloadUrl:String, //源文件下载地址
    appLevel:String,
    changelog:String,
    hidden: { type:Boolean , default:false },
    strategy:{
        updateMode:{type:String,enum:['slient','normal','force']},
        whiteIpList:[String],
        blackIpList:[String],
        downloadCountLimit:Number
    }
});

module.exports = mongoose.model('Version', versionSchema);
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
    downloadCount:{ type:Number, default:0 },
    fileDownloadUrl:String, //源文件下载地址
    showOnDownloadPage:{type:Boolean,default:false},
    appLevel:String,
    changelog:String,
    hidden: { type:Boolean , default:false },
    updateMode:{type:String,default:'slient',enum:['slient','normal','force']},
});

module.exports = mongoose.model('Version', versionSchema);
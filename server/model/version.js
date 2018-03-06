const mongoose = require('../db.js');
const Schema = mongoose.Schema;

var versionSchema = new Schema({
    appId : { type:String, index:true },
    bundleId:String,
    versionStr: String,
    versionCode:String,
    uploadAt:{ type: Date, default: Date.now },
    uploader:{ type:String },
    size: Number,
    downloadUrl:String,
    hidden:Boolean,
    current:Boolean
});

module.exports = mongoose.model('Version', versionSchema);
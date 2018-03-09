const mongoose = require('../helper/db')
const Schema = mongoose.Schema
const Version = require('./version');


var appSchema = new Schema({
    platform: { type: String },
    bundleId: { type:String ,index:true },
    name: { type: String },
    currentVersion: { type: String },
    creator:String,
    createAt:{ type:Date,default:Date.now },
    icon:{ type: String },
    describe: { type: String },
    updateAt: { type: Date },
})

// appSchema.virtual('versions').get(function () {
//     return Version.find
// })

module.exports = mongoose.model('App', appSchema)
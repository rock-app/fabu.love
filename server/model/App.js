const mongoose = require('../db.js')
const Schema = mongoose.Schema

var App = new Schema({
    platform: { type: String },
    name: { type: String },
    version: { type: String },
    describe: { type: String },
    state: { type: String },
    isRelease: { type: Boolean },
    type: { type: String },
    downloadCounts: { type: Number },
    updateTime: { type: Date }
})

module.exports = mongoose.model('App', App)
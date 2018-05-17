
var fs = require("fs")
var path = require("path")


var baseConfig = JSON.parse(fs.readFileSync('../config.json','utf8'))

const common = {
    baseUrl: baseConfig.baseUrl,
    port: baseConfig.port,
    apiPrefix:'api',
    fileDir:path.join((baseConfig.uploadDir ||  path.join(__dirname,"..")), '/upload') //上传文件的存放目录
};

if (baseConfig.dbUser) {
    common['dbUser'] = baseConfig.dbUser
}
if (baseConfig.dbPassword) {
    common['dbPassword'] = baseConfig.dbPassword
}

export default common;

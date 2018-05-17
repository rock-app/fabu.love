var fs = require("fs")
var path = require("path")

var baseConfig = JSON.parse(fs.readFileSync('../config.json', 'utf8'))

const common = {
    baseUrl: baseConfig.baseUrl,
    port: baseConfig.port,
    apiPrefix: 'api',
    fileDir: path.join((baseConfig.uploadDir || path.join(__dirname, "..", "..")), '/upload'), //上传文件的存放目录
    secret: baseConfig.secret || "d8AC195A-c3A1-9D8D-DAEc-B0C4C28F6F2a"
};

if (baseConfig.dbUser) {
    common['dbUser'] = baseConfig.dbUser
}
if (baseConfig.dbPassword) {
    common['dbPassword'] = baseConfig.dbPassword
}

export default common;

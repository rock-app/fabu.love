
var fs = require("fs")


var baseConfig = JSON.parse(fs.readFileSync('../config.json','utf8'))

const common = {
    baseUrl: baseConfig.baseUrl,
    port: baseConfig.port,
    apiPrefix:'api',
    fileDir:__dirname + '/uploaded' //上传文件的存放目录
};

export default common;

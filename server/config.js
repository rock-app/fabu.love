var fs = require("fs")
var path = require("path")

const common = {
    baseUrl:  process.env.FABU_BASE_URL || "https://127.0.0.1:9898",
    port: process.env.FABU_PORT || "9898" ,
    apiPrefix: 'api',
    fileDir: process.env.FABU_UPLOAD_DIR || path.join(__dirname, ".."), //上传文件的存放目录
    secret: process.env.FABU_SECRET || "secretsecret",
    dbUser: process.env.FABU_DBUSER || undefined,
    dbPass: process.env.FABU_DBPWD || undefined,
    dbName: process.env.FABU_DB_NAME || "fabulove",
    dbHost: process.env.FABU_DB_HOST || "localhost",
    dbPort: process.env.FABU_DB_PORT || "27017"
};  

export default common;

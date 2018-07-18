var fs = require("fs")
var path = require("path")

var baseConfig = JSON.parse(fs.readFileSync('../config.json', 'utf8'))


const common = {
    baseUrl:  process.env.FABU_BASE_URL || baseConfig.url || "https://127.0.0.1:9898",
    port: process.env.FABU_PORT || baseConfig.port || "9898" ,
    apiPrefix: 'api',
    fileDir: process.env.FABU_UPLOAD_DIR || path.join((baseConfig.dir || path.join(__dirname, "..", ".."))), //上传文件的存放目录
    secret: process.env.FABU_SECRET || baseConfig.secret || "secretsecret",
    dbUser: process.env.FABU_DBUSER || baseConfig.dbuser || undefined,
    dbpass: process.env.FABU_DBPWD || baseConfig.dbpass || undefined,
    dbName: process.env.FABU_DB_NAME || baseConfig.dbname || "fabulove",
    dbHost: process.env.FABU_DB_HOST || baseConfig.dbhost || "localhost",
    dbPort: process.env.FABU_DB_PORT || baseConfig.dbport || "27017"
};  

export default common;

#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var exec = require('child_process').execSync;

var defaultUrl = "http://localhost:8383";
var defaultPort = "8383"

program
  .version('0.0.1')

program
    .command('config')
    .description('set app config like baseUrl or port')
    .option("-u, --url [url]", "server runing base url")
    .option("-p, --port [port]", "server runing port")
    .option("-d, --directory [dir]","file upload directory")
    .action(function(options){
    var url = options.url || defaultUrl;
    var port = options.port || defaultPort;
    var dir = options.dir
    console.log('setup host with port %s and %s', port, url, dir);
    writeConfig(url,port,dir)
});

program
    .command('init')
    .description('install all dependence')
    .option("-u, --url [url]", "server runing base url")
    .option("-p, --port [port]", "server runing port")
    .action(function(options){
    var url = options.url;
    var port = options.port;
    writeConfig(url,port)
    exec("sh install.sh",(error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    })
});

program
    .command('build')
    .description('rebuild client source and copy it to server static directory')
    .option("-u, --url [url]", "server runing base url")
    .option("-p, --port [port]", "server runing port")
    .action(function(options){
    var url = options.url || defaultUrl;
    var port = options.port || defaultPort;
    console.log('setup host with port %s and %s', port, url);
    writeConfig(url,port)
    exec("sh build_client.sh",(error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    })
});


program.command('start')
    .description('start services')
    .option("-i --install","install all dependience")
    .option("-b --build","rebuild client source")
    .action(function(options) {
        if (options.install) {
            console.log("start install - START -")
            console.log(exec("sh install.sh").toString())
            console.log("install complete - END -")
        }
        if (options.build) {
            console.log("start build - START -")
            console.log(exec("sh build_client.sh").toString())
            console.log("build complete - END -")
        }        

        console.log(exec("cd server && pm2 start process.json").toString())
    }
)

program.parse(process.argv);


function writeConfig(url,port,dir) {
    var content = {}
    if (url) {
        content['baseURL'] = url
    }
    if (port) {
        content['port'] = port
    }
    if (dir) {
        content['uploadDir'] = dir
    }
    var {size} = fs.statSync("config.json")
    if (size == undefined) {
        fs.writeFileSync("config.json",JSON.stringify(content))
        return
    }else{
        var baseConfig = {};
        try {
            baseConfig = JSON.parse(fs.readFileSync('config.json'), 'utf8')
        } catch (error) {
            console.log(console.error());
        }
        fs.unlinkSync('config.json')
        if (url) {
            baseConfig['baseURL'] = url
        }
        if (port) {
            baseConfig['port'] = port
        }
        if (dir) {
            baseConfig['uploadDir'] = dir
        }
        baseConfig['port'] = content.port
        fs.writeFileSync("config.json",JSON.stringify(baseConfig))
    }
}

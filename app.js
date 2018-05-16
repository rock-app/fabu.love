#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var exec = require('child_process').exec;

var defaultUrl = "http://localhost:8383";
var defaultPort = "8383"

program
  .version('0.0.1')

program
  .command('config')
  .description('set app config like baseUrl or port')
  .option("-u, --url [url]", "server runing base url")
  .option("-p, --port [port]", "server runing port")
  .action(function(options){
    var url = options.url || defaultUrl;
    var port = options.port || defaultPort;
    console.log('setup host with port %s and %s', port, url);
    writeConfig(url,port)
  });

  program
  .command('init')
  .description('set app config like baseUrl or port')
  .option("-u, --url [url]", "server runing base url")
  .option("-p, --port [port]", "server runing port")
  .action(function(options){
    var url = options.url || defaultUrl;
    var port = options.port || defaultPort;
    console.log('setup host with port %s and %s', port, url);
    writeConfig(url,port)
    exec("sh install.sh",(error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    })
  });


  program.command('start')
  .description('start services')
  .action(function(options) {
      
  })

program.parse(process.argv);


function writeConfig(url,port) {
    var content = {'baseURL':url,'port':port}
    var {size} = fs.statSync("config.json")
    if (size == undefined) {
        fs.writeFileSync("config.json",JSON.stringify(content))
        return
    }else{
        var baseConfig;
        try {
            baseConfig = JSON.parse(fs.readFileSync('config.json'), 'utf8')
        } catch (error) {
            baseConfig = {}
        }
        fs.unlinkSync('config.json')
        baseConfig['baseURL'] = content.baseURL
        baseConfig['port'] = content.port
        fs.writeFileSync("config.json",JSON.stringify(baseConfig))
    }
}

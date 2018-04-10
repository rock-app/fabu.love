#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');

program
    .version('0.0.1')
    .option('install', '安装依赖')
    .option('start', '启动服务')
    .option('config', '生成配置')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.install){
    
}
if (program.pineapple) console.log('  - pineapple');
if (program.bbq) console.log('  - bbq');
console.log('  - %s cheese', program.cheese);
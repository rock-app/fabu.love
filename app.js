#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var exec = require('child_process').execSync;

program.version('0.0.1')

program
    .command('config')
    .description('set app config like baseUrl or port')
    .option("--url [url]", "server runing base url")
    .option("--port [port]", "server runing port")
    .option("--dir [dir]", "file upload directory")
    .option("--dbuser, [dbuser]", "mongodb user")
    .option("--dbpass, [dbpass]", "mongodb password")
    .option("--secret, [secret]", "app session secret")
    .action(function (options) {
        writeConfig(options)
    });

program
    .command('init')
    .description('install all dependence')
    .option("--url [url]", "server runing base url")
    .option("--port [port]", "server runing port")
    .option("--dir [dir]", "file upload directory")
    .option("--dbuser, [dbuser]", "mongodb user")
    .option("--dbpass, [dbpass]", "mongodb password")
    .option("--secret, [secret]", "app session secret")
    .action(function (options) {
        writeConfig(options)
        exec("sh install.sh", (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        })
    });

program
    .command('build')
    .option("--url [url]", "server runing base url")
    .option("--port [port]", "server runing port")
    .option("--dir [dir]", "file upload directory")
    .option("--dbuser, [dbuser]", "mongodb user")
    .option("--dbpass, [dbpass]", "mongodb password")
    .option("--secret, [secret]", "app session secret")
    .action(function (options) {
        writeConfig(options)
        exec("sh build_client.sh", (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        })
    });

program
    .command('start')
    .description('start services')
    .option("-i --install", "install all dependience")
    .option("-b --build", "rebuild client source")
    .action(function (options) {
        if (options.install) {
            console.log("start install - START -")
            console.log(exec("sh install.sh").toString())
            console.log("install complete - END -")
        }
        if (options.build) {
            console.log("start build - START -")
            console.log(exec("cd client && npm run build").toString())
            console.log("build complete - END -")
        }

        console.log(exec("cd server && pm2 start process.json").toString())
    })

program
    .command('stop')
    .description('stop services')
    .action(function (options) {
        console.log(exec("pm2 stop fabu").toString())
    })

program.parse(process.argv);

function writeConfig(options) {
    var configKey = [
        'url',
        'port',
        'dir',
        'dbuser',
        'dbpass',
        'secret'
    ]
    var baseConfig = {}
    try {
        baseConfig = JSON.parse(fs.readFileSync('config.json'), 'utf8')
        fs.unlinkSync('config.json')
    } catch (error) {
        // console.log(error);
    }
    var cache = [];
    configKey.forEach(key => {
        if (options[key]) {
            baseConfig[key] = options[key]
        }
    });
    fs.writeFileSync("config.json", JSON.stringify(baseConfig))
    console.log(`current config ${JSON.stringify(baseConfig)}`)
}

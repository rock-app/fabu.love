const fs = require('fs')
const cp = require('child_process')

const readFile = (path, opts = 'utf8') => new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
        if (err)
            rej(err)
        else
            res(data)
    })
})

const writeFile = (path, data, opts = 'utf8') => new Promise((res, rej) => {
    fs.writeFile(path, data, opts, (err) => {
        if (err)
            rej(err)
        else
            res()
    })
})

const responseWrapper = function wrapper(success, message, data) {
    if (arguments.length === 3) {
        return { 'success': success, 'message': message, 'data': data };
    }
    if (arguments.length === 2) {
        return { 'success': success, 'message': message };
    };
    if (arguments.length === 1) {
        return { 'success': true, 'data': arguments[0] };
    }
    return {}
}

// Run a program directly, passing every argument as a separate array element.
// No shell is involved, so arguments are never interpreted as shell syntax and
// no character filtering/quoting is needed. NOTE: this also means shell features
// (pipes, "&&"/";", redirection, $VAR expansion, ...) are no longer available.
function exec(file, args = [], options = {
    log: false,
    cwd: process.cwd()
}) {
    if (options.log)
        console.log([file].concat(args).join(' '))

    return new Promise((done, failed) => {
        cp.execFile(file, args, {
            options
        }, (err, stdout, stderr) => {
            if (err) {
                err.stdout = stdout
                err.stderr = stderr
                failed(err)
                return
            }
            done({ stdout, stderr })
        })
    })
}

const getIp = (req) => new Promise((resolve) => {
    var ip = req.headers['x-forwarded-for'] ||
        req.headers['Proxy-Client-IP'] ||
        req.headers['WL-Proxy-Client-IP'] ||
        req.headers['HTTP_CLIENT_IP'] ||
        req.headers['HTTP_X_FORWARDED_FOR'] ||
        req.remoteAddress ||
        req.ip.match(/\d+.\d+.\d+.\d+/)[0]
    resolve(ip)
})


module.exports = {
    responseWrapper,
    readFile,
    writeFile,
    exec,
    getIp
}

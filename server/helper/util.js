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

const responseWrapper = (res) => {
    return {'code': 200, 'data': res}
}

function exec (command, options = { log: false, cwd: process.cwd() }) {
  if (options.log) console.log(command)

  return new Promise((done, failed) => {
    cp.exec(command, { options }, (err, stdout, stderr) => {
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

module.exports = {
    responseWrapper,
    readFile,
    writeFile,
    exec
}
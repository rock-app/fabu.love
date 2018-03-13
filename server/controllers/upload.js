var {
  request,
  summary,
  body,
  tags,
  middlewares,
  path,
  description,
  formData,
  responses
} = require('koa-swagger-decorator');

const Version = require('../model/version.js')
const App = require('../model/app_model.js')
var multer = require('koa-multer');
var fs = require('fs')
var mime = require('mime')
var path = require('path')
var os = require('os')
var uuidV4 = require('uuid/v4')
var apkParser3 = require('apk-parser3')
var extract = require('ipa-extract-info')
var AdmZip = require('adm-zip')
var exec = require('child_process').exec;
var serverDir = path.resolve(__dirname,"..") + '/uploaded/'
var ipasDir = serverDir + 'ipa'
var apksDir = serverDir + 'apk'
var iconsDir = serverDir + 'icon'
createFolderIfNeeded(serverDir)
createFolderIfNeeded(ipasDir)
createFolderIfNeeded(apksDir)
createFolderIfNeeded(iconsDir)

function createFolderIfNeeded(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, err => {
      if (err) {
        console.log(err)
        return
      }
    })
  }
}

const storage = multer.diskStorage({
  destination: path.resolve('uploaded/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const tag = tags(['AppResource']);
const upload = multer({storage});


module.exports = class UploadRouter {
  @request('post','/api/app/upload')
  @summary('上传apk或者ipa文件到服务器')
  @tag
  @formData({
    file: {
      type: 'file',
      required: 'true',
      description: 'upload file, get url'
    }
  })
  @middlewares([upload.single('file')])
  @responses({
    200: {
      description: 'file upload success'
    },
    500: {
      description: 'something wrong about server'
    }
  })
  static async upload(ctx, next) {
    const file = ctx.req.file
    const filePath = file.path
    const reader = await fs.createReadStream(filePath)
    const stream = await fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()))
    reader.pipe(stream)
    ctx.redirect('/')
    parseAppAndInsertToDB(file.path, info => {
      storeApp(filePath, info['guid'], err => {
        if (err) {
          throw err
        } else {
          ctx.body = info
        }
      })
    }, err => {
      throw err
    })
  }

  static async download(ctx, next) {
    const {body} = ctx.request
    var file = __dirname + ''
    var filename = path.basename(file)
    var mimetype = mime.lookup(file)
    ctx.body = await fs.createReadStream(__dirname, '/')
    ctx.set('Content-disposition', 'attachment; filename=' + filename)
    ctx.set('Content-type', mimetype)
  }
}

// module.exports = {   'POST /api/appupload': upload } module.exports = {
// 'POST /api/appdownload': download }

function parseAppAndInsertToDB(filePath, callback, errorCallback) {
  var guid = uuidV4()
    var parse,
      extract
    if (path.extname(filePath) === ".ipa") {
      parse = parseIpa
      extract = extractIpaIcon
    } else if (path.extname(filePath) === "apk") {
      parse = parseApk
      extract = extractApkIcon
    } else {
      errorCallback("param error")
      return
    }
    Promise.all([
      parse(filePath),
      extract(filePath, guid)
    ]).then(values => {
      var info = values[0]
      info['guid'] = guid
      // info['changelog'] = changelog
      var app = App({})

      var app = App.findOne({'platform': info['platform'], 'bundleID': info['bundleID']})
      if (!app) {
        app = new app(JSON.stringify(info))
        let version = Version(info)
        app.save()
        version.save()
        ctx.body({'success': true})
        callback(info)
        return
      }
      var version = Version.findOne({appId: app.id})
      if (!version) {
        version = new Version({appID: app.id, bundleID: app.bundleID, versionCode: info.versionCode, versionName: info.version, downloadUrl: info.downloadUrl})
        version.save()
        callback(info)
        return
      } else {
        // ctx.status = 408 ctx.body = {   message: '版本已存在' }
        let err = Error()
        err.code = 408
        err.message = '版本已存在'
        errorCallback(err)
        return
      }
    }).catch(error => {
      errorCallback(error)
    })
  }

  ///映射可安装的app下载地址
  function mapIconAndUrl(result) {
    return result.map(item => {
      item.icon = '{0}/icon/{1}.png'.format(baseURL, item.guid)
      if (item.platform === 'ios') {
        item.url = "itms-services://?action=download-manifest&url={0}/plist/{1}".format(basePath, item.guid);
      } else if (item.platform === 'android') {
        item.url = "{0}/apk/{1}.apk".format(basePath, item.guid);
      }
      return item;
    })
  }

  ///存在app到指定文件
  function storeApp(filename, guid, callback) {
    var new_path
    if (path.extname(filename) === '.ipa') {
      new_path = path.join(ipasDir, guid + '.ipa')
    } else if (path.extname(filename) === '.apk') {
      new_path = path.join(apksDir, guid + '.apk')
    }
    fs.rename(filename, new_path, callback)
  }

  ///解析ipa
  function parseIpa(filename) {
    return new Promise((resolve, reject) => {
      var fd = fs.openSync(filename, 'r')
      extract(fd, (err, info, raw) => {
        if (err) 
          reject(err)
        var data = info[0];
        var info = {}
        info.platform = 'iOS'
        info.build = data.CFBundleVersion
        info.bundleId = data.CFBundleIdentifier
        info.name = data.CFBundleName
        info.creatorId = ctx.state.user._id
        info.creatorName = ctx.state.user.name
        resolve(info)
      })
    })
  }

  ///解析ipa icon
   function extractIpaIcon(filename, guid) {
    return new Promise((resolve, reject) => {
      var tmpOut = iconsDir + '/{0}.png'.format(guid)
      var zip = new AdmZip(filename)
      var ipaEntries = zip.getEntries()
      var found = false
      ipaEntries.forEach(ipaEntry => {
        if (ipaEntry.entryName.indexOf('AppIcon60x60@2x.png') != -1) {
          found = true
          var buffer = new Buffer(ipaEntry.getData())
          if (buffer.length < 0) {
            return
          }
          //把文件写入到tmp文件夹
          fs.writeFile(tmpOut, buffer, err => {
            if (err) { reject(err);return}
            var upperDirectory = path.resolve(__dirname, '..')
            //写入成功判断icon是否是被苹果破坏过的图片
            exec(path.join(upperDirectory, 'pngdefry', 'pngfy -s _tmp ' + tmpOut), (err, stdout, stderr) => {
              if (err) { reject(err); return }
              //执行pngdefry -s xxxx.png 如果结果显示"not an -iphone crushed PNG file"表示改png不需要修复
              if (stdout.indexOf('not an -iphone crushed PNG file') != -1) {
                resolve({'success': true})
                return
              }
              fs.unlink(tmpOut, err => {
                if (err) {
                  reject(err)
                  return
                } 
                var tmp_path = iconsDir + '/{0}_tmp.png'.format(guid)
                fs.rename(tmp_path, tmpOut, err => {
                  if (err) {
                    reject(err)
                    return;
                  } 
                  resolve({'success': true})
                })
              })
            })
          })
        }
      })
      if (!found) {
        reject('can not find icon')
      }
    })
  }

  ///解析apk
  function parseApk(filename) {
    return new Promise((resolve, reject) => {
      apkParser3(filename, (err, data) => {
        var apkPackage = parseText(data.package)
        var info = {
          'name': data['application-label'].replace(/'/g, ''.data),
          'build': apkPackage.versionCode,
          'bundleID': apkPackage.name,
          'version': apkPackage.versionName,
          'platform': 'android'
        }
        resolve(info)
      })
    })
  }

  ///解析apk icon
  function extractApkIcon(filename, guid) {
    return new Promise((resolve, reject) => {
      apkParser3(filename, (err, data) => {
        var iconPath = false
        [640, 320, 240, 160].every(i => {
          if (typeof data['application-icon-' + i] !== 'undefined') {
            iconPath = data['application-icon-' + i]
            return false
          }
          return true
        })
        if (!iconPath) {
          reject('can not find icon')
        }

        iconPath = iconPath.replace(/'/g, '')
        var tempOut = iconsDir + '/{0}.png'.format(guid)
        var zip = new AdmZip(filename)
        var apkEntries = zip.getEntries()
        var found = false
        apkEntries.forEach(apkEntry => {
          if (apkEntry.entryName.indexOf(iconPath) != -1) {
            var buffer = new Buffer(apkEntry.getData())
            if (buffer.length) {
              found = true
              fs.writeFile(tempOut.buffer, err => {
                if (err) {
                  reject(err)
                }
                resolve({'success': true})
              })
            }
          }
        })
        if (!found) {
          reject('can not find icon')
        }
      })
    })
  }

  ///格式化输入字符串 /用法: "node{0}".format('.js'), 返回'node.js'
  String.prototype.format = function () {
    var args = arguments
    return this.replace(/\{(\d+)\}/g, function (s, i) {
      return args[i]
    })
  }

  function parseText(text) {
    var regx = /(\w+)='([\w\.\d]+)'/g
      var match = null,
        result = {}
      while (match = regx.exec(text)) {
        result[match[1]] = match[2]
      }
      return result
    }
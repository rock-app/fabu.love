var {
  request,
  summary,
  body,
  tags,
  middlewares,
  path,
  description,
  formData,
  responses,
  query
} = require('koa-swagger-decorator');

const Version = require('../model/version')
const App = require('../model/app_model')
var multer = require('koa-multer');
var fs = require('fs')
var mime = require('mime')
var path = require('path')
var os = require('os')
var uuidV4 = require('uuid/v4')
var apkParser3 = require('apk-parser3')
var extract = require('ipa-extract-info')
var Team = require('../model/team')
var AdmZip = require('adm-zip')
var serverDir = path.resolve(__dirname,"..") + '/uploaded/'
var ipasDir = serverDir + 'ipa'
var apksDir = serverDir + 'apk'
var iconsDir = serverDir + 'icon'
var {writeFile,readFile,responseWrapper,exec} = require('../helper/util')
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

const tag = tags(['上传']);
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
  @query({ teamId: { type: 'String'} })
  @middlewares([upload.single('file')])
  static async upload(ctx, next) {
    var file = ctx.req.file
    var filePath = file.path
    var reader = await fs.createReadStream(filePath)
    var stream = await fs.createWriteStream(
      path.join(os.tmpdir(), Math.random().toString()))
    reader.pipe(stream)

    var teamId = ctx.query.teamId;
    var team;
    if (teamId) {
      team = await Team.findById(teamId)
      if (!team) {
        throw new Error("没有找到该团队")
      }
    }
    var result = await parseAppAndInsertToDB(file.path, ctx.state.user.data,team);
    ctx.body = responseWrapper(result);
  }

  static async download(ctx, next) {
    const {body} = ctx.request
    var file = __dirname + ''
    var filename = path.basename(file)
    var mimetype = mime.lookup(file)
    ctx.body = await fs.createReadStream(__dirname, '/')
    ctx.set('Content-disposition', 
      'attachment; filename=' + filename)
    ctx.set('Content-type', mimetype)
  }
}

async function parseAppAndInsertToDB(filePath,user,team) {
  var guid = uuidV4()
    var parser, extractor;
    if (path.extname(filePath) === ".ipa") {
      parser = parseIpa
      extractor = extractIpaIcon
    } else if (path.extname(filePath) === ".apk") {
      parser = parseApk
      extractor = extractApkIcon
    } else {
      throw(new Error("文件类型有误,仅支持IPA或者APK文件的上传."))
    }

    var info = await parser(filePath);
    var icon = await extractor(filePath, guid);

    var app;
    if (team) {
      app = await App.findOne(
        {'platform': info['platform'], 'bundleId': info['bundleId'],
          'ownerType':'team','ownerId':team._id})
    }else{
      app = await App.findOne(
        {'platform': info['platform'], 'bundleId': info['bundleId'],
          'ownerType':'user','ownerId':user._id})
    }
    if (!app) {
      info.creator = user.username;
      info.creatorId = user._id;
      info.icon = icon.fileName;
      app = new App(info)
      if (team) {
        app.ownerId = team._id;
        app.ownerType = "team";
      }else{
        app.ownerId = user._id;
        app.ownerType = "user";
      }
      await app.save()
      info.uploader = user.username;
      info.uploaderId = user._id;
      info.size = fs.statSync(filePath).size
      var version = Version(info)
      version.appId = app._id;
      await version.save()
      return {'app':app,'version':version}
    }
    var version = Version.findOne({appId: app.id})
    if (!version) {
      version = new Version(
        {appId: app.id, bundleId: app.bundleId, 
        versionCode: info.versionCode, versionName: info.version, 
        downloadUrl: info.downloadUrl})
      version.save()
      return {'app':app,'version':version}
    } else {
      let err = Error()
      err.code = 408
      err.message = '当前版本已存在'
      throw err
    }
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
      info.platform = 'ios'
      info.bundleId = data.CFBundleIdentifier
      info.bundleName = data.CFBundleName
      info.appName = data.CFBundleDisplayName
      info.versionStr = data.CFBundleShortVersionString
      info.versionCode = data.CFBundleVersion
      resolve(info)
    })
  })
}

  ///解析ipa icon
async function extractIpaIcon(filename, guid) {
  var tmpOut = iconsDir + '/{0}.png'.format(guid)
  var zip = new AdmZip(filename)
  var ipaEntries = zip.getEntries()
  var found = false
  for (let ipaEntry of ipaEntries){
    if (ipaEntry.entryName.indexOf('AppIcon60x60@2x.png') != -1) {
      found = true
      var buffer = new Buffer(ipaEntry.getData())
      if (buffer.length < 0) {
        return
      }
      //把文件写入到tmp文件夹
      await writeFile(tmpOut, buffer)
      var upperDirectory = path.resolve(__dirname, '..')
        //写入成功判断icon是否是被苹果破坏过的图片
      var {stderr,stdout} = await exec(path.join(upperDirectory, 'pngdefry', 'pngfy -s _tmp ' + tmpOut));
      if (stderr) {
        throw stderr;
      }
      //执行pngdefry -s xxxx.png 如果结果显示"not an -iphone crushed PNG file"表示改png不需要修复
      if (stdout.indexOf('not an -iphone crushed PNG file') != -1) {
        return {'success': true,'fileName':'/{0}.png'.format(guid)}
      }
      await fs.unlink(tmpOut)
      var tmp_path = iconsDir + '/{0}_tmp.png'.format(guid)
      await fs.rename(tmp_path, tmpOut)
      return {'success': true,'fileName':'/{0}.png'.format(guid)}
    }
  }
  if (!found) {
    throw(new Error('can not find icon'))
  }
}

///解析apk
function parseApk(filename) {
  return new Promise((resolve, reject) => {
    apkParser3(filename, (err, data) => {
      var apkPackage = parseText(data.package)
      var info = {
        'appName': data['application-label'].replace(/'/g, ''),
        'versionCode': Number(apkPackage.versionCode),
        'bundleId' : apkPackage.name,
        'versionStr': apkPackage.versionName,
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
      var iconPath = false;
      var iconSize = [640, 320, 240, 160]
      for (var i in iconSize){
        if (typeof data['application-icon-' + iconSize[i]] !== 'undefined') {
          iconPath = data['application-icon-' + iconSize[i]]
          break;
        }
      }
      if (!iconPath) {
        throw('can not find app icon')
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
            fs.writeFile(tempOut,buffer, err => {
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
  var match = null;
  var result = {}
  while (match = regx.exec(text)) {
    result[match[1]] = match[2]
  }
  return result
}
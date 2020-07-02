import {
    request,
    summary,
    body,
    tags,
    middlewares,
    description,
    formData,
    responses,
    query,
    path as rpath
} from '../swagger';
import config from '../config';
var Team = require('../model/team')
const Version = require('../model/version')
const App = require('../model/app_model')
var multer = require('koa-multer');
var fs = require('fs')
var crypto = require('crypto')
var path = require('path')
var os = require('os')
var mime = require('mime')
var uuidV4 = require('uuid/v4')
var apkParser3 = require('../library/apkparser/apkparser')
var unzip = require('unzipper')
var etl = require('etl')
var mkdirp = require('mkdirp')
var ipaMataData = require('ipa-metadata2')
const AppInfoParser = require('app-info-parser')
const { compose, maxBy, filter, get } = require('lodash/fp')

var { writeFile, readFile, responseWrapper, exec } = require('../helper/util')

var tempDir = path.join(config.fileDir, 'temp')
var uploadDir = path.join(config.fileDir, 'upload')

createFolderIfNeeded(tempDir)

var uploadPrefix = "upload";

function createFolderIfNeeded(path) {
    if (!fs.existsSync(path)) {
        mkdirp.sync(path, function(err) {
            if (err) console.error(err)
        })
    }
}

const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const tag = tags(['上传']);
const upload = multer({ storage });

module.exports = class UploadRouter {
    @request('post', '/api/apps/{teamId}/upload')
    @summary('上传apk或者ipa文件到服务器')
    @tag
    @formData({
        file: {
            type: 'file',
            required: 'true',
            description: 'upload file, get url'
        }
    })
    @rpath({ teamId: { type: 'string', required: true } })
    @middlewares([upload.single('file')])
    static async upload(ctx, next) {
        var file = ctx.req.file
        const { teamId } = ctx.validatedParams;
        var team = await Team.findById(teamId)
        if (!team) {
            throw new Error("没有找到该团队")
        }
        var result = await parseAppAndInsertToDB(file, ctx.state.user.data, team);
        await Version.updateOne({ _id: result.version._id }, {
            released: result.app.autoPublish
        })
        if (result.app.autoPublish) {
            await App.updateOne({ _id: result.app._id }, {
                releaseVersionId: result.version._id,
                releaseVersionCode: result.version.versionCode
            })
        }
        console.log(result.app.autoPublish)
        console.log(result.version.released)
        ctx.body = responseWrapper(result);
    }

    static async download(ctx, next) {
        const { body } = ctx.request
        var file = __dirname + ''
        var filename = path.basename(file)
        var mimetype = mime.lookup(file)
        ctx.body = await fs.createReadStream(__dirname, '/')
        ctx.set('Content-disposition',
            'attachment; filename=' + filename)
        ctx.set('Content-type', mimetype)
    }
}

async function parseAppAndInsertToDB(file, user, team) {
    var filePath = file.path
    var parser, extractor;
    if (path.extname(filePath) === ".ipa") {
        parser = parseIpa
        extractor = extractIpaIcon
    } else if (path.extname(filePath) === ".apk") {
        parser = parseApk
        extractor = extractApkIcon
    } else {
        throw (new Error("文件类型有误,仅支持IPA或者APK文件的上传."))
    }

    //解析ipa和apk文件
    var info = await parser(filePath);
    var fileName = info.bundleId + "_" + info.versionStr + "_" + info.versionCode
        //解析icon图标
    var icon = await extractor(filePath, fileName, team);


    //移动文件到对应目录
    var fileRelatePath = path.join(team.id, info.platform)
    createFolderIfNeeded(path.join(uploadDir, fileRelatePath))
    var fileRealPath = path.join(uploadDir, fileRelatePath, fileName + path.extname(filePath))

    //获取文件MD5值
    var buffer = fs.readFileSync(filePath)
    var fsHash = crypto.createHash('md5')
    fsHash.update(buffer)
    var filemd5 = fsHash.digest('hex')

    //异步保存问题（避免跨磁盘移动问题）
    var readStream = fs.createReadStream(filePath)
    var writeStream = fs.createWriteStream(fileRealPath)
    readStream.pipe(writeStream)
    readStream.on('end',function(){
        fs.unlinkSync(filePath)
    })

    info.downloadUrl = path.join(uploadPrefix, fileRelatePath, fileName + path.extname(filePath))

    var app = await App.findOne({ 'platform': info['platform'], 'bundleId': info['bundleId'], 'ownerId': team._id })
    if (!app) {
        info.creator = user.username;
        info.creatorId = user._id;
        info.icon = path.join(uploadPrefix, icon.fileName);
        info.shortUrl = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
        app = new App(info)
        app.ownerId = team._id;
        app.currentVersion = info.versionCode
        await app.save()
        info.uploader = user.username;
        info.uploaderId = user._id;
        info.size = fs.statSync(fileRealPath).size
        var version = Version(info)
        version.md5 = filemd5
        version.appId = app._id;
        if (app.platform == 'ios') {
            version.installUrl = mapInstallUrl(app.id, version.id)
        } else {
            version.installUrl = info.downloadUrl
        }
        await version.save()
        return { 'app': app, 'version': version }
    }
    var version = await Version.findOne({ appId: app.id, versionCode: info.versionCode })
    if (!version) {
        info.uploader = user.username;
        info.uploaderId = user._id;
        info.size = fs.statSync(fileRealPath).size
        var version = Version(info)
        version.appId = app._id;
        version.md5 = filemd5
        if (app.platform == 'ios') {
            version.installUrl = mapInstallUrl(app.id, version.id)
        } else {
            version.installUrl = `${config.baseUrl}/${info.downloadUrl}`
        }
        await version.save()
        return { 'app': app, 'version': version }
    } else {
        let err = Error()
        err.code = 408
        err.message = '当前版本已存在'
        throw err
    }
}

///映射可安装的app下载地址
function mapInstallUrl(appId, versionId) {
    return `itms-services://?action=download-manifest&url=${config.baseUrl}/api/plist/${appId}/${versionId}`
}

///移动相关信息到指定目录
function storeInfo(filename, guid) {
    var new_path
    if (path.extname(filename) === '.ipa') {
        new_path = path.join(ipasDir, guid + '.ipa')
    } else if (path.extname(filename) === '.apk') {
        new_path = path.join(apksDir, guid + '.apk')
    }
    fs.rename(filename, new_path)
}

///解析ipa
function parseIpa(filename) {
    const parser = new AppInfoParser(filename)

    return new Promise((resolve, reject) => {
        parser.parse().then(result => {
            console.log('app info ----> ', result)
            console.log('icon base64 ----> ', result.icon)

            var info = {}
            info.platform = 'ios'
            info.bundleId = result.CFBundleIdentifier
            info.bundleName = result.CFBundleName
            info.appName = result.CFBundleDisplayName
            info.versionStr = result.CFBundleShortVersionString
            info.versionCode = result.CFBundleVersion
            info.iconName = result.CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconName
            try {
                const environment = result.mobileProvision.Entitlements['aps-environment']
                const active = result.mobileProvision.Entitlements['beta-reports-active']
                if (environment == 'production') {
                    info.appLevel = active ? 'appstore' : 'enterprise'
                } else {
                    info.appLevel = 'develop'
                }
            } catch (err) {
                info.appLevel = 'develop'
                // reject("应用未签名,暂不支持")
            }
            resolve(info)
        })
        
    })
}

///解析ipa icon
async function extractIpaIcon(filename, guid, team) {
    var ipaInfo = await parseIpa(filename)
    var iconName = ipaInfo.iconName || 'AppIcon';
    var tmpOut = tempDir + '/{0}.png'.format(guid)
    var found = false
    var buffer = fs.readFileSync(filename)
    var data = await unzip.Open.buffer(buffer)
    await new Promise((resolve, reject) => {
        data.files.forEach(file => {
            if (file.path.indexOf(iconName + '60x60@2x.png') != -1) {
                found = true
                file.stream()
                    .pipe(fs.createWriteStream(tmpOut))
                    .on('error', reject)
                    .on('finish', resolve)
            }
        })
    }).catch({
        
    })

    if (!found) {
        throw (new Error('can not find icon'))
    }

    var pnfdefryDir = path.join(__dirname, '..', 'library/pngdefry')
        //写入成功判断icon是否是被苹果破坏过的图片
    var exeName = '';
    if (os.type() === 'Darwin') {
        exeName = 'pngfy-osx';
    } else if (os.type() === 'Linux') {
        exeName = 'pngfy-linux';
    } else {
        throw new Error('Unknown OS!');
    }

    var { stderr, stdout } = await exec(path.join(pnfdefryDir, exeName + ' -s _tmp ', tmpOut));
    if (stderr) {
        throw stderr;
    }
    //执行pngdefry -s xxxx.png 如果结果显示"not an -iphone crushed PNG file"表示改png不需要修复
    var iconRelatePath = path.join(team.id, "/icon")
    var iconSuffix = "/" + guid + "_i.png"
    createFolderIfNeeded(path.join(uploadDir, iconRelatePath))
    if (stdout.indexOf('not an -iphone crushed PNG file') != -1) {
        await fs.renameSync(tmpOut, path.join(uploadDir,iconRelatePath, iconSuffix))
        return { 'success': true, 'fileName': iconRelatePath + iconSuffix }
    }
    await fs.unlinkSync(tmpOut)
    fs.renameSync(tempDir + '/{0}_tmp.png'.format(guid), path.join(uploadDir, iconRelatePath, iconSuffix))
    return { 'success': true, 'fileName': iconRelatePath + iconSuffix }

}

///解析apk
function parseApk(filename)  {

    const parser = new AppInfoParser(filename)


    return new Promise((resolve, reject) => {
        parser.parse().then(result => {
            // console.log('app info ----> ', result)
            // console.log('icon base64 ----> ', result.icon)
            // console.log('====================================', JSON.stringify(result));
            var label = undefined

            if(result.application && result.application.label && result.application.label.length > 0) {
                label = result.application.label[0]
            }

            if (label) {
                label = label.replace(/'/g, '')
            }
            var appName = (result['application-label'] || result['application-label-zh-CN'] || result['application-label-es-US'] ||
            result['application-label-zh_CN'] || result['application-label-es_US'] || label || 'unknown')

            var info = {
                'appName': appName.replace(/'/g, ''),
                'versionCode': Number(result.versionCode),
                'bundleId': result.package,
                'versionStr': result.versionName,
                'platform': 'android'
            }
            resolve(info)
          }).catch(err => {
            console.log('err ----> ', err)
          })
        // apkParser3(filename, (err, data) => {
        //     var apkPackage = parseText(data.package)
        //     console.log(data)
        //     console.log("----------------")
        //     console.log(data['application-label'])
        //     var label = undefined
        //     data['launchable-activity']
        //         .split(' ')
        //         .filter(s => s.length != 0)
        //         .map(element => { return element.split('=') })
        //         .forEach(element => {
        //             if (element && element.length > 2 && element[0] == 'label') {
        //                 label = element[1]
        //             }
        //         })
        //     if (label) {
        //         label = label.replace(/'/g, '')
        //     }
        //     var appName = (data['application-label'] || data['application-label-zh-CN'] || data['application-label-es-US'] ||
        //         data['application-label-zh_CN'] || data['application-label-es_US'] || label || 'unknown')
        //     var info = {
        //         'appName': appName.replace(/'/g, ''),
        //         'versionCode': Number(apkPackage.versionCode),
        //         'bundleId': apkPackage.name,
        //         'versionStr': apkPackage.versionName,
        //         'platform': 'android'
        //     }
        //     resolve(info)
        // })
    })
}

///解析apk icon
function extractApkIcon(filepath, guid, team) {
    return new Promise((resolve, reject) => {
        apkParser3(filepath, (err, data) => {
            var iconPath = false;
            var iconSize = [640, 320, 240, 160]
            for (var i in iconSize) {
                if (typeof data['application-icon-' + iconSize[i]] !== 'undefined') {
                    iconPath = data['application-icon-' + iconSize[i]]
                    break;
                }
            }
            if (!iconPath) {
                throw ('can not find app icon')
            }

            iconPath = iconPath.replace(/'/g, '')
            var dir = path.join(uploadDir, team.id, "icon")
            var realPath = path.join(team.id, "icon", '/{0}_a.png'.format(guid))
            createFolderIfNeeded(dir)
            var tempOut = path.join(uploadDir, realPath)
            
            var { ext, dir } = path.parse(iconPath);
            // 获取到最大的png的路径
            let maxSizePath;
            // if (ext === '.xml') {

            // } else {
            //     fs.createReadStream(filepath)
            //         .pipe(unzip.Parse())
            //         .pipe(etl.map(entry => {
            //             // 适配iconPath为ic_launcher.xml的情况
            //             const entryPath = entry.path
            //             // const isXml = entryPath.indexOf('.xml') >= 0
            //             // if ( (!isXml && entryPath.indexOf(iconPath) != -1) || (isXml && entry.path.indexOf(maxSizePath) != -1)) {
            //             //     console.log(entry.path)
            //             entry.pipe(etl.toFile(tempOut))
            //             resolve({ 'success': true, fileName: realPath })
            //             // } else {
            //             //     entry.autodrain()
            //             // }
            //         }))
            // }

            const initialPromise = ext === '.xml' ?
                unzip.Open.file(filepath).then(directory => {
                    const getMaxSizeImagePath = compose(get('path'), maxBy('compressedSize'),
                        filter(entry => entry.path.indexOf(dir) >= 0 && entry.path.indexOf('.png') >= 0), get('files'));
                    maxSizePath = getMaxSizeImagePath(directory)
                }) : new Promise((resolve) => resolve())
            initialPromise.then(() => {
                fs.createReadStream(filepath)
                    .pipe(unzip.Parse())
                    .pipe(etl.map(entry => {
                        // 适配iconPath为ic_launcher.xml的情况
                        const entryPath = entry.path
                        const isXml = entryPath.indexOf('.xml') >= 0
                        if ( (!isXml && entryPath.indexOf(iconPath) != -1) || (isXml && entry.path.indexOf(maxSizePath) != -1)) {
                            console.log(entry.path)
                            entry.pipe(etl.toFile(tempOut))
                            resolve({ 'success': true, fileName: realPath })
                        } else {
                            resolve({ 'success': true, fileName: realPath })
                            entry.autodrain()
                        }
                    }))
            })
        })
    })
}

///格式化输入字符串 /用法: "node{0}".format('.js'), 返回'node.js'
String.prototype.format = function() {
    var args = arguments
    return this.replace(/\{(\d+)\}/g, function(s, i) {
        return args[i]
    })
}

function parseText(text) {
    var regx = /(\w+)='([\S]+)'/g
    var match = null;
    var result = {}
    while (match = regx.exec(text)) {
        result[match[1]] = match[2]
    }
    return result
}

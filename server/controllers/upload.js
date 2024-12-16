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

const Team = require('../model/team');
const Version = require('../model/version');
const App = require('../model/app_model');
const multer = require('koa-multer');
const fs = require('fs');
const crypto = require('crypto')
const path = require('path');
const os = require('os');
const { v4: uuidV4 } = require('uuid');
const apkParser3 = require('../library/apkparser/apkparser');
const unzip = require('unzipper');
const etl = require('etl');
const mkdirp = require('mkdirp');
const AppInfoParser = require('app-info-parser');
const { compose, maxBy, filter, get } = require('lodash/fp');
const text2png = require('text2png');
const ApkReader = require('adbkit-apkreader');

const { writeFile, readFile, responseWrapper, exec } = require('../helper/util');

const tempDir = path.join(config.fileDir, 'temp');
const uploadDir = path.join(config.fileDir, 'upload');

createFolderIfNeeded(tempDir);

const uploadPrefix = 'upload';

function createFolderIfNeeded(path) {
  if ( !fs.existsSync(path) ) {
    return mkdirp(path);
  }

  return Promise.resolve();
}

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => cb(null, `${ Date.now() }-${ file.originalname }`)
});

const tag = tags([ '上传' ]);
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
  @middlewares([ upload.single('file') ])
  static async upload(ctx, next) {
    const file = ctx.req.file;
    const { teamId } = ctx.validatedParams;
    const team = await Team.findById(teamId);
    if ( !team ) {
      throw new Error('没有找到该团队');
    }
    const result = await parseAppAndInsertToDB(file, ctx.state.user.data, team);
    await Version.updateOne({ _id: result.version._id }, {
      released: result.app.autoPublish
    });
    if ( result.app.autoPublish ) {
      await App.updateOne({ _id: result.app._id }, {
        releaseVersionId: result.version._id,
        releaseVersionCode: result.version.versionCode
      });
    }
    ctx.body = responseWrapper(result);
  }
};

async function parseAppAndInsertToDB(file, user, team) {
  let version;
  const filePath = file.path;
  let parser, extractor;
  if ( path.extname(filePath) === '.ipa' ) {
    parser = parseIpa;
    extractor = extractIpaIcon;
  } else if ( path.extname(filePath) === '.apk' ) {
    parser = parseApk;
    extractor = extractAPKIconV2;
  } else {
    throw ( new Error('文件类型有误,仅支持IPA或者APK文件的上传.') );
  }

  //解析ipa和apk文件
  const info = await parser(filePath);
  const fileName = info.bundleId + '_' + info.versionStr + '_' + info.versionCode;
  //解析icon图标
  /**
   * @type {{success: boolean, fileName: string}}
   */
  const icon = await extractor(filePath, fileName, team);
  //移动文件到对应目录
  const fileRelatePath = path.join(team.id, info.platform);
  await createFolderIfNeeded(path.join(uploadDir, fileRelatePath));
  const fileRealPath = path.join(uploadDir, fileRelatePath, fileName + path.extname(filePath));
  await fs.renameSync(filePath, fileRealPath);

  //获取文件MD5值
  const buffer = fs.readFileSync(fileRealPath);
  const fsHash = crypto.createHash('md5');
  fsHash.update(buffer)
  const fileMd5 = fsHash.digest('hex');

  // //异步保存问题（避免跨磁盘移动问题）
  // var readStream = fs.createReadStream(filePath)
  // var writeStream = fs.createWriteStream(fileRealPath)
  // readStream.pipe(writeStream)
  // readStream.on('end',function(){
  //     fs.unlinkSync(filePath)
  // })

  info.downloadUrl = path.join(uploadPrefix, fileRelatePath, fileName + path.extname(filePath));

  let app = await App.findOne({ 'platform': info['platform'], 'bundleId': info['bundleId'], 'ownerId': team._id });
  if ( !app ) {
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
    version = Version(info);
    version.md5 = fileMd5
    version.appId = app._id;
    if ( app.platform === 'ios' ) {
      version.installUrl = mapInstallUrl(app.id, version.id)
    } else {
      version.installUrl = info.downloadUrl
    }
    await version.save()
    return { 'app': app, 'version': version }
  }
  version = await Version.findOne({ appId: app.id, versionCode: info.versionCode });
  if ( !version ) {
    info.uploader = user.username;
    info.uploaderId = user._id;
    info.size = fs.statSync(fileRealPath).size
    version = Version(info);
    version.appId = app._id;
    version.md5 = fileMd5
    if ( app.platform === 'ios' ) {
      version.installUrl = mapInstallUrl(app.id, version.id)
    } else {
      version.installUrl = `${ config.baseUrl }/${ info.downloadUrl }`
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
  return `itms-services://?action=download-manifest&url=${ config.baseUrl }/api/plist/${ appId }/${ versionId }`;
}

///移动相关信息到指定目录
function storeInfo(filename, guid) {
  let new_path;
  if ( path.extname(filename) === '.ipa' ) {
    new_path = path.join(ipasDir, guid + '.ipa');
  } else if ( path.extname(filename) === '.apk' ) {
    new_path = path.join(apksDir, guid + '.apk');
  }
  fs.rename(filename, new_path);
}

///解析ipa
function parseIpa(filename) {
  const parser = new AppInfoParser(filename);

  return new Promise((resolve, reject) => {
    parser.parse().then(result => {
      // console.log('app info ----> ', result);
      // console.log('icon base64 ----> ', result.icon);

      const info = {};
      info.platform = 'ios'
      info.bundleId = result.CFBundleIdentifier
      info.bundleName = result.CFBundleName
      info.appName = result.CFBundleDisplayName
      if ( typeof ( info.appName ) == 'undefined' || info.appName == null || info.appName === '' ) {
        info.appName = info.bundleName
      }
      info.versionStr = result.CFBundleShortVersionString
      info.versionCode = result.CFBundleVersion
      info.iconName = result.CFBundleIcons ? result.CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconName : '';
      try {
        const environment = result.mobileProvision.Entitlements['aps-environment']
        const active = result.mobileProvision.Entitlements['beta-reports-active']
        if ( environment === 'production' ) {
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

async function generatePngWithText(iconPath, name) {
  return new Promise((resolve, reject) => {
    fs.writeFileSync(
      iconPath,
      text2png(name, {
        backgroundColor: 'black',
        color: 'white',
        font: '80px Futura',
        lineSpacing: 10,
        padding: 200,
      }),
      { encoding: 'utf8', flag: 'w' });
    resolve()
  })
}

///解析ipa icon
async function extractIpaIcon(filename, guid, team) {
  let ipaInfo = await parseIpa(filename)
  let iconName = ipaInfo.iconName || 'AppIcon';
  let tmpOut = tempDir + '/{0}.png'.format(guid)
  let found = false
  let buffer = fs.readFileSync(filename)
  let data = await unzip.Open.buffer(buffer)
  await new Promise(async (resolve, reject) => {
    data.files.forEach(file => {
      if ( file.path.indexOf(iconName + '60x60@2x.png') !== -1 ) {
        found = true;
        file.stream()
          .pipe(fs.createWriteStream(tmpOut))
          .on('error', reject)
          .on('finish', resolve);
      }
    });
    if ( !found ) {
      found = true
      await generatePngWithText(tmpOut, ipaInfo.bundleName || ipaInfo.appName)
      resolve()
    }
  }).catch(() => {
    return Promise.reject('upload failure');
  });

  if ( !found ) {
    throw ( new Error('can not find icon') );
  }

  let pngdefryDir = path.join(__dirname, '..', 'library/pngdefry');
  //写入成功判断icon是否是被苹果破坏过的图片
  let exeName = '';
  if ( os.type() === 'Darwin' ) {
    exeName = 'pngfy-osx';
  } else if ( os.type() === 'Linux' ) {
    exeName = 'pngfy-linux';
  } else {
    throw new Error('Unknown OS!');
  }

  let { stderr, stdout } = await exec(path.join(pngdefryDir, exeName + ' -s _tmp ', tmpOut));
  if ( stderr ) {
    throw stderr;
  }
  //执行pngdefry -s xxxx.png 如果结果显示"not an -iphone crushed PNG file"表示改png不需要修复
  let iconRelatePath = path.join(team.id, '/icon');
  let iconSuffix = '/' + guid + '_i.png';
  await createFolderIfNeeded(path.join(uploadDir, iconRelatePath));
  if ( stdout.indexOf('not an -iphone crushed PNG file') !== -1 ) {
    await fs.renameSync(tmpOut, path.join(uploadDir, iconRelatePath, iconSuffix));
    return { 'success': true, 'fileName': iconRelatePath + iconSuffix };
  }
  await fs.unlinkSync(tmpOut);
  fs.renameSync(tempDir + '/{0}_tmp.png'.format(guid), path.join(uploadDir, iconRelatePath, iconSuffix));
  return { 'success': true, 'fileName': iconRelatePath + iconSuffix };

}

///解析apk
function parseApk(filename) {

  const parser = new AppInfoParser(filename);

  return new Promise((resolve, reject) => {
    parser.parse().then(result => {
      let label = undefined;

      if ( result.application && result.application.label && result.application.label.length > 0 ) {
        label = result.application.label[0];
      }

      if ( label ) {
        label = label.replace(/'/g, '');
      }
      let appName = ( result['application-label'] || result['application-label-zh-CN'] || result['application-label-es-US'] ||
        result['application-label-zh_CN'] || result['application-label-es_US'] || label || 'unknown' );

      let info = {
        'appName': appName.replace(/'/g, ''),
        'versionCode': Number(result.versionCode),
        'bundleId': result.package,
        'versionStr': result.versionName,
        'platform': 'android'
      };
      resolve(info);
    }).catch(err => {
      console.log('err ----> ', err);
    });
  });
}

function extractAPKIconV2(filepath, guid, team) {
  let iconDir = path.join(uploadDir, team.id, 'icon');
  let realPath = path.join(team.id, 'icon', '/{0}_a.png'.format(guid));

  return new Promise(async (resolve, reject) => {
    const parser = new AppInfoParser(filepath) // or xxx.ipa
    const parserResult = await parser.parse()
    if ( parserResult.icon ) {
      // 可能会包含 xml 文件
      let largestIcon = parserResult.application.icon.filter(name => name.endsWith('.png') || name.endsWith('.webp')).pop()

      const reader = await ApkReader.open(filepath)
      const png = await reader.readContent(largestIcon)

      await createFolderIfNeeded(iconDir);
      let tempOut = path.join(uploadDir, realPath);

      fs.writeFile(tempOut, png, (err) => {
        resolve({ 'success': true, fileName: realPath });
      })
    } else {
      generatePngWithText(realPath, parserResult.application.label.pop()).then(() => {
        resolve({ 'success': true, fileName: realPath });
      })
    }
  })
}

/**
 * 解析apk icon
 * @param filepath
 * @param guid
 * @param team
 * @returns {Promise<{success:boolean, fileName:string}>}
 */
function extractApkIcon(filepath, guid, team) {
  return new Promise((resolve, reject) => {
    apkParser3(filepath, async (err, data) => {
      let iconPath = false;
      const iconSize = [ 640, 320, 240, 160 ];
      for (const i in iconSize) {
        if ( typeof data['application-icon-' + iconSize[i]] !== 'undefined' ) {
          iconPath = data['application-icon-' + iconSize[i]];
          break;
        }
      }
      if ( !iconPath ) {
        throw ( 'can not find app icon' );
      }
      // res/mipmap-anydpi-v26/ic_launcher.xml 解析不行
      //TODO:[answer] png 或者 webp, 需要判断下
      iconPath = 'res/mipmap-xxxhdpi-v4/ic_launcher.png';

      iconPath = iconPath.replace(/'/g, '');
      let iconDir = path.join(uploadDir, team.id, 'icon');
      let realPath = path.join(team.id, 'icon', '/{0}_a.png'.format(guid));
      await createFolderIfNeeded(iconDir);
      let tempOut = path.join(uploadDir, realPath);
      let { ext, dir } = path.parse(iconPath);
      // 获取到最大的png的路径
      let maxSizePath;

      const initialPromise = ext === '.xml' ?
        unzip.Open.file(filepath).then(directory => {
          const getMaxSizeImagePath = compose(
            get('path'),
            maxBy('compressedSize'),
            filter(entry => entry.path.indexOf(dir) >= 0 && entry.path.indexOf('.png') >= 0),
            get('files')
          );
          maxSizePath = getMaxSizeImagePath(directory);
        })
        :
        new Promise((resolve) => resolve());

      initialPromise.then(() => {
        try {
          fs.createReadStream(filepath)
            // TODO: [answer] apk parse 报错, 换新的 apk 解析方式
            .pipe(unzip.Parse())
            .pipe(etl.map(entry => {
              // 适配iconPath为ic_launcher.xml的情况
              const entryPath = entry.path;
              const isXml = entryPath.indexOf('.xml') >= 0;
              if ( ( !isXml && entryPath.indexOf(iconPath) !== -1 ) || ( isXml && entry.path.indexOf(maxSizePath) !== -1 ) ) {
                console.log('entry if:', entry.path)
                entry.pipe(etl.toFile(tempOut));
                resolve({ 'success': true, fileName: realPath });
              } else {
                resolve({ 'success': true, fileName: realPath });
                entry.autodrain().on('error', (err) => {
                  console.log('entry error:', err);
                });
              }
            }));
        } catch (e) {
          console.log('create read stream error:', e);
          reject(e);
        }
      }).catch((err) => {
        console.log('initialPromise err:', err)
      });
    });
  });
}

///格式化输入字符串 /用法: "node{0}".format('.js'), 返回'node.js'
String.prototype.format = function () {
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function (s, i) {
    return args[i];
  });
};

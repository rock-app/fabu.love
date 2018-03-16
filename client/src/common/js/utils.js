/**
 * Created by darren on 2018/3/15.
 */
// var fs = require('node-fs')
// var extract = require('ipa-extract-info')
//
// // 解析ipa
// export function parseIpa(filename) {
//   return new Promise((resolve, reject) => {
//     console.log(fs)
//     var fd = fs.openSync(filename, 'r')
//     extract(fd, (err, info, raw) => {
//       if (err) {
//         reject(err)
//       }
//       var data = info[0]
//       var appInfo = {}
//       appInfo.platform = 'ios'
//       appInfo.bundleId = data.CFBundleIdentifier
//       appInfo.bundleName = data.CFBundleName
//       appInfo.appName = data.CFBundleDisplayName
//       appInfo.versionStr = data.CFBundleShortVersionString
//       appInfo.versionCode = data.CFBundleVersion
//       resolve(appInfo)
//     })
//   })
// }

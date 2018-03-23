/**
 * Created by darren on 2018/3/15.
 */
import {getHttp, deleteHttp, postHttp} from '../basehttp'

// 获取应用列表
export function getAppList(teamId, page) {
  let params = {
    'page': page, 'size': 10
  }
  let url = `api/apps/${teamId}`
  console.log(url)
  return getHttp(url, params)
}

// 获取应用详情
export function getAppDetail(teamId, appId) {
  let url = `api/apps/${teamId}/${appId}`
  return getHttp(url)
}

// 获取应用的版本列表
export function getAppVersionList(teamId, id, page) {
  let params = {
    'page': page, 'size': 10
  }
  let url = `api/apps/${teamId}/${id}/versions`
  return getHttp(url, params)
}

// 获取某个应用的某个版本详情
export function getAppVersionDetail(teamId, id, versionId) {
  let url = `api/apps/${teamId}/${id}/versions/${versionId}`
  return getHttp(url)
}
// 删除应用
export function delectApp(teamId, appId) {
  let url = `api/apps/${teamId}/${appId}`
  return deleteHttp(url)
}

// 通过短链接获取应用最新版本
export function getAppInfoByShortUrl(appShortUrl) {
  let url = `api/app/${appShortUrl}`
  return getHttp(url)
}

// 发布应用
export function releaseApp(teamId, id, versionId, versionCode, release) {
  let body = {
    'versionId': versionId,
    'release': release,
    'versionCode': versionCode
  }
  let url = `api/apps/${teamId}/${id}/release`
  return postHttp(url, body)
}

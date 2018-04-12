/**
 * Created by darren on 2018/3/15.
 */
import {getHttp, deleteHttp, postHttp} from '../basehttp'

// 获取应用列表
export function getAppList(teamId) {
  let url = `api/apps/${teamId}`
  return getHttp(url)
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
// 删除某个版本
export function delectAppVersion(teamId, appId, versionId) {
  let url = `api/apps/${teamId}/${appId}/versions/${versionId}`
  return deleteHttp(url)
}

// 更新应用设置
export function updateAppSetting(teamId, appId, body) {
  let url = `api/apps/${teamId}/${appId}/profile`
  return postHttp(url, body)
}

// 灰度版本
export function grayVersion(teamId, id, body) {
  let url = `api/apps/${teamId}/${id}/grayPublish`
  return postHttp(url, body)
}

// 更新日志
export function updateNote(teamId, id, versionId, body) {
  let url = `api/apps/${teamId}/${id}/${versionId}/profile`
  return postHttp(url, body)
}

// 统计下载次数
export function downloadedCount(appId, versionId) {
  let url = `api/count/${appId}/${versionId}`
  return getHttp(url)
}

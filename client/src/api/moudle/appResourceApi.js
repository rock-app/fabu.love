/**
 * Created by darren on 2018/3/15.
 */
import {getHttp, deleteHttp} from '../basehttp'

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
export function getAppDetail(appId) {
  let url = `api/app/${appId}`
  return getHttp(url)
}

// 获取应用的版本列表
export function getAppVersionList(id, page) {
  let params = {
    'page': page, 'size': 10
  }
  let url = `api/apps/${id}/versions`
  return getHttp(url, params)
}


// 删除应用
export function delectApp(appId) {
  let url = `api/app/${appId}`
  return deleteHttp(url)
}

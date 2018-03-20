/**
 * Created by darren on 2018/3/15.
 */
import {getHttp} from '../basehttp'

// 获取应用列表
export function getAppList(page) {
  let params = {
    'page': page, 'size': 10
  }
  let url = 'api/apps'
  return getHttp(url, params)
}

// 获取应用详情
export function getAppDetail(appId) {
  let url = `api/app/${appId}`
  return getHttp(url)
}

// 删除应用
export function delectApp(appId) {
  let url = `api/app/${appId}`
  return getHttp(url)
}

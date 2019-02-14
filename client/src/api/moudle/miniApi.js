/**
 * Created by darren on 2019/2/14.
 */
import {postHttp, getHttp} from '../basehttp'

// 创建一个小程序
export function create(body) {
  let url = 'api/miniapps/create'
  return postHttp(url, body)
}

// 获取团队下小程序列表
export function getAppList(teamId) {
  let url = `api/miniapps/${teamId}`
  return getHttp(url)
}

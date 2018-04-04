/**
 * Created by darren on 2018/4/2.
 */
import {postHttp, getHttp} from '../basehttp'

// 修改用户信息
export function updateUserInfo(body) {
  let url = `api/user/modify`
  return postHttp(url, body)
}

// 修改用户密码
export function updateUserPassword(body) {
  let url = `api/user/password/modify`
  return postHttp(url, body)
}

// 获取用户消息列表
export function getUserMessage(page) {
  let params = {
    'page': page, 'size': 10
  }
  let url = `api/messages`
  return getHttp(url, params)
}

// 获取消息总数和未读消息总数
export function getMessageCount() {
  let url = 'api/messages/count'
  return getHttp(url)
}

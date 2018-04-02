/**
 * Created by darren on 2018/4/2.
 */
import {postHttp} from '../basehttp'

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

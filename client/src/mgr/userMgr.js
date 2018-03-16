import StorageMgr from './StorageMgr'

const USERINFO_KEY = '__userInfo__'

// 存储用户信息
export function saveUserInfo(user) {
  StorageMgr.setItem(USERINFO_KEY, user)
}

// 获取用户信息
export function getUserInfo() {
  let user = StorageMgr.getItem(USERINFO_KEY)
  return user
}

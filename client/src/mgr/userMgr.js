import StorageMgr from './StorageMgr'

const USERINFO_KEY = '__userInfo__'
const CURRENT_USERTRAM_KEY = '__userTeam__'


// 存储用户信息（登录）
export function saveUserInfo(user) {
  StorageMgr.setItem(USERINFO_KEY, user)

  // 存储用户的team，默认存储第一个team
  saveUserTeam(user.teamArr[0])
}

// 获取用户信息
export function getUserInfo() {
  let user = StorageMgr.getItem(USERINFO_KEY)
  return user
}

// 删除用户信息
export function removeUserInfo() {
  StorageMgr.setItem(USERINFO_KEY, '')
  StorageMgr.setItem(CURRENT_USERTRAM_KEY, '')
}

// 获取用户id
export function getUserId() {
  let user = StorageMgr.getItem(USERINFO_KEY)
  return user.userId
}

// 获取team数组
export function getTeamArr() {
  let user = StorageMgr.getItem(USERINFO_KEY)
  return user.teamArr
}

// 更新team数组
export function updateTeamArr(teamArr) {
  let user = this.getUserInfo()
  user.teamArr = teamArr
  // 存储新的用户信息
  StorageMgr.setItem(USERINFO_KEY, user)
}

// 存储当前用户选择的team
export function saveUserTeam(team) {
  StorageMgr.setItem(CURRENT_USERTRAM_KEY, team)
}

// 获取当前用户选择的team
export function getUserTeam() {
  return StorageMgr.getItem(CURRENT_USERTRAM_KEY)
}


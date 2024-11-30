import StorageMgr from './StorageMgr'
import axios from 'axios'

/// 根据域名管理token
class TokenMgr {
  static StorageKey = 'Token';

  constructor () {
    this.tokens = this.read()
  }

  read () {
    return StorageMgr.getItem(TokenMgr.StorageKey, [])
  }

  write (value) {
    StorageMgr.setItem(TokenMgr.StorageKey, value)
  }

  get (url) {
    var host = this.urlhost(url)
    for (var item of this.tokens) {
      if (item.url === host) {
        return item.token
      }
    }
    return null
  }

  add (url, token) {
    for (var item of this.tokens) {
      if (item.url === this.urlhost(url)) {
        this.tokens.splice(this.tokens.indexOf(item), 1)
        break
      }
    }
    this.tokens.push({
      url: this.urlhost(url),
      token: token
    })
    this.write(this.tokens)
    console.log(this.tokens)
  }

  clearTokens() {
    StorageMgr.setItem(TokenMgr.StorageKey, [])
  }

  /// 获得url对应的域名
  urlhost (url) {
    // let link = document.createElement('a')
    // link.href = url
    // return link.host
    return axios.defaults.baseURL
  }

}

const instance = new TokenMgr()
export default instance

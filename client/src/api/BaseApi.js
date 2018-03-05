import TokenMgr from '../mgr/TokenMgr'
const axios = require('axios')

export default class BaseApi {
  
  static init (router) {
    axios.interceptors.request.use((config) => {
      let token = TokenMgr.get('localhost:3001')
      alert(config.url)
      if (token) {
        config.header.token = 'Bearer' + ' ' + token
      }
      return config
    }, (error) => {
      return Promise.reject(error)
    })

    axios.interceptors.response.use((response) => {
      // alert(response.header.token)
      if (response.data && response.data.token) {
        TokenMgr.add(response.config.url, response.data.token)
      }
      // if (response.body)
      
    }, (error) => {
      return Promise.reject(error)
    })
  }
}
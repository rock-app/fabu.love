import TokenMgr from '../mgr/TokenMgr'
const axios = require('axios')

export default class BaseApi {
  
  static init (router) {
    axios.interceptors.request.use((config) => {
      var token = TokenMgr.get(config.baseURL + config.url)
      if (token) {
        config.headers.Authorization = 'Bearer' + ' ' + token
      }
      return config
    }, (error) => {
      return Promise.reject(error)
    })

    axios.interceptors.response.use((response) => {
      if (response.data && response.data.token) {
        TokenMgr.add(response.config.url, response.data.token)
      }
      return response
    }, (error) => {
      return Promise.reject(error)
    })
  }
}
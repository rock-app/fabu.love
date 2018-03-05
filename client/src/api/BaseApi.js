import TokenMgr from '../mgr/TokenMgr'
const axios = require('axios')

export default class BaseApi {
  
  static init (router) {
    // axios.interceptors.request.use((config) => {
    //   var token = TokenMgr.get('http://localhost:3001/api/applist')
    //   if (token) {
    //     config.headers.token = 'Bearer' + ' ' + token
    //   }
    //   return config
    // }, (error) => {
    //   return Promise.reject(error)
    // })

    axios.interceptors.request.use(function (config) {
      var token = TokenMgr.get('http://localhost:3001/api/applist')
      if (token) {
        config.headers.Authorization = 'Bearer' + ' ' + token
      }
      return config
    }, function (errpr) {
      return Promise.reject(error)
    })

    axios.interceptors.response.use((response) => {
      // alert(response.header.token)
      if (response.data && response.data.token) {
        TokenMgr.add(response.config.url, response.data.token)
      }
      return response
    }, (error) => {
      return Promise.reject(error)
    })
  }
}
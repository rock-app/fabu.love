import axios from 'axios'

export default class LoginApi {
  
  static baseURL = 'http://localhost:3001/'

  static login(userName, password) {
    return axios.post(this.baseURL + 'api/login', {
      userName: userName,
      password: password
    })
  }

  static register(userName, password) {
    return axios.post(this.baseURL + 'api/register', {
      userName: userName,
      password: password
    })
  }

}
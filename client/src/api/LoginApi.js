import axios from 'axios'

export default class LoginApi {

  static baseURL = 'http://localhost:3001/'

  static login(username, password) {
    return axios.post(this.baseURL + 'api/login', {
      username: username,
      password: password
    })
  }

static register(username, password) {
    return axios.post(this.baseURL + 'api/register', {
      username: username,
      password: password
    })
  }
}

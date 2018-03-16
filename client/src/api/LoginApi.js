import axios from 'axios'

export default class LoginApi {

  static baseURL = 'http://localhost:3008/'

  static login(username, password) {
    this.configAxios()
    return axios.post(this.baseURL + 'api/user/login', {
      username: username,
      password: password
    })
  }

  static register(username, password, email) {
    this.configAxios()
    return axios.post(this.baseURL + 'api/user/register', {
      username: username,
      password: password,
      email: email
    })
  }

  static configAxios() {
    axios.defaults.headers.common['Content-Type'] = 'application/json'
  }
}

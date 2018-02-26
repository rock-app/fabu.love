import Vue from 'vue'
let vue = new Vue()

export function getHttp (url, params) {
  return new Promise((resolve, reject) => {
    vue.axios.get(url, {params: params})
      .then(response => {
        setTimeout(() => {
          resolve(response.data)
        }, 300)
      })
      .catch(error => {
        reject(error.message)
      })
  })
}

export function postHttp (url, body, params) {
  return new Promise((resolve, reject) => {
    vue.axios({
      method: 'post',
      url: url,
      params: params,
      data: body
    }).then(response => {
      setTimeout(() => {
        resolve(response.data)
      }, 300)
    }).catch(error => {
      console.log('error...')
      console.log(error)
      reject(error.message)
    })
  })
}

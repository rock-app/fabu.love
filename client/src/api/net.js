import { postHttp } from './basehttp'

export function login () {
  let url = `api/signin`
  let body = {
    name: 'koa',
    password: '12345'
  }
  return postHttp(url, body)
}

export function getAppList (params, body) {
  let url = '/api/applist'
  return postHttp(url, body, params)
}






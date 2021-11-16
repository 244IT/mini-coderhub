import ChhRequest from './baseNetwork'
import { networkConfig } from './config.js'
const { baseURL, timeout } = networkConfig
const chhRequest = new ChhRequest({
  timeout,
  baseURL,
  requestInterceptor() {
    console.log('类请求拦截')
  },
  responseInterceptor() {
    console.log('类响应拦截')
  }
})

export {
  chhRequest
}
import { chhRequest } from './networkInstance'

export const getMomentList = (params) => {
  return chhRequest.post({
    url: '/moment/list',
    data: params,
    requestInterceptor() {
      console.log('/moment/list实例请求拦截')
    },
    responseInterceptor() {
      console.log('/moment/list实例响应拦截')
    }
  })
}

export const getLabelList = (params) => {
  return chhRequest.post({
    url: `/label`,
    data: params,
    requestInterceptor() {
      console.log('/label实例请求拦截')
    },
    responseInterceptor() {
      console.log('/label实例响应拦截')
    }
  })
}
import { chhRequest } from './baseNetworkInstance'

export const getMomentList = (params) => {
  return chhRequest.post({
    url: '/moment/list',
    data: params,
    handleConflict: true, // 开启请求冲突处理
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
      // console.log('/label实例请求拦截')
    },
    responseInterceptor() {
      // console.log('/label实例响应拦截')
    }
  })
}
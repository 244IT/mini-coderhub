import { chhRequest } from './baseNetworkInstance'

export const getMomentList = (params) => {
  return chhRequest.get({
    url: '/moment/list',
    data: params,
    handleConflict: true, // 开启请求冲突处理
  })
}
export const getLabelList = (params) => {
  return chhRequest.get({
    url: `/label`,
    data: params,
  })
}
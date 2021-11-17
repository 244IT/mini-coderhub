
class ChhRequest{
  static requestTask = []
  constructor(config) {
    this.config = config
  }
  // 实例请求方法
  request(config) {
    // 请求拦截
    ChhRequest.globalRequestInterceptor()
    this.config.requestInterceptor && this.config.requestInterceptor()
    config.requestInterceptor && config.requestInterceptor()
    // 返回Promise实例
    return new Promise((resolve, reject) => {
      ChhRequest.baseRequest({
        ...this.config,
        ...config,
        success: (res) => {
          // console.log(res)
          // 响应拦截
          ChhRequest.globalResponseInterceptor(res)
          this.config.responseInterceptor && this.config.responseInterceptor(res)
          config.responseInterceptor && config.responseInterceptor(res)
          // 结果返回
          resolve(res.data)
        },
        fail: (err) => {
          reject(err)
          console.log(err)
        },
      })
    })
  }
  get(config) {
    return this.request({ ...config, method: "GET" })
  }
  post(config) {
    return this.request({ ...config, method: "POST" })
  }
  
  static baseRequest(config) {
    const requestInstance = wx.request({
      url: config.baseURL + config.url,
      timeout: config.timeout || 60000,
      method: config.method || 'GET',
      header: config.header || {},
      data: config.data,
      success(res) {
        config.success && config.success(res)
      },
      fail(err) {
        config.fail && config.fail(err)
      },
      complete() {
        // 从待完成请求列表中删除
        ChhRequest.removeRequest(config)
      }
    })
    if(config.handleConflict) {
      // 如果在待完成请求列表中找到相同url，先删除后终止
      const index = this.requestTask.findIndex(item => item.url === config.url)
      if(index > -1) {
        this.requestTask[index].requestInstance.abort()
        this.requestTask.splice(index, 1)
      }
    }
    // 加入待完成请求列表
    this.requestTask.push({ requestInstance, url: config.url})
  }
  static globalRequestInterceptor() {
    console.log('全局请求拦截')
  }
  static globalResponseInterceptor() {
    console.log('全局响应拦截')
  }
  static removeRequest(config) {
    const { requestTask } = ChhRequest
    const index = requestTask.findIndex(item => item.url === config.url)
    if(index > -1) {
      requestTask.splice(index, 1)
    }
  }
}

export default ChhRequest
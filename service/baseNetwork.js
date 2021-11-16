
class ChhRequest{
  constructor(config) {
    this.instance = {}
    this.config = config
    this.instance.requestInterceptor = config?.requestInterceptor
    this.instance.responseInterceptor = config?.responseInterceptor
  }
  // 实例请求方法
  request(config) {
    console.log('全局请求拦截')
    this.instance.requestInterceptor && this.instance.requestInterceptor()
    config.requestInterceptor && config.requestInterceptor()
    this.instance.requestTask = new Promise((resolve, reject) => {
      ChhRequest.baseRequest({
        ...this.config,
        ...config,
        success: (res) => {
          console.log(res)
          // 响应拦截
          console.log('全局响应拦截')
          this.instance.responseInterceptor && this.instance.responseInterceptor()
          config.responseInterceptor && config.responseInterceptor()
          resolve(res.data)
        },
        fail: (err) => {
          console.log(err)
          reject(err)
          console.log('网络错误')
        },
      })
    })
    return this.instance
  }
  get(config) {
    return this.request({ ...config, method: "GET" })
  }
  post(config) {
    return this.request({ ...config, method: "POST" })
  }

  static baseRequest(config) {
    console.log('baseRequest')
    console.log(config)
    wx.request({
      url: config.baseURL + config.url,
      timeout: config.timeout || 60000,
      header: config.header || {},
      data: config.data,
      success(res) {
        config.success && config.success(res)
      },
      fail(err) {
        config.fail && config.fail(err)
      }
    })
  }
}

export default ChhRequest
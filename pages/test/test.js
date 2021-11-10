// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: '', // 用户名
    cartId: '', // 密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onLogin() {
    const { tel, cartId } = this.data
    console.log('跳转物业缴费')
    console.log('身份证号：' + cartId )
    console.log('手机号：' + tel)
    const path = `pages/property/property?cid=30&tel=${tel}&cartId=${cartId}`
    wx.navigateToMiniProgram({
      appId: 'wx16c11bc34e06caa5',
      path,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'trial',
      success(res) {
        // 打开成功
      }
    })
  }
})
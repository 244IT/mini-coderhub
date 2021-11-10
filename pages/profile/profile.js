// pages/profile/profile.js
const app = getApp()


Page({

 /* -----------------------页面的初始数据---------------------- */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._initData()
  },
  onShow() {
    if(app.globalData.userUpdate) {
      console.log('更新用户信息')
      this._initData()
      app.globalData.userUpdate = false
    }
  },
  /* --------------------------------页面事件------------------------------ */
  /* 点击退出登录 */
  onLogout() {
    wx.removeStorageSync('userInfo')
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },
  /* 点击头部 */
  onHeader() {
    const { userInfo } = this.data
    if(userInfo) {
      wx.navigateTo({
        url: `/pages/profile/childPages/userInfo/userInfo?userInfo=${JSON.stringify(userInfo)}`,
      })
    }else {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },
  /* 页面跳转 */
  toUrl(res) {
    const { url } = res.currentTarget.dataset
    wx.navigateTo({ url, })
  },
  /* ---------------------------------页面方法----------------------------- */
  /* 初始化数据 */
  _initData() {
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo) {
      this.setData({
        userInfo
      })
    }
  }
})
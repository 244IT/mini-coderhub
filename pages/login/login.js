/* 登陆页脚本 @author: chh */
import { login } from '../../service/api'
import { showToast } from '../../utils/util'

const app = getApp()
Page({
  /**
   * -----------------------页面的初始数据------------------------
   */
  data: {
    username: '', // 用户名
    password: '', // 密码
    checked: false, // 默认不记住密码
  },
  /* -------------------------页面声明周期---------------------- */
  onLoad() {
    this._initData()
  },
  /* -------------------------页面事件------------------------- */
  /* 路由跳转 */
  toUrl(res) {
    const { url } = res.currentTarget.dataset
    wx.navigateTo({ url, })
  },
  /* 点击登录 */
  onLogin() {
    const { username, password } = this.data
    if(!username) {
      showToast('请输入用户名')
      return
    }
    if(!password) {
      showToast('请输入密码')
      return
    }
    this.login()
  },
  /* 点击记住密码 */
  onCheck() {
    this.setData({
      checked: !this.data.checked
    })
  },
  /* ------------------------网络请求------------------------------ */
  async login() {
    const { username, password, checked } = this.data
    const params = {
      name: username,
      password
    }
    const result = await login(params)
    console.log(result)
    // 存储用户信息
    showToast('登录成功')
    app.globalData.userInfo = result.data
    wx.setStorageSync('userInfo', result.data)
    wx.setStorageSync('username', username)
    if(checked) {
      wx.setStorageSync('password', password)
    }else {
      wx.removeStorageSync('password')
    }
    // 跳转首页
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /* --------------------------------------页面方法-------------------------------------- */
  /* 初始化数据 */
  _initData() {
    console.log('初始化数据')
    const password = wx.getStorageSync('password')
    const username = wx.getStorageSync('username')
    console.log(username)
    if(password) {
      this.setData({
        password,
        username,
        checked: true
      })
      return
    }
    this.setData({
      username
    })
  }
})
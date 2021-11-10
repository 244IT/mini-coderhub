// pages/register/register.js
import { register } from '../../../../service/api'
import { showToast } from '../../../../utils/util'
import Validate from '../../../../models/validateModel'
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    username: '', // 用户名
    password: '', // 密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /* ----------------------------页面事件----------------------------- */
  /* 点击注册 */
  onRegister() {
    const { username, password } = this.data
    const validate = new Validate()
    validate.add(username, 'checkEmpty')
    validate.add(password, 'checkEmpty')
    console.log(validate)
    validate.check()
    // if(!username) {
    //   showToast('请输入用户名')
    //   return
    // }
    // if(!password) {
    //   showToast('请输入密码')
    //   return 
    // }
    // this.register()
  },
  /* ----------------------------网络请求----------------------------- */
  /* 用户注册接口 */
  async register() {
    const { username, password } = this.data
    const params = {
      name: username,
      password
    }
    await register(params)
    // 存储用户信息
    showToast('注册成功')
    wx.navigateBack()
  },
})
import { updatePassword } from '../../../../service/api'

import { assignParams, showToast } from '../../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword: '',
    newPassword: '',
    againPassword: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /* ---------------------------------页面事件---------------------- */
  /* 点击确认修改 */
  onConfirm() {
    // 参数校验
    if(this._checkParams()) return
    // 发起请求
    this.updatePassword()
  },
  /* ---------------------------------网络请求---------------------- */
  /* 修改密码 */
  async updatePassword() {
    const { oldPassword, newPassword } = this.data
    const params = {
      password: oldPassword,
      newPassword: newPassword,
    }
    const result = await updatePassword(params)
    console.log(result)
    showToast('修改成功')
    this._initParams()
  },

  /* ---------------------------------页面方法---------------------- */
  /* 初始化参数 */
  _initParams() {
    this.setData({
      newPassword: '',
      againPassword: '',
      oldPassword: '',
    })
  },
  /* 参数校验 */
  _checkParams() {
    const { oldPassword, newPassword, againPassword } = this.data
    if(!oldPassword) {
      showToast('请输入旧密码')
      return true
    }
    if(!newPassword) {
      showToast('请输入新密码')
      return true
    }
    if(!againPassword) {
      showToast('请再次输入新密码')
      return true
    }
    if(newPassword !== againPassword) {
      showToast('两次输入的新密码不相同')
      return true
    }
    if(newPassword === oldPassword) {
      showToast('新密码和旧密码相同')
      return true
    }
  }
})
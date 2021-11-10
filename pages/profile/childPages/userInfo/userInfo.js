// pages/profile/childPages/userInfo/userInfo.js
import { updateUserInfo } from '../../../../service/api'
import { networkConfig } from '../../../../service/config'
import { showToast } from '../../../../utils/util'
const { baseURL } = networkConfig
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    isShowDialog: false, // 是否显示模态框
    dialogInfo: {}, // 模态框信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._initData(options)
  },
  /* --------------------------页面事件------------------------------- */
  /* 点击头像 */
  onImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        this._uploadImg(res.tempFilePaths[0]) //调用上传方法
      }
    })
  },
  /* 点击设置昵称或者签名 */
  onUserInfo(res) {
    const { type } = res.currentTarget.dataset
    let dialogInfo
    if(type === '0') { // 昵称
      dialogInfo = {
        placeholder: '(你是张三还是李四?...)',
        title: '请输入昵称',
        key: 'name',
      }
    }else {
      dialogInfo = {
        placeholder: '请展示你风骚的签名...',
        title: '请输入签名',
        key: 'sign'
      }
    }
    this.setData({
      dialogInfo,
      isShowDialog: true
    })
  }, 
  /* 修改用户信息：昵称，签名 */
  setUserInfo(res) {
    const { value } = res.detail
    this.setData({
      ['dialogInfo.value']: value
    })
  },
  /* 点击提交 */
  onSetUserInfo() {
    const { key, value, title } = this.data.dialogInfo
    console.log(key, value, title)
    if(!value) {
      showToast(title)
      return
    }
    this.updateUserInfo(key, value)
  },
  /* 关闭模态框 */
  onFork() {
    this.setData({
      isShowDialog: false
    })
  },
  /* --------------------------网络请求------------------------------ */
  /* 修改用户信息 */
  async updateUserInfo(key, value) {
    const params = {
      [key]: value
    }
    await updateUserInfo(params) 
    showToast('修改成功')

    this.setData({
      [`userInfo.${key}`]: value,
      ['dialogInfo.value']: '',
      isShowDialog: false,
    })
    app.globalData.userUpdate = true
    app.globalData.userInfo[key] = value
    wx.setStorageSync('userInfo', app.globalData.userInfo)
  },
  /* --------------------------页面方法------------------------------ */
  /* 初始化数据 */
  _initData(options) {
    const userInfo = JSON.parse(options.userInfo)
    this.setData({
      userInfo
    })
  },
  /* 上传图片到服务器 */
  _uploadImg (imgurl) {
    const { token } = wx.getStorageSync('userInfo')
    wx.uploadFile({
      url: baseURL + '/upload/avatar',// 上传路径
      filePath: imgurl,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': token
      },  
      name: 'avater',
      success: (res) => {
        const { avatar_url } = this.data.userInfo
        // if(avatar_url) {
        //   showToast('修改头像成功')
        // }else {
        //   showToast('上传头像成功')
        // }
        showToast('上传头像成功')
        const result = JSON.parse(res.data)
        this.setData({
          ['userInfo.avatar_url']: result.data.avatar_url
        })
        app.globalData.userUpdate = true
      }
    })
  },

})
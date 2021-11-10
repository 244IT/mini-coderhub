// pages/edit/edit.js
import { createMoment, updateMoment, getLabelList, setMomentLabels } from '../../service/api'
import { ListModel } from '../../models/listModel'
import { showToast } from '../../utils/util'
import { networkConfig } from '../../service/config'

const app = getApp()
const { baseURL } = networkConfig
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 10,
    labelList: [], // 标签列表
    selectLabel: {
      name: '选择标签'
    },
    title: '', // 帖子标题
    content: '', // 帖子内容
    imgList: [], // 图片列表
    momentId: '', // 动态id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 初始化数据
    this._initData(options)
    // 获取标签列表
    this.getLabelList()
  },

  /* ----------------------------------页面事件------------------------------------- */
  /* 选择标签 */
  onLabel(res) {
    console.log(res)
    const { value } = res.detail
    this.setData({
      selectLabel: this.data.labelList[value]
    })
  },
  /* 点击发布帖子 */
  onSubmit() {
    const { title, content } = this.data
    if(!title){
      showToast('请输入帖子标题')
      return
    }
    if(!content) {
      showToast('请输入帖子内容')
      return
    }
    if(!this.data.momentId) {
      // 新增帖子
      this.createMoment()
    }else {
      // 修改帖子
      this.updateMoment()
    }
  },
  /* 点击上传图片 */
  onUpload() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        const { imgList } = this.data
        imgList.push(res.tempFilePaths[0])
        this.setData({
          imgList
        })
        // this._uploadImg(res.tempFilePaths[0]) //调用上传方法
      }
    })
  },
  /* 预览图片 */
  onImage(res) {
    const { url } = res.currentTarget.dataset
    wx.previewImage({
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  /* ----------------------------------网络请求-------------------------------------- */
  /* 新增动态 */
  async createMoment() {
    const { title, content, imgList, selectLabel } = this.data
    const params = {
      title,
      content
    }
    const result = await createMoment(params)
    const { momentId } = result.data
    this.setData({
      momentId
    })
    // 对帖子新增标签
    console.log('添加标签')
    if(selectLabel.name !== '选择标签') {
      await this.setMomentLabels()
    }
    // 上传动态图片
    imgList.forEach(item => {
      this._uploadImg(item, momentId)
    })
    showToast('发布成功')
    // 修改全局仓库
    const userInfo = wx.getStorageSync('userInfo')
    userInfo.avatar = userInfo.avatar_url
    userInfo.userName = userInfo.name
    app.globalData.store[0].selectList.unshift({
      momentId,
      content,
      updateTime: '',
      createTime: '',
      title,
      author: userInfo,
      commentCount: 0,
      favorCount: 0,
      images: imgList,
      labelList: [ selectLabel.name ]
    })
    app.globalData.store[0].selectStatus = 3
    const timer = setTimeout(() => {
      wx.navigateBack()
      clearTimeout(timer)
    }, 2000)
  },
  /* 修改动态 */
  async updateMoment() {
    const { title, content, momentId, imgList, momentInfo, selectLabel } = this.data
    const params = {
      title,
      content
    }
    console.log('修改111')

    // 修改了内容
    if(momentInfo.title !== title || momentInfo.content !== content) {
      await updateMoment(params, momentId)
    }
    // 修改了标签
    if(!momentInfo.labelList || (momentInfo.labelList[0] !== selectLabel.name)) {
      console.log('修改标签')
      await this.setMomentLabels()
    }
    // 修改动图
    imgList.forEach(async item => {
      await this._uploadImg(item, momentId)
    })
    showToast('修改成功')
  },
  /* 获取标签列表 */
  async getLabelList(isRefresh = false) {
    const { size } = this.data
    const page = 1
    const params = {
      page,
      size
    }
    const result = await getLabelList(params)
    
    ListModel.handleResult(this, { result })
             .assignData(this, { result,  listName: 'labelList' })
             .stopRefresh(isRefresh)
    console.log(this.data.labelList)
  },
  /* 帖子添加标签 */
  async setMomentLabels() {
    const { momentId } = this.data
    const params = {
      labels: this.data.selectLabel.name
    }
    console.log(params.labels, typeof params.labels)
    const result = await setMomentLabels(params, momentId)
    console.log(result) 
  },
  /* --------------------------------页面方法------------------------------- */
  /* 初始化数据 */
  _initData(options) {
    if(options.momentInfo) {
      wx.setNavigationBarTitle({ 
        title: '修改帖子'
      })
      const momentInfo = JSON.parse(options.momentInfo)
      this.setData({
        title: momentInfo.title,
        content: momentInfo.content,
        momentId: momentInfo.momentId,
        ['selectLabel.name']: momentInfo.labelList ? momentInfo.labelList.join() : '选择标签',
        imgList: momentInfo.images || [],
        momentInfo, // 原始的动态信息
      })
    }
  },
   /* 上传动态配图到服务器 */
   _uploadImg (imgurl, momentId) {
    const { token } = wx.getStorageSync('userInfo')
    wx.uploadFile({
      url: baseURL + '/upload/picture?momentId=' + momentId,// 上传路径
      filePath: imgurl,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': token
      },  
      name: 'picture',
      success: (res) => {
      }
    })
  },
  /* 重置参数 */
  _initParams() {
    this.setData({
      imgList: [],
      title: '',
      content: '',
      ['selectLabel.name']: '',
      momentId: '',
    })
  }
})
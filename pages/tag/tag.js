// pages/tag/tag.js
import { getLabelList, followLabel, getUserLabelList } from '../../service/api'
import { ListModel } from '../../models/listModel'

import { showToast } from '../../utils/util'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labelList: [], // 标签列表
    userLabelList: [], // 用户关注的标签列表
    tabIndex: '0', // tab索引
    tabLeft: [88, 460], 
    page: 0, // 全部标签页数
    subPage: 0, // 用户标签页数
    size: 10, // 页大小
    listHeight: [], // 标签列表高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // 初始化数据
    this._initData()
    // 获取标签列表
    await this.getLabelList()
    // 获取用户关注的标签列表
    await this.getUserLabelList()
  },

  /* ------------------------------页面事件---------------------- */
  /* 点击tag切换 */
  onTag(res) {
    const { index } = res.currentTarget.dataset
    const oldIndex = this.data.tabIndex
    if(oldIndex === index) return
    this.setData({
      tabIndex: index,
    })

  },
  /* 左右滑动swiper */
  changeTab(res) {
    console.log(res)
    const { current } = res.detail
    this.setData({
      tabIndex: String(current),
    })
  },
  /* 监听swiper滑动距离 */
  transitionTab(res) {
    // console.log('transitionTab')
    // console.log(res)
  },
  /* 点击关注，已关注 */
  onFollow(res) {
    const { id, index } = res.currentTarget.dataset
    this.followLabel(id, index)
  },
  /* 下拉刷新 */
  onPullDownRefresh() {
    const { tabIndex } = this.data
    if(tabIndex === '0') {
      this._initParams('labelList')
      this.getLabelList(true)
    }else {
      this._initParams('userLabelList')
      this.getUserLabelList(true)
    }
  },
  /* ----------------------------------网络请求------------------------------- */
  /* 获取标签列表 */
  async getLabelList(isRefresh = false) {
    const { size, userId } = this.data
    const page = ++this.data.page
    const params = {
      page,
      size,
      id: userId
    }

    const result = await getLabelList(params)

    ListModel.handleResult(this, { result, showLine: true })
             .assignData(this, { result,  listName: 'labelList' })
             .stopRefresh(isRefresh)
    /* 计算标签列表高度 */
    this._height(0)
  },
  /* 获取用户关注的标签列表 */
  async getUserLabelList(isRefresh = false) {
    const { size } = this.data
    const page = ++this.data.subPage 
    const params = {
      page,
      size,
    }
    const result = await getUserLabelList(params)
    ListModel.handleResult(this, { result })
             .assignData(this, { result,  listName: 'userLabelList' })
             .stopRefresh(isRefresh)
    /* 计算标签列表高度 */
    this._height(1)
  },
  /* 关注，取消关注标签 */
  async followLabel(labelId, itemIndex) {
    const params = {
      labelId
    }
    const result = await followLabel(params)
    // 提示
    // showToast(result.message)

    const { labelList, userLabelList, tabIndex } = this.data
    let labelStore = app.globalData.store[1]
    // 关注成功处理
    if(result.message === '关注成功') {  
      // labelList 项修改follow
      const currentItem = labelList[itemIndex] 
      currentItem.follow = 1
      // 计算应该插入的userLabelList的位置
      if(!userLabelList.some(item => item.name === currentItem.name)) {
        let insertIndex = currentItem.id
        for(let i = 0; i < userLabelList.length; i++) {
          if(insertIndex < userLabelList[i].id) {
            insertIndex = i
            break
          }
        }
        userLabelList.splice(insertIndex, 0, currentItem)
      }
      this.setData({
        labelList,
        userLabelList
      })
      // 全局仓库数据修改
      labelStore.selectList = userLabelList
      labelStore.selectStatus = 2
      return 
    }
    // 取消关注处理
    if(tabIndex === '1') {
      // userLabelList[itemIndex].follow = 0
      const index = labelList.findIndex(item => item.name === userLabelList[itemIndex].name)
      labelList[index].follow = 0
      userLabelList.splice(itemIndex, 1)
    }else {
      labelList[itemIndex].follow = 0
      const index = userLabelList.findIndex(item => item.name === labelList[itemIndex].name)
      userLabelList.splice(index, 1)
    } 
    this.setData({
      labelList,
      userLabelList
    })
    // 全局仓库数据修改
    labelStore.selectList = userLabelList
    labelStore.selectStatus = 3
  },
  /* --------------------------------------页面方法------------------------------------ */
  /* 初始化数据 */
  _initData() {
    const { id } = wx.getStorageSync('userInfo')
    this.setData({
      userId: id
    })
  },
  /* 初始化参数 */
  _initParams(name) {
    if(name === 'labelList') {
      this.data.page = 0
    }else {
      this.data.subPage = 0
    }
    this.setData({
      [name]: [],
      hasMore: true,
    })
  },

  /* 计算标签的高度 */
  _height(index) {
    const query = wx.createSelectorQuery();
    query.select('.list').boundingClientRect()
    query.exec((res) => {
      console.log('获取元素高度')
      console.log(res)
      if(res[0] && res[0].height) {
        this.setData({
          [`listHeight[${index}]`]: res[0].height
        })
      }  
    })
  },
})
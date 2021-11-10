// pages/profile/childPages/momentList/momentList.js
import { navigateTo, showToast } from '../../../../utils/util'
import { ListModel } from '../../../../models/listModel'
import { getFavorMomentList, getCollectMoment, getFootprint } from '../../../../service/api'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    momentList: [], // 帖子列表
    page: 0,
    size: 10,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化数据
    this._initData(options)
  },

  /* --------------------------------页面事件------------------------------- */
  /* 下拉刷新 */
  onPullDownRefresh() {
    this.data.page = 0
    this.setData({
      momentList: [],
      hasMore: true
    })
    // 重新获取数据
    this._getList()
  },
  /* 上拉加载 */
  onReachBottom() {
    if(this.data.hasMore) {
      this.getFavorMomentList()
    }
  },
  /* 跳转详情 */
  toDetail(res) {
    console.log(res)
    const { item } = res.currentTarget.dataset
    console.log('跳转详情')
    app.globalData.store[0].selectItem = item
    navigateTo(`/pages/detail/detail`)
  },
  /* --------------------------------网络请求-------------------------------- */
  /* 获取用户点赞的帖子 */
  async getFavorMomentList(isRefresh = false) {
    const { size } = this.data
    const page = ++this.data.page
    const params = {
      page,
      size
    }
    const result = await getFavorMomentList(params)
    console.log(result)
    ListModel.handleResult(this, { result, showLine: true })
             .assignData(this, { result,  listName: 'momentList' })
             .stopRefresh(isRefresh)
    console.log(this.data.momentList)
  },
  /* 获取用户的浏览记录 */
  async getFootprint(isRefresh = false) {
    console.log('111')
    const { size } = this.data
    const page = ++this.data.page
    const params = {
      page,
      size
    }
    const result = await getFootprint(params)
    console.log(result)
    ListModel.handleResult(this, { result, showLine: true })
             .assignData(this, { result,  listName: 'momentList' })
             .stopRefresh(isRefresh)
  },
  /* 获取用户收藏夹下的文章 */
  async getCollectMoment(id, isRefresh = false) {
    const params = {
      collectionId: id
    }
    const result = await getCollectMoment(params)
    this.setData({
      momentList: result.data
    })
    if(isRefresh) {
      showToast('刷新成功')
      wx.stopPullDownRefresh()
    }
  },  
  /* ------------------------------------页面方法--------------------------------------- */
  /* 初始化数据 */
  _initData(option) {
    console.log(option)
    switch(option.type) {
      case '1': 
        this.getFavorMomentList()
        break;
      case '2':
        this.getCollectMoment(option.id)
        this._initTitle(option.name)
        this.setData({ collectionId: option.id, })
        break;
      case '3':
        this.getFootprint()
        this._initTitle('阅读过的文章')
        break;
    }
    this.setData({
      type: option.type
    })
  },
  /* 初始化标题 */
  _initTitle(name) {
    // 头部标题
    wx.setNavigationBarTitle({ title: name })
  },
  /* 根据类型获取列表 */
  _getList() {
    const { type, collectionId } = this.data
    switch(type) {
      case '1': 
        this.getFavorMomentList(true)
        break;
      case '2':
        this.getCollectMoment(collectionId, true)
        break;
      case '3':
        this.getFootprint(true)
        break;
      default: 
        this.getFavorMomentList(true)
    }
  }

})
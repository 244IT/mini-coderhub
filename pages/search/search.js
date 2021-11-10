// pages/search/search.js
import { getMomentList } from '../../service/api'

import { ListModel } from '../../models/listModel'
import { showToast, navigateTo } from '../../utils/util'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordList: [], // 历史搜索列表
    q: '', // 搜索值
    momentList: [], // 帖子列表
    isShowList: false, // 是否开始搜索
    page: 0, // 请求页数
    hasMore: true, // 是否还有更多
  },

  /* ------------------------------生命周期函数---------------------------------- */
  onLoad: function (options) {
    // 初始化数据
    this._initData()
  },

  /* ---------------------------------页面事件----------------------------------- */
  /* 点击搜索 */
  onConfirm(res) {
    const { value } = res.detail
    if(!value) {
      showToast('请输入搜索关键字...')
      return
    }

    // 获取当前缓存中的搜索列表
    let words = wx.getStorageSync('q')
    if(!words) {
      words = []
    }
    
    // 如果缓存中没有当前搜索的关键字，则添加
    const has = words.includes(value)
    if(!has) {
      if(words.length >= 10) {
        words.pop()
      }
      words.unshift(value)
      // 存储
      wx.setStorageSync('q', words)
    }
    // 初始化参数
    if(this.data.momentList.length > 0) {
      this._initParams()
    }
    // 搜索动态
    this.getMomentList(value)
    // 显示列表
    this.setData({
      wordList: words,
      isShowList: true,
      q: '',
    })
  },
  /* 点击取消 */
  onCancel() {
    wx.navigateBack()
  },
  /* 点击删除 */
  onDelete() {
    console.log('点击删除')
    this.setData({
      q: '',
      isShowList: false,
    })
  },
  /* 跳转详情 */
  toDetail(res) {
    console.log(res)
    const { item } = res.currentTarget.dataset
    console.log('跳转详情')
    app.globalData.store[0].selectItem = item
    navigateTo(`/pages/detail/detail`)
  },
  /* 点击历史搜索tag */
  onTag(res) {
    const { value } = res.currentTarget.dataset
    // 初始化参数
    if(this.data.momentList.length > 0) {
      this._initParams()
    }
    // 获取动态列表
    this.getMomentList(value)
    this.setData({
      isShowList: true,
    })
  },
  /* 下拉刷新 */
  onPullDownRefresh() {
    // 初始化数据
    this._initParams()
    // 重新获取数据
    this.getMomentList()
  },
  /* 上拉加载 */
  onReachBottom() {
    const { hasMore } = this.data
    if(hasMore) {
      this.getMomentList()
    }
  },
  /* ---------------------------------------网络请求-------------------------------------- */
  /* 搜索动态 */
  async getMomentList(keyword, isRefresh = false) {
    console.log(getMomentList.toString())
    // 参数收集
    const size = 10,
          page = ++this.data.page
    const params = {
      size,
      page,
      keyword
    }
    // 发送请求，获取结果
    const result = await getMomentList(params)
    
    console.log(result)
    // 结果处理
    ListModel.handleResult(this, { result, showLine: true })
             .assignData(this, { result,  listName: 'momentList' })
             .stopRefresh(isRefresh)
  },
  /* ---------------------------------------页面方法-------------------------------------- */
  /* 初始化数据 */
  _initData() {
    const wordList = wx.getStorageSync('q')
    this.setData({
      wordList
    })
  },
  /* 初始化帖子列表 */
  _initParams() {
    this.data.hasMore = true
    this.data.page = 0
    this.setData({
      momentList: []
    })
  },
})
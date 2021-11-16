/* 接口 */
import { getMomentList, getLabelList, getMomentByLabel } from '../../service/api'
import * as API from '../../service/baseApi'
/* 工具库 */
import { navigateTo } from '../../utils/util'
/* 模型 */
import { ListModel } from '../../models/listModel'
import { debounce } from '../../models/clickModel'
/* 状态管理 */
import { listenStore } from '../../store/index'

const app = getApp()

Page({ 
  data: {
    momentList: [], // 帖子列表
    labelList: [], // 标签列表
    page: 0, // 文章页数
    size: 10, 
    hasMore: true, // 是否还有更多
    tabIndex: 0, // 激活的标签
    selectLabelId: 0, // 选择的标签id
    showLoading: false, // 显示加载 

    skeleton: {
      showMomentList: false, // 骨架屏：显示帖子列表
      showLabelList: false, // 骨架屏：显示标签列表
      loading: true, // 骨架屏：显示骨架
    },
  },
  /* ----------------------------------页面生命周期--------------------------------- */
  onLoad() {
    this.getMomentListApi()
    this.getLabelListApi()
    // 获取帖子列表
    this.getMomentList()
    // 获取标签列表
    this.getLabelList()
  },
  onShow() {
    // 监听全局状态
    listenStore(this)
  },
  /* ----------------------------------页面事件---------------------------------- */
  /* 跳转详情 */
  toDetail(res) {
    const { item, index } = res.detail

    // 保存选择的列表项信息和索引
    app.globalData.store[0].selectItem = item
    app.globalData.store[0].selectIndex = index

    navigateTo(`/pages/detail/detail`)
  },
  /* 下拉刷新 */
  onPullDownRefresh() {
    const { selectLabelId } = this.data
    this._initParams('momentList')
    if(selectLabelId !== 0) {
      this.getMomentByLabel(selectLabelId, true)
      return
    }
    // 重新获取帖子数据
    this.getMomentList(true)
  },
  /* 上拉加载 */
  onReachBottom() {
    const { selectLabelId, hasMore } = this.data
    if(hasMore) {
      if(selectLabelId !== 0) {
        this.getMomentByLabel(selectLabelId)
        return
      }
      this.getMomentList()
    }
  },
  /* 跳转页面 */
  toUrl(res) {
    const { url, type } = res.detail
    if(type) {
      wx[`${type}`]({
        url: url
      })
      return
    }
    app.globalData.store[0].selectList = this.data.momentList
    navigateTo(url)
  },
  /* 点击tab */
  onTab(res) {
    const { id, index } = res.detail
    const { tabIndex } = this.data
    if(tabIndex == index) return
    this.setData({
      tabIndex: index,
      selectLabelId: id,
    })
    this._initParams('momentList')
    if(id !== 0) {
      // 获取标签下的动态
      this.getMomentByLabel(id)
      return
    }
    // 获取全部动态
    this.getMomentList()
  }, 
  /* 跳转标签管理 */
  toTag() {
    debounce(function() {
      console.log(111)
    }, 2000)
  },
  /* ----------------------------------网络请求---------------------------------- */
  /* 获取帖子列表 */
  async getMomentList(isRefresh = false) {
    const { size } = this.data
    const page = ++this.data.page
    const params = {
      page,
      size
    }
    const result = await getMomentList(params)
    setTimeout(() => {
      ListModel.handleResult(this, { result, showLine: true })
               .assignData(this, { result,  listName: 'momentList', isRefresh })
               .stopRefresh(isRefresh)
      this.setData({
        ['skeleton.showMomentList']: true,
        showLoading: false
      })  
      this._listenList()
    }, 500)      
  },
  /* 获取帖子列表重构版 */
  async getMomentListApi() {
    const { size } = this.data
    const page = ++this.data.page
    const params = {
      page,
      size
    }
    const result = await API.getMomentList(params)
    console.log(result)
  },
  /* 获取标签列表重构版 */
  async getLabelListApi() {
    const { id } = wx.getStorageSync('userInfo')
    const { size } = this.data
    const page = 1
    let params = {
      page,
      size
    }
    // 如果用户有登录，添加用户id获取用户关注的标签
    if(id) {
      params.id = id
    }
    const result = await API.getLabelList(params)
    console.log(result)
  },
  /* 获取标签列表 */
  async getLabelList(isRefresh = false) {
    const { id } = wx.getStorageSync('userInfo')
    const { size } = this.data
    const page = 1
    let params = {
      page,
      size
    }
    // 如果用户有登录，添加用户id获取用户关注的标签
    if(id) {
      params.id = id
    }
    const result = await getLabelList(params)

    setTimeout(() => {
      ListModel.handleResult(this, { result, showLine: true })
               .assignData(this, { result,  listName: 'labelList', isRefresh })
               .stopRefresh(isRefresh)
      let { labelList } = this.data
      if(id) {
        labelList = labelList.filter(item => item.follow)
      }
      labelList.unshift({
        id: 0,
        name: '全部'
      })
      this.setData({
        labelList,
        ['skeleton.showLabelList']: true
      })
      this._listenList()
    }, 200)
  },

  /* 获取指定标签下的帖子 */
  async getMomentByLabel(labelId, isRefresh = false) {
    // 参数收集
    const { size } = this.data
    const page = ++this.data.page
    const params = {
      page,
      size
    }
    // 发送请求，获取结果
    const result = await getMomentByLabel(params, labelId)
    // 结果处理
    setTimeout(() => {
      ListModel.handleResult(this, { result, showLine: true })
               .assignData(this, { result,  listName: 'momentList', isRefresh })
               .stopRefresh(isRefresh)
      this.setData({
        showLoading: false
      })
    }, 500) 
  },
  /* --------------------------------------页面方法-------------------------------------- */
  /* 初始化帖子列表 */
  _initParams(tableName) {
    this.data.page = 0
    this.setData({
      showLoading: true,
      [tableName]: [],
      hasMore: true
    })
  },
  /* 监听动态（帖子修改操作） */
  _listenStore() {
    
  },
  /* 监听列表 */
  _listenList() {
    const { showLabelList, showMomentList } = this.data.skeleton
    if(showLabelList && showMomentList) {
      this.setData({
        ['skeleton.loading']: false
      })
    }
  }
})
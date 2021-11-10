// pages/profile/childPages/momentList/momentList.js
import { navigateTo, showToast } from '../../../../utils/util'
import { ListModel } from '../../../../models/listModel'
import { getMomentListByUser, deleteMoment } from '../../../../service/api'

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
    // 获取用户发布的帖子
    this.getMomentListByUser()
  },

  /* --------------------------------页面事件------------------------------- */
  /* 上拉刷新 */
  onPullDownRefresh() {
    this.data.page = 0
    this.setData({
      momentList: [],
      hasMore: true
    })
    // 重新获取数据
    this.getMomentListByUser(true)
  },
  /* 下拉加载 */
  onReachBottom() {
    if(this.data.hasMore) {
      this.getMomentListByUser()
    }
  },
  /* 点击编辑帖子 */
  onEdit(res) {
    const { index } = res.currentTarget.dataset
    const momentInfo = this.data.momentList[index]
    wx.navigateTo({
      url: `/pages/edit/edit?momentInfo=${JSON.stringify(momentInfo)}`,
    })
  },
  /* 点击删除帖子 */
  onDelete(res) {
    const { index } = res.currentTarget.dataset
    const momentInfo = this.data.momentList[index]
    wx.showModal({
      title: '提示',
      content: '确定要删除这条帖子吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteMoment(momentInfo.momentId, index)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
  /* --------------------------------网络请求-------------------------------- */
  /* 获取用户发布的帖子 */
  async getMomentListByUser(isRefresh = false) {
    const { size } = this.data
    const page = ++this.data.page
    const params = {
      page,
      size
    }
    const result = await getMomentListByUser(params)
    console.log(result)
    ListModel.handleResult(this, { result, showLine: true })
             .assignData(this, { result,  listName: 'momentList' })
             .stopRefresh(isRefresh)
    console.log(this.data.momentList)
  },
  /* 删除帖子 */
  async deleteMoment(momentId, index) {
    const result = await deleteMoment(momentId)
    console.log(result)
    showToast('删除帖子成功')
    const { momentList } = this.data
    momentList.splice(index, 1)
    this.setData({
      momentList
    })
  }
  /* --------------------------------页面方法-------------------------------- */
})
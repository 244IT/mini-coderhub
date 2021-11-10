// pages/profile/childPages/collectionList/index.js
import { getCollectionList, removeCollection, renameCollection } from '../../../../service/api'
import { showToast } from '../../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList: [], // 收藏夹列表
    username: '', // 用户名
    isShowDialog: false, // 是否显示模态框
    collection: '', // 新的收藏夹名称
    collectionIndex: '', // 收藏夹索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._initData()
    this.getCollectionList()
  },
  onRenameCollection() {
    const { collectionIndex, collection, collectionList } = this.data
    // 获取原名
    const oldName = collectionList[collectionIndex].name
    this.renameCollection(oldName, collection, collectionIndex)
  },
  /* ------------------------------------页面事件--------------------------------- */
  /* 跳转 */
  toUrl(res) {
    const { url } = res.currentTarget.dataset
    wx.navigateTo({ url, })
  },
  /* 编辑收藏夹 */
  onEdit(res) {
    const { collectionId, index } = res.currentTarget.dataset
    wx.showActionSheet({
      itemList: ['删除', '编辑'],
      success: (res) => {
        console.log(res)
        if(res.tapIndex === 0) {
          // 删除
          this.removeCollection(collectionId, index)
        }else{
          // 编辑
          this.toggleDialog()
          this.setData({
            collectionIndex: index
          })
        }
      }
    })
  },
  /* 开关编辑模态框 */
  toggleDialog() {
    this.setData({
      isShowDialog: !this.data.isShowDialog
    })
  },
  /* 下拉刷新 */
  async onPullDownRefresh() {
    // 重新获取数据
    await this.getCollectionList()
    showToast('刷新成功')
    wx.stopPullDownRefresh()
  },
  
  /* ------------------------------------网络请求--------------------------------- */
  /* 获取收藏夹列表 */
  async getCollectionList() {
    const result = await getCollectionList() 
    console.log('收藏夹列表')
    console.log(result)
    this.setData({
      collectionList: result.data
    })
  },
  /* 用户删除收藏夹 */
  async removeCollection(collectionId, index) {
    const result = await removeCollection({ collectionId })
    console.log(result)
    showToast('删除成功')
    // 更新视图
    this._updateRemoveView(index)
  },
  /* 用户收藏夹重命名 */
  async renameCollection(oldName, collection, collectionIndex) {
    const params = {
      name: oldName,
      collection
    }
    const result = await renameCollection(params)
    console.log(result)
    showToast('修改成功')
    // 更新视图
    this._updateRenameView(collection, collectionIndex)
    // 关闭模态框
    this.toggleDialog()
  },
  /* -----------------------------------页面方法--------------------------------- */
  /* 初始化数据 */
  _initData() {
    const username = wx.getStorageSync('userInfo').name
    this.setData({
      username
    })
  },
  /* 更新删除收藏集视图 */
  _updateRemoveView(index) {
    const { collectionList } = this.data
    collectionList.splice(index, 1)
    this.setData({
      collectionList
    })
  },
  /* 更新重命名视图 */
  _updateRenameView(collection, index) {
    this.setData({
      [`collectionList[${index}].name`]: collection
    })
  }
})
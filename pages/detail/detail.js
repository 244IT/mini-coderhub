import { level4Img,  } from '../../assets/base64/img'
import { 
  getMomentDetail, 
  getCommentList, 
  setComment, 
  replyComment, 
  favorMoment, 
  favorComment, 
  getCollectionList, 
  collectMoment, 
  addCollection, 
  addFootprint 
} from '../../service/api'
import { getTime, showToast, } from '../../utils/util'

const app = getApp()
Page({
  data: {
    level4Img,
    inputPlaceholder: '输入评论...',
    momentId: '', // 动态id
    momentDetail: {}, // 动态详情
    commentList: [], // 评论列表
    commentType: 0, // 评论类型：0，对动态评论、1：对评论回复
    inputFocus: false, // 表单聚焦
    selectComment: '', // 在哪个评论下的回复
    selectReplyComment: '', // 回复哪条评论
    selectCommentIndex: '', // 选择的评论的数组索引
    comment: '', // 输入的评论
    showCollect: false, // 是否显示收藏夹列表
    collectionList: [], // 收藏夹列表
    isShowDialog: false, // 是否显示新建收藏夹模态框
    collection: '', // 新建的收藏夹名称
  },

  /* ---------------------------------页面生命周期--------------------------------- */
  onLoad(options) {
    this._initData(options)
    // 获取动态详情
    this.getMomentDetail()
    // 获取评论列表
    this.getCommentList()
    
  },
  /* -----------------------------------页面事件------------------------------------- */
  /* 点击底部评论按钮 */
  onComment() {
    this.setData({
      inputFocus: true
    })
  },
  /* 用户对帖子进行点赞,取消点赞 */
  onFavor() {
    this.favorMoment()
  },
  /* 用户对评论进行点赞,取消点赞 */
  onFavorComment(res) {
    const { commentId, index } = res.currentTarget.dataset
    this.favorComment(commentId, index)
  },
  /* 对动态发表评论 */
  onSetComment(res) {
    const { value } = res.detail
    const { commentType, selectComment, selectReplyComment } = this.data
    if(commentType === 0) {
      this.setComment(value)
    }else if(commentType === 1) {
      this.replyComment(value, selectComment, selectReplyComment)
    }
   
  },
  /* 对评论进行回复 */
  onReplyComment(res) {
    console.log('回复评论')
    console.log(res.currentTarget.dataset)
    const { commentId, user, index, replyCommentId } = res.currentTarget.dataset
    this.setData({
      commentType: 1,
      inputFocus: true,
      selectComment: commentId,
      selectReplyComment: replyCommentId ? replyCommentId : commentId,
      inputPlaceholder: '回复' + user,
      selectCommentIndex: index,
    })
  },
  /* 对评论下的某人进行回复 */
  onReplyUser(res) {
    console.log('回复评论下的某人')
    const { commentId, user, index, replyCommentId } = res.currentTarget.dataset
    this.setData({
      commentType: 1,
      inputFocus: true,
      selectComment: commentId,
      selectReplyComment: replyCommentId,
      inputPlaceholder: '回复' + user,
      selectCommentIndex: index,
    })
  },

  /* 预览图片 */
  onImage(res) {
    const { url } = res.currentTarget.dataset
    wx.previewImage({
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  /* 跳转页面 */
  toUrl(res) {
    const { url, type } = res.detail
    wx[`${type}`]({
      url: url
    })
  },

  /* 点击遮罩层 */
  async toggleCollect() {
    const { momentDetail } = this.data
    if(momentDetail.isCollect) {
      // 取消收藏文章
      this.collectMoment()
      return
    } 
    // 获取用户的收藏夹列表
    await this.getCollectionList()
    this.setData({
      showCollect: !this.data.showCollect
    })
  },
  /* 收藏文章 */
  onCollect(res) {
    const { collectionId } = res.currentTarget.dataset
    this.collectMoment(collectionId)
  },

  /* 关闭模态框 */
  toggleDialog() {
    this.setData({
      isShowDialog: !this.data.isShowDialog
    })
  },
  /* 点击新建收藏夹 */
  onAddCollection() {
    const { collection } = this.data
    if(!collection) {
      showToast('请输入收藏夹名称')
      return
    }
    this.addCollection(collection)
  },
  /* -----------------------------------网络请求------------------------------------- */
  // 获取动态详情
  async getMomentDetail() {
    const momentId = this.data.momentId
    const uid = wx.getStorageSync('userInfo').id || ''
    const result = await getMomentDetail({momentId, uid})
    this.setData({
      momentDetail: result.data
    })
 
  },
  /* 获取评论列表 */
  async getCommentList() {
    const { momentId } = this.data
    const uid = wx.getStorageSync('userInfo').id || ''
    const result = await getCommentList({momentId, uid})
    this.setData({
      commentList: result.data
    })
  },
  /* 对动态发表评论 */
  async setComment(content) {
    const { momentId } = this.data
    const params = {
      momentId,
      content
    }
    const result = await setComment(params)

    showToast('评论成功')
    // 添加一条评论记录
    const { commentId } = result.data
    const { commentList, momentDetail } = this.data
    const user = wx.getStorageSync('userInfo')
    user.avatar = user.avatar_url
    const replyTime = ''
    commentList.unshift({
      content,
      commentId,
      user,
      replyTime,
      favorCount: 0,
      replyCount: 0
    }) 

    // 当前页面视图更改
    momentDetail.commentCount += 1
    // 全局动态信息修改
    let { selectItem } = app.globalData.store[0]
    selectItem.commentCount += 1
    app.globalData.store[0].selectStatus = 1

    this.setData({
      momentDetail,
      commentList,
      comment: ''
    })
  },
  /* 对评论回复评论 */
  async replyComment(content, commentId, replyCommentId) {
    const { momentId } = this.data
    const params = {
      content,
      momentId,
      replyCommentId: commentId
    }
    const result = await replyComment(params, replyCommentId)
    showToast('回复评论成功')

    // 添加一条回复评论记录
    const returnReplyCommentId = result.data.commentId
    const { commentList, selectCommentIndex } = this.data
    console.log(commentList[selectCommentIndex])
    const replyCommentList = commentList[selectCommentIndex].replyList ?  commentList[selectCommentIndex].replyList : []
    const user = wx.getStorageSync('userInfo')
    user.avatar = user.avatar_url
    const replyTime = ''

    console.log(replyCommentList)
    replyCommentList.push({
      content,
      commentId: returnReplyCommentId,
      user,
      replyTime
    }) 
    this.setData({
      [`commentList[${selectCommentIndex}].replyList`]: replyCommentList
    })
  },

  /* 点赞，取消点赞动态 */
  async favorMoment() {
    // 参数收集
    const { momentId } = this.data
    const params = {
      momentId,
    }
    // 发送请求获取结果
    const result = await favorMoment(params)
    // 提示
    // showToast(result.message)
    // 修改动态的点赞视图
    this._updateMomentFavorView(result.message)
  },

  /* 点赞，取消点赞评论 */
  async favorComment(commentId, index) {
    // 参数收集
    const params = {
      commentId,
    }
    // 发送请求获取结果
    const result = await favorComment(params)
    // showToast(result.message)
    // 修改点赞的评论项视图
    this._updateCommentFavorView(result.message, index)
  },

  /* 获取用户的收藏夹列表 */
  async getCollectionList() {
    const result = await getCollectionList() 
    console.log('收藏夹列表')
    console.log(result)
    this.setData({
      collectionList: result.data
    })
  },
  /* 收藏，取消收藏文章 */
  async collectMoment(collectionId) {
    const uid = wx.getStorageSync('userInfo').id
    const { momentId } = this.data
    const params = {
      collectionId,
      momentId,
      uid,
    }
    const result = await collectMoment(params)
    console.log('收藏，取消收藏')
    console.log(result)
    showToast(result.message)
    let isCollect = 0
    if(result.message === '收藏成功') {
      isCollect = 1 
    }
    this.setData({
      ['momentDetail.isCollect']: isCollect,
      showCollect: false
    })
  },
  /* 用户添加收藏夹 */
  async addCollection(collection) {
    const params = {
      collection
    }
    const result = await addCollection(params)
    console.log(result)
    showToast(result.message)
    const { collectionList } = this.data
    const userInfo = wx.getStorageSync('userInfo')
    collectionList.unshift({
      uid: userInfo.id, 
      collectionId: result.data.collectionId,
      name: collection,
      momentCount: 0
    })
    this.setData({
      isShowDialog: false,
      collectionList
    })
  },
  /* 添加浏览记录 */
  async addFootprint() {
    const { momentId } = this.data 
    const result = await addFootprint({ momentId })
    console.log(result)
  },
  /* --------------------------------页面方法----------------------------------- */
  /* 初始化数据 */
  _initData(options) {
    const { momentId, title } = app.globalData.store[0].selectItem
    const userInfo = wx.getStorageSync('userInfo')
    console.log('用户：' )
    console.log(userInfo, typeof userInfo)
    this.setData({
      momentId
    })
    // 头部标题
    wx.setNavigationBarTitle({ title })

    if(userInfo) {
      // 添加浏览记录（如果用户有登录）
      this.addFootprint()
    }
    
  },
  /* 修改点赞的动态底部视图 */
  _updateMomentFavorView(message) {
    const { momentDetail } = this.data
    let { selectItem } = app.globalData.store[0]
    console.log(momentDetail)
    if(message === '点赞成功') {
      momentDetail.isFavor = 1
      momentDetail.favorCount += 1
      // 全局动态信息修改
      selectItem.favorCount += 1
    }else {
      momentDetail.isFavor = 0
      momentDetail.favorCount -= 1
      // 全局动态信息修改
      selectItem.favorCount -= 1
    }
    // 添加修改标识
    app.globalData.store[0].selectStatus = 1
    this.setData({
      momentDetail
    })
  },
  // 修改点赞的评论项视图
  _updateCommentFavorView(message, index) {
    const { commentList } = this.data
    const currentComment = commentList[index]
    if(message === '点赞成功') {
      currentComment.isFavor = 1
      currentComment.favorCount += 1
    }else {
      currentComment.isFavor = 0
      currentComment.favorCount -= 1
    }
    this.setData({
      [`commentList[${index}].isFavor`]:  currentComment.isFavor,
      [`commentList[${index}].favorCount`]: currentComment.favorCount,
    })
  },
})
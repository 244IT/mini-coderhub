/* 列表通用类 @author: chh */
import { showToast } from '../utils/util'

export class ListModel{
  constructor() {}
  /* 结果处理 */
  static handleResult(that, options) {
    if(options.result.data.length === 0) {  
      that.data.hasMore = false
      if(that.data.pageNo !== 1) {
        that.setData({
          hasMore: false
        })
        // 如果不是展示底线，需要弹窗提示
        if(!options.showLine) {
          showToast('已经没有数据了')
        }
      }
    } 
    return this
  }
  /* 合并参数 */
  static assignData(that, options) {
    const list = that.data[options.listName]
    if(options.isNew) {
      that.setData({
        [options.listName] : options.result.data
      })
    }else {
      list.push(...options.result.data)
      that.setData({
        [options.listName] : list
      })
    }
    return this
  }
  /* 停止刷新:只在刷新情况下触发 */
  static stopRefresh(isRefresh) {
    if(isRefresh) {
      wx.stopPullDownRefresh({
        success: (res) => {
          showToast('刷新成功')
        },
      })
    }
    return this
  }
  /* 初始化列表参数 */
  static initParams(that, listName) {
    that.data.page = 0
    that.setData({
      hasMore: true,
      [listName]: []
    })
  }
}
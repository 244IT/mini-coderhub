/* 全局状态管理 */
class Store{
  constructor() {
    this.store = [ // 全局仓库
      { 
        selectItem: {}, // 当前选择的动态（帖子）
        selectIndex: 0, // 当前选择的帖子索引
        selectStatus: 0, // 操作状态，0：无操作，1：修改，2：删除, 3:新增
        selectTitle: 'moment', // 列表名
        selectList:  []
      },
      { selectItem: {}, selectIndex: 0, selectStatus: 0, selectTitle: 'label', selectList:  [] } // 标签
    ]
  }
  /* 监听状态改变 */
  listenStore(that) {
    getApp().globalData.store.forEach((item, index) => {
      const { selectIndex, selectStatus, selectTitle, selectItem, selectList } = item  
      // 修改操作
      if(selectStatus === 1) {
        const list = that.data[`${selectTitle}List`]
        console.log(list)
        list.splice(selectIndex, 1, selectItem)
        that.setData({
          [`${selectTitle}List`]: list
        })
        // 重置全局状态
        item.selectStatus = 0
      }
      // 删除操作 && 新增操作
      if(selectStatus === 2 || selectStatus === 3) {
        const list = JSON.parse(JSON.stringify(selectList))
        if(index === 1) {
          list.unshift({
            id: 0,
            name: '全部'
          })
        }
        that.setData({
          [`${selectTitle}List`]: list
        })
        // 重置全局状态
        item.selectStatus = 0
      }
    }) 
  }
}

module.exports = new Store()
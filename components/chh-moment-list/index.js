// components/chh-moment-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    momentList: {
      type: Array
    },
    hasMore: {
      type: Boolean
    },
    showLoading: {
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 点击跳转详情 */
    toDetail(res) {
      console.log('点击')
      const { item, index } = res.detail
      this.triggerEvent('toDetail', { item, index })
    }
  }
})

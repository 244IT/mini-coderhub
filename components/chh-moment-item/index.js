// components/chh-moment-list/chh-moment-.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    momentList: {
      type: Array,
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
    /* 跳转详情 */
    toDetail(res) {
      console.log('111')
      const { item, index } = res.currentTarget.dataset
      this.triggerEvent('toDetail', { item, index })
    }
  }
})

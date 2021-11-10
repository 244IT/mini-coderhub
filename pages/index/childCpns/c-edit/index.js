// pages/index/childCpns/c-edit/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    toUrl(res) {
      const { url } = res.currentTarget.dataset
      this.triggerEvent('toUrl', { url })
    },
  }
})

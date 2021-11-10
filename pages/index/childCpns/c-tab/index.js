// pages/index/childCpns/c-tab/c-tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    labelList: {
      type: Array
    },
    tabIndex: {
      type: Number
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
    /* 点击tab */
    onTab(res) {
      const { id, index } = res.currentTarget.dataset
      this.triggerEvent("onTab", { id, index })
    }
  }
})

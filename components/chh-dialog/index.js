/* 模态框组件脚本 @author: chh */

const app = getApp()
Component({
  externalClasses: ['dialog-class', 'mask-class'],
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isShowDialog: {
      type: Boolean,
      value: false //false关闭模态框 true开启模态框
    },
    top: {
      type: Number,
      value: 30
    },
    dialog: {
      type: String,
    },
    mask: {
      type: String,
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
    /* 点击确定 */
    onConfirm() {
      this.triggerEvent('onConfirm', {}, {})
    },
    /* 点击取消 */
    onCancel() {
      this.triggerEvent('onCancel', {}, {})
    },
    /* 点击遮罩层 */
    onHideModal() {
      this.triggerEvent('onHideModal', {}, {})
    }
  }
})
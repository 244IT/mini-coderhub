//app.js
import { store } from './store/index'
App({
  onLaunch: function(options) {
    this._getNavBarInfo()
  },
  globalData: {
    store, // 挂载全局状态
  },
  /* 获取导航栏相关信息 */
  _getNavBarInfo() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
    this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    this.globalData.menuHeight = menuButtonInfo.height;
    this.globalData.menuTop = menuButtonInfo.top
  }
})
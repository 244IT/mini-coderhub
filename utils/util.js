/* 获取当前时间 */
const getTime = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const secend = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${secend}`
}

/* 吐司 */
const showToast = (title, icon, duration) => {
  wx.showToast({
    title,
    duration: duration || 2000,
    icon: icon || 'none'
  })
}

/* 跳转 */
const navigateTo = (url) => {
  wx.navigateTo({ url, })
} 


export {
  showToast,
  navigateTo,
  getTime
}

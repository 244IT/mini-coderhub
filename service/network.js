/* 网络请求基础封装 @author: chh */
import { networkConfig } from './config.js'
import { showToast } from '../utils/util'

const { baseURL, timeout } = networkConfig

/**
 * 网络请求基础封装接口
 * @param {Object} options 传入的请求参数对象 
 * @param {String} title loading的标题，根据需求调整
 * @param {Boolean} openCheck 是否开启响应拦截验证
 * @return {void}
 * @author chh
 */
function request(options, title, openCheck = true) {
	// 显示loading
	if(title) {
		wx.showLoading({
			title
		})
	}
	// 请求头配置
	const header = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
	const { token } = wx.getStorageSync('userInfo')
	if(token) {
		header['authorization'] = token
	}
	return new Promise((resolve, reject) => {
		wx.request({
			url: baseURL + options.url,
			method: options.method || 'POST',
			timeout: timeout || 10000,
			data: options.data || {},
			header,
			success: (res) => {
				// 开启loading才需关闭
				if(title) {
					wx.hideLoading()
				}	
				// 响应拦截
				if(openCheck && res.data.status !== '10000') {
					if(res.data.status === 401) {
						showToast('请先登陆')
						wx.removeStorageSync('userInfo')
						const timer = setTimeout(() => {
							wx.reLaunch({
								url: '/pages/login/login',
							})
							clearTimeout(timer)
						}, 2000)
						return
					}
					showToast(res.data.message)
					return
				}
				resolve(res.data)
			},
			fail: (err) => {
				console.log(err)
				showToast('网络错误')
			},
		})
	})
}

export default request
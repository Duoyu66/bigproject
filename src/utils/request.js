import Vue from 'vue'
import axios from 'axios'
import {
	baseURL,
	contentType,
	contentType2,
	debounce,
	invalidCode,
	noPermissionCode,
	noPermissionRedirect,
	requestTimeout,
	successCode,
	tokenName,
	loginInterception,
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'
import {
	isArray
} from '@/utils/validate'

let loadingInstance

function baseMessage(msg, type) {
	if (document.getElementsByClassName('el-message').length === 0) {
		Vue.prototype.$baseMessage(msg, type);
	}
}
/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
	if (code) {

		switch (code) {
			case '0':
			case 0:
				break
			case invalidCode:
				baseMessage(`后端接口${code}异常` || msg, 'error');
				store.dispatch('user/resetAccessToken').catch(() => {})
				if (loginInterception) {
					location.reload()
				}
				break
			case noPermissionCode:
				if (noPermissionRedirect == 'login') {
					baseMessage(`${code}会话超时，请重新登陆` || msg, 'error');
					//Vue.prototype.$baseMessage(`${code}会话超时，请重新登陆` || msg, 'error')
					store.dispatch('user/resetAccessToken')
					router.push({
						path: '/login'
					}).catch(() => {})
				} else {
					router.push({
						path: '/401'
					}).catch(() => {})
				}
				break
			default:
				baseMessage(`后端接口${code}异常` || msg, 'error');
				//Vue.prototype.$baseMessage(`后端接口${code}异常` || msg, 'error')
				break
		}
	}

}

const instance = axios.create({
	baseURL,
	timeout: requestTimeout,
	headers: {
		'Content-Type': contentType,
	},
})

instance.interceptors.request.use(
	(config) => {
		if (store.getters['user/accessToken']) {
			config.headers[tokenName] = store.getters['user/accessToken']
		}
		if (config.method == 'post' || config.method == 'POST') {
			config.headers['Content-Type'] = contentType2
		}
		//这里会过滤所有为空、0、false的key，如果不需要请自行注释
		if (config.data)
			config.data = Vue.prototype.$baseLodash.pickBy(
				config.data,
				Vue.prototype.$baseLodash.identity
			)
		if (
			config.data &&
			config.headers['Content-Type'] ===
			'application/x-www-form-urlencoded; charset=UTF-8'
		)
			config.data = qs.stringify(config.data)
		if (debounce.some((item) => config.url.includes(item)))
			loadingInstance = Vue.prototype.$baseLoading()
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

instance.interceptors.response.use(
	(response) => {
		if (loadingInstance) loadingInstance.close()

		const {
			data,
			config
		} = response
		const {
			code,
			msg
		} = data

		// 操作正常Code数组
		const codeVerificationArray = isArray(successCode) ? [...successCode] : [...[successCode]];
		// 是否操作正常
		//其余接口无状态码
		if (!code || codeVerificationArray.includes(Number(code))) {
			return data
		} else {
			handleCode(code, msg)
			if (config.url == '/api/Login/Login') {
				return data
			} else {
				return Promise.reject(
					'vue-admin-beautiful请求异常拦截:' +
					JSON.stringify({
						url: config.url,
						code,
						msg
					}) || 'Error'
				)
			}

		}
	},
	(error) => {
		if (loadingInstance) loadingInstance.close()
		const {
			response,
			message
		} = error
		if (error.response && error.response.data) {
			const {
				status,
				data
			} = response
			handleCode(status, data.msg || message)
			return Promise.reject(error)
		} else {
			let {
				message
			} = error
			console.log(message)
			if (message === 'Network Error') {
				message = '后端接口连接异常'
			}
			if (message.includes('timeout')) {
				try {
					if (navigator.onLine) {
						message = '后端接口请求超时,如有数据保存请确认数据保存状态'
					} else {
						message = '网络断开,后端接口请求超时,如有数据保存请确认数据保存状态'
					}
				} catch (e) {
					message = '后端接口请求超时,如有数据保存请确认数据保存状态'
				}

			}
			if (message.includes('Request failed with status code')) {
				const code = message.substr(message.length - 3)
				message = '后端接口' + code + '异常'
			}
			if (Vue.prototype.$baseMessage) {
				baseMessage(message || `后端接口未知异常`, 'error');
				//Vue.prototype.$baseMessage(message || `后端接口未知异常`, 'error')
			} else if (Vue.prototype.$notify) {
				Vue.prototype.$notify({
					title: '提示',
					message: message || `后端接口未知异常`,
					type: 'error'
				});

			} else {
				console.log(message || `后端接口未知异常`, 'error')
			}

			return Promise.reject(error)
		}
	}
)

export default instance

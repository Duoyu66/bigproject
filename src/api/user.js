import loginrequest from '@/utils/loginrequest'
import request from '@/utils/request'
import {
	encryptedData
} from '@/utils/encrypt'
import {
	loginRSA,
	tokenName
} from '@/config'

export async function login(data) {
	if (loginRSA) {
		data = await encryptedData(data)
	}
	return request({
		url: '/api/Login/Login',
		method: 'post',
		data,
	})
	// return request({
	//   url: '/api/Login/Login',
	//   method: 'post',
	//   data,
	// })
}

export function getUserInfo(accessToken) {
	return request({
		url: '/userInfo',
		method: 'post',
		data: {
			[tokenName]: accessToken,
		},
	})
}

export function logout() {
	return request({
		url: '/logout',
		method: 'post',
	})
}

export function register() {
	return request({
		url: '/register',
		method: 'post',
	})
}

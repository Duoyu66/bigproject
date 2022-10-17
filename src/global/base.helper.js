import Vue from 'vue'
import axios from 'axios'
import sataic_variable from '../global/sataic_variable.vue'
import deshelper from '@/global/des.helper'
import {
	ZlibHelper,
	base64_arraybuffer_fob
} from '@/global/zlibHelper'
import {
	storage,
	tokenTableName
} from '@/config'
import {
	sql_helper
} from '@/global/sql_helper'
import {
	recordRoute
} from '@/config'

let sataic_var = sataic_variable.sataic_variable


export let LocalStorage = {
	//key ="gtwise",
	access_token: tokenTableName,
	user_info: 'user_info',
	GetSave: function() {
		if (storage) {
			if ('localStorage' === storage) {
				return localStorage
			} else if ('sessionStorage' === storage) {
				return sessionStorage
			} else {
				return localStorage
			}
		} else {
			return localStorage
		}
	},
	setItem: function(key, obj) {
		LocalStorage.GetSave().setItem(key, obj)
	},
	getItem: function(key) {
		return LocalStorage.GetSave().getItem(key)
	},
	getAccess:function(){
		return LocalStorage.GetSave().getItem(LocalStorage.access_token)
	},
	removeItemAccess: function() {
		LocalStorage.GetSave().removeItem(LocalStorage.access_token)
		return true
	},
}


function logout(res) {
	async function exec_fob() {
		let vueTHAT = Vue.prototype.ThisVue
		if (res.status == 401) {
			await vueTHAT.$store.dispatch('user/logout')
			vueTHAT.$baseMessage('登陆过期', 'error')
			if (recordRoute) {
				const fullPath = vueTHAT.$route.fullPath
				vueTHAT.$router.push(`/login?redirect=${fullPath}`)
			} else {
				vueTHAT.$router.push('/login')

			}
			return false
		} else {
			return true
		}
	}
	let bol = exec_fob()
	return bol
}



export default {
	LocalStorage
}

/*
 * 权限存储
 */
import {
	Notification
} from 'element-ui';
import {
	getRouterList
} from '@/api/router'

import Vue from 'vue'

import {
	TreeDataDealEx
} from '@/global/tree_deal'
const state = {
	permissions: [],
	routerList: [],
	CannotJumpClass: 'unclick'
}
const getters = {
	permissions: (state) => state.permissions,
	routerList: (state) => state.routerList,
	CannotJumpClass: (state) => state.CannotJumpClass,
}
const mutations = {
	setPermissions(state, permissions) {
		state.permissions = JSON.parse(JSON.stringify(permissions))
	},
	setRouterList(state, routerList) {
		state.routerList = JSON.parse(JSON.stringify(routerList))
	},
}
const actions = {
	async getRouterList({
		commit
	}) {
		return state.routerList;
	},
	async getPermission({
		commit
	}) {
		let {
			data
		} = await getRouterList()
		if (!data || data.length == 0) {
			Vue.prototype.$baseMessage(`未查询到任何权限...`, 'error')
		}

		function sortId(a, b) {
			return Number(a.level) - Number(b.level)
		}
		data.sort(sortId);

		function meta(item, key) {
			if (item[key]) {
				if (item.meta) {
					item.meta[key] = item[key]
				} else {
					item.meta = {}
					item.meta[key] = item[key]
				}
			}
		}
		let length = data.length - 1
		for (; length >= 0; length--) {
			try {
				let item = data[length]
				if (
					item.hasOwnProperty('org_status') &&
					item.org_status.toLowerCase() === 'true'
				) {
					item.org_status = true
				} else {
					item.org_status = false
				}
				if (item.hide && item.hide == '1') {
					item.hidden = true
				} else {
					item.hidden = false
				}
				if (item.noKeepAlive && item.noKeepAlive === 'true') {
					item.keepAlive = true
				} else {
					item.keepAlive = false
				}
				if (item.affix && item.affix === 'true') {
					item.affix = true
				} else {
					item.affix = false
				}
				meta(item, 'keepAlive')
				meta(item, 'title')
				meta(item, 'affix')
				if (item.icon) {
					item.icon = item.icon
						.replace('el-icon', '')
						.replace('-s-', '')
						.replace('fa fa-', '')
					if (item.icon.startsWith('-')) {
						item.icon = item.icon.replace('-', '')
					}
					console.log(item.icon)
					meta(item, 'icon')
				}
			} catch (e) {
				console.log(e)
			}

		}

		//保存权限
		commit('setPermissions', data)
		data = data.filter(function(s) {
			return s.type_name === '菜单' // 注：IE9(不包含IE9)以下的版本没有trim()方法
		})

		let treeData = TreeDataDealEx(data, 0, 'permission_id', 'parent_id')
		treeData.sort(sortId);
		console.log(treeData)
		commit('setRouterList', treeData)
		return treeData
	},
	setPermission({
		commit
	}) {
		commit('setPermissions', [])
	},
	GetALLPermissionByModel({
		commit
	}, model_name) {
		//查找所在数据
		let length = state.permissions.length - 1
		let item = {}
		let result = {}
		let falg = false
		for (; length >= 0; --length) {
			item = state.permissions[length]
			if (item.permission_name == model_name) {
				falg = true
				console.log('GetALLPermissionByModel', item)
				break
			}
		}
		if (!falg) {
			console.error('未找到对应权限')
			return false
		}

		function isEmptyObject(obj) {
			for (let key in obj) {
				return false
			}
			return true
		}
		if (isEmptyObject(JSON.parse(JSON.stringify(item)))) {
			console.error('empty item')
			return false
		}
		//寻找子节点
		function findChildren(permission_id, permission_name, deep) {
			if (!deep) {
				deep = 0
			}
			if (deep > 500) {
				return {}
			}
			let length_1 = state.permissions.length - 1
			let json = {}
			for (; length_1 >= 0; --length_1) {
				let item = state.permissions[length_1]
				if (item.parent_id === permission_id) {
					let children = findChildren(
						item.permission_id,
						item.permission_name,
						++deep
					)
					if (isEmptyObject(JSON.parse(JSON.stringify(children)))) {
						json[item.permission_name] = true
					} else {
						children.self = true
						json[item.permission_name] = children
					}
				}
			}
			return json
		}
		result = findChildren(item.permission_id, item.permission_name)
		result[model_name] = true
		if (isEmptyObject(result)) {
			console.log('empty result', result, model_name)
			return false
		}
		result.self = true
		return result
	},
	isCanJumpAndTips({
		commit
	}, element) {

		let flag = actions.isCanJump({
			commit
		}, element)
		if (!flag) {
			Notification.error({
				title: '错误',
				message: '无权限打开此页面，请联系管理员'
			});
		}
		return flag
	},
	isCanJump({
		commit
	}, element) {
		try {

			if (!element) {
				return false
			}
			let class_name = element.getAttribute('class')
			if (!class_name) {
				return true
			}
			class_name = class_name.split(' ')
			if (class_name.length == 0) {
				return true
			}
			if (class_name.indexOf(state.CannotJumpClass) >= 0) {
				return false
			}
			return true
		} catch (e) {
			console.log(e)
			Notification.error({
				title: '错误',
				message: e
			});
			return false
		}

	},
}
export default {
	state,
	getters,
	mutations,
	actions,
}

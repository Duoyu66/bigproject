/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import {
	asyncRoutes,
	constantRoutes
} from '@/router'
import {
	getRouterList
} from '@/api/router'
import {
	convertRouter,
	filterAsyncRoutes
} from '@/utils/handleRoutes'
import store from '@/store'
const state = {
	routes: [],
	partialRoutes: []
}
const getters = {
	routes: (state) => state.routes,
	partialRoutes: (state) => state.partialRoutes,
}
const mutations = {
	setRoutes(state, routes) {
		state.routes = constantRoutes.concat(routes)
	},
	setAllRoutes(state, routes) {
		state.routes = constantRoutes.concat(routes)
	},
	setPartialRoutes(state, routes) {
		state.partialRoutes = constantRoutes.concat(routes)
	},
}
const actions = {
	async setRoutes({
		commit
	}, permissions) {
		//开源版只过滤动态路由permissions，admin不再默认拥有全部权限
		const finallyAsyncRoutes = await filterAsyncRoutes(
			[...asyncRoutes],
			permissions
		)
		commit('setRoutes', finallyAsyncRoutes)
		return finallyAsyncRoutes
	},
	async setAllRoutes({
		commit
	}) {
		const d = 1
		let data = await store.dispatch(`permission/getPermission`)
		// let {
		// 	data
		// } = await getRouterList()
		let accessRoutes = data
		if (data && data.length > 0) {
			data.push({
				permission_id: "-1",
				parent_id: "0",
				path: '*',
				redirect: '/404',
				hidden: true
			})
			accessRoutes = convertRouter(accessRoutes)
		}
		commit('setAllRoutes', accessRoutes)
		return accessRoutes
	},
	setPartialRoutes({
		commit
	}, accessRoutes) {
		commit('setPartialRoutes', accessRoutes)
		return accessRoutes
	},
	async hasRoute({
		commit
	}, parameter) {
		if (!parameter) {
			return false
		}
		if (!parameter.name) {
			return false
		}
		if (!parameter.routeList) {
			parameter.routeList = await store.dispatch(`permission/getRouterList`)
		}
		if (!parameter.deep) {
			parameter.deep = 0;
		}
		if (parameter.deep > 100) {
			return false
		}
		let field = parameter.field;
		if (!field) {
			return false
		}
		let parentPath = '';
		if (parameter.parentPath && parameter.addParentPath) {
			if (parameter.parentPath == '//') {
				parentPath = '/';
			} else if ((parameter.parentPath == '/')) {
				parentPath = '/';
			} else {
				parentPath = parameter.parentPath
			}

		}
		let name = parameter.name
		let routeList = parameter.routeList

		if (!routeList) {
			return false
		}
		for (let i = 0; i < routeList.length; i++) {
			let value = '';
			if (parameter.addParentPath) {
				if (parentPath && routeList[i][field].startsWith('/')) {
					value = routeList[i][field].replace('/', '')
				} else {
					value = routeList[i][field]
				}
				value = parentPath + value

			} else {
				value = routeList[i][field]
			}
			if (value === name) {
				return true
			}

			if (routeList[i].children && routeList[i].children.length > 0) {
				let path = '';
				if (parameter.addParentPath) {
					path = parentPath + routeList[i].path + '/'
				}
				let flag = await store.dispatch(`routes/hasRoute`, {
					name: name,
					routeList: routeList[i].children,
					deep: ++parameter.deep,
					field: field,
					parentPath: path,
					addParentPath: parameter.addParentPath
				})
				if (flag) {
					return flag
				}
			}
		}
		return false
	},
	async hasRouteByPathEx({
			commit
		},
		parameter) {
		if (!parameter) {
			return false
		}
		if (!parameter.name) {
			return false
		}
		parameter.field = 'path'
		let flag = await store.dispatch(`routes/hasRoute`, parameter)
		return flag
	},
	async hasRouteByPathNoParentPath({
			commit
		},
		path) {
		let flag = await store.dispatch(`routes/hasRoute`, {
			name: path,
			field: 'path'
		})
	},
	async hasRouteByPath({
			commit
		},
		path) {
		let flag = await store.dispatch(`routes/hasRoute`, {
			name: path,
			addParentPath: true,
			field: 'path'
		})
		return flag
	},
	async autoJudge({
		commit
	}, to) {
		if (!to) {
			return false
		}
		if (to.path === '/login') {
			return true
		} else {
			let flag = await store.dispatch(`routes/hasRouteByPathEx`, {
				name: to.path,
				field: 'path',
				routeList: constantRoutes
			})
			if (flag) {
				return true
			}
			flag = await store.dispatch('routes/hasRouteByPath', to.path)
			if (flag) {
				return true
			}
		}
		return false
	}
}
export default {
	state,
	getters,
	mutations,
	actions
}

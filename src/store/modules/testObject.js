/*
 * 权限存储
 */
import {
	pageDeal,
	search_fob,
	update_fob,
	insert_fob,
	delete_fob,
	delete_from_fob,
	QueryExec_fob,
	QueryExec_fobEx,
	ExecSql_fob,
	delete_from_fobEx,
} from '@/global/form.helper'
import {
	getRouterList
} from '@/api/router'

import Vue from 'vue'

import {
	TreeDataDealEx
} from '@/global/tree_deal'

import store from '@/store'

async function roleJudg() {
	let role_max = await store.dispatch('user/getRoleMax')
	let type = -1;
	switch (role_max) {
		case 'super_admin':
			type = 0;
			break
		default:
			type = -1;
			break
	}
	return type
}
const state = {
	object_list: [],
	//key object_name
	object_json: {},
	object_tree: [],
	common_object_list: [],
	common_object_json: [],
	common_object_tree: [],
}
const getters = {
	object_list: (state) => state.object_list,
	object_json: (state) => state.object_json,
	common_object_list: (state) => state.common_object_list,
	common_object_json: (state) => state.common_object_json,
	common_object_tree: (state) => state.common_object_tree,
}
const mutations = {
	setObjectList(state, object_list) {
		state.object_list = JSON.parse(JSON.stringify(object_list))
	},
	setObjectJson(state, object_json) {
		state.object_json = JSON.parse(JSON.stringify(object_json))
	},
	setobjectTree(state, object_tree) {
		state.object_tree = JSON.parse(JSON.stringify(object_tree))
	},
	setCommonObjectList(state, common_object_list) {
		state.common_object_list = JSON.parse(JSON.stringify(common_object_list))
	},
	setCommonObjectTree(state, common_object_tree) {
		state.common_object_tree = JSON.parse(JSON.stringify(common_object_tree))
	},
	setCommonObjectJson(state, common_object_json) {
		state.common_object_json = JSON.parse(JSON.stringify(common_object_json))
	}
}
const actions = {
	async init({
		commit
	}) {
		try {
			await actions.initAll({
				commit
			})
			await actions.initCommon({
				commit
			})
		} catch (e) {
			console.log(e)
		}
		return -1

	},
	async initAll({
		commit
	}) {
		try {

			let sqlcode = 455
			let list = []
			let form = {}
			let {
				data
			} = await QueryExec_fob(sqlcode, list, form)
			if (!data || data.length == 0) {
				return 0
			}
			commit('setObjectList', data)
			let object_json = {}
			let object_id = ''
			data.forEach((e) => {
				object_id = e.object_id
				object_json[object_id] = e
			})
			commit('setObjectJson', object_json)
			let tree = TreeDataDealEx(data, 0, 'object_id', 'group_id', undefined, true)
			commit('setobjectTree', tree)
			return 1
		} catch (e) {
			console.log(e)
		}
		return -1
	},
	async initCommon({
		commit
	}) {
		try {
			let org_pid = store.getters['user/org_pid']
			let sqlcode = 467
			let list = [{
				field: 'org_pid',
				type: 3,
				level: 1,
			}]
			let form = {
				org_pid: org_pid
			}
			let {
				data
			} = await QueryExec_fob(sqlcode, list, form)
			if (!data || data.length == 0) {
				return 0
			}
			commit('setCommonObjectList', data)
			let object_json = {}
			let object_id = ''
			data.forEach((e) => {
				object_id = e.object_id
				object_json[object_id] = e
			})
			commit('setCommonObjectJson', object_json)
			let tree = TreeDataDealEx(data, 0, 'object_id', 'group_id', undefined, true)
			commit('setCommonObjectTree', tree)
			return 1
		} catch (e) {
			console.log(e)
		}
		return -1

	},
	async reInit({
		commit
	}) {
		return await actions.init({
			commit
		})
	},
	async GetListAll({
		commit
	}) {
		if (state.object_list.length == 0) {
			await actions.initAll({
				commit
			})
		}
		return state.object_list
	},
	async GetList({
		commit
	}) {
		if (state.object_list.length == 0) {
			await actions.initAll({
				commit
			})
		}
		if (state.common_object_json.length == 0) {
			await actions.initCommon({
				commit
			})
		}
		let type = await roleJudg()
		if (type == 0) {
			return state.object_list
		} else {
			return state.common_object_list
		}
	},
	async GetTreeAll({
		commit
	}) {
		if (state.object_list.length == 0) {
			await actions.initAll({
				commit
			})
		}
		return state.object_tree
	},
	async GetTree({
		commit
	}) {
		if (state.object_list.length == 0) {
			await actions.initAll({
				commit
			})
		}
		if (state.common_object_json.length == 0) {
			await actions.initCommon({
				commit
			})
		}
		let type = await roleJudg()
		if (type == 0) {
			return state.object_tree
		} else {
			return state.common_object_tree
		}
	},
	async GetJsonKeyObejctIdAll({
		commit
	}) {
		if (state.object_list.length == 0) {
			await actions.init({
				commit
			})
		}
		return state.object_json
	},
	async GetJsonKeyObejctId({
		commit
	}) {
		if (state.object_list.length == 0) {
			await actions.initAll({
				commit
			})
		}
		if (state.common_object_json.length == 0) {
			await actions.initCommon({
				commit
			})
		}
		let type = await roleJudg()
		if (type == 0) {
			return state.object_json
		} else {
			return state.common_object_json
		}

	},
	async GetOjectNameByIdReturnList({
		commit
	}, object_id) {
		let ObjectNameList = []
		try {
			let object_json = await actions.GetJsonKeyObejctId({
				commit
			})
			if (!object_id) {
				return ObjectNameList;
			}
			if (typeof object_id == 'object') {
				object_id = object_id
			} else if (typeof object_id == 'string') {
				object_id = object_id.split(',')
			} else {
				object_id = [object_id]
			}
			let item;
			let length = object_id.length
			for (let i = 0; i < length; i++) {
				item = object_id[i]
				let temp = object_json[item]
				if (!temp) {
					continue
				}
				ObjectNameList.push(temp.object_name)
			}
			return ObjectNameList
		} catch (e) {
			console.log(e)
		}
		return ObjectNameList;
	},
	async GetOjectNameByIdReturnStr({
		commit
	}, object_id) {
		try {
			let ObjectNameList = await actions.GetOjectNameByIdReturnList({
				commit
			}, object_id);
			if (ObjectNameList.length > 0) {
				return ObjectNameList.join(',')
			}
			return ''
		} catch (e) {
			console.log(e)
		}
		return ''
	},
	async GetOjectNameById({
		commit
	}, object_id) {
		try {
			let ObjectNameList = await actions.GetOjectNameByIdReturnList({
				commit
			}, object_id);
			if (ObjectNameList.length > 0) {
				return ObjectNameList[0]
			}
			return ''
		} catch (e) {
			console.log(e)
		}
		return ''

	}

}
export default {
	state,
	getters,
	mutations,
	actions,
}

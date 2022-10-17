/*
 * @Author: Mortar
 * @Date: 2021-03-20 16:18:03
 * @LastEditors: Mortar
 * @LastEditTime: 2021-03-20 16:55:10
 * @Description:
 * @FilePath: \母体实验室\src\store\modules\org.js
 */
import {
	sql_helper
} from '@/global/sql_helper'
import store from '@/store/index'
import Vue from 'vue'
import {
	getTreeList
} from '@/api/tree'
import {
	TreeDataDeal
} from '@/global/tree_deal.js'
const state = {
	org_table_type: 1, //0  Orgnization 1 cm_org_type
	//所有机构的名称和机构号
	org_all_cache: [],
	//当前人员所能看到的机构
	org_cache: [],
	//当前选中机构号
	current_org: -1,
	//当前选中机构号+子节点
	current_and_chrilren_org: '-1',
	org_type: '',
	mixDeviceId: '',
	currentTab: 'org',
}
const getter = {
	org_all_cache: (state) => state.org_all_cache,
	org_cache: (state) => state.org_cache,
	current_org: (state) => state.current_org,
	current_and_chrilren_org: (state) => state.current_and_chrilren_org,
	org_type: (state) => state.org_type,
	mixDeviceId: (state) => state.mixDeviceId,
	currentTab: (state) => state.currentTab,
}
const getters = {
	org_all_cache: (state) => state.org_all_cache,
	org_cache: (state) => state.org_cache,
	current_org: (state) => state.current_org,
	current_and_chrilren_org: (state) => state.current_and_chrilren_org,
	org_type: (state) => state.org_type,
	mixDeviceId: (state) => state.mixDeviceId,
	currentTab: (state) => state.currentTab,
}
const mutations = {
	setOrgAllCache(state, org_all_cache) {
		state.org_all_cache = org_all_cache
	},
	setOrgCache(state, org_cache) {
		state.org_cache = org_cache
	},
	setCurrent_org(state, current_org) {
		Vue.set(state, 'current_org', current_org)
		//state.current_org = current_org
	},
	setCurrent_and_chrilren_org(state, current_and_chrilren_org) {
		state.current_and_chrilren_org = current_and_chrilren_org
	},
	setOrgType(state, orgType) {
		state.org_type = orgType
	},
	setmixDeviceId(state, mixDeviceId) {
		state.mixDeviceId = mixDeviceId
	},
	setCurrentTab(state, currentTab) {
		state.currentTab = currentTab
	},
}
const actions = {
	async setCurrentTab({
		commit
	}, currentTab) {
		commit('setCurrentTab', currentTab);
	},
	async setCurrent_org({
		commit
	}, node) {
		try {
			//commit('setCurrent_org', node.id);
			let org_id = '';
      console.log('setCurrentnode', node);
			let array = new Array()
			const org_type = node.org_type
			switch (org_type) {
				case '拌合机':
					org_id = node.p_id;
					array.push(org_id)
					commit('setmixDeviceId', node.device_id);
					break
				default:
					commit('setmixDeviceId', '');
					org_id = node.org_id;
					const a = 1
					break
			}
			console.log('setCurrent_org', org_id);
			commit('setCurrent_org', org_id);
			commit('setOrgType', org_type);


			function findChirldren(node, deep) {
				if (!deep) {
					deep = 0
				}
				if (deep > 500) {
					return -1
				}
				let length = node.length
				while (--length >= 0) {
					//array.push(node[length].id);

					let org_type = node[length].org_type;
					let isContinue = false;
					switch (org_type) {
						case '拌合机':
							isContinue = true;
							break;
					}
					if (isContinue) {
						continue;
					}
					array.push(node[length].org_id)
					if (
						node[length].hasOwnProperty('children') &&
						node[length].children.length > 0
					) {
						findChirldren(node[length].children, deep + 1)
					}
				}
			}
			findChirldren([node]);
			console.log('setCurrent_org array', array);
			if (array.length > 1) {
				commit('setCurrent_and_chrilren_org', "'" + array.join("','") + "'")
			} else if (array.length > 0) {
				commit('setCurrent_and_chrilren_org', array[0])
			}else{
				commit('setCurrent_and_chrilren_org', '')
			}
			commit('setCurrentTab', 'org');
			await store.dispatch(`projectInfo/setCurrentTab`, 'org')
			console.log('state.mixDeviceId', state.mixDeviceId)

		} catch (e) {
			console.log(e)
		}
	},
	async SetOrgStore({
		commit
	}) {
		try {
			await store.dispatch('user/getUserInfo')
			let tree1 = await actions.GetOrgFromDataBase({
				commit
			})
			commit('setCurrent_org', store.getters['user/org_pid'])
			commit('setCurrent_and_chrilren_org', store.getters['user/org_pid'])
			return tree1
		} catch (e) {
			console.log(e)
			return []
		}
	},
	async GetOrgFromDataBase({
		commit
	}) {
		try {
			let sData, sqlcode, jsonlist, field;
			let roleMax = await store.dispatch('user/getRoleMax');
			let org_id = store.getters['user/org_pid'];
			console.log('roleMax', roleMax)
			switch (roleMax) {
				case 'super_admin':
					// if (state.org_table_type == 0) {
					// 	sqlcode = 1022;
					// } else {
					// 	sqlcode = 1031;
					// }
					// //sqlcode = 816;
					// // field = {
					// // 	org_id: org_id
					// // };
					// // jsonlist = [{
					// // 	field: 'org_id',
					// // 	type: 3,
					// // 	level: 1,
					// // }];
					// field = {};
					// jsonlist = [];
					// break;
				case 'admin':
				case 'user':
				default:
					sqlcode = 1054;
					field = {
						org_id: org_id,
            type_id: 1
					};
					jsonlist = [{
						field: 'org_id',
						type: 3,
						level: 1,
					},{
						field: 'type_id',
						type: 3,
						level: 2,
					}];
					break
			}
			sData = sql_helper.splicing_fob(1, sqlcode, jsonlist, field).sql;

			console.log('sData', sData)
			const orgdata = await getTreeList(sData)
			console.log('sData', orgdata)
			const tree1 = await TreeDataDeal(orgdata.data)
			commit('setOrgCache', tree1)
			return tree1
		} catch (e) {
			console.log(e)
			return []
		}
	},
	async GetOrgTreeAll({
		commit
	}) {
		if (!state.org_cache || state.org_cache.length === 0) {
			return await actions.SetOrgStore({
				commit
			})
		}
		return state.org_cache
	},
	async GetOrgTreeAllEx({
		commit
	}) {
		function formatDeptValue(arr) { //递归遍历树,得到新的树
			let result = []
			for (var i = 0; i < arr.length; i++) {
				const item = arr[i]
				let node = JSON.parse(JSON.stringify(item))
				node.label = item.name
				result.push(node)
				if (item.children && item.children.length > 0) {
					node.children = formatDeptValue(item.children)
				} else {
					node.children = undefined
				}
			}
			return result
		}
		return formatDeptValue(await actions.GetOrgTreeAll({
			commit
		}))
	},
	async GetOrgAllCache({
		commit
	}) {
		if (!state.org_all_cache || state.org_all_cache.length === 0) {
			let sqlcode = 0
			if (state.org_table_type == 0) {
				sqlcode = 342
			} else {
				sqlcode = 1028
			}
			let sData = sql_helper.splicing_fob(1, sqlcode, [], {}).sql; //'[Q]342{}|^SYS'
			const orgdata = await getTreeList(sData)
			const tree1 = await TreeDataDeal(orgdata.data)
			commit('setOrgAllCache', tree1)
		}
		console.log(state.org_all_cache)
		return JSON.parse(JSON.stringify(state.org_all_cache))
	},
	GetOrgNameByOrgIdSync({
		commit
	}, org_id) {

		if (!org_id) {
			return '';
		}
		if (typeof org_id == 'object') {
			org_id = org_id
		} else if (typeof org_id == 'string') {
			org_id = org_id.split(',')
		} else {
			org_id = [org_id]
		}

		function findOrg(node, org_id, deep) {
			if (!deep) {
				deep = 0
			}
			let length = node.length
			let ob = ''
			for (let i = 0; i < length; i++) {
				ob = node[i]
				if (ob.id == org_id) {
					return ob
				}
				if (
					ob.hasOwnProperty('children') &&
					ob.children.length > 0
				) {
					let temp = findOrg(ob.children, org_id, deep + 1)
					if (temp) {
						return temp
					}
				}
			}
			return null
		}
		let OrgNameList = []
		for (let i = 0; i < org_id.length; i++) {
			let temp = findOrg(state.org_all_cache, org_id[i])
			if (temp) {
				OrgNameList.push(temp.name)
			}
		}
		if (OrgNameList.length > 0) {
			return OrgNameList.join(',')
		}
		return ''
	},
	async GetOrgNameByOrgId({
		commit
	}, org_id) {
		if (!state.org_all_cache || state.org_all_cache.length === 0) {
			await actions.GetOrgAllCache({
				commit
			});
			// let sData = sql_helper.splicing_fob(1, 342, [], {}).sql; //'[Q]342{}|^SYS'
			// const orgdata = await getTreeList(sData)
			// const tree1 = await TreeDataDeal(orgdata.data)
			// commit('setOrgAllCache', tree1)
		}
		let orgName = actions.GetOrgNameByOrgIdSync({
			commit
		}, org_id)
		return orgName

	},
	async GetOrgType({
		commit
	}, org_id) {
		if (!state.org_all_cache || state.org_all_cache.length === 0) {
			await actions.GetOrgAllCache({
				commit
			});
		}
		console.log(state.org_all_cache)

		function findOrg(node, org_id, deep) {
			if (!deep) {
				deep = 0
			}
			let length = node.length
			let ob = ''
			for (let i = 0; i < length; i++) {
				ob = node[i]
				if (ob.id == org_id) {
					return ob
				}
				if (
					ob.hasOwnProperty('children') &&
					ob.children.length > 0
				) {
					let temp = findOrg(ob.children, org_id, deep + 1)
					if (temp) {
						return temp
					}
				}
			}
			return null
		}
		let item = findOrg(state.org_all_cache, org_id);
		console.log(item, org_id);
		if (item) {
			return item.org_type;
		}
		return '';
	},
	SearchOrg({
		commit
	}) {
		try {
			return tree1
		} catch (e) {
			console.log(e)
		}
	}
}
export default {
	state,
	getters,
	mutations,
	actions,
}

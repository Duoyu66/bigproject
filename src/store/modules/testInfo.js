/**
 * @author
 * @description 项目信息
 */
import {
	sql_helper
} from '@/global/sql_helper'
import {
	pageDeal,
	search_fob,
	update_fob,
	insert_fob,
	delete_fob,
	delete_from_fob,
	QueryExec_fob,
	QueryExecAndPage_fob,
	QueryExec_fobEx,
	ExecSql_fob,
	delete_from_fobEx,
} from '@/global/form.helper'
import store from '@/store'
const state = {
	primaryId: '',
	object_id: '',
  object_name: ''
}
const getter = {
	primaryId: (state) => state.primaryId,
	object_id: (state) => state.object_id,
  object_name: (state) => state.object_name,
}
const getters = {
	primaryId: (state) => state.primaryId,
	object_id: (state) => state.object_id,
  object_name: (state) => state.object_name,
}
const mutations = {
	setObject_id(state, object_id) {
		state.object_id = object_id
	},
	setPrimaryId(state, primaryId) {
		state.primaryId = primaryId
	},
  setObject_name(state, object_name) {
		state.object_name = object_name
	},
}
const actions = {
	async setCurrent_Object({
		commit
	}, row) {
		try {
			let object_id = row.object_id;
			commit('setObject_id', object_id);
      commit('setObject_name', row.object_name);
			commit('setPrimaryId', row.id);
			console.log(state)
		} catch (e) {
			console.log(e);
		}
	},
	async GetData({
		commit
	}) {
		try {
			let sData, sqlcode, jsonlist, field;
			let roleMax = await store.dispatch('user/getRoleMax');
			let org_id = store.getters['user/org_pid'];
			console.log('roleMax', roleMax)
			switch (roleMax) {
				case 'super_admin':
					if (state.org_table_type == 0) {
						sqlcode = 1037;
					} else {
						sqlcode = 1037;
					}
					field = {

					};
					jsonlist = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}];
					break;
				case 'admin':
				case 'user':
				default:
					sqlcode = 1037;
					field = {
						org_id: org_id
					};
					jsonlist = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}];
					break
			}
			let {
				data
			} = await QueryExec_fob(sqlcode, jsonlist, field);
			console.log('setProjectSideTableData',data)
			commit('setProjectSideTableData', data)
			// sData = sql_helper.splicing_fob(1, sqlcode, jsonlist, field).sql;

			// console.log('sData', sData)
			// const orgdata = await getTreeList(sData)
			// console.log('sData', orgdata)
			// const tree1 = await TreeDataDeal(orgdata.data)
			// commit('setOrgCache', tree1)
			return data
		} catch (e) {
			console.log(e)
			return []
		}
	}
}
export default {
	state,
	getters,
	mutations,
	actions
}

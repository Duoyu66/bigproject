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
	projectSideTableData: [],
	primaryId: '',
	project_id: '',
	currentTab: 'org',
}
const getter = {
	projectSideTableData: (state) => state.projectSideTableData,
	primaryId: (state) => state.primaryId,
	project_id: (state) => state.project_id,
	currentTab: (state) => state.currentTab,
}
const getters = {
	projectSideTableData: (state) => state.projectSideTableData,
	primaryId: (state) => state.primaryId,
	project_id: (state) => state.project_id,
	currentTab: (state) => state.currentTab,
}
const mutations = {
	setProject_id(state, project_id) {
		state.project_id = project_id
	},
	setCurrentTab(state, currentTab) {
		state.currentTab = currentTab
	},
	setPrimaryId(state, primaryId) {
		state.primaryId = primaryId
	},
	setProjectSideTableData(state, projectSideTableData) {
		state.projectSideTableData = projectSideTableData
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
	}, row) {
		try {
			let project_id = row.project_id;
			commit('setProject_id', project_id);
			commit('setPrimaryId', row.id);
			commit('setCurrentTab', 'project');
			await store.dispatch(`org/setCurrentTab`, 'project')
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

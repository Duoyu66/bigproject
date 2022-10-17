/**
 * @author 
 * @description 
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
const state = {
	param: {}
}
const getters = {
	param: (state) => state.param,
}

const mutations = {
	updataParamUnit(state, info) {
		if (info.unit == '无') {
			info.unit = '';
		} else if (info.unit.trim() == '') {
			info.unit = undefined;
		}
		if (state.param[info.param_id]) {
			state.param[info.param_id].unit = info.unit;
		} else {
			state.param[info.param_id] = info
		}
	},
}
const actions = {
	async getUnit({
		commit
	}, param_id) {
		console.log('getUnit', state.param[param_id])
		if (state.param[param_id] && typeof state.param[param_id].unit != 'undefined') {
			return state.param[param_id].unit;
		}
		let form = {
			param_id: param_id
		}
		let data = await getParam(form);

		let param = '';
		if (data && data.length > 0) {
			param = data[0].param;
			commit('updataParamUnit', data[0]);
		}
		if (state.param[param_id] && typeof state.param[param_id].unit != 'undefined') {
			return state.param[param_id].unit;
		}
		if (param) {
			form = {
				param: param
			}
			let data2 = await getParam(form);
			if (data2 && data2.length > 0) {
				data[0].unit = data2[0].unit;
				if (!data[0].unit) {
					data[0].unit = '%'
				}
				commit('updataParamUnit', data[0]);
			}
		}
		if (state.param[param_id] && typeof state.param[param_id].unit != 'undefined') {
			return state.param[param_id].unit;
		}
		return '%';
	}
}

async function getParam(form) {
	if (!form) {
		form = {}
	}
	let sqlcode = 815;
	let list = [{
		field: 'param_id',
		type: 3,
		level: 1,
	}, {
		field: 'param',
		type: 3,
		level: 2,
	}]
	let {
		data
	} = await QueryExec_fob(sqlcode, list, form);
	return data;
}
export default {
	state,
	getters,
	mutations,
	actions
}

import store from '@/store/index'
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
export async function GetParameter(param, param_id, parent_id) {
	try {
		
		let sqlcode = 572
		let list = [{
			field: 'param',
			type: 2,
			level: 1
		}, {
			field: 'param_id',
			type: 3,
			level: 2
		}, {
			field: 'parent_id',
			type: 3,
			level: 3
		}]
		let field = {
			param: param,
			param_id: param_id,
			parent_id: parent_id,
		}
		const {
			code,
			data
		} = await QueryExec_fob(sqlcode, list, field)
		return data
	} catch (e) {
		console.log(e)
		return []
	}
}

export default {

}

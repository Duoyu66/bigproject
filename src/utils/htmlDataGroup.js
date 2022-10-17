import {
	search_fob,
	update_fob,
	insert_fob,
	delete_fob,
	delete_from_fob,
	QueryExec_fob,
	QueryExec_fobEx,
	ExecSql_fob,
} from '@/global/form.helper'
//根据group_id获取数据
export async function GetGroupData(group_id) {
	try {
		let form = {}
		let list = [{
			field: 'group_id',
			type: 3,
			level: 1,
		}]
		form.group_id = group_id
		const {
			code,
			data
		} = await QueryExec_fob(71, list, form)
		return data
	} catch (e) {
		console.log(e)
	}
}
//自定义sql
export async function GetGroupDataCustom(sqlcode, list, form) {
	try {
		if (!list) {
			list = []
		}
		if (!form) {
			form = {}
		}
		const {
			code,
			data
		} = await QueryExec_fob(sqlcode, list, form)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function GetGroupDataAsKey(group_id) {
	try {
		let form = {}
		let list = [{
			field: 'group_id',
			type: 3,
			level: 1,
		}]
		form.group_id = group_id
		const {
			code,
			data
		} = await QueryExec_fob(238, list, form)
		return data
	} catch (e) {
		console.log(e)
	}
}
//
export async function GetGroupDataCustomEx(that, list) {
	try {
		for (let i = 0; i < list.length; i++) {
			let data = await GetGroupDataCustom(list[i].sqlcode, list[i].list, list[i].form)
			that.selectData[list[i].data] = data
		}
	} catch (e) {
		console.log(e)
		console.log('GetGroupDataCustomEx',list)
	}
}
export async function GetGroupDataEx(that, list) {
	try {
		for (let i = 0; i < list.length; i++) {
			that.selectData[list[i].data] = await GetGroupData(list[i].group_id)
		}
	} catch (e) {
		console.log(e)
	}
}
export async function GetGroupDataEx2(that, list) {
	try {
		for (let i = 0; i < list.length; i++) {
			that.selectData[list[i].data] = await GetGroupDataAsKey(list[i].group_id)
		}
	} catch (e) {
		console.log(e)
	}
}
export default {

}

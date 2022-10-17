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
export const file_about = {
	upload: {
		cert_image: 3,
		material_list: 3,
		confirm_image: 3,
	}
}
let role_max = ''
/*
获取人员最高权限
*/
export async function GetPersonRoleMax() {
	if (role_max) {
		return role_max
	}
	role_max = await store.dispatch('user/getRoleMax')
	return role_max
}
async function getOrgName(value) {
	let orgName = await store.dispatch('org/GetOrgNameByOrgId', value)
	return orgName
}
export function getOrgNameByselect() {
	return new Promise((resolve, reject) => {
		let index = setInterval(async () => {
			let org_name = await getOrgName(await GetOrgId());
			if (org_name.trim()) {
				clearInterval(index);
				resolve(org_name)
			}
		}, 500)
	})

}
export function GetCurrentOrgId() {
	return new Promise((resolve, reject) => {
		let index = setInterval(async () => {
			let org_id = store.getters['org/current_org'];
			if (org_id && org_id > 0) {
				clearInterval(index);
				resolve(org_id)
			}
		}, 500)
	})
}

export function GetPersonOrgPId() {
	return new Promise((resolve, reject) => {
		let index = setInterval(async () => {
			let org_id = store.getters['user/org_pid'];
			if (org_id && org_id > 0) {
				clearInterval(index);
				resolve(org_id)
			}
		}, 500)
	})
}


/*
获取机构id
*/
export async function GetOrgId(role_max) {
	if (!role_max) {
		role_max = await GetPersonRoleMax()
	}
	let org_id = ''
	switch (role_max) {
		case 'super_admin':
			org_id = await GetCurrentOrgId()
			break;
		default:
			org_id = await GetPersonOrgPId()
			break
	}
	return org_id
}
export async function GetPersonList(org_id, name, duty) {
	try {
		if (!org_id) {
			org_id = await GetOrgId()
		}
		let sqlcode = 525
		let list = [{
			field: 'org_id',
			type: 3,
			level: 1
		}, {
			field: 'org_pid',
			type: 3,
			level: 2
		}, {
			field: 'name',
			type: 2,
			level: 3
		}, {
			field: 'duty',
			type: 2,
			level: 4
		}]
		let field = {
			duty: duty,
			name: name,
			org_id: org_id,
		}
		const {
			code,
			data
		} = await QueryExec_fob(sqlcode, list, field)
		return data
	} catch (e) {
		console.log(e)
	}
}
/*
获取化学品库存
*/
export async function GetChemicalStore(org_id, chemical_id, chemical_name, store_id) {
	try {
		if (!org_id) {
			org_id = await GetOrgId()
		}
		let sqlcode = 523
		let list = [{
				field: 'org_id',
				type: 3,
				level: 1
			},
			{
				field: 'chemical_id',
				type: 3,
				level: 2
			},
			{
				field: 'chemical_name',
				type: 2,
				level: 3
			},
			{
				field: 'store_id',
				type: 3,
				level: 4
			}
		]
		let field = {
			chemical_id: chemical_id,
			chemical_name: chemical_name,
			org_id: org_id,
			store_id: store_id
		}
		if (store_id) {
			field.chemical_id = undefined
			field.chemical_name = undefined
			field.org_id = undefined
		}
		console.log(JSON.stringify(field))
		const {
			code,
			data
		} = await QueryExec_fob(sqlcode, list, field)
		return data
	} catch (e) {
		console.log(e)
	}
}
/*
获取化学品分配
*/
export async function GetChemicalAlloc(org_id, chemical_id, chemical_name) {
	try {
		if (!org_id) {
			org_id = await GetOrgId()
		}
		let sqlcode = 524
		let list = [{
				field: 'org_id',
				type: 3,
				level: 1
			},
			{
				field: 'chemical_id',
				type: 3,
				level: 2
			},
			{
				field: 'chemical_name',
				type: 2,
				level: 3
			}
		]
		let field = {
			chemical_id: chemical_id,
			chemical_name: chemical_name,
			org_id: org_id,
		}
		const {
			code,
			data
		} = await QueryExec_fob(sqlcode, list, field)
		return data
	} catch (e) {
		console.log(e)
	}
}
export async function GetChemicalBuyMinDate(org_id, store_id) {
	try {
		if (!org_id) {
			org_id = await GetOrgId()
		}
		let sqlcode = 536
		let list = [{
				field: 'store_id',
				type: 3,
				level: 1
			},
			{
				field: 'org_id',
				type: 3,
				level: 2
			}
		]
		let field = {
			store_id: store_id,
			org_id: org_id,
		}
		const {
			code,
			data
		} = await QueryExec_fob(sqlcode, list, field)

		if (data && data.length > 0) {
			return data[0].min_buy_date
		}
		return data
	} catch (e) {
		console.log(e)
	}
}
export async function GetChemicalBaseInfoByStoreId(org_id, store_id) {
	try {
		if (!org_id) {
			org_id = await GetOrgId()
		}
		let sqlcode = 539
		let list = [{
				field: 'org_id',
				type: 3,
				level: 1
			},
			{
				field: 'store_id',
				type: 3,
				level: 2
			}
		]
		let field = {
			store_id: store_id,
			org_id: org_id,
		}
		const {
			code,
			data
		} = await QueryExec_fob(sqlcode, list, field)
		if (data && data.length > 0) {
			return data[0]
		}
		return data
	} catch (e) {
		console.log(e)
	}
}

export default {}

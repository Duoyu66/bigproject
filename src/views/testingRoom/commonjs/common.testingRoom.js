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
		enclosure: 3,
		certificate: 3,
	}
}
let role_max = ''

export function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}
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

import store from '@/store/index';
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
} from '@/global/form.helper';
import {
	fileType
} from '@/utils/servicefile.js'
export let file_upload_type = 22;
export let type_str = 'jpg/pdf/png/jpeg/docx/doc/xlsx/xls/zip';
export let type_array = [fileType.jpeg.rawType, fileType.png.rawType, fileType.pdf.rawType,
	fileType.docx.rawType, fileType.doc.rawType, fileType.xlsx.rawType, fileType.xls.rawType, fileType.zip.rawType
];
let role_max = '';
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
export default {}

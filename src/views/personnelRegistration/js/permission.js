import store from '@/store/index'
//从权限json中查找指定的权限名称是否存在和可用
export function hasPermission(permission, permission_name) {
	try {
		function find(json, value) {
			if ((typeof json).toLowerCase() !== 'object') {
				return false
			}
			let flag = false
			for (let key in json) {
				if (key === value) {
					if ((typeof json[key]).toLowerCase() === 'object') {
						if (json[key].self) {
							return true
						}
						return false
					} else {
						return json[key]
					}
				}
				if ((typeof json[key]).toLowerCase() === 'object') {
					flag = find(json[key], value)
				}
				if (flag) {
					return true
				}
			}
			return false
		}
		return find(permission, permission_name)
	} catch (e) {
		console.log(e)
		return false
	}
}
export function PermissionSubtableDeal(status, name, row, person_id, role_max, model) {

	switch (name) {
		case 'examine':
			if (person_id == row.person_id) {
				status = false
				return status
			}
			if (row.approve == '-3' && (role_max === 'user' || !role_max)) {
				status = false
				return status
			}
			break
		case 'edit':
		case 'delete':
		case 'add':
			if ((role_max === 'user' || !role_max) && (Number(row.approve) > 0 || Number(row.approve) < -2)) {
				//console.log('status', false)
				status = false
			}
			break

	}
	return status
}
export default {

}

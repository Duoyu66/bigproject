import store from '@/store'
import {
	judgeVariableType,
	variableInfo,
	judgeVariableIsEmptyOrNull
} from '@/utils/base.helper'
/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 检查权限
 * @param value
 * @returns {boolean}
 */
export default function checkPermission(value) {
	if (value && value instanceof Array && value.length > 0) {
		const permissions = store.getters['user/permissions']
		const permissionPermissions = value

		return permissions.some((role) => {
			return permissionPermissions.includes(role)
		})
	} else {
		return false
	}
}

export function hasPermissionMenu(class_name, permission, permission_name, config, option) {
	try {
		let bishasPermission = hasPermissionEx(permission, permission_name, config, option)
		if (!class_name) {
			class_name = ''
		}
		if (bishasPermission) {
			return class_name
		}
		return class_name + " " + menuClassName()
	} catch (e) {
		console.log(e)
	}
}

export function menuClassName() {
	return 'unclick'
}

export function hasPermissionEx(permission, permission_name, config, option) {
	try {
		let name = permission
		if (!config) {
			config = {}
		}
		let permission_second = ''
		if (!option) {
			option = {}
		}
		if (option.permission_second) {
			permission_second = option.permission_second
		}

		if (config[permission]) {
			switch (judgeVariableType(config[permission])) {
				case variableInfo.string.name:
					name = config[permission]
					break
				case variableInfo.array.name:
					break
				case variableInfo.json.name:
					name = config[permission][permission_second]
					break
				case variableInfo.function.name:

					break
				case variableInfo.number.name:
				case variableInfo.boolean.name:
				default:
					name = config[permission]
					break
			}
		}
		return hasPermission(permission, permission_name)
	} catch (e) {
		console.log(e)
	}
}

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

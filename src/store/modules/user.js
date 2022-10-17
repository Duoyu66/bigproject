/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import {
	getUserInfo,
	login,
	logout
} from '@/api/user'
import {
	getAccessToken,
	removeAccessToken,
	setAccessToken,
} from '@/utils/accessToken'
import {
	setPersonel,
	getPersonel
} from '@/utils/userInfo'
import {
	resetRouter
} from '@/router'
import {
	title,
	tokenName,
	tokenAuthName,
	successCode
} from '@/config'
import {
	DESHelper
} from '@/global/des.helper'
import {
	isArray
} from '@/utils/validate'
import {
	QueryExec_fob
} from '@/global/form.helper'
import {
	ViewfileUrlEx
} from '@/utils/servicefile'

import {
	drawByText
} from '@/utils/convasHelper'
const state = {
	accessToken: getAccessToken(),
	username: '',
	avatar: '',
	permissions: [],
	permission_all: [],
	person_id: -1,
	//用户初始机构
	org_id: -1,
	//用户所在机构
	org_pid: -1,
	duty: '',
	job_type: '',
	SupervisorOrgList: [],
	isHasSupervisorOrg: false
}
const getters = {
	accessToken: (state) => state.accessToken,
	username: (state) => state.username,
	avatar: (state) => state.avatar,
	permissions: (state) => state.permissions,

	permission_all: (state) => state.permission_all,
	person_id: (state) => state.person_id,
	org_id: (state) => state.org_id,
	org_pid: (state) => state.org_pid,
	duty: (state) => state.duty,
	job_type: (state) => state.job_type,
	SupervisorOrgList: (state) => state.SupervisorOrgList,
	isHasSupervisorOrg: (state) => state.isHasSupervisorOrg,

}
const mutations = {
	setAccessToken(state, accessToken) {
		state.accessToken = accessToken
		setAccessToken(accessToken)
	},
	setUsername(state, username) {
		state.username = username
	},
	setAvatar(state, avatar) {
		state.avatar = avatar
	},
	setPermissions(state, permissions) {
		state.permissions = permissions
	},
	setPersonel(state, userInfo) {
		setPersonel(userInfo)
	},
	setPerson_id(state, person_id) {
		state.person_id = person_id
	},
	setOrg_id(state, org_id) {
		try {
			state.org_id = Number(org_id)
		} catch (e) {
			console.log(e)
		}
	},
	setOrg_pid(state, org_pid) {
		try {
			state.org_pid = Number(org_pid)
		} catch (e) {
			console.log(e)
		}
	},
	setDuty(state, duty) {
		state.duty = duty
	},
	setJob_type(state, job_type) {
		state.job_type = job_type
	},
	setpermission_json(state, permission_all) {
		state.permission_all = permission_all
	},
	setSupervisorOrgList(state, SupervisorOrgList) {
		try {
			if (typeof SupervisorOrgList == 'undefined') {
				SupervisorOrgList = [];
			}
			state.SupervisorOrgList = SupervisorOrgList;
			state.isHasSupervisorOrg = SupervisorOrgList.length > 0;
		} catch (e) {
			state.isHasSupervisorOrg = false;
			console.log(e);
		}

	}
}
const actions = {
	setPermissions({
		commit
	}, permissions) {
		commit('setPermissions', permissions)
	},
	async login({
		commit
	}, userInfo) {

		const {
			data,
			code
		} = await login(userInfo)
		// 操作正常Code数组

		const codeVerificationArray = isArray(successCode) ? [...successCode] : [...[successCode]];
		if (!codeVerificationArray.includes(Number(code))) {
			Vue.prototype.$baseMessage(
				`登录失败，用户名或密码错误`,
				'error'
			);
			return false;
		} else {
			//Vue.prototype.$baseNotify(`登陆成功`);
		}
		const accessToken = data[tokenAuthName]

		if (accessToken) {
			//先设置token,用户信息需要用其加密
			commit('setAccessToken', accessToken);
			commit('setPersonel', data);
			const hour = new Date().getHours()
			const thisTime =
				hour < 8 ?
				'早上好' :
				hour <= 11 ?
				'上午好' :
				hour <= 13 ?
				'中午好' :
				hour < 18 ?
				'下午好' :
				'晚上好'
			Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！${data.name}`);
			return true;
		} else {
			Vue.prototype.$baseMessage(
				`登录接口异常，未正确返回${tokenName}...`,
				'error'
			)
			return false;
		}
	},
	async getUserInfo({
		commit,
		state
	}) {
		// const {
		// 	data
		// } = await getUserInfo(state.accessToken) // await DESHelper.getUserInfo()
		const data = getPersonel()
		//debugger
		if (!data) {
			Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
			return false
		}
		let {
			permissions,
			name,
			head_con,
			person_id,
			org_id,
			org_pid,
			duty,
			job_type,
			SupervisorOrgList
		} = data
		let list = [{
			field: 'person_id',
			type: 3,
			level: 1,
		}]
		let permission_list = await QueryExec_fob(184, list, {
			person_id: person_id
		})

		function sortId(a, b) {
			return Number(a.level) - Number(b.level)
		}
		permission_list.data.sort(sortId);
		let temp_list = []
		for (let i = 0; i < permission_list.data.length; i++) {
			temp_list.push(permission_list.data[i].role_name)
		}
		//为兼容本地模式，后期删除
		//temp_list.push('admin')
		permissions = temp_list
		if (permissions && name && Array.isArray(permissions)) {
			commit('setpermission_json', permission_list.data);
			commit('setPermissions', permissions);
			commit('setUsername', name);
			commit('setSupervisorOrgList', SupervisorOrgList);
			if (!head_con) {
				try {
					head_con = await drawByText(name[0]);
				} catch (e) {
					console.log(e)
				}

			} else {
				head_con = ViewfileUrlEx(15) + head_con
			}
			commit('setAvatar', head_con)

			commit('setPerson_id', person_id)
			commit('setOrg_id', org_id)
			commit('setOrg_pid', org_pid)
			commit('setDuty', duty)
			commit('setJob_type', job_type)
			return permissions
		} else {
			Vue.prototype.$baseMessage('用户信息接口异常', 'error')
			return false
		}
	},
	async logout({
		dispatch
	}) {
		//await logout(state.accessToken)
		await dispatch('resetAccessToken')
		await resetRouter()
	},
	resetAccessToken({
		commit
	}) {
		commit('setPermissions', [])
		commit('setAccessToken', '')
		removeAccessToken()
	},
	roleJudge({
		commit
	}, role_name) {
		switch (role_name) {
			case 'super_admin':
				role_name = '超级管理员'
				break
			case 'admin':
				role_name = '管理员'
				break
			case 'user':
				role_name = '普通用户'
				break
		}
		if (permissions.indexOf(role_name) >= 0) {
			return true
		}
		return false
	},
	getRoleMax({
		commit
	}) {
		//获取用户的最高角色

		let role_name = state.permission_all[0].role_name
		switch (role_name) {
			case '超级管理员':
				role_name = 'super_admin'
				break
			case '管理员':
				role_name = 'admin'
				break
			case '普通用户':
				role_name = 'user'
				break
		}
		console.log(role_name)
		return role_name
	},
	isHasSupervisorOrg() {
		try {
			console.log('isHasSupervisorOrg', state.SupervisorOrgList);
			if (state.SupervisorOrgList) {
				if (state.SupervisorOrgList.length > 0) {
					return true;
				}
				return false;
			} else {
				return false;
			}

		} catch (e) {
			console.log(e);
			return false;
		}
	}
}

function roleConvert() {

}
export default {
	state,
	getters,
	mutations,
	actions
}

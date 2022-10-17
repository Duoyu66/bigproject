import request from '@/utils/request'
import {
	getPersonel
} from '@/utils/userInfo'
import {
	QueryExec_fob
} from '@/global/form.helper'

import store from '@/store/index'

export async function getRouterList(data1) {
	const person_id = store.getters['user/person_id']
	const list = [{
		field: 'person_id',
		type: 3,
		level: 1,
	}]
	const form = {
		person_id: person_id
	}
	const {
		data
	} = await QueryExec_fob(32, list, form)
	return {
		data
	}
}

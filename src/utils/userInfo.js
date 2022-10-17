import {
	storage,
	tokenTableName2
} from '@/config'
import {
	getItem,
	setItem
} from '@/utils/storage'
import {
	DESHelper
} from '@/global/des.helper'

export function setPersonel(info) {
	const data = DESHelper.EncryptByDESModeEBC_fob(JSON.stringify(info))
	setItem(tokenTableName2, data)
}

export function getPersonel(info) {
	try {
		let user_info = getItem(tokenTableName2)
		return JSON.parse(DESHelper.DecryptByDESModeEBC_fob(user_info))
	} catch (e) {
		console.log(e)
		return {}
	}
}

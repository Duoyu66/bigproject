import {
	QueryExec_fob
} from '@/global/form.helper'
export async function dealRespond(sqlcode, list, form, msg) {
	if (!msg) {
		msg = '更新'
	}
	const {
		code,
		influence,
		data
	} = await QueryExec_fob(sqlcode, list, form)
	if (code != 200) {
		return [false, msg + '失败']
	}
	if (!data || data.length == 0) {
		return [false, msg + '失败']
	}
	let json = JSON.parse(data[0].info)

	if (json.code > 0) {
		switch (json.code) {
			case 1:
				return [true, json.msg]
				break
			case 2:
				msg = json.msg
				break
			default:
				msg = json.msg
				break
		}
		return [false, msg]
	} else {
		msg = json.msg
		return [false, msg]
	}
}
export function Notify(that, isSuccess, msg) {
	if (!msg) {
		if (isSuccess) {
			msg = '更新成功'
		} else {
			msg = '更新失败,请刷新重试'
		}
	}

	if (isSuccess) {
		that.$notify({
			title: '成功',
			message: msg,
			type: 'success'
		});
	} else {
		that.$notify.error({
			title: '错误',
			message: msg
		});
	}
}

export default {

}

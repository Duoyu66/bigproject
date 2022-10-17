import store from '@/store'
export async function getParamUnit(param_id, param_name, value) {
	let unit = await store.dispatch('param/getUnit', param_id);
	if (!value) {
		value = '';
	}
	return value + unit;
}

export default {
	getParamUnit
}

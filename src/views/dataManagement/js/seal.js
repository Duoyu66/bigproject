export async function DealSealProcess() {
	try{
		
		
	}catch(e){
		console.log(e)
		return '';
	}
}

export async function GetSealProcessData() {
	let defaultData = {
		"add": {
			"label": "添加",
			"repeat": false,
			"level": 1
		},
		"examine": {
			"label": "审核",
			"level": 2
		}
	}
	try {
		let list = [{
			field: "item_id",
			level: 1,
			type: 3,
		}]
		let form = {
			item_id: 1017
		}
		let {
			data,
			total
		} = await QueryExec_fob(339, list, form);
		if (!data || data.length == 0) {
			return defaultData
		}
		let custom = data[0].custom
		if (!custom) {
			return defaultData
		}
		let process = JSON.parse(custom)
		return process
	} catch (e) {
		console.log(e)
		return defaultData
	}
}

export default {

}

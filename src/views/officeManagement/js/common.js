import {
	QueryExec_fob
} from '@/global/form.helper'
let splitChildren = '^'
let splitProcess = '-'
export function docRegisterProcess(source, processDeFalut, sourceList, form, option) {
	let aReturn = {
		sign: {
			isrequired: false
		},
		outgoingOrg: {
			isrequired: false
		},
		reply: {
			isrequired: false
		}
	}
	try {
		if (typeof source == 'string') {
			source = source.split(',')
		}
		let optionDefault = {
			field: {
				nextStatus: 'nextStatus',
				processingStatus: 'processingStatus'
			}
		}
		if (option) {
			if (option.field) {
				if (!option.field.nextStatus) {
					option.field.nextStatus = optionDefault.field.nextStatus
				}
				if (!option.field.processingStatus) {
					option.field.processingStatus = optionDefault.field.processingStatus
				}
			} else {
				option.field = optionDefault.field
			}
		} else {
			option = optionDefault
		}
		let nextStatusFiled = option.field.nextStatus
		let processingStatusFiled = option.field.processingStatus
		let processJson = JSON.parse(JSON.stringify(processDeFalut))
		//登记-审核
		let process = processJson.register.label + splitProcess + processJson.examine.label +
			splitProcess + processJson.end.label;

		let processList = [];
		// for (let j = 0; j < source.length; j++) {
		// 	let flag = true
		// 	for (let i = 0; i < sourceList.length; i++) {
		// 		if (sourceList[i].item_name == source[j]) {
		// 			let processMoel = new ProcessModel(sourceList[i].custom);
		// 			processList.push(processMoel)
		// 			flag = false
		// 			break
		// 		}
		// 	}
		// 	if (flag) {
		// 		let processMoel = new ProcessModel(process);
		// 		processList.push(processMoel)
		// 	}
		// }
		// for (let i = 0; i < sourceList.length; i++) {
		// 	if (sourceList[i].item_name == source) {
		// 		process = sourceList[i].custom
		// 		break
		// 	}
		// }
		console.log(process)
		//处理数组
		process = dealProcess(source, processJson, sourceList);
		process = process.split(splitProcess)
		let processChildren = ''
		let temp = ''
		let processSet = new Set()
		let processSetAll = new Set()
		let nextStatusFlag = false;
		for (let i = 0; i < process.length; i++) {
			processChildren = process[i].split(splitChildren)
			let setTemp = new Set()
			for (let j = 0; j < processChildren.length; j++) {
				temp = processChildren[j]
				if (!setTemp.has(temp)) {
					setTemp.add(temp)
				}
				if (!processSetAll.has(temp)) {
					processSetAll.add(temp)
				}
				switch (temp) {
					case processJson.sign.label:
						break;
					case processJson.register.label:
						break;
					case processJson.examine.label:
						break;
					case processJson.end.label:
						break;
				}
				if (nextStatusFlag && j == processChildren.length - 1) {
					nextStatusFlag = false
					form[nextStatusFiled] = temp
				}
				//processingStatus没有值，为首次添加
				if (!form[processingStatusFiled] && i == 0 && j == processChildren
					.length - 1) {
					form[processingStatusFiled] = temp
				}
				if (form[processingStatusFiled] == temp) {
					nextStatusFlag = true
					processSet = setTemp
				}
			}
		}

		if (processSet.has(processJson.sign.label)) {
			aReturn.sign.isrequired = true
		} else {
			aReturn.sign.isrequired = false
		}
		if (processSet.has(processJson.outgoingOrg.label)) {
			aReturn.outgoingOrg.isrequired = true
		} else {
			aReturn.outgoingOrg.isrequired = false
		}
		if (processSetAll.has(processJson.reply.label)) {
			aReturn.reply.isrequired = true
		} else {
			aReturn.reply.isrequired = false
		}
		return aReturn
	} catch (e) {
		console.log(e)
		return aReturn
	}
}

function dealProcess(source, processJson, sourceList) {
	//登记-审核
	let process = processJson.register.label + '[1]' + splitProcess + processJson.examine.label +
		 splitProcess + processJson.end.label;
	console.log(sourceList[0])
	if (sourceList && sourceList.length > 0 && sourceList[0].remarks == '0') {
		//起草 审核 盖章  发送 完成
		process = processJson.draft.label + splitProcess + processJson.examine.label +
			splitProcess + processJson.Seal.label + splitProcess + processJson.send.label +splitProcess+ processJson.end.label;
	}
	console.log('dealProcess begin defalut process', process)
	console.log('processJson', processJson)
	let processList = [];
	console.log('source', source)
	for (let j = 0; j < source.length; j++) {
		let flag = true
		for (let i = 0; i < sourceList.length; i++) {
			if (sourceList[i].item_name == source[j]) {
				processList.push.apply(processList, dealProcessSplit(sourceList[i].custom, processJson));
				flag = false
				break
			}
		}
		if (flag) {
			processList.push.apply(processList, dealProcessSplit(process, processJson));
		}
	}
	processList.sort(function(a, b) {
		return a.level - b.level
	});
	let length = processList.length
	let tempList = []
	let tempNo = -1;
	for (let i = 0; i < length; i++) {
		if (tempList[tempNo]) {
			if (tempList[tempNo].processName == processList[i].processName) {
				tempList[tempNo].ProcessChildrenListSetAdd(processList[i].processChildrenList)
			} else {
				tempList.push(processList[i])
				tempNo++
			}
		} else {
			tempList.push(processList[i])
			tempNo++
		}
	}
	console.log(processList)
	length = tempList.length
	let temp = ''
	for (let i = 0; i < length; i++) {
		if (temp) {
			temp = temp + splitProcess + tempList[i].GetProcess()
		} else {
			temp = tempList[i].GetProcess()
		}
	}
	console.log(temp)
	console.log('dealProcess end')
	return temp
}

function dealProcessSplit(process, processJson) {
	let list = process.split(splitProcess)
	let length = list.length
	let processList = []
	let temp = ''
	for (let i = 0; i < length; i++) {
		let processMoel = new ProcessModel(list[i], processJson);
		processList.push(processMoel)
	}
	return processList
}

export async function GetProcessData() {
	let defaultData = {
		"outgoingOrg": {
			"label": "发文",
			"repeat": false
		},
		"sign": {
			"label": "签收",
			"repeat": false
		},
		"register": {
			"label": "登记",
			"repeat": false,
			"level": 4
		},
		"examine": {
			"label": "审核",
			"level": 2
		},
		"end": {
			"label": "完成",
			"repeat": false,
			"isLast": true,
			"level": 6
		},
		"draft": {
			"label": "起草",
			"repeat": false,
			"level": 1
		},
		"send": {
			"label": "发送",
			"repeat": false,
			"level": 3
		},
		"reply": {
			"label": "回复",
			"level": 5
		}
	}
	try {
		let list = [{
			field: "item_id",
			level: 1,
			type: 3,
		}]
		let form = {
			item_id: 1016
		}
		let {
			data,
			total
		} = await QueryExec_fob(339, list, form);
		if (!data || data.length == 0) {
			return defaultData
		}
		let custom = data[0].custom
		console.log('GetProcessData', custom)
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

function getLevelByProcessJson(processJson, process) {
	let levelList = []
	for (let key in processJson) {
		if (key == 'label' && processJson.label == process) {
			if (processJson.hasOwnProperty('level')) {
				return processJson.level
			}
			return undefined
		}
		if (typeof processJson[key] == 'object') {
			levelList.push(getLevelByProcessJson(processJson[key], process))
		}
	}
	for (let i = 0; i < levelList.length; i++) {
		if (levelList[i]) {
			return levelList[i]
		}
	}
	return undefined
}
export function upLoadDocReceiptHistory(that, form) {
	try {
		let list = [{
				field: "receive_id",
				level: 1
			},
			{
				field: "action",
				level: 2
			},
			{
				field: "person_name",
				level: 3
			},
			{
				field: "remarks",
				level: 4
			}
		]
		that.insert_fob(list, form, 334);
	} catch (e) {
		console.log(e)
	}
}

export async function upLoadDocDispatchHistory(that, form) {
	try {
		let list = [{
				field: "send_id",
				level: 1
			},
			{
				field: "person_id",
				level: 2
			},
			{
				field: "action",
				level: 3
			},
			{
				field: "remarks",
				level: 4
			}
		]
		let result = await that.insert_fob(list, form, 348);
	} catch (e) {
		console.log(e)
	}
}
export class ProcessModel {
	constructor(process, processJson, set) {
		try {
			if (!process) {
				return
			}
			if (typeof process != 'string') {
				return
			}

			let List = process.split(splitChildren);
			let length = List.length
			this.processChildrenList = new Set()
			for (let i = 0; i < length - 1; i++) {
				this.ProcessChildrenListAdd(List[i].trim())
			}
			let temp = List[length - 1].trim()
			let reg = /\d+/;
			let regResult = reg.exec(temp)
			this.processName = temp.replace(/\[\d+\]/, "");
			let level = getLevelByProcessJson(processJson, this.processName)
			//获取自定义等级 [1]
			if (regResult && regResult["0"].trim() && isRealNum(regResult["0"].trim())) {
				this.level = Number(regResult["0"].trim())
			} else if (level) {
				this.level = level
			} else {
				this.level = 0
			}

			if (set) {
				this.ProcessChildrenListSetAdd(set)
			}
		} catch (e) {
			console.log(e)
		}
	}
	ProcessChildrenListAdd(value) {
		if (!this.processChildrenList) {
			this.processChildrenList = new Set()
		}
		if (!this.processChildrenList.has(value)) {
			this.processChildrenList.add(value)
		}
		return this.processChildrenList.size
	}
	ProcessChildrenListSetAdd(set) {

		if (!set) {
			return
		}
		for (let key of set) {
			this.ProcessChildrenListAdd(key);
		}
	}
	GetProcess() {
		let temp = ''
		for (let key of this.processChildrenList) {
			if (temp) {
				temp = temp + splitChildren + key
			} else {
				temp = key
			}
		}
		if (temp) {
			temp = temp + splitChildren + this.processName
		} else {
			temp = this.processName
		}
		return temp
	}
}
/**
 *判断是否是数字
 *
 **/

function isRealNum(val) {
	// isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，

	if (val === "" || val == null) {
		return false;
	}
	if (!isNaN(val)) {
		//对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
		//所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
		return true;
	} else {
		return false;
	}
}
export default {

}

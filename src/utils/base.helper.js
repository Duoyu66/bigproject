export const variableInfo = {
	string: {
		name: 'string'
	},
	number: {
		name: 'number'
	},
	object: {
		name: 'object'
	},
	array: {
		name: 'array'
	},
	json: {
		name: 'json'
	},
	class: {
		name: 'class'
	},
	null: {
		name: 'null'
	},
	function: {
		name: 'function'
	},
	boolean: {
		name: 'boolean'
	},
	undefined: {
		name: 'undefined'
	},
}
// case variableInfo.string.name:
// 	type = typeofdata
// break
// case variableInfo.number.name:
// 	type = typeofdata
// break
// case variableInfo.array.name:
// break
// case variableInfo.json.name:
// break
// case variableInfo.null.name:
// break
// case variableInfo.function.name:
// 	type = typeofdata
// break
// case variableInfo.boolean.name:
// 	type = typeofdata
// break
// case variableInfo.undefined.name:
// 	type = typeofdata
// break
//返回变量类型
export function judgeVariableType(variable) {
	try {
		let typeofdata = (typeof variable).toLowerCase()
		let type = ''
		switch (typeofdata) {
			case variableInfo.string.name:
				type = typeofdata
				break
			case variableInfo.number.name:
				type = typeofdata
				break
			case variableInfo.object.name:
				if (variable instanceof Array) {
					type = variableInfo.array.name
				} else if (variable instanceof Object) {
					if (variable.constructor == Object) {
						type = variableInfo.json.name
					} else {
						type = variableInfo.class.name
					}
				} else if (variable == null) {
					type = variableInfo.null.name
				}
				break
			case variableInfo.function.name:
				type = typeofdata
				break
			case variableInfo.boolean.name:
				type = typeofdata
				break
			case variableInfo.undefined.name:
				type = typeofdata
				break
		}
		return type
	} catch (e) {
		console.log(e)
		return ''
	}

}
//判断变量可用
export function judgeVariableIsAvailable(variable) {
	try {
		let type = judgeVariableType(variable)
		let isAvailable = false
		switch (type) {
			case variableInfo.undefined.name:
			case variableInfo.null.name:
				isAvailable = false
				break
			default:
				if (type) {
					isAvailable = true
				} else {
					isAvailable = false
				}
				break
		}
		return isAvailable
	} catch (e) {
		console.log(e)
		return false
	}

}
//判断变量是空值还是不可用
export function judgeVariableIsEmptyOrNull(variable) {
	try {
		let isAvailable = judgeVariableIsAvailable(variable)
		if (isAvailable) {
			let type = judgeVariableType(variable)
			let isEmpty = true
			switch (type) {
				case variableInfo.string.name:
					if (!variable) {
						isEmpty = true
					} else {
						isEmpty = false
					}
					break
				case variableInfo.array.name:
					if (variable.length > 0) {
						isEmpty = false
					} else {
						isEmpty = true
					}
					break
				case variableInfo.json.name:
					isEmpty = true
					for (let key in variable) {
						isEmpty = false
					}
					break
				case variableInfo.number.name:
				case variableInfo.function.name:
				case variableInfo.boolean.name:
				case variableInfo.class.name:
					isEmpty = false
					break
			}
			return isEmpty
		}
		return isAvailable
	} catch (e) {
		console.log(e)
		return true
	}

}
//采用了正则表达式，循环遍历字符串，如果遇到中文字符，则length长度+2，否则长度+1。
export function getByteLen(val) {
	try {
		let len = 0;
		for (let i = 0; i < val.length; i++) {
			let a = val.charAt(i);
			if (a.match(/[^\x00-\xff]/ig) != null) {
				len += 2;
			} else {
				len += 1;
			}
		}
		return len;
	} catch (e) {
		console.log(e);
		try {
			return val.length;
		} catch (e) {
			console.log(e);
			return 0;
		}
	}
}
//val 要截取的字符串
//nStart 开始位置
//nlength 截取长度
export function Substring(val, nStart, nlength) {
	try {
		let len = 0;
		let str = '';
		for (let i = 0; i < val.length; i++) {
			let a = val.charAt(i);
			if (a.match(/[^\x00-\xff]/ig) != null) {
				len += 2;
			} else {
				len += 1;
			}
			if (len < nStart) {
				continue;
			}
			str = str + a;
			if (getByteLen(str) >= nlength) {
				return str;
			}
		}
		return str;
	} catch (e) {
		return '';
	}
}
export default {
	variableInfo,
	judgeVariableType,
	judgeVariableIsAvailable,
	judgeVariableIsEmptyOrNull,
	getByteLen,
	Substring
}

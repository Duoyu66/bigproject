import {
	sataic_variable
} from '../global/sataic_variable.vue'
const slider_login = sataic_variable.slider_login
const ROWSPLIT_vob = sataic_variable.ROWSPLIT_vob
const UNITSPLIT_vob = sataic_variable.UNITSPLIT_vob
const SECUNITSPLIT_vob = sataic_variable.SECUNITSPLIT_vob
const PARTSPLIT_vob = sataic_variable.PARTSPLIT_vob
const TableType = sataic_variable.TableType
const AffectRows = sataic_variable.AffectRows
const AffectDatas = sataic_variable.AffectDatas
const BaseUrl = sataic_variable.BaseUrl
const databaseType = sataic_variable.databaseType

export let sql_helper = {
	/**
	 *
	 * @param {*} type 语句类型 1 查询 2 更新  3 插入 4 删除 5、批量插入
	 * @param {*} sqlcode sql编号
	 * @param {*} jsonlist 查询 [{field:"field",type:1,//1分割日期2、模糊查询 3、不做处理(默认)4、直接取字段 [page] or [limit] 5 element 时间范围 split:"~",//分割日期范围的分隔符level:1//优先级}]
	 *  更新 [{field:"field",level:1//优先级}]
	 *  插入 和 删除 与更新一致
	 * @param {*} field
	 */
	splicing_fob: function(type, sqlcode, jsonlist, field, filed_list) {
		try {
			function sortLevel(a, b) {
				return a.level - b.level
			}
			if (
				typeof type == 'undefined' ||
				typeof sqlcode == 'undefined' ||
				typeof jsonlist == 'undefined'
			) {
				return {
					code: -2,
					sql: '',
					msg: '部分值未定义'
				}
			}
			if (type < 0 || type > 5) {
				return {
					code: -3,
					sql: '',
					msg: 'type无效'
				}
			}
			if (typeof field == 'undefined') {
				field = {}
			} else {
				field = trim_fob(field)
			}
			jsonlist.sort(sortLevel)
			let where = '',
				filed_type = '',
				temp = '',
				str = '',
				percent = '%',
				split_list = [],
				i = 0,
				j = 0,
				prefix = '[Q]' + sqlcode,
				suffix = '';
			if (type < 5) {
				prefix = '[Q]' + sqlcode
			} else if (type == 5) {
				prefix = '[R][Q]' + sqlcode
			}

			switch (type) {
				case 1:
					for (i = 0; i < jsonlist.length; i++) {
						filed_type = ''
						if (jsonlist[i].type) {
							filed_type = Number(jsonlist[i].type)
						}

						try {
							str = field[jsonlist[i].field]
						} catch (e) {
							str = ''
							console.log(e)
						}
						switch (filed_type) {
							case 1:
								where = split_fob(str, where, jsonlist[i].split)
								break
							case 2:
								where = where + UNITSPLIT_vob + percent + str + percent
								break
							case 4:
								where = where + UNITSPLIT_vob + jsonlist[i].field
								break
							case 5:
								where = elementDateRange(str, where)
								break
							case 3:
							default:
								where = where + UNITSPLIT_vob + str
								break
						}
					}
					break
				case 2:
				case 3:
				case 4:
					where = insertUpdate_fob(field, jsonlist, where)
					break
				case 5:
					for (j = 0; j < filed_list.length; j++) {
						temp = ''
						temp = insertUpdate_fob(filed_list[j], jsonlist, temp)
						// for (i = 0; i < jsonlist.length; i++) {
						// 	str = filed_list[j][jsonlist[i].field]
						// 	temp = temp + UNITSPLIT_vob + str
						// }
						temp.replace(UNITSPLIT_vob, '')
						if (j != filed_list.length - 1) {
							where = where + temp + SECUNITSPLIT_vob
						}
					}
					where = UNITSPLIT_vob + where
					break
			}
			where = where.replace(UNITSPLIT_vob, '').replace(/undefined/g, '').replace(/%%/g,
				'').replace(/null/g, '');

			switch (type) {
				case 1:
					suffix = ROWSPLIT_vob + TableType
					break
				case 2:
					suffix = ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType
					break
				case 3:
					suffix = ROWSPLIT_vob + AffectDatas + ROWSPLIT_vob + TableType
					break
				case 4:
					suffix = ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType
					break
				case 5:
					suffix = ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType
					break
			}
			let sData = prefix + '{' + where + '}' + suffix
			return {
				code: 1,
				sql: sData,
				msg: 'ok'
			}
		} catch (e) {
			console.log(e)
			return {
				code: -1,
				sql: '',
				msg: e
			}
		}
	},
}

function split_fob(str, where, split) {
	let split_list = ['', '']
	try {
		if (typeof str != 'undefined') {
			split_list = str.split(
				split
			)
		}
		if (split_list.length < 2) {
			split_list = ['', '']
		}
	} catch (e) {
		console.log(e)
	}
	where = where + UNITSPLIT_vob + split_list[0] + UNITSPLIT_vob + split_list[1]
	return where
}

function insertUpdate_fob(field, jsonlist, where) {
	let filed_type = ''
	let str = ''
	for (let i = 0; i < jsonlist.length; i++) {
		filed_type = jsonlist[i].type
		try {
			str = field[jsonlist[i].field]
		} catch (e) {
			str = ''
			console.log(e)
		}
		switch (filed_type) {
			case '1-1':
				where = split_fob(str, where)
				break
			case '1-2':
				where = elementDateRange(str, where)
				break
			default:
				where = where + UNITSPLIT_vob + str
				break
		}
	}
	return where
}

function elementDateRange(str, where) {
	try {
		if (str && (typeof str).toLocaleLowerCase() == 'object') {
			if (str.length > 1) {
				where = where + UNITSPLIT_vob + str[0] + UNITSPLIT_vob +
					str[1]
			} else {
				where = where + UNITSPLIT_vob + str[0] + UNITSPLIT_vob + ''
			}
		} else {
			where = where + UNITSPLIT_vob + '' + UNITSPLIT_vob + ''
		}
	} catch (e) {
		where = where + UNITSPLIT_vob + '' + UNITSPLIT_vob + ''
		console.log(e)
	}
	return where
}

function trim_fob(field) {
	let key = '',
		temp = ''
	for (key in field) {
		temp = field[key]
		switch ((typeof temp).toLocaleLowerCase()) {
			case 'object':
				break
			case 'undefined':
			case 'boolean':
			case 'string':
			case 'number':
			case 'function':
			default:
				field[key] = temp.toString().trim()
				break
		}

	}
	return field
}
export default {
	sql_helper,
}

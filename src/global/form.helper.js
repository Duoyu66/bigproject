import {
	TreeDataDealExGetData,
	TreeDataDealEx,
	TreeDataSecondary
} from '@/global/tree_deal'
import {
	ExecSql,
	QueryExec
} from '@/api/table'
import {
	sql_helper
} from '@/global/sql_helper'
import {
	doDelete
} from '@/api/file'
export function pageDeal(queryForm, type) {
	let form = JSON.parse(JSON.stringify(queryForm))
	if (!queryForm.pageNo || !queryForm.pageSize) {
		return form
	}
	if (!type) {
		type = 1
	}
	const pageNo = queryForm.pageNo
	const pageSize = queryForm.pageSize
	switch (type) {
		//截取从pageNo到pageSize,不包含第pageSize个数据
		case 2:
			form.pageNo = (pageNo - 1) * pageSize;
			form.pageSize = (pageNo - 1) * pageSize + pageSize;
			break
			//从pageNo开始截取pageSize个数据
		case 1:
		default:
			form.pageNo = (pageNo - 1) * pageSize
			break
	}
	return form
}

export async function search_fob(list, that, sqlcode, key_json) {
	try {
		if (key_json.loading) {
			that[key_json.loading] = true
		}
		//转义下 以后操作不修改源 数据
		let queryForm = JSON.parse(JSON.stringify(that[key_json.queryForm]))
		let total = that[key_json.total]
		let pageSize = queryForm.pageSize
		let pageNo = queryForm.pageNo
		queryForm = pageDeal(queryForm)

		// const pageNo = queryForm.pageNo
		// const pageSize = queryForm.pageSize
		// queryForm.pageNo = (pageNo - 1) * pageSize
		//queryForm.pageSize = (pageNo) * pageSize - 1;
		let sData = sql_helper.splicing_fob(1, sqlcode, list, queryForm)
		const {
			data,
			totalCount
		} = await QueryExec(sData.sql)
		//that['list']= data
		try {

			if (totalCount == 0) {
				//当查询到的 totalCount 为 0 是，满足以下条件尝试查询之前页的数据
				//total % pageSize ==1 最后一页只有一行数据。Math.ceil(total / pageSize) == pageNo 当前页为最后一页。pageNo 大于 1，代表之前页可能有数据
				if (total % pageSize == 1 && Math.ceil(total / pageSize) == pageNo && pageNo > 1) {

					that[key_json.queryForm].pageNo = pageNo - 1
					return search_fob(list, that, sqlcode, key_json)
				}
				//不是最后一页没查到数据
				if (pageNo > 1) {
					that[key_json.queryForm].pageNo = 1
					return search_fob(list, that, sqlcode, key_json)
				}
			}
			if (that.$set) {
				that.$set(that, key_json.data, data);
			} else {
				that[key_json.data] = data
			}

		} catch (e) {
			console.log(e)
			that[key_json.data] = data
		}
		// if (!totalCount) {
		// 	totalCount = 0
		// }
		that[key_json.total] = parseInt(totalCount)
		if (key_json.loading) {
			that[key_json.loading] = false
		}
		return {
			code: 200,
		}
	} catch (e) {
		console.log(e)
		return {
			code: 500,
		}
	}
}
export async function QueryExecAndPage_fob(sqlcode, list, filed) {
	try {
		//转义下 以后操作不修改源数据
		let queryForm = JSON.parse(JSON.stringify(filed))
		if (typeof queryForm.pageSize != 'undefined' && typeof queryForm.pageNo != 'undefined') {
			queryForm.pageNo = queryForm.pageNo - 1;
			queryForm = pageDeal(queryForm);
			console.log('QueryExecAndPage_fob', queryForm)
		}
		return await QueryExec_fob(sqlcode, list, queryForm);
	} catch (e) {
		console.log(e)
		return {
			code: 500,
		}
	}
}
export async function QueryExec_fob(sqlcode, list, filed) {
	try {
		//转义下 以后操作不修改源数据
		let queryForm = JSON.parse(JSON.stringify(filed))
		let sData = sql_helper.splicing_fob(1, sqlcode, list, queryForm)

		const {
			data,
			totalCount
		} = await QueryExec(sData.sql)
		return {
			code: 200,
			data: data,
		}
	} catch (e) {
		console.log(e)
		return {
			code: 500,
		}
	}
}

export async function ExecSql_fob(type, sqlcode, list, filed) {
	try {
		//转义下 以后操作不修改源数据
		let queryForm = JSON.parse(JSON.stringify(filed))
		let sData = sql_helper.splicing_fob(type, sqlcode, list, queryForm)

		const res = await ExecSql(sData.sql)
		return {
			code: 200,
			influence: Number(res),
		}
	} catch (e) {
		console.log(e)
		return {
			code: 500,
		}
	}
}

export async function QueryExec_fobEx(sData) {
	try {
		const {
			data,
			totalCount
		} = await QueryExec(sData)
		return {
			code: 200,
			data: data,
		}
	} catch (e) {
		console.log(e)
		return {
			code: 500,
		}
	}
}

export async function update_fob(list, filed, sqlcode) {
	try {
		let data = JSON.parse(JSON.stringify(filed))
		let sData = sql_helper.splicing_fob(2, sqlcode, list, data)
		console.log(sData.sql)
		const res = await ExecSql(sData.sql)
		return {
			code: 200,
			influence: Number(res),
		}
	} catch (e) {
		console.log(e)
		return {
			code: 500,
			error: e,
		}
	}
}
export async function insert_fob(list, filed, sqlcode) {
	try {
		let data = JSON.parse(JSON.stringify(filed))
		let sData = sql_helper.splicing_fob(3, sqlcode, list, data)
		const num = await ExecSql(sData.sql)

		return {
			code: 200,
			influence: Number(num),
		}
	} catch (e) {
		console.log(e)
		return {
			e: e,
			code: 500,
		}
	}
}
export async function delete_fob(that, list, filed, sqlcode, key_json) {
	try {
		let data = JSON.parse(JSON.stringify(filed))
		let sData = sql_helper.splicing_fob(4, sqlcode, list, data)
		const num = await ExecSql(sData.sql)
		if (num && Number(num) > 0) {
			that.$baseMessage('删除成功', 'success')
			//let reaload = that[key_json.reload]
			//reaload()
			return {
				status: 200,
			}
		} else {
			that.$baseMessage('删除失败', 'error')
			return {
				status: 500,
			}
		}
	} catch (e) {
		console.log(e)
		that.$baseMessage('执行异常', 'error')
	}
}
export async function delete_from_fobEx(that, row, sqlcode, key_json) {
	that.$confirm('此操作会清空所有相关信息，是否继续？', '确认信息', {
			distinguishCancelAndClose: true,
			confirmButtonText: '取消',
			cancelButtonText: '确定删除'
		})
		.then(() => {

		})
		.catch(action => {
			delete_from_fob(that, row, sqlcode, key_json);
		});
}
export async function delete_img_fob(that, row, sqlcode, key_json, custom_fob) {
	try {

		if (!key_json.file) {
			return 0;
		}
		let upload_type = -1
		let file = ''
		let res = -1
		for (let key in key_json.file) {
			try {
				file = row[key]
				if (!file) {
					continue
				}
				upload_type = key_json.file[key]
				file = file.split(';')
				for (let i = 0; i < file.length; i++) {
					if (file[i].indexOf('/') == 0) {
						file[i] = file[i].replace('/', '')
					}

				}
				res = await doDelete(
					upload_type,
					file.join(';')
				)
				console.log(res)
			} catch (e) {
				console.log(e)
			}
		}
		return 1
	} catch (e) {
		console.log(e)
		return -1
	}
}

//
export async function delete_from_fob(that, row, sqlcode, key_json, custom_fob) {
	try {
		let id = ''
		let msg = ''
		const main_key = key_json.main_key
		let msgTips = {
			success: '删除成功',
			fail: '删除失败',
		}
		if (key_json.successMsg) {
			msgTips.success = key_json.successMsg
		}
		if (key_json.failMsg) {
			msgTips.fail = key_json.failMsg
		}
		if (row && row[key_json.main_key]) {
			id = row[key_json.main_key]
			msg = '你确定要删除当前项吗'
		} else {
			//获取所选行
			if (key_json.selectRows) {
				if (that[key_json.selectRows].length > 0) {
					id = that[key_json.selectRows]
						.map((item) => "'" + item.type_id + "'")
						.join()
					msg = '你确定要删除选中项吗'
				} else {
					that.$baseMessage('未选中任何行', 'error')
					return false
				}
			} else {
				that.$baseMessage('操作异常', 'error')
				return false
			}
		}
		let field = {}
		let list = [{
			field: main_key,
			level: 1,
		}, ]
		field[main_key] = id
		if (key_json && key_json.confirmMsg) {
			msg = key_json.confirmMsg
		}
		that.$baseConfirm(msg, null, async () => {
			const data = JSON.parse(JSON.stringify(field))
			const sData = sql_helper.splicing_fob(4, sqlcode, list, data)
			const num = await ExecSql(sData.sql)
			if (num && Number(num) > 0) {
				delete_img_fob(that, row, sqlcode, key_json, custom_fob)
				that.$baseMessage(msgTips.success, 'success')
				let fetchData = that[key_json.fetchData] //that.fetchData
				if (fetchData) {
					console.log('fetchData')
					fetchData()
				} else if (custom_fob) {
					console.log('custom_fob')
					custom_fob()
				}

			} else {
				that.$baseMessage(msgTips.fail, 'error')
			}
		})
	} catch (e) {
		console.error(e)
		that.$baseMessage('执行异常', 'error')
	}
}
// 树形分页懒加载
export async function treePaging(that, config, options, row, treenode, resolve) {
	let listLoading = false
	//console.log(config, options)
	try {
		
		if (!that || !config || !options) {
			return {
				code: -1,
				msg: "that config options 不能为空"
			}
		}
		if (!options.sqlcode) {
			return {
				code: -1,
				msg: "options.sqlcode 不能为空"
			}
		}

		let jSqlcode = options.sqlcode
		let sqlcode_main = jSqlcode.zero
		let sqlcode_other = false
		let select_list_main = JSON.parse(JSON.stringify(options.select_list.main))
		let select_list_supply = []
		let nParent_id = 0
		let nSqlcode = sqlcode_main

		//主键字段
		let primary_id_filed = config.key.primary_id
		//懒加载字段
		let hasChildren_filed = 'hasChildren'
		//父节点字段
		let parent_id_filed = "parent_id"

		let double_parent_id_filed = "double_parent_id"
		//父节点数据
		let parent_info_filed = false
		//回调函数保存字段
		let sResolve_filed = "resolve"
		//table绑定ref字段
		let table_ref = false
		//table数据绑定字段
		let data_filed = "data"
		//table 分页total字段
		let total_filed = false
		if (config.listLoading) {
			listLoading = config.listLoading
		}

		//加载动画
		if (listLoading) {
			that[listLoading] = true
		}
		//根节点父节点
		if (config.key.double_parent_id_filed) {
			double_parent_id_filed = options.key.double_parent_id_filed
		}
		if (config.key.hasChildren) {
			hasChildren_filed = options.key.hasChildren
		}
		//根节点父节点
		if (options.key.parent_id) {
			nParent_id = options.key.parent_id
		}
		if (options.select_list.supply) {
			select_list_supply = options.select_list.supply
		}
		if (jSqlcode.other) {
			sqlcode_other = jSqlcode.other
		}
		if (config.data.total) {
			total_filed = config.data.total
		}
		if (config.data.data) {
			data_filed = config.data.data
		}
		//table 绑定的ref
		if (config.data.table_ref) {
			table_ref = config.data.table_ref
		}
		//保存回调函数
		if (config.resolve) {
			sResolve_filed = config.resolve
		}
		//父节点字段
		if (config.key.parent_id) {
			parent_id_filed = config.key.parent_id
		}
		//上级节点信息
		if (config.key.parent_info) {
			parent_info_filed = config.key.parent_info
		}
		let form = {}

		//分页表单字段
		if (config.form.page) {
			form = JSON.parse(JSON.stringify(that[config.form.page]))
		}
		//行数据是否传递
		if (row && row[primary_id_filed]) {
			form[parent_id_filed] = row[primary_id_filed]
		} else {
			//没有默认未更根节点
			form[parent_id_filed] = nParent_id
		}
		//查询回调函数保存情况
		if (resolve && (!that[sResolve_filed] || !that[sResolve_filed][form[parent_id_filed]])) {
			if (!that[sResolve_filed]) {
				that[sResolve_filed] = {}
			}
			that[sResolve_filed][form[parent_id_filed]] = resolve
		}
		//不存在当前回调则取上级节点的父节点id
		if (resolve) {} else if (that[sResolve_filed] && that[sResolve_filed][form[parent_id_filed]]) {

		} else if (
			parent_info_filed &&
			row && row[parent_info_filed] && row[parent_info_filed][double_parent_id_filed]) {
			form[parent_id_filed] = row[parent_info_filed][double_parent_id_filed]
		}
		//根节点带分页，非根节点不带分页
		if (form[parent_id_filed] == nParent_id) {
			//查询表单字段
			if (config.form.select) {
				form = Object.assign(form, that[config.form.select])
			}
			nSqlcode = sqlcode_main
			if (select_list_supply) {
				for (let i = 0; i < select_list_supply.length; i++) {
					select_list_main.push(select_list_supply[i])
				}
			}
			form = pageDeal(form)
		} else if (sqlcode_other) {
			nSqlcode = sqlcode_other
		}
		if (row) {
			const {
				data
			} = await QueryExec_fob(nSqlcode, select_list_main, form, )
			console.log(data)
			for (let i = 0; i < data.length; i++) {
				if (Number(data[i][hasChildren_filed]) > 0) {
					data[i][hasChildren_filed] = true
				} else {
					data[i][hasChildren_filed] = false
				}
			}
			if (resolve) {
				console.log('resolve')
				resolve(data)
			} else if (that[sResolve_filed] && that[sResolve_filed][form[parent_id_filed]]) {
				console.log('this.resolve')
				if (table_ref) {
					that.$set(that.$refs[table_ref].store.states.lazyTreeNodeMap, form[parent_id_filed], []);
				}
				that[sResolve_filed][form[parent_id_filed]](data)
			} else if (form[parent_id_filed] == nParent_id) {
				that[data_filed] = data
				that[sResolve_filed] = {}
				let count = GetCount(data);
				if (total_filed) {
					that[total_filed] = count
				}
				console.log('this.list')

			}

		} else {
			const data = await TreeDataDealExGetData(
				nSqlcode,
				select_list_main,
				form,
				nParent_id,
				primary_id_filed,
				parent_id_filed,
				hasChildren_filed
			)

			that[sResolve_filed] = {}
			that[data_filed] = data
			let count = GetCount(data);
			console.log(data)
			if (total_filed) {
				that[total_filed] = count
			}
		}

		if (listLoading) {
			that[listLoading] = false
		}
	} catch (e) {
		console.error(e)
		if (listLoading) {
			that[listLoading] = false
		}
	}
}

function GetCount(data) {
	if (!data) {
		return 0
	}
	if (data.length == 0) {
		return 0
	}
	if (!data[0].hasOwnProperty('Total')) {
		return 0
	}
	return Number(data[0]['Total'])
}

import request from '@/utils/request'
import {
	ExecSql,
	QueryExec
} from '@/api/table'
import {
	sql_helper
} from '@/global/sql_helper'

export function TreeDataDeal(data) {
	const list = data
	const tree = []
	const record = {}
	const length = list.length
	for (let i = 0; i < length; i++) {
		const item = list[i]

		item.children = [] // 重置 children
		record[item.id] = item
	}

	for (let i = 0; i < length; i++) {
		const item = list[i]

		if (item.p_id != 0) {
			if (record[item.p_id]) {
				record[item.p_id].children.push(item)
			}
		} else {
			tree.push(item)
		}
	}
	return tree
}
export function TreeDataDealEx2(data, sRootVal, primary_id, parent_id, haveChild, isDeleteEmptyChildren) {
	const list = data
	const tree = []
	const record = {}
	const length = list.length
	for (let i = 0; i < length; i++) {
		const item = list[i]
		if (typeof haveChild != 'undefined' && item.hasOwnProperty(haveChild)) {
			try {
				if (Number(item[haveChild]) > 0) {
					item[haveChild] = true;
				} else {
					item[haveChild] = false;
				}
			} catch (e) {
				console.log(e);
			}
		}
		//item.children = [] // 重置 children
		record[item[primary_id]] = item
	}
	for (let i = 0; i < length; i++) {
		const item = list[i]
		if (item[parent_id] == sRootVal) {
			tree.push(item)
		} else {
			if (record[item[parent_id]]) {
				if (!record[item[parent_id]].children) {
					record[item[parent_id]].children = [];
				}
				record[item[parent_id]].children.push(item)
			}
		}
	}
	if (isDeleteEmptyChildren) {
		for (let i = 0; i < length; i++) {
			const item = list[i]
			try {
				if (typeof item.children != 'undefined' && item.children.length == 0) {
					item.children = undefined;
				}

			} catch (e) {
				console.log(e);
			}
		}
	}
	return tree
}


//获取下拉树TreeSelect sql 语句中要标明 as name as value字段别名
//sRootVal 根节点的值 primary_id 父子关系中的id字段名字  parent_id  父id字段名字 
export function TreeDataDealEx(aData, sRootVal, primary_id, parent_id, haveChild, isDeleteEmptyChildren) {
	try {
		function findChildren(perData, aDist, deep) {
			if (!deep) {
				deep = 0
			}
			if (perData.children == undefined) {
				perData.children = [];
			}
			//限制递归深度
			if (deep > 500) {
				return perData
			}
			//待删除元素位置
			let deleteList = []
			let item = '';
			for (let i = 0; i < aDist.length; i++) {
				item = aDist[i]
				if (perData[primary_id] == item[parent_id]) {
					deleteList.push(i)
					perData.children.push(findChildren(item, aDist, ++deep));
				}
			}
			for (let i = deleteList.length - 1; i > -1; i--) {
				aDist.splice(deleteList[i], 1)
			}
			if (typeof haveChild != 'undefined' && perData.hasOwnProperty(haveChild)) {
				try {
					if (Number(perData[haveChild]) > 0) {
						perData[haveChild] = true;
					} else {
						perData[haveChild] = false;
					}
				} catch (e) {
					console.log(e);
				}
			}
			return perData;
		}

		function deleteEmptyChildren(node, nDeep) {
			if (!nDeep) {
				nDeep = 0
			}
			if (!node) {
				node = []
			}
			let length = node.length
			let item;
			let children;
			for (let i = 0; i < length; i++) {
				item = node[i]
				children = item.children
				if (!children || children.length == 0) {
					item.children = undefined
					continue
				}
				item.children = deleteEmptyChildren(children, nDeep + 1)
			}
			return node
		}
		let aDist = [];
		let aDataTemp = aData.filter(item => item[parent_id] != sRootVal && item[parent_id] != null && item[
				parent_id] !=
			'null')
		aData = aData.filter(item => item[parent_id] == sRootVal || item[parent_id] == null || item[parent_id] ==
			'null')
		for (let t in aData) {
			aDist.push(findChildren(aData[t], aDataTemp));
		}
		if (isDeleteEmptyChildren) {
			aDist = deleteEmptyChildren(aDist)
		}
		return aDist
	} catch (e) {
		console.log(e)
		return []
	}

}
export async function TreeDataDealGetData(sData, sRootVal, primary_id, parent_id, haveChildren) {
	try {
		const {
			data,
			totalCount
		} = await QueryExec(sData);
		//return TreeDataDealEx(data, sRootVal, primary_id, parent_id, haveChildren)
		return TreeDataDealEx2(data, sRootVal, primary_id, parent_id, haveChildren)
	} catch (e) {
		console.log(e)
		return []
	}
}
export async function TreeDataDealExGetData(sqlcode, list, filed, sRootVal, primary_id, parent_id, haveChildren) {
	try {
		let queryForm = JSON.parse(JSON.stringify(filed))
		const obj = sql_helper.splicing_fob(1, sqlcode, list, queryForm)
		return await TreeDataDealGetData(obj.sql, sRootVal, primary_id, parent_id, haveChildren)
	} catch (e) {
		console.log(e)
		return []
	}
}
//从array2合并到data
export async function TreeDataSecondary(data, array2, primary_id, parent_id) {
	try {
		let temp = JSON.parse(JSON.stringify(data))

		function find(array, key) {
			let length = array.length
			let item = ''
			for (let i = 0; i < length; i++) {
				item = array[i]
				if (item[primary_id] == key) {
					return item;
				}
				if (item.children && item.children.length > 0) {
					item = find(item.children, key);
					if (item) {
						return item
					}
				}
			}
			return undefined
		}
		let length = array2.length
		let key = ''
		let item = ''
		let parent = ''
		for (let i = 0; i < length; i++) {
			item = array2[i]
			key = item[parent_id]
			if (parent && parent[primary_id] == key) {
				if (!parent.children) {
					parent.children = []
				}
				parent.children.push(item)
				continue
			}
			parent = find(temp, key)
			if (parent) {
				if (!parent.children) {
					parent.children = []
				}
				parent.children.push(item)
			}
		}
		return data
	} catch (e) {
		console.log(e)
		return data
	}

}

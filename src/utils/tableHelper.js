export function handleSelectionChange(val, row) {
	try {
		if (val) {

		} else {
			val = []
		}
		if (row) {
			let selected = val.length && val.indexOf(row) !== -1
			// true就是选中，0或者false是取消选中
			let flag = false
			if (selected == true) {
				flag = true
			} else if (selected == false || selected == 0) {
				flag = false
			} else {
				flag = false
			}
			return {
				code: 200,
				data: flag
			}
		}
	} catch (e) {
		console.log(e)
	}
	return {
		code: 500,
		data: false
	}
}

export function toggleSelectionList(that, tableRef, rows) {
	if (!rows) {
		return;
	}
	rows.forEach(row => {
		toggleSelection(that, tableRef, row)
	});
}

export function toggleSelection(that, tableRef, row) {
	try {
		if (!row) {
			return;
		}

		that.$nextTick(() => {
			if (that.$refs[tableRef]) {
				that.$refs[tableRef].toggleRowSelection(row)
			} else {
				let index = setInterval(() => {
					if (that.$refs[tableRef]) {
						clearInterval(index)
						that.$refs[tableRef].toggleRowSelection(row)
					}
				})
			}
		})
	} catch (e) {
		console.log(e)
	}

}
export function setCurrentRowSelectTopOne(that, tableRef, rows) {

	if (!rows || rows.length == 0) {
		return;
	}
	setCurrentRow(that, tableRef, rows[0])
	return rows[0]
}

export function setCurrentRowSelectTopFirstPageFirst(that, tableRef, rows, form, page) {
	try {

		if (!rows || rows.length == 0 || !form) {
			return;
		}
		if (!page) {
			page = 'pageNo'
		}
		if (form[page] && form[page] == 1) {
			setCurrentRow(that, tableRef, rows[0])
			return rows[0]
		}
	} catch (e) {
		console.log(e)
	}

}

export function setCurrentRow(that, tableRef, row) {
	try {
		if (!row) {
			return;
		}
		that.$nextTick(() => {
			if (that.$refs[tableRef]) {
				that.$refs[tableRef].setCurrentRow(row)
			} else {
				let index = setInterval(() => {
					if (that.$refs[tableRef]) {
						clearInterval(index)
						that.$refs[tableRef].setCurrentRow(row)
					}
				})
			}
		})
	} catch (e) {
		console.log(e)
	}
}
export default {
	toggleSelection,
	setCurrentRowSelectTopOne,
	setCurrentRowSelectTopFirstPageFirst,
	setCurrentRow,
	toggleSelectionList
}

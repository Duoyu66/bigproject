export const Option = {
	luckysheetOption: {
		container: 'luckysheet',
		lang: 'zh',
		rowHeaderWidth: 0,
		columnHeaderHeight: 0,
		enableAddRow: false,
		showtoolbar: false,
		showinfobar: false,
		showsheetbar: false,
		sheetFormulaBar: false,
		showstatisticBar: false,
		showstatisticBarConfig: {
			count: false, // 计数栏
			view: false, // 打印视图
			zoom: false, // 缩放
		},
		showsheetbarConfig: {
			menu: true,
		},
		data: [{
			config: {
				"merge": {}, //合并单元格
				"rowlen": {}, //表格行高
				"columnlen": {}, //表格列宽
				"rowhidden": {}, //隐藏行
				"colhidden": {}, //隐藏列
				"borderInfo": {}, //边框
				"authority": {}, //工作表保护

			},
		}]
	}
}

function numberToChar(i) {
	return String.fromCharCode(i);
}

function CharToNumber(a) {
	return a.charCodeAt();
}

export function colToStr(col) {
	try {
		let colChar = ''
		let maxChar = 25
		let a = CharToNumber('A')
		if (col <= maxChar) {
			colChar = numberToChar(a + col)
		} else {
			let cirle = parseInt(col / maxChar)
			let remainder = col % maxChar;
			if (remainder > 0) {
				remainder = remainder - 1
			}
			for (let i = 0; i < cirle; i++) {
				colChar = colChar + 'A'
			}
			colChar = colChar + numberToChar(a + remainder)
		}
		return colChar
	} catch (e) {
		console.log(e)
		return col
	}

}
export default {
	Option,
	colToStr
}

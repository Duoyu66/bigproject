(function(window, $) {
	"use strict";;
	let UI = GrapeCity.UI;
	let contentMange = function() {

	}
	contentMange.prototype.GetCopyContent = function() {
		try {
			let _id = 'luckysheet-copy-content';
			let id = '#' + _id
			let $copyContent = $(id);
			if ($copyContent && $copyContent.length > 0) {
				return $copyContent;
			}
			$copyContent = $('<div id="' + _id + '" style="display:none" ></div>');
			$('body').append($copyContent);
			return $copyContent;
		} catch (e) {
			console.log(e)
		}
	}
	contentMange.prototype.GetCopyContentHtml = function() {
		try {
			return this.GetCopyContent().html()
		} catch (e) {
			console.log(e)
		}
	}
	contentMange.prototype.CopyContentSetOrClear = function(txt) {
		try {
			let $copyContent = this.GetCopyContent();
			$copyContent.empty();
			if (txt) {
				$copyContent.html(txt);
			}
			return $copyContent;
		} catch (e) {
			console.log(e);
		}
	}
	let styleConvert = function(spread_init) {
		this.setSpread(spread_init);
	}
	styleConvert.prototype.setSpread = function(spread_init) {
		this.spreadDefult = new spreadDefult(spread_init);
	}
	styleConvert.prototype.getQKBorder = function(width, type, color) {
		let bordertype = "";
		let borderType = this.getBorderJson('paste');
		if (width.indexOf("pt") > -1) {
			width = parseFloat(width);

			if (width < 1) {

			} else if (width < 1.5) {
				bordertype = "Medium";
			} else {
				bordertype = "Thick";
			}
		} else {
			width = parseFloat(width);

			if (width < 2) {

			} else if (width < 3) {
				bordertype = "Medium";
			} else {
				bordertype = "Thick";
			}
		}

		let style = 0;
		type = type.toLowerCase();

		if (type == "double") {
			style = 6;
		} else if (type == "dotted") {
			if (bordertype == "Medium" || bordertype == "Thick") {
				style = borderType['mediumDashDot'];
			} else {
				style = borderType['dotted'];
			}
		} else if (type == "dashed") {
			if (bordertype == "Medium" || bordertype == "Thick") {
				style = borderType['mediumDashed'];
			} else {
				style = borderType['dashed'];
			}
		} else if (type == "solid") {
			if (bordertype == "Medium") {
				style = borderType['medium'];
			} else if (bordertype == "Thick") {
				style = borderType['thick'];
			} else {
				style = borderType['thin'];
			}
		}

		return [style, color];
	}
	styleConvert.prototype.getBorderJson = function(type) {
		let result = '';
		let borderType = {
			"0": "none",
			"1": "thin",
			"2": "medium",
			"3": "dashed",
			"4": "dotted",
			"5": "thick",
			"6": "double",
			"7": "hair",
			"8": "mediumDashed",
			"9": "dashDot",
			"10": "mediumDashDot",
			"11": "dashDotDot",
			"12": "mediumDashDotDot",
			"13": "slantedDashDot"
		};
		switch (type) {
			case 'paste':
				result = {}
				for (let key in borderType) {
					if (key && borderType[key]) {
						result[borderType[key]] = parseFloat(key);
					}

				}
				break;
			case 'copy':
			default:
				result = borderType;
				break;
		}
		return result;
	}
	styleConvert.prototype.getHtmlBorderStyle = function(type, color) {
		if (!type) {
			type = 0;
		}
		if (!color) {
			color = '';
		}
		let style = "";
		let borderType = this.getBorderJson('copy');
		type = borderType[type.toString()];

		if (type.indexOf("medium") > -1) {
			style += "1pt ";
		} else if (type == "thick") {
			style += "1.5pt ";
		} else {
			style += "0.5pt ";
		}

		if (type == "hair") {
			style += "double ";
		} else if (type.indexOf("dashDotDot") > -1) {
			style += "dashDotDot ";
		} else if (type.indexOf("dashDot") > -1) {
			style += "dashDot ";
		} else if (type.indexOf("dotted") > -1) {
			style += "dotted ";
		} else if (type.indexOf("dashed") > -1) {
			style += "dashed ";
		} else {
			style += "solid ";
		}
		return style + color;
	}
	styleConvert.prototype.vAlignDeal = function(vaule, type) {
		try {
			let option = {
				top: 0,
				bottom: 2,
				center: 1,
				top: 3,
				'text-top': 3,
				'flex-start': 0,
				'flex-end': 2
			}
			let result = '';
			switch (type) {
				case 'copy':
					if (vaule) {
						for (let key in option) {
							if (option[key] == vaule) {
								result = key;
								break;
							}
						}
					}
					break;
				case 'paste':
					if (typeof option[vaule] != 'undefined') {
						result = option[vaule];
					} else {
						result = 0;
					}
					break
			}
			return {
				code: 1,
				data: result,
				msg: ''
			}
		} catch (e) {
			console.log(e);
			return {
				code: 1,
				data: '',
				msg: e
			}
		}
	}
	styleConvert.prototype.hAlignDeal = function(vaule, type) {
		try {
			let option = {
				left: 0,
				right: 2,
				center: 1,
				//right: 3,
			}
			let result = '';
			switch (type) {
				case 'copy':
					if (vaule) {
						for (let key in option) {
							if (option[key] == vaule) {
								result = key;
								break;
							}
						}
					}
					break;
				case 'paste':
					if (typeof option[vaule] != 'undefined') {
						result = option[vaule];
					} else {
						result = 0;
					}
					break
			}
			return {
				code: 1,
				data: result,
				msg: ''
			}
		} catch (e) {
			console.log(e);
			return {
				code: 1,
				data: '',
				msg: e
			}
		}
	}
	//字体处理
	styleConvert.prototype.fontDeal = async function(vaule, type) {
		try {
			let _type = 0;
			let temp = '',
				index = 0,
				falg = false,
				array_item = undefined,
				result = '';
			switch (type) {
				case 'copy':
					_type = 0;
					if (!vaule) {
						vaule = await this.spreadDefult._getDefaultFont();
					}
					temp = vaule.split(/\s/g);
					break;
				case 'paste':
					_type = 1;
					break;
				default:
					switch (typeof vaule) {
						case 'string':
							_type = 0;
							if (!vaule) {
								vaule = await this.spreadDefult._getDefaultFont();
							}
							temp = vaule.split(/\s/g);
							break
						case 'object':
							_type = 1;
							break
					}
					break;
			}
			let option = {
				weight: {
					array: ['bold'],
					default: 'normal',
					label: 'font-weight',
					//array_index: 'first',
				},
				style: {
					array: ['italic'],
					default: 'normal',
					//array_index: 'second',
					label: 'font-style',
				},
				size: {
					regular: [/\d+px$/g, /\d+pt$/g, /\d+em$/g, /\d+rem$/g],
					//array_index: 'third',
					label: 'font-size',
				},
				family: {
					default: '宋体',
					array_index: 'last',
					label: 'font-family',
				},
				array_sort: ['weight', 'style', 'size', 'family'],
				max_length: 4,
			}

			switch (_type) {
				case 0:
					//复制
					result = {};
					for (let i = 0; i < temp.length; i++) {
						falg = false;
						array_item = temp[i];
						for (let num = 0; num < option.array_sort.length; num++) {
							falg = false;
							let key = option.array_sort[num];
							if (!key || !option[key]) {
								continue;
							}

							let item = option[key];
							if (item.isFind) {
								continue;
							}
							//正则
							if (item.regular) {
								for (let j = 0; j < item.regular.length; j++) {
									index = array_item.search(item.regular[j]);
									if (index >= 0) {
										falg = true;
										break;
									}
								}
							}
							//数组元素匹配
							if (!falg && item.array) {
								if (item.array.indexOf(array_item) >= 0) {
									falg = true;
								}
							}
							if (falg) {
								result[key] = array_item;
								option[key].isFind = true;
								break;
							}
							if (!falg && item.array_index) {
								index = -1;
								switch (item.array_index) {
									case 'first':
										index = 0;
										break;
									case 'last':
										index = temp.length - 1;
										break
								}
								if (index > 0) {
									if (index > option.max_length - 1 && index - 1 >= 0) {
										result[key] = temp[index - 1] + ' ' + temp[index];
									} else {
										result[key] = array_item;
									}
								}
							}

						}
					}
					//将未找到的值赋值为默认值
					for (let num = 0; num < option.array_sort.length; num++) {
						let key = option.array_sort[num];
						if (!key || !option[key]) {
							continue;
						}
						let item = option[key];
						let label = key;
						if (item.label) {
							label = item.label;
						}
						if (!result[key] && item.default) {
							result[label] = item.default;
						} else if (result[key]) {
							result[label] = result[key];
							delete result[key];
						}
					}
					break;
				case 1:
					//粘贴
					result = '';
					if (vaule.font_weight == 1) {
						result = result + 'bold'
					} else {
						result = result + 'normal'
					}
					if (vaule.font_style == 1) {
						result = result + ' italic'
					} else {
						result = result + ' normal'
					}
					if (vaule.font_size) {
						result = result + ' ' + vaule.font_size;
					}
					if (vaule.font_family) {
						result = result + ' ' + vaule.font_family;
					}
					break;
			}
			return {
				code: 1,
				data: result,
				msg: '',
			}
		} catch (e) {
			console.log(e);
			return {
				code: -1,
				data: undefined,
				msg: e,
			}
		}

	}
	// UI.Range
	// this.row = r;
	// this.rowCount = rc;
	// this.col = c;
	// this.colCount = cc
	let copyManual = function(spread_init) {
		this.setSpread(spread_init);
		this.styleConvert = new styleConvert(spread_init);
		this.contentMange = new contentMange();
		this.pakoCompress = new pakoCompress();
		this.jsHelper = new jsHelper();
	}
	copyManual.prototype.setSpread = function(spread_init) {
		this.spreadDefult = new spreadDefult(spread_init);
	}
	//判断单元格是否位置合并的单元格中，左上角单元格不算
	copyManual.prototype.cellIsInSideSpan = function(row, col) {
		let spans = this.spans;
		for (let i = 0; i < spans.length; i++) {
			let range = spans[i];
			if (row >= range.row && row <= range.row + range.rowCount - 1 && col >= range.col && col <= range
				.col + range.colCount - 1) {
				if (row == range.row && col == range.col) {
					return false
				}
				return true
			}
		}
		return false
	}
	//当前单元格是否位于合并单元格的左上角
	copyManual.prototype.getSpanByCell = function(row, col) {
		let spans = this.spans;
		for (let i = 0; i < spans.length; i++) {
			let range = spans[i];
			if (range.row == row && range.col == col) {
				return {
					code: 1,
					data: range
				};
			}
		}
		return {
			code: 0,
			data: 0,
		}
	}
	copyManual.prototype.SplicingHtml = function(copyJson, option) {
		let tbody = '';
		let colgroup = '';
		let table = '';
		let rowcolsize = '';
		for (let tr in copyJson.tbody) {
			let trHtml = '';
			for (let td in copyJson.tbody[tr]) {
				let style = '';
				let td_value = copyJson.tbody[tr][td];
				for (let attr in td_value.style) {
					if (!td_value.style[attr]) {
						continue;
					}
					switch (typeof td_value.style[attr]) {
						case 'string':
							style = style + '' + attr + ':' + td_value.style[attr] + ';'
							break;
						case 'object':
							for (let key in td_value.style[attr]) {
								if (!td_value.style[attr][key]) {
									continue;
								}
								style = style + '' + key + ':' + td_value.style[attr][key] + ';'
							}
							break;
					}

				}
				let td_html =
					`<td rowspan="${td_value.rowspan}" colspan="${td_value.colspan}" style="${style}" word-wraps="${td_value.wrod_wraps}">${td_value.value}</td>`
				trHtml = trHtml + td_html;
			}
			if (trHtml) {
				trHtml = `<tr> ${trHtml} </tr>`;
			}
			tbody = tbody + trHtml;
		}
		tbody = `<tbody> ${tbody} </tbody>`;
		for (let col in copyJson.rowcolsize.col) {
			let vaule = copyJson.rowcolsize.col[col];
			let columnHtml =
				`<column width="${vaule.width}" data-col-num="${vaule.index}" ishide ="${vaule.isVisible}"></column>`;
			rowcolsize = rowcolsize + columnHtml;
			columnHtml = ` <colgroup width="${vaule.width}"></colgroup>`;
			colgroup = colgroup + columnHtml;
		}
		table = `<table data-type="luckysheet_copy_action_table"> ${colgroup}${tbody}</table>`
		for (let row in copyJson.rowcolsize.row) {
			let vaule = copyJson.rowcolsize.row[row];
			let rowumnHtml =
				`<row height="${vaule.height}" data-row-num="${vaule.index}" ishide ="${vaule.isVisible}"></row>`;
			rowcolsize = rowcolsize + rowumnHtml;
		}
		if (rowcolsize) {
			rowcolsize = `<rowcolsize>${rowcolsize}</rowcolsize>`
		}
		let copyText = '';
		if (option && option.isCopySheetInfo) {
			copyText = '<sheet data-sheet-name ="' + copyJson.sheet_name + '">' + rowcolsize +
				'<table data-type="luckysheet_copy_action_table">' + table + '</table></sheet>';
		} else {
			copyText = rowcolsize + table;
		}
		return copyText;
	}
	copyManual.prototype.sheetEventCopy = async function(range, sheet_id, setting) {
		let copyText = '';
		try {
			let defaultSetting = {
				isCopyHide: {
					row: true,
					col: true
				},
				isCopySheetInfo: false,
			}
			if (!setting) {
				setting = {}
			}
			setting = $.extend({}, defaultSetting, setting);
			let copyJson = {
				rowcolsize: {
					row: {

					},
					col: {

					}
				},
				tbody: {

				}
			};
			let sheet = '';
			sheet = await this.spreadDefult.getSheetById(sheet_id);
			let sheet_name = await this.spreadDefult.getSheetName(sheet_id);
			copyJson.sheet_name = sheet_name;
			// if (typeof sheet_id == 'undefined') {
			//     sheet = spread_init.getActiveSheet();
			// } else {
			//     let sheetCount = spread_init.getSheetCount();
			//     if (sheet_id < 0 || sheet_id > sheetCount) {
			//         return {
			//             code: -1,
			//             data: copyText,
			//             msg: 'sheet_id超出可用范围'
			//         }
			//     }
			//     sheet = spread_init.getSheet(sheet_id);
			// }
			if (!sheet) {
				return {
					code: -1,
					data: copyText,
					msg: 'sheet获取失败'
				}
			}
			if (!range) {
				range = await this.spreadDefult.getSelections(sheet_id)
				//range = sheet.getSelections();
				if (range.length > 0) {
					range = range[0];
				}
			}
			let value, style, wrod_wraps;
			let option = {
				style: {
					border: {
						borderBottom: {
							label: 'border-bottom',
						},
						borderLeft: {
							label: 'border-left',
						},
						borderRight: {
							label: 'border-right',
						},
						borderTop: {
							label: 'border-top',
						}
					}
				}
			}
			this.spans = sheet.getSpans(range);


			for (let row = range.row; row < range.row + range.rowCount; row++) {
				let tr = {};
				let rowIsVisible = sheet.getRowVisible(row);
				if (!rowIsVisible && !setting.isCopyHide.row) {
					continue;
				}
				if (typeof copyJson.rowcolsize.row[row] == 'undefined') {
					copyJson.rowcolsize.row[row] = {
						height: sheet.getRowHeight(row),
						isVisible: rowIsVisible,
						index: row - range.row
					};
				}
				for (let col = range.col; col < range.col + range.colCount; col++) {
					try {
						if (row == 4 && col == 4) {

						}
						let colIsVisible = sheet.getColumnVisible(col);
						if (!colIsVisible && !setting.isCopyHide.col) {
							continue;
						}
						if (typeof copyJson.rowcolsize.col[col] == 'undefined') {
							copyJson.rowcolsize.col[col] = {
								width: sheet.getColumnWidth(col),
								isVisible: colIsVisible,
								index: col - range.col
							};
						}
						let td = {
							style: {

							},
							row: row,
							col: col
						};
						let isInSideSpan = this.cellIsInSideSpan(row, col);
						if (isInSideSpan) {
							continue;
						}
						let spanRange = this.getSpanByCell(row, col);
						if (spanRange.code > 0) {
							td.rowspan = spanRange.data.rowCount;
							td.colspan = spanRange.data.colCount;
						} else {
							td.rowspan = 1;
							td.colspan = 1;
						}
						tr['td' + col] = td;
						td.value = sheet.getValue(row, col);
						if (!td.value && td.value != 0) {
							td.value = '';
						}
						if (td.value == null || typeof td.value == 'undefined') {
							td.value = '';
						}
						style = sheet.getStyle(row, col);
						if (!style) {
							td.wrod_wraps = 'auto-wraps';
							continue;
						}
						if (style.wordWrap) {
							td.wrod_wraps = 'auto-wraps';
						} else if (style.wordWrap == false) {
							td.wrod_wraps = 'break';
						}
						td.style.font = (await this.styleConvert.fontDeal(style.font, 'copy')).data;
						td.style['background-color'] = style.backColor;
						td.style['color'] = style.foreColor;
						td.style['text-align'] = this.styleConvert.hAlignDeal(style.hAlign, 'copy').data;
						td.style['align-items'] = this.styleConvert.vAlignDeal(style.vAlign, 'copy').data;
						for (let key in option.style.border) {
							if (!style[key]) {
								continue;
							}
							td.style[option.style.border[key].label] = this.styleConvert.getHtmlBorderStyle(
								style[key].style, style[key].color);
						}
						//console.log('style', style)
					} catch (e) {
						console.log(e)
					}
				}
				copyJson.tbody['tr' + row] = tr;

			}
			copyText = this.SplicingHtml(copyJson, setting);
			return {
				code: 1,
				data: copyText,
				msg: ''
			};
		} catch (e) {
			console.log(e);
			return {
				code: -1,
				data: copyText,
				msg: e
			};
		}
	}
	copyManual.prototype.ManualCopy = async function(rowRange, colRange, isCompressed, isShowRange, Option) {
		let sTemp = undefined
		try {
			const defalutoption = {
				isCopyHide: {
					row: false,
					col: false
				},
				isCopySheetInfo: false, //是否复制sheet信息
				isShowSelect: false, //是否展示所选区域
				isDeleteUselessTag: true, //是否删除无用的数据
				isMultipleSheet: false, //{index:{colRange:[0,0],rowRange:[0,0]}}
				isfrozen: true,
				index: undefined,
			}
			if (!Option) {
				Option = {};
			}
			Option = Object.assign(defalutoption, Option);
			Option.isShowSelect = isShowRange;
			if (!rowRange) {
				rowRange = [0, 0];
			}
			if (!colRange) {
				colRange = [0, 0];
			}
			let html = '',
				vaule, range;
			if (Option.isMultipleSheet) {
				//多页复制强制打开复制sheet信息
				Option.isCopySheetInfo = true;
				let sheet_count = await this.spreadDefult.getSheetCount()
				let isMultipleSheet = Option.isMultipleSheet
				let area = {}
				let key = Object.keys(isMultipleSheet)
				let length = key.length
				for (let i = 0; i < length; i++) {
					let index = key[i]
					area = {}
					if (typeof index == 'undefined') {
						continue
					}
					if (index < 0 || index > sheet_count - 1) {
						continue
					}
					if (isMultipleSheet[index].colRange) {
						area.colRange = isMultipleSheet[index].colRange
					} else {
						area.colRange = colRange
					}
					if (isMultipleSheet[index].rowRange) {
						area.rowRange = isMultipleSheet[index].rowRange
					} else {
						area.rowRange = rowRange
					}
					range = new UI.Range(area.rowRange[0], area.colRange[0], area.rowRange[1] - area
						.rowRange[0] + 1, area.colRange[1] - area.colRange[0] + 1);
					vaule = await this.sheetEventCopy(range, index, Option);
					if (Option.isDeleteUselessTag) {
						vaule.data = this.DeleteUselessTag(vaule.data)
					}
					html = html + vaule.data;
				}
			} else {
				range = new UI.Range(rowRange[0], colRange[0], rowRange[1] - rowRange[0] + 1, colRange[1] -
					colRange[0] + 1);
				vaule = await this.sheetEventCopy(range, Option.index, Option);

				if (Option.isDeleteUselessTag) {
					vaule.data = this.DeleteUselessTag(vaule.data)
				}
				html = vaule.data;
			}
			if (isCompressed) {
				let Compressed = this.pakoCompress.zip(html)
				console.log('压缩前后变化', '压缩后' + Compressed.length, '压缩前' + html.length)
				return {
					code: 1,
					data: Compressed,
					message: ''
				}
			} else {
				return {
					code: 1,
					data: html,
					message: ''
				}
			}
		} catch (e) {
			console.log(e)
		}
	}
	copyManual.prototype.DeleteUselessTag = function(txt) {
		try {
			function sortNum(a, b) {
				return a - b
			}

			function getNum(set, num) {
				try {
					if (num) {
						return parseInt(num)
					}
					let array = Array.from(set)

					if (array.length > 0) {
						array.sort(sortNum)
						num = array[array.length - 1] + 1
					} else {
						num = 0
					}

				} catch (e) {
					console.log(e)
				} finally {
					if (!set.has(num)) {
						set.add(num)
					}
				}

			}
			if (txt) {
				this.contentMange.CopyContentSetOrClear(txt);
			}
			let info_col = {}
			let info_row = {}

			let nTemp = 0;
			let row_num = 0;
			let col_num = 0;
			let row_num_set = new Set();
			let col_num_set = new Set();
			let height = 0;
			let width = 0;
			let $rowcolsize = this.contentMange.GetCopyContent()
			if (!$rowcolsize) {
				return
			}
			$rowcolsize.find('column').each(function() {
				let $column = $(this);
				let isHide = $column.attr('ishide')
				col_num = $column.attr('data-col-num');
				col_num = getNum(col_num_set, col_num);
				width = $column.attr('width');
				if (isHide.toLowerCase() == '"true"') {
					isHide = true
				} else {
					isHide = false
				}
				if (height) {
					row_height[row_num] = height
				}
				if (info_col[col_num]) {
					info_col[col_num].isHide = isHide
				} else {
					info_col[col_num] = {
						col_num: col_num,
						isHide: isHide
					}
				}
			})

			$rowcolsize.find('row').each(function() {
				let $row = $(this);
				let isHide = $row.attr('ishide')
				row_num = $row.attr('data-row-num');
				row_num = getNum(row_num_set, row_num);
				height = $row.attr('height');
				if (isHide.toLowerCase() == '"true"') {
					isHide = true
				} else {
					isHide = false
				}
				if (info_row[row_num]) {
					info_row[row_num].isHide = isHide
				} else {
					info_row[row_num] = {
						row_num: row_num,
						isHide: isHide
					}
				}
			})
			let info_col_list = Object.values(info_row)
			let temp = info_col_list.filter((e) => {
				if (e.isHide) {
					return e
				}
			})
			let $tr_list = $rowcolsize.find('tr');
			let tr_list_length = $tr_list.length
			for (let i = 0; i < temp.length; i++) {
				let item = temp[i]
				if (item.row_num > tr_list_length - 1 && item.row_num < 0) {
					continue
				}
				$($tr_list[item.row_num]).empty();
			}
			//
			let style_list = ['text-align', 'align-items', 'font-family', 'border-left', 'border-right',
				'border-top',
				'border-bottom'
			]
			$tr_list.each(function() {
				let $tr = $(this);

				let $td_list = $tr.find('td')
				let td_list_length = $td_list.length - 1
				let delete_index = []
				let flag = false
				for (; td_list_length >= 0; td_list_length--) {

					if (flag) {
						break
					}
					let td = $td_list[td_list_length]
					let $td = $(td)
					if ($td.text()) {
						flag = true
						continue
					}
					for (let i = 0; i < style_list.length; i++) {
						if (td.style[style_list[i]]) {
							flag = true
							break
						}
					}
					if (flag) {
						break
					}

					if ($td.attr('word-wraps-excel')) {
						flag = true
						continue
					}
					if (!flag) {
						delete_index.push(td_list_length)
					}
				}
				for (let i = 0; i < delete_index.length; i++) {
					$($td_list[delete_index[i]]).remove()
				}

			})
			let result = this.contentMange.GetCopyContentHtml();
			return result
		} catch (e) {
			console.log(e)
		} finally {

		}
	}

	let spreadDefult = function(spread_init) {
		this.spread = spread_init;

	};
	spreadDefult.prototype._getDefaultFont = async function(sheet_id) {
		try {
			let sheet = await this.getSheetById(sheet_id);
			return sheet._render._getDefaultFont();
		} catch (e) {
			console.log(e)
			return ''
		}

	}
	spreadDefult.prototype.setColumnCount = async function(columnCount, sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		sheet.setColumnCount(columnCount);
	}
	spreadDefult.prototype.getColumnCount = async function(sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		sheet.getColumnCount();
	}
	spreadDefult.prototype.setRowCount = async function(rowCount, sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		sheet.setRowCount(rowCount);
	}
	spreadDefult.prototype.getRowCount = async function(sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		sheet.getRowCount();
	}
	//是否冻结刷新
	spreadDefult.prototype.isPaintSuspended = async function(bol) {
		let spread = await this.getDefaultSpred();
		spread.isPaintSuspended(bol);
	}
	//添加sheet页
	spreadDefult.prototype.addSheet = async function(index, sheet) {
		let spread = await this.getDefaultSpred();
		spread.addSheet(index, sheet);
		return await this.getSheetCount();
	}
	//添加单元格合并
	spreadDefult.prototype.addSpan = async function(row, col, rowCount, colCount, sheet_id) {
		try {
			let sheet = await this.getSheetById(sheet_id);
			row = parseInt(row);
			col = parseInt(col);
			rowCount = parseInt(rowCount);
			colCount = parseInt(colCount);
			sheet.addSpan(row, col, rowCount, colCount);
			return {
				col: {
					min: col,
					max: col + colCount - 1
				},
				row: {
					min: row,
					max: row + rowCount - 1
				}
			}
		} catch (e) {
			console.log(e);
		}
	}
	//设置单元格值
	spreadDefult.prototype.setValue = async function(row, col, value, sheet_id) {
		try {
			if (!value || value.trim() == '') {
				value = '';
				return
			}
			let sheet = await this.getSheetById(sheet_id);
			row = parseInt(row);
			col = parseInt(col);
			sheet.setValue(row, col, value);
		} catch (e) {
			console.log(e);
		}
	}
	spreadDefult.prototype.getStyle = async function(row, col, sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		sheet.getStyle(parseInt(row), parseInt(col));
	}
	//设置样式
	spreadDefult.prototype.setStyle = async function(row, col, style, sheet_id, isCover) {
		try {

			let sheet = await this.getSheetById(sheet_id);
			row = parseInt(row);
			col = parseInt(col);
			if (isCover) {
				return sheet.setStyle(parseInt(row), parseInt(col), style);
			}
			let style_old = sheet.getStyle(parseInt(row), parseInt(col));
			if (!style_old) {
				style_old = new UI.Style()
			}
			for (let key in style_old) {
				if (style[key]) {
					style_old[key] = style[key]
				}
			}
			return sheet.setStyle(parseInt(row), parseInt(col), style_old);
		} catch (e) {
			console.log(e)
		}

	}
	//设置行是否可见
	spreadDefult.prototype.setRowVisible = async function(row, value, sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		return sheet.setRowVisible(parseInt(row), value);
	}
	//设置行高
	spreadDefult.prototype.setRowHeight = async function(row, value, sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		return sheet.setRowHeight(parseInt(row), value);
	}
	//设置列是否可见
	spreadDefult.prototype.setColumnVisible = async function(col, value, sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		return sheet.setColumnVisible(parseInt(col), value);
	}
	//设置列宽
	spreadDefult.prototype.setColumnWidth = async function(col, width, sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		return sheet.setColumnWidth(parseInt(col), width);
	}
	//获取sheet名称
	spreadDefult.prototype.getSheetName = async function(sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		return sheet.getName();
	}
	//设置sheet名称
	spreadDefult.prototype.setSheetName = async function(sheet_id, name) {
		try {
			let sheet = await this.getSheetById(sheet_id);
			sheet.setName(name);
			return await this.getSheetName(sheet_id);
		} catch (e) {
			console.log(e)
			return await this.getSheetName(sheet_id);
		}
	}
	//获取选中区域
	spreadDefult.prototype.getSelections = async function(sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		return sheet.getSelections(sheet_id);
	}
	//获取spread的实例
	spreadDefult.prototype.getDefaultSpred = async function(spread_init) {
		if (spread_init) {
			return spread_init
		}
		if (this.spread) {
			return this.spread
		}
		return spread;
	}
	//获取当前sheet页
	spreadDefult.prototype.getActiveSheet = async function(spread_init) {
		if (!spread_init) {
			spread_init = await this.getDefaultSpred();
		}
		return spread_init.getActiveSheet();
	}
	spreadDefult.prototype.getActiveSheetIndex = async function(spread_init) {
		if (!spread_init) {
			spread_init = await this.getDefaultSpred();
		}
		return spread_init.getActiveSheetIndex();
	}
	// spreadDefult.prototype.getActiveSheet = async function (spread_init) {
	//     if (!spread_init) {
	//         spread_init = await this.getDefaultSpred();
	//     }
	//     return spread_init.getActiveSheet();
	// }
	//获取sheet数量
	spreadDefult.prototype.getSheetCount = async function() {

		if (!this.spread) {
			console.log(this.spread.getSheetCount);
		}
		return this.spread.getSheetCount();
	}

	//获取sheet根据id
	spreadDefult.prototype.getSheetById = async function(sheet_id) {
		let sheet = '';
		if (typeof sheet_id == 'undefined') {
			sheet = await this.getActiveSheet();
		} else {
			let sheet_count = this.getSheetCount();
			if (sheet_id < 0) {
				sheet = this.spread.getSheet(0);
			} else if (sheet_id >= sheet_count) {
				sheet = this.spread.getSheet(sheet_count - 1)
			} else {
				sheet = this.spread.getSheet(sheet_id)
			}
		}
		return sheet;
	}
	spreadDefult.prototype.clear = async function(row, column, rowCount, columnCount, area, type, sheet_id) {

		let sheet = await this.getSheetById(sheet_id);
		sheet.clear(row, column, rowCount, columnCount, area, type);
	}
	spreadDefult.prototype.removeSpan = async function(row, column, sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		sheet.removeSpan(row, column);
	}
	spreadDefult.prototype.get_dataModel = async function(sheet_id) {
		let sheet = await this.getSheetById(sheet_id);
		return sheet._dataModel;

	}
	spreadDefult.prototype.get_dataTable = async function(sheet_id) {
		let _dataModel = await this.get_dataModel(sheet_id);
		return _dataModel.dataTable;
	}

	let autoGetRange = function(spread_init) {
		this.setSpread(spread_init);
	}
	autoGetRange.prototype.setSpread = function(spread_init) {
		this.spreadDefult = new spreadDefult(spread_init);
	}

	autoGetRange.prototype.getBorderRange = async function(sheet_id) {
		let range_col = {
			max: -Number.MAX_VALUE,
			min: Number.MAX_VALUE
		}
		let range_row = {
			max: -Number.MAX_VALUE,
			min: Number.MAX_VALUE
		}
		try {
			let sheet = this.spreadDefult.getSheetById(sheet_id);
			let dataTable = await this.spreadDefult.get_dataTable(sheet_id);
			let item;
			let row, style;
			let boderAttar = {
				borderBottom: {

				},
				borderLeft: {

				},
				borderRight: {

				},
				borderTop: {

				}
			};
			for (let row_index in dataTable) {
				row = dataTable[row_index];
				for (let col_index in row) {
					item = row[col_index];
					if (!item) {
						continue
					}
					style = item.style;
					if (!style) {
						continue
					}
					for (let key in boderAttar) {
						if (!style[key]) {
							continue
						}
						if (style[key].style > 0) {
							col_index = parseInt(col_index);
							if (col_index > range_col.max) {
								range_col.max = col_index
							}
							if (col_index < range_col.min) {
								range_col.min = col_index
							}
							row_index = parseInt(row_index);
							if (row_index > range_row.max) {
								range_row.max = row_index
							}
							if (row_index < range_row.min) {
								range_row.min = row_index
							}
						}
					}
				}
			}
			return {
				range_col: range_col,
				range_row: range_row
			}
		} catch (e) {
			console.log(e)
			return {
				range_col: -1,
				range_row: -1
			}
		}
	}

	autoGetRange.prototype.GetCellDataRangeBySheetid = async function(sheet_id) {
		try {
			let range_col = {
				max: -Number.MAX_VALUE,
				min: Number.MAX_VALUE
			}
			let range_row = {
				max: -Number.MAX_VALUE,
				min: Number.MAX_VALUE
			}
			let dataTable = await this.spreadDefult.get_dataTable(sheet_id);
			let item;
			let row, value;
			for (let row_index in dataTable) {
				row = dataTable[row_index];
				for (let col_index in row) {
					item = row[col_index];
					if (!item) {
						continue
					}
					value = item.value;
					if (!value) {
						continue
					}
					col_index = parseInt(col_index);
					if (col_index > range_col.max) {
						range_col.max = col_index
					}
					if (col_index < range_col.min) {
						range_col.min = col_index
					}
					row_index = parseInt(row_index);
					if (row_index > range_row.max) {
						range_row.max = row_index
					}
					if (row_index < range_row.min) {
						range_row.min = row_index
					}
				}
			}
			return {
				range_col: range_col,
				range_row: range_row
			}
		} catch (e) {
			console.log(e);
			return {
				range_col: -1,
				range_row: -1
			}
		}
	}
	autoGetRange.prototype.GetHasValueRange = async function(sheet_id, mode, option) {
		let range_col = {
			max: -Number.MAX_VALUE,
			min: Number.MAX_VALUE
		}
		let range_row = {
			max: -Number.MAX_VALUE,
			min: Number.MAX_VALUE
		}
		const defalutOption = {
			border: {
				name: 'border',
			},
			data: {
				name: 'data'
			},
			all: {
				name: 'all'
			}
		}
		try {
			if (!option) {
				option = {}
			}
			option = Object.assign(option, defalutOption)
			let range;
			let Temp = 0;
			let value = '';
			switch (mode) {
				case defalutOption.border.name:
					range = await this.getBorderRange(sheet_id)
					break;
				case defalutOption.data.name:
					range = await this.GetCellDataRangeBySheetid(sheet_id)
					break;
				case defalutOption.all.name:
				default:
					range = await this.getBorderRange(sheet_id)
					Temp = await this.GetCellDataRangeBySheetid(sheet_id)
					if (Temp.range_col.max > range.range_col.max) {
						range.range_col.max = Temp.range_col.max
					}
					if (Temp.range_col.min < range.range_col.min) {
						range.range_col.min = Temp.range_col.min
					}
					if (Temp.range_row.max > range.range_row.max) {
						range.range_row.max = Temp.range_row.max
					}
					if (Temp.range_row.min < range.range_row.min) {
						range.range_row.min = Temp.range_row.min
					}
					break
			}
			return range;
		} catch (e) {
			console.log(e);
			return {
				range_col: -1,
				range_row: -1
			}
		}
	}
	autoGetRange.prototype.GetHasValueRangeMultiple = async function(sheet_list, mode, option) {
		try {
			let length = 0;
			if (!sheet_list) {
				//默认获取所有页
				let sheetCount = this.spreadDefult.getSheetCount()
				sheet_list = []
				for (let i = 0; i < sheetCount; i++) {
					sheet_list.push(i)
				}
			}
			length = sheet_list.length
			let range = {}
			let temp = undefined
			let item = undefined
			for (let i = 0; i < length; i++) {
				item = sheet_list[i]
				temp = await this.GetHasValueRange(item)
				range[item] = temp
			}
			return range;
		} catch (e) {
			console.log(e);
		}
	}
	let pakoCompress = function() {

	}
	pakoCompress.prototype.zip = function(str) {
		let binaryString = pako.gzip(encodeURIComponent(str), {
			level: 7,
			to: 'string'
		})
		return base64js.fromByteArray(binaryString);
	}
	pakoCompress.prototype.unzip = function(b64Data) {
		if (!b64Data || typeof b64Data != 'string') {
			return b64Data;
		}
		let strData = base64js.toByteArray(b64Data);
		// // Convert binary string to character-number array
		// let charData = strData.split('').map(function(x) {
		// 	return x.charCodeAt(0);
		// });
		// Turn number array into byte-array
		// let binData = new Uint8Array(strData);
		// // unzip
		let array = pako.ungzip(strData);
		// Convert gunzipped byteArray back to ascii string:
		//strData = String.fromCharCode.apply(null, new Uint16Array(array));
		let chunk = 8 * 1024;
		let i;
		array = new Uint16Array(array)
		strData = ''
		for (i = 0; i < array.length / chunk; i++) {
			strData += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk));
		}
		strData += String.fromCharCode.apply(null, array.slice(i * chunk));
		// 将乱码的中文进行转换
		// let jsonResult = decodeURIComponent(escape((strData)))
		let jsonResult = decodeURIComponent(strData)
		return jsonResult;
	}

	let pasteManual = function(spread_init) {
		this.setSpread(spread_init);
		this.styleConvert = new styleConvert();
		this.contentMange = new contentMange();
		this.pakoCompress = new pakoCompress();
		this.jsHelper = new jsHelper();
	}
	pasteManual.prototype.setSpread = function(spread_init) {
		this.spreadDefult = new spreadDefult(spread_init);
	}
	pasteManual.prototype.ManualPaste = async function(txt, row, col, isCompressed, isRollBACKSelectSave, Option) {
		let sTemp = undefined
		try {
			let range = {

			}
			let that = this
			let defalutoption = {
				//range: [], //[{0,0},{0,0}]每个sheet的复制起始位置，默认为0，0，当需要复制的字符串的字符串中有sheet信息时优先从该变量获取区域
				sheet: {
					start_sheet_id: -1, //默认当前页
					satart_sheet_isAdd: false, //要复制的第一个sheet是覆盖到当前sheet上还是新加一个【start_sheet_id+1】
					other_sheet_isAdd: false, //其余页是添加还是覆盖
					add_pos: 'start', //start_behind start_before  end manual 手动 
					info: {}, //{0：{range:{},name:{}}}0为下标，代表复制文本内的顺序，非luckysheet实例内的sheet下标，从0开始，没有采用默认信息
					isSetColCount: true,
					isSetRowCount: true, //根据复制内容的范围设置行数，当设置为false时如果当前行数小于所需任然会设置行数
				},
				isFrozen: true,
			}
			defalutoption.sheet.start_sheet_id = await that.spreadDefult.getActiveSheetIndex();
			let pasteHtml = '';
			let domid = 'luckysheet-ManualPaste-area';
			let sheetList = [];
			let item = {};
			let lenght = 0

			if (!Option) {
				Option = {};
			}
			//只要传值了就是手动模式
			if (Option.sheet && typeof Option.sheet.start_sheet_id != 'undefined') {
				Option.sheet.add_pos = 'manual'
			}
			Option = this.jsHelper.deepCopyTo(defalutoption, Option, {
				IsCover: false
			});
			if (Option.isFrozen) {
				await this.spreadDefult.isPaintSuspended(true);
			}

			//默认为左上角 0,0
			if (!row) {
				row = 0
			}
			if (!col) {
				col = 0
			}
			if (isCompressed) {
				pasteHtml = this.pakoCompress.unzip(txt);
			} else {
				pasteHtml = txt;
			}
			this.contentMange.CopyContentSetOrClear(pasteHtml);
			let sheetDom = this.contentMange.GetCopyContent();
			sheetList = sheetDom.find('sheet');
			//是否有sheet信息
			if (sheetList && sheetList.length > 0) {
				let allSheetInfo = Option.sheet.info;
				let sheet_count = await this.spreadDefult.getSheetCount();
				lenght = sheetList.length;
				switch (Option.sheet.add_pos) {
					case 'start':
						Option.sheet.start_sheet_id = 0;
						Option.sheet.satart_sheet_isAdd = false
						break
					case 'start_behind':
						Option.sheet.start_sheet_id = 0;
						Option.sheet.satart_sheet_isAdd = true
						break
					case 'start_before':
						Option.sheet.start_sheet_id = -1;
						Option.sheet.satart_sheet_isAdd = true
						break
					case 'end':
						Option.sheet.start_sheet_id = sheet_count - 1;
						Option.sheet.satart_sheet_isAdd = true
						break
					case 'manual':
						//将sheet_id规范在一个可用范围内
						if (Option.sheet.start_sheet_id > sheet_count) {
							if (Option.sheet.satart_sheet_isAdd) {
								Option.sheet.start_sheet_id = sheet_count - 1;
							} else {
								Option.sheet.start_sheet_id = sheet_count
							}
						} else if (Option.sheet.start_sheet_id < -1 && Option.sheet.satart_sheet_isAdd) {
							Option.sheet.start_sheet_id = -1
						} else if (Option.sheet.start_sheet_id < 0 && !Option.sheet.satart_sheet_isAdd) {
							Option.sheet.start_sheet_id = 0
						}

						break
				}
				let start_sheet_id = Option.sheet.start_sheet_id;
				if (Option.sheet.satart_sheet_isAdd) {
					Option.sheet.start_sheet_id++;
					start_sheet_id++;
					sheet_count = await this.spreadDefult.addSheet(start_sheet_id);
				} else {
					if (start_sheet_id > sheet_count - 1) {
						sheet_count = await this.spreadDefult.addSheet(start_sheet_id);
					}
				}
				if (start_sheet_id > sheet_count - 1) {
					start_sheet_id = sheet_count - 1;
				}
				await paste(sheetList[0], 0, start_sheet_id)

				async function paste(item, i, sheet_id) {
					let $item = $(item)
					let config = {}
					//获取自定义信息

					if (allSheetInfo[i]) {
						if (allSheetInfo[i].name) {
							config.name = allSheetInfo[i].name
						}
						if (allSheetInfo[i].range) {
							config.range = allSheetInfo[i].range
						}
					}
					if (!config.name) {
						config.name = $item.attr('data-sheet-name')
					}
					if (config.name) {
						that.spreadDefult.setSheetName(start_sheet_id + i, config.name)
					}
					if (!config.range) {
						config.range = {
							col: col,
							row: row,
						}
					}
					if (typeof config.range.col == 'undefined') {
						config.range.col = col
					}
					if (typeof config.range.row == 'undefined') {
						config.range.row = cow
					}
					range[sheet_id] = await that.luckysheetEventPaste($item.html(), config.range,
						sheet_id, Option);
				}
				for (let i = 1; i < lenght; i++) {
					let sheet_index = start_sheet_id + i;
					if (Option.sheet.other_sheet_isAdd) {
						sheet_count = await that.spreadDefult.addSheet(sheet_index);

					} else if (sheet_index > sheet_count - 1) {
						//没有这一页添加出来
						sheet_count = await that.spreadDefult.addSheet(sheet_index);
						sheet_index = sheet_count - 1;
					}
					item = sheetList[i];
					await paste(item, i, sheet_index)
				}
			} else {
				range = await that.luckysheetEventPaste(pasteHtml, {
					row: row,
					col: col
				}, Option.sheet.start_sheet_id, Option)
			}
			sheetDom.empty();

			//ChangeAreaHeightWidth(txt, row, col)
			return {
				code: 1,
				data: range,
				message: 'success',
				expect: undefined,
			}
		} catch (e) {
			console.log(e)
			return {
				code: -1,
				data: undefined,
				message: 'fail',
				expect: e,
			}
		} finally {
			if (Option.isFrozen) {
				await this.spreadDefult.isPaintSuspended(false);
			}

		}
	}
	pasteManual.prototype.setWidthAndHeight = async function(rowinfo, colinfo, sheet_id) {
		try {
			let that = this;
			if (!rowinfo) {
				rowinfo = {}
			}
			if (!colinfo) {
				colinfo = {}
			}
			for (let row in rowinfo) {
				try {
					await that.spreadDefult.setRowHeight(row, rowinfo[row].height, sheet_id);
					await that.spreadDefult.setRowVisible(row, !rowinfo[row].ishide, sheet_id);
				} catch (e) {
					console.log(e)
				}

			}
			for (let col in colinfo) {
				try {
					await that.spreadDefult.setColumnWidth(col, colinfo[col].width, sheet_id);
					await that.spreadDefult.setColumnVisible(col, !colinfo[col].ishide, sheet_id);
				} catch (e) {
					console.log(e)
				}

			}
		} catch (e) {
			console.log(e);
		}
	}
	pasteManual.prototype.getWidthAndHeight = async function(txt, postion) {
		let rowinfo = {}
		let colinfo = {}
		try {
			function sortNum(a, b) {
				return a - b
			}
			if (!postion) {
				postion = {
					row: 0,
					col: 0
				}
			}
			if (!postion.row) {
				postion.row = 0
			}
			if (!postion.col) {
				postion.col = 0
			}
			let row = postion.row;
			let col = postion.col;

			function getNum(set, num) {
				try {
					if (num) {
						return parseInt(num)
					}
					let array = Array.from(set)

					if (array.length > 0) {
						array.sort(sortNum)
						num = array[array.length - 1] + 1
					} else {
						num = 0
					}

				} catch (e) {
					console.log(e)
				} finally {
					if (!set.has(num)) {
						set.add(num)
					}
				}

			}

			if (!txt) {
				return
			}

			if (typeof row == 'string') {
				row = parseInt(row)
			}
			if (typeof col == 'string') {
				col = parseInt(col)
			}
			let row_hide = []
			let col_hide = []
			let nTemp = 0;
			let row_num = 0;
			let col_num = 0;
			let row_num_set = new Set();
			let col_num_set = new Set();
			let height = 0;
			let width = 0;
			let row_height = {};
			let col_width = {};
			let $rowcolsize = this.contentMange.CopyContentSetOrClear(txt);
			if (!$rowcolsize) {
				return {
					rowinfo: rowinfo,
					colinfo: colinfo
				}
			}
			$rowcolsize.find('row').each(function() {
				try {
					let $row = $(this);
					try {
						row_num = $row.attr('data-row-num');
						row_num = getNum(row_num_set, row_num) + row;
						height = $row.attr('height');

						if (height) {
							row_height[row_num] = height
						}
						let ishide = $row.attr('ishide');
						if (ishide && ishide.toLowerCase() == '"true"') {
							ishide = true
						} else {
							ishide = false
						}
						if (rowinfo[row_num]) {
							rowinfo[row_num].height = height
							rowinfo[row_num].row = row_num
							rowinfo[row_num].ishide = ishide
						} else {
							rowinfo[row_num] = {
								height: height,
								row: row_num,
								ishide: ishide
							}
						}
					} catch (e) {
						console.log(e)
					}

				} catch (e) {
					console.log(e)
				}
			})
			$rowcolsize.find('column').each(function() {
				try {
					let $column = $(this);
					col_num = $column.attr('data-col-num');
					col_num = getNum(col_num_set, col_num) + col;
					width = $column.attr('width');
					if (width) {
						col_width[col_num] = width
					}
					let ishide = $column.attr('ishide');
					if (ishide && ishide.toLowerCase() == '"true"') {
						ishide = true
					} else {
						ishide = false
					}
					if (colinfo[col_num]) {
						colinfo[col_num].height = height
						colinfo[col_num].col = col_num
						colinfo[col_num].ishide = ishide
					} else {
						colinfo[col_num] = {
							width: width,
							col: col_num,
							ishide: ishide
						}
					}
				} catch (e) {
					console.log(e)
				}
			})
			return {
				rowinfo: rowinfo,
				colinfo: colinfo
			}


		} catch (e) {
			console.log(e);
			return {
				rowinfo: rowinfo,
				colinfo: colinfo
			}
		} finally {
			this.contentMange.CopyContentSetOrClear();
		}
	}
	pasteManual.prototype.fomart = function(val) {
		return val;
	}
	pasteManual.prototype.setSpanBoder = async function(cell, leftCellstyle, sheet_id) {
		try {
			let row = parseInt(cell.row);
			let col = parseInt(cell.col);
			let rowCount = parseInt(cell.mc.rs);
			let colCount = parseInt(cell.mc.cs);
			let that = this;
			let style = '';
			if (cell.value == 'Total') {

			}
			if (leftCellstyle.borderTop) {
				for (let c = col; c < col + colCount; c++) {
					style = await that.spreadDefult.getStyle(row, c);
					if (!style) {
						style = new UI.Style();
					}
					style.borderTop = leftCellstyle.borderTop
					await that.spreadDefult.setStyle(row, c, style, sheet_id, false);
				}
			}
			if (leftCellstyle.borderBottom) {
				for (let c = col; c < col + colCount; c++) {
					style = await that.spreadDefult.getStyle(row + rowCount - 1, c);
					if (!style) {
						style = new UI.Style();
					}
					style.borderBottom = leftCellstyle.borderBottom
					await that.spreadDefult.setStyle(row + rowCount - 1, c, style, sheet_id, false);
				}
			}
			if (leftCellstyle.borderLeft) {
				for (let r = row; r < row + rowCount; r++) {
					style = await that.spreadDefult.getStyle(r, col);
					if (!style) {
						style = new UI.Style();
					}
					style.borderLeft = leftCellstyle.borderLeft
					await that.spreadDefult.setStyle(r, col, style, sheet_id, false);
				}
			}
			if (leftCellstyle.borderRight) {
				for (let r = row; r < row + rowCount; r++) {
					style = await that.spreadDefult.getStyle(r, col + colCount - 1);
					if (!style) {
						style = new UI.Style();
					}
					style.borderRight = leftCellstyle.borderRight
					await that.spreadDefult.setStyle(r, col + colCount - 1, style, sheet_id, false);
				}
			}
		} catch (e) {
			console.log(e);
		}

	}
	pasteManual.prototype.setDataAndBorder = async function(data, sheet_id) {
		try {
			let row_count = data.length;
			let row_info, cell, style;
			let that = this;
			let row_max = -Number.MAX_VALUE;
			let row_min = Number.MAX_VALUE;
			let col_max = -Number.MAX_VALUE;
			let col_min = Number.MAX_VALUE;
			for (let y = 0; y < row_count; y++) {
				row_info = data[y];
				for (let x = 0; x < row_info.length; x++) {
					try {
						cell = row_info[x];
						if (!cell || !typeof cell.row == 'undefined' || typeof cell.col == 'undefined') {
							continue;
						}
						if (cell.row > row_max) {
							row_max = cell.row;
						}
						if (cell.row < row_min) {
							row_min = cell.row;
						}
						if (cell.col > col_max) {
							col_max = cell.col;
						}
						if (cell.col < col_min) {
							col_min = cell.col;
						}
						style = await that.spreadDefult.getStyle(cell.row, cell.col);
						if (!style) {
							style = new UI.Style();
						}

						style.hAlign = cell.horizontal;
						style.vAlign = cell.vertical;
						style.backColor = cell.backColor;
						style.foreColor = cell.font_color;
						switch (cell.word_wraps) {
							case '2':
								style.wordWrap = true;
								break;
							default:
								style.wordWrap = false;
								break;
						}

						if (cell.border) {
							for (let boder in cell.border) {
								style[boder] = cell.border[boder]
							}
						}
						style.font = (await that.styleConvert.fontDeal(cell, 'paste')).data;
						if (cell.mc) {
							let sapnRange = await that.spreadDefult.addSpan(cell.mc.r, cell.mc.c, cell.mc
								.rs, cell.mc.cs, sheet_id);
							if (sapnRange) {
								if (sapnRange.row.max > row_max) {
									row_max = sapnRange.row.max;
								}
								if (sapnRange.row.min < row_min) {
									row_min = sapnRange.row.min;
								}
								if (sapnRange.col.max > col_max) {
									col_max = sapnRange.col.max;
								}
								if (sapnRange.col.min < col_min) {
									col_min = sapnRange.col.min;
								}
							}
							await that.setSpanBoder(cell, style, sheet_id);
						}
						await that.spreadDefult.setStyle(cell.row, cell.col, style, sheet_id, false);
						await that.spreadDefult.setValue(cell.row, cell.col, cell.value, sheet_id);
					} catch (e) {
						console.log(e);
					}

				}
			}
			return {
				row: {
					max: row_max,
					min: row_min
				},
				col: {
					max: col_max,
					min: col_min
				}
			}
		} catch (e) {
			console.log(e)
		}
	}
	pasteManual.prototype.getDataAndBorder = async function(txtdata, position, option) {
		let isEqual = true;
		let clipboardData = undefined
		let files = []
		let custom_paste = false
		let that = this;
		try {
			if (!position) {
				position = {
					row: 0,
					col: 0
				}
			}
			if (!position.row) {
				position.row = 0;
			}
			if (!position.col) {
				position.col = 0;
			}
			if (option) {

			}
			let $content = this.contentMange.CopyContentSetOrClear(txtdata);

			let data = new Array($content.find("table tr").length);
			let colLen = 0;
			$content.find("table tr").eq(0).find("td").each(function() {
				let colspan = parseInt($(this).attr("colspan"));
				if (isNaN(colspan)) {
					colspan = 1;
				}
				colLen += colspan;
			});

			for (let i = 0; i < data.length; i++) {
				data[i] = new Array(colLen);
			}

			let r = 0;
			let borderInfo = {};
			$content.find("table tr").each(function() {
				let $tr = $(this);
				let c = 0;
				$tr.find("td").each(function() {
					let $td = $(this);
					let cell = {};
					let txt = $td.text();
					if ($.trim(txt).length == 0) {
						cell.value = null;
					} else {
						let mask = that.fomart($td.text());
						cell.value = mask;
					}

					let bg = $td.css("background-color");
					if (bg == "rgba(0, 0, 0, 0)") {
						bg = null;
					}

					cell.backColor = bg;

					let bl = $td.css("font-weight");
					if (bl == 400 || bl == "normal") {
						cell.font_weight = 0;
					} else {
						cell.font_weight = 1;
					}

					let it = $td.css("font-style");
					if (it == "normal") {
						cell.font_style = 0;
					} else {
						cell.font_style = 1;
					}

					let ff = $td.css("font-family");
					let ffs = ff.split(",");
					for (let i = 0; i < ffs.length; i++) {
						let fa = $.trim(ffs[i].toLowerCase());
						//fa = locale_fontjson[fa];
						if (fa == null) {
							cell.font_family = 0;
						} else {
							cell.font_family = fa;
							break;
						}
					}
					//let fs = Math.round(parseInt($td.css("font-size")) * 72 / 96);
					let fs = $td.css("font-size");
					cell.font_size = fs;

					let fc = $td.css("color");
					cell.font_color = fc;

					let ht = $td.css("text-align");
					cell.horizontal = that.styleConvert.hAlignDeal(ht, 'paste').data

					let vt = $td.css("align-items");
					//let vt = $td.css("vertical-align");
					cell.vertical = that.styleConvert.vAlignDeal(vt, 'paste').data
					//自动换行
					let tb = typeof $td.attr('word-wraps-excel') == 'undefined' ? $td.attr(
						'word-wraps') : $td.attr('word-wraps-excel');
					if (tb == 'auto-wraps') {
						cell.word_wraps = '2';
					} else if (tb == 'overflow') {
						cell.word_wraps = '1';
					} else if (tb == 'break') {
						cell.word_wraps = '0';
					} else {
						cell.word_wraps = undefined;
					}
					while (c < colLen && data[r][c] != null) {
						c++;
					}

					if (c == colLen) {
						return true;
					}

					if (data[r][c] == null) {
						data[r][c] = cell;
						let rowspan = parseInt($td.attr("rowspan"));
						let colspan = parseInt($td.attr("colspan"));

						if (isNaN(rowspan)) {
							rowspan = 1;
						}

						if (isNaN(colspan)) {
							colspan = 1;
						}

						let r_ab = position.row + r;
						let c_ab = position.col + c;
						cell.row = r_ab;
						cell.col = c_ab;
						cell.border = {

						}
						for (let rp = 0; rp < rowspan; rp++) {
							for (let cp = 0; cp < colspan; cp++) {
								if (rp == 0) {
									let bt = $td.css("border-top");
									if (bt != null && bt.length > 0 && bt.substr(0, 3)
										.toLowerCase() != "0px") {
										let width = $td.css("border-top-width");
										let type = $td.css("border-top-style");
										let color = $td.css("border-top-color");
										let borderconfig = that.styleConvert.getQKBorder(
											width,
											type, color);

										if (borderInfo[(r_ab + rp) + "_" + (c_ab + cp)] ==
											null) {
											borderInfo[(r_ab + rp) + "_" + (c_ab +
												cp)] = {};
										}
										cell.border.borderTop = {
											"style": borderconfig[0],
											"color": borderconfig[1]
										}
										borderInfo[(r_ab + rp) + "_" + (c_ab + cp)].t = {
											"style": borderconfig[0],
											"color": borderconfig[1]
										};
									}
								}

								if (rp == rowspan - 1) {
									let bb = $td.css("border-bottom");
									if (bb != null && bb.length > 0 && bb.substr(0, 3)
										.toLowerCase() != "0px") {
										let width = $td.css("border-bottom-width");
										let type = $td.css("border-bottom-style");
										let color = $td.css("border-bottom-color");
										let borderconfig = that.styleConvert.getQKBorder(
											width,
											type, color);

										if (borderInfo[(r_ab + rp) + "_" + (c_ab + cp)] ==
											null) {
											borderInfo[(r_ab + rp) + "_" + (c_ab +
												cp)] = {};
										}
										cell.border.borderBottom = {
											"style": borderconfig[0],
											"color": borderconfig[1]
										}
										borderInfo[(r_ab + rp) + "_" + (c_ab + cp)].b = {
											"style": borderconfig[0],
											"color": borderconfig[1]
										};
									}
								}

								if (cp == 0) {
									let bl = $td.css("border-left");
									if (bl != null && bl.length > 0 && bl.substr(0, 3)
										.toLowerCase() != "0px") {
										let width = $td.css("border-left-width");
										let type = $td.css("border-left-style");
										let color = $td.css("border-left-color");
										let borderconfig = that.styleConvert.getQKBorder(
											width,
											type, color);

										if (borderInfo[(r_ab + rp) + "_" + (c_ab + cp)] ==
											null) {
											borderInfo[(r_ab + rp) + "_" + (c_ab +
												cp)] = {};
										}
										cell.border.borderLeft = {
											"style": borderconfig[0],
											"color": borderconfig[1]
										}
										borderInfo[(r_ab + rp) + "_" + (c_ab + cp)].l = {
											"style": borderconfig[0],
											"color": borderconfig[1]
										};
									}
								}

								if (cp == colspan - 1) {
									let br = $td.css("border-right");
									if (br != null && br.length > 0 && br.substr(0, 3)
										.toLowerCase() != "0px") {
										let width = $td.css("border-right-width");
										let type = $td.css("border-right-style");
										let color = $td.css("border-right-color");
										let borderconfig = that.styleConvert.getQKBorder(
											width,
											type, color);

										if (borderInfo[(r_ab + rp) + "_" + (c_ab + cp)] ==
											null) {
											borderInfo[(r_ab + rp) + "_" + (c_ab +
												cp)] = {};
										}
										cell.border.borderRight = {
											"style": borderconfig[0],
											"color": borderconfig[1]
										}
										borderInfo[(r_ab + rp) + "_" + (c_ab + cp)].r = {
											"style": borderconfig[0],
											"color": borderconfig[1]
										};
									}
								}

								if (rp == 0 && cp == 0) {
									continue;
								}
								try {
									data[r + rp][c + cp] = {
										"mc": {
											"r": r_ab,
											"c": c_ab
										}
									};
								} catch (e) {
									console.log(e)
								}

							}
						}

						if (rowspan > 1 || colspan > 1) {
							let first = {
								"rs": rowspan,
								"cs": colspan,
								"r": r_ab,
								"c": c_ab
							};
							data[r][c].mc = first;
						}
					}

					c++;

					if (c == colLen) {
						return true;
					}
				});

				r++;
			});

			$content.empty();
			return {
				data: data,
				borderInfo: borderInfo
			}
		} catch (e) {
			console.log(e);
			return {

			}
		}
	}
	pasteManual.prototype.getPasteRange = function(data) {
		try {
			let row_count = data.length;
			let row_info, cell, style;
			let that = this;
			let row_max = -Number.MAX_VALUE;
			let row_min = Number.MAX_VALUE;
			let col_max = -Number.MAX_VALUE;
			let col_min = Number.MAX_VALUE;
			for (let y = 0; y < row_count; y++) {
				row_info = data[y];
				for (let x = 0; x < row_info.length; x++) {
					try {
						cell = row_info[x];
						if (!cell || !typeof cell.row == 'undefined' || typeof cell.col == 'undefined') {
							continue;
						}
						let row = parseInt(cell.row);
						let col = parseInt(cell.col);

						if (row > row_max) {
							row_max = row;
						}
						if (row < row_min) {
							row_min = row;
						}
						if (col > col_max) {
							col_max = col;
						}
						if (cell.col < col_min) {
							col_min = cell.col;
						}
						if (cell.mc) {
							let rowCount = parseInt(cell.mc.rs);
							let colCount = parseInt(cell.mc.cs);
							let sapnRange = {
								col: {
									min: col,
									max: col + colCount - 1
								},
								row: {
									min: row,
									max: row + rowCount - 1
								}
							}
							if (sapnRange) {
								if (sapnRange.row.max > row_max) {
									row_max = sapnRange.row.max;
								}
								if (sapnRange.row.min < row_min) {
									row_min = sapnRange.row.min;
								}
								if (sapnRange.col.max > col_max) {
									col_max = sapnRange.col.max;
								}
								if (sapnRange.col.min < col_min) {
									col_min = sapnRange.col.min;
								}
							}
						}
					} catch (e) {
						console.log(e);
					}
				}
			}
			return {
				row: {
					max: row_max,
					min: row_min
				},
				col: {
					max: col_max,
					min: col_min
				}
			}
		} catch (e) {
			console.log(e);
			return {

			}
		}

	}
	pasteManual.prototype.clear = async function(range, sheet_id) {
		try {
			let array = ['Data', 'Style', 'Sparkline', 'Axis'];
			for (let i = 0; i < array.length; i++) {
				await this.spreadDefult.clear(range.row.min, range.col.min, range.row.max - range.row.min +
					1, range.col.max - range.col.min + 1, UI.SheetArea.viewport, UI.StorageType[array[
						i]], sheet_id);
			}
			for (let row = range.row.min; row <= range.row.max; row++) {
				for (let col = range.col.min; col <= range.col.max; col++) {
					await this.spreadDefult.removeSpan(row, col, sheet_id);
				}
			}
		} catch (e) {
			console.log(e);
		}
	}
	pasteManual.prototype.setRowAndColCount = async function(range, sheet_id, option) {
		try {
			let flag = false;
			if (range.col && range.col.max) {
				if (option && option.sheet && option.sheet.isSetColCount) {
					flag = true;
				} else {
					let colCount = await this.spreadDefult.getColumnCount(sheet_id);
					if (colCount < range.col.max + 1) {
						flag = true;
					}
				}
				if (flag) {
					flag = false;
					await this.spreadDefult.setColumnCount(range.col.max + 1, sheet_id);
				}
			}
			if (range.row && range.row.max) {
				if (option && option.sheet && option.sheet.isSetRowCount) {
					flag = true;
				} else {
					let rowCount = await this.spreadDefult.getRowCount(sheet_id);
					if (rowCount < range.row.max + 1) {
						flag = true;
					}
				}
				if (flag) {
					flag = false;
					await this.spreadDefult.setRowCount(range.row.max + 1, sheet_id);
				}
			}
		} catch (e) {
			console.log(e)
		}
	}
	pasteManual.prototype.luckysheetEventPaste = async function(txtdata, position, sheet_id, option) {
		try {
			let sheet_count = await this.spreadDefult.getSheetCount();
			if (!sheet_id) {
				sheet_id = 0;
			}
			if (sheet_id < 0) {
				sheet_id = 0;
			}
			if (sheet_id > sheet_count - 1) {
				sheet_count = await this.spreadDefult.addSheet(sheet_count);
				sheet_id = sheet_count - 1;
			}
			let dataAndBorder = await this.getDataAndBorder(txtdata, position, option);
			let WidthAndHeight = await this.getWidthAndHeight(txtdata, position);
			let range = {};
			if (dataAndBorder && dataAndBorder.data) {
				range = await this.getPasteRange(dataAndBorder.data);
				await this.setRowAndColCount(range, sheet_id, option);
				await this.clear(range, sheet_id);
				range = await this.setDataAndBorder(dataAndBorder.data, sheet_id);
			}
			if (WidthAndHeight) {
				await this.setWidthAndHeight(WidthAndHeight.rowinfo, WidthAndHeight.colinfo, sheet_id);
			}
			return range;
		} catch (e) {
			console.log(e);
		}
	}
	let jsHelper = function() {

	}
	/*
 函数调用复制接口
 txt 需要复制的字符串
 row 行
 col 列
 isCompressed 是否压缩过字符串
 isRollBACKSelectSave 是否回滚选择区域
 return 
 code 执行结果 1 成功 -1 失败
 data 粘贴文件的区域范围
 message 消息
 expect 失败信息
*/
	jsHelper.prototype.deepCopyTo = function(from, to, option) {
		let defalutoption = {
			IsCover: false,

		}
		option = Object.assign(defalutoption, option)
		let type = this.judgeVariableType(from)
		if (!to) {
			to = {}
		}
		let type_to = this.judgeVariableType(to);
		switch (type) {
			case variableInfo.string.name:
			case variableInfo.number.name:
			case variableInfo.boolean.name:
			case variableInfo.function.name:
				to = from
				break;
			case variableInfo.array.name:
				if (type_to != type) {
					to = [];
				};
				break;
			case variableInfo.json.name:
				if (type_to != type) {
					to = {};
				};
				for (let key in from) {
					switch (this.judgeVariableType(to[key])) {
						case variableInfo.string.name:
						case variableInfo.number.name:
						case variableInfo.boolean.name:
						case variableInfo.function.name:
							if (!option.IsCover) {
								continue
							}
							break
					}
					to[key] = this.deepCopyTo(from[key], to[key], option)
				}
				//case variableInfo.string.class:
				break
			default:
				to = from
				break
		}
		return to
	}
	jsHelper.prototype.judgeVariableType = function(variable) {
		try {
			let typeofdata = (typeof variable).toLowerCase();
			let type = '';
			switch (typeofdata) {
				case variableInfo.string.name:
					type = typeofdata;
					break
				case variableInfo.number.name:
					type = typeofdata;
					break
				case variableInfo.object.name:
					if (variable instanceof Array) {
						type = variableInfo.array.name;
					} else if (variable instanceof Object) {
						if (variable.constructor == Object) {
							type = variableInfo.json.name;
						} else {
							type = variableInfo.class.name;
						}
					} else if (variable == null) {
						type = variableInfo.null.name;
					}
					break
				case variableInfo.function.name:
					type = typeofdata;
					break
				case variableInfo.boolean.name:
					type = typeofdata;
					break
				case variableInfo.undefined.name:
					type = typeofdata;
					break
			}
			return type;
		} catch (e) {
			console.log(e);
			return '';
		}
	}
	const variableInfo = {
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
	window.pakoCompress = pakoCompress;
	window.autoGetRange = autoGetRange;
	window.contentMange = contentMange;
	window.copyManual = copyManual;
	window.jsHelper = jsHelper;
	window.pasteManual = pasteManual;
})(window, jQuery);

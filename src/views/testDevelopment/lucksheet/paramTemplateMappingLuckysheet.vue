<template>
	<!-- position: absolute;height: 100%;width:99%;top:0px;bottom: 0px -->
	<div>
		<div style="height: 100%;width:100%;top:0px;bottom: 0px" ref="div">
			<div id="luckysheet" ref="luckysheet"
				style="margin:0px;padding:0px;position:absolute;width:100%;height: 100%;left: 0px;top:0px;bottom:0px">
			</div>
		</div>

	</div>
</template>
<script>
	let messageListener = '';
	let browserRejectionHandler = '';
	let vue_that = '';
	import {
		judgeVariableType,
		variableInfo,
		judgeVariableIsEmptyOrNull
	} from '@/utils/base.helper'
	import {
		colToStr
	} from '@/utils/luckysheet.helper'

	// import {
	// 	globalFuncTryCatch
	// } from '@/utils/error.helper'
	export default {
		name: 'paramTemplateMappingLuckysheet',
		components: {

		},
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
		watch: {
			isHasLuckSheet(newvlav, old) {

			}
		},
		data() {
			return {
				close: false,
				timer: false,
				isHasLuckSheet: false, //初始化后请改为真
				rangeSelectComplateAutoCopy: true, //选区后自动选择
				range: '', //所选区域
				isCanGetRange: false, //初始化完luckysheet是否获取可用范围
				isCompressed: true, //是否压缩
				isAutoSelect: true, //加载完文件是否自动选择
				isMultipleSheet: false,
				file: {
					size: {
						unit: 'KB',
						size: '200',
						max_size: 0,
					},
					type: {
						type_array: [
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
						], //application/vnd.ms-excel xls
						str: 'xlsx',
					}
				},
				confirminfo: {
					status: false,
					layerid: '',
				},
				dom: {
					id: ''
				}

			}
		},
		mounted() {
			const that = this
			window.onresize = function() {
				that.resizeLuckSheet()
			}
			let index = setInterval(() => {
				if (that.$refs['div']) {
					clearInterval(index)
					let domDiv = that.$refs['div']
					let mousedown = false
					let mousemove = false
					domDiv.addEventListener('mousedown', function(e) {
						mousedown = true
					});
					domDiv.addEventListener('mousemove', function(e) {
						if (!mousedown) {
							return
						}
						mousemove = true

					});
					domDiv.addEventListener('mouseup', async function(e) {
						if (!mousedown || !mousemove) {
							return
						}
						let button = e.button
						switch (button) {
							case 0:
								if (that.rangeSelectComplateAutoCopy) {
									if (!that.range) {
										return
									}
									if (!that.isMultipleSheet) {
										let order = await luckysheet.findCurrentSheetIndexAwait()
										if (!that.range[order]) {
											return
										}
										let range = that.range[order].area
										let row_count = range[0].row[1] - range[0].row[0] + 1
										let col_count = range[0].column[1] - range[0].column[0] +
											1
										//一行一列只包含一个单元格 ，不触发获取事件。可手动强制获取
										if (row_count == 1 && col_count == 1) {
											return
										}
									}
									//that.ManualCopy()
								}
								break
								//鼠标右键
							case 2:
								break
						}
						mousemove = false
						mousedown = false
					});
				}
			})

		},
		created() {
			console.log('template create')
			this.getPostMessage()
			this.createLuckSheet()

		},
		beforeDestroy() {
			console.log('template iframe beforeDestroy')
			this.getPostMessage({
				isAddEventListener: false
			})
		},
		methods: {
			resizeLuckSheet() {
				if (this.timer) {
					return
				}
				let that = this

				if (this.isHasLuckSheet) {
					this.timer = true
					setTimeout(() => {
						luckysheet.resize();
						that.timer = false
					}, 400)
				}
			},
			destroy() {
				try {
					if (this.isHasLuckSheet) {
						luckysheet.destroy();
						this.isHasLuckSheet = false
					}

				} catch (e) {
					console.log(e)
				}
			},
			layerClose(layerid) {
				if (layerid) {
					this.$layer.close(layerid);
				} else if (this.confirminfo.status) {
					layerid = this.confirminfo.layerid
					this.$layer.close(layerid);
					this.confirminfo.status = false
				} else {
					this.$layer.close();
				}
			},
			createLuckSheet(selectFileJson) {
				let that = this
				let data = [{
					"name": "Sheet1",
					"index": 0,
					"status": 0,
					"order": 0,
					"celldata": [{
						"r": 0,
						"c": 0,
						"v": {
							ct: {
								fa: "General",
								t: "g"
							},
							m: "",
							v: ""
						}
					}],
				}]
				let title = '模板'
				let userInfo = undefined
				if (selectFileJson) {
					data = selectFileJson.sheets
					title = selectFileJson.info.name
					userInfo = selectFileJson.info.name.creator
				}
				this.destroy()
				this.layerClose()
				let option = {
					lang: 'zh',
					container: 'luckysheet', //luckysheet is the container id
					//showinfobar: false,
					title: title,
					sheetFormulaBar: false,
					showinfobar: false,
					showsheetbar: false,
					showsheetbarConfig: {
						menu: true,
						sheet: true //sheet页显示
					},
					showtoolbar: false,
					showtoolbarConfig: {
						//undoRedo: true
						// textRotateMode: false, // '文本旋转方式'
						// image: false, // '插入图片'
						// link: false, // '插入链接'
						// chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
						// postil: false, //'批注'
						// pivotTable: false, //'数据透视表'
						// function: false, // '公式'
						// frozenMode: false, // '冻结方式'
						// sortAndFilter: false, // '排序和筛选'
						// conditionalFormat: false, // '条件格式'
						// dataVerification: false, // '数据验证'
						// splitColumn: false, // '分列'
						// screenshot: false, // '截图'
						// findAndReplace: false, // '查找替换'
						// protection: false, // '工作表保护'
						// print: false, // '打印'
					},
					hook: {
						rangeSelect: async function(sheet, range) {
							if (!that.range) {
								that.range = {}
							}
							let order = ''
							let name = sheet.name
							if (sheet.order) {
								order = sheet.order
							} else {
								order = await luckysheet.findCurrentSheetIndexAwait(sheet.index)
							}
							that.range[order] = {
								index: sheet.index,
								order: order,
								name: name,
								area: range,
								colRange: range[0].column,
								rowRange: range[0].row
							}
						},
						workbookCreateAfter(json) {
							that.isHasLuckSheet = true
							that.range = {}
						},
						rangeMoveAfter(oldRange, newRange) {
							if (that.rangeSelectComplateAutoCopy) {
								that.ManualCopy()
							}
						},
						workbookDestroyAfter(json) {
							that.isHasLuckSheet = false
						}
					}
					// userInfo: userInfo
				}
				if (data) {
					option.data = data
				}
				try {

					let index = setInterval(() => {
						if (that.$refs['luckysheet'] && luckysheet) {
							clearInterval(index)
							luckysheet.create(option);
						}
					}, 300)
				} catch (e) {
					console.log('option e', e)
				}



			},
			GetMaxSize() {
				if (this.file.size.max_size > 0) {
					return this.file.size.max_size
				}
				let that = this
				let max_size = 0
				switch (this.file.size.unit.toUpperCase()) {
					case 'MB':
						max_size = Number(this.file.size.size) * 1024 * 1024
						break
					case 'KB':
						max_size = Number(this.file.size.size) * 1024
						break
					case 'B':
						max_size = Number(this.file.size.size)
						break
					case 'GB':
						max_size = Number(this.file.size.size) * 1024 * 1024 * 1024 * 1024
						break
					default:
						max_size = Number(this.file.size.size) * 1024 * 1024
						break
				}
				this.file.size.max_size = max_size
				return max_size
			},
			importExcel(files) {
				let that = this
				if (!files || files.length == 0) {
					this.$notify({
						title: '提示',
						message: '请选择文件',
						type: 'warning'
					});
					return;
				}
				let file = files[0]
				let name = file.name;
				let suffixArr = name.split("."),
					suffix = suffixArr[suffixArr.length - 1];
				if (suffix != "xlsx") {
					this.$notify({
						title: '提示',
						message: '当前只支持 xlsx文件',
						type: 'warning'
					});
					return;
				}
				const type = this.file.type.type_array.indexOf(file.type) >= 0 ? true : false
				const size = file.size < that.GetMaxSize()
				if (!type) {
					this.$notify({
						title: '提示',
						message: '上传格式只能是' + this.file.type.str,
						type: 'warning'
					});
					return
				}
				if (!size) {
					this.$notify({
						title: '提示',
						message: '文件不能超过' + this.file.size.size + this.file.size.unit,
						type: 'warning'
					});
					return
				}

				improtLuckyExcel.transformExcelToLucky(file, function(exportJson, luckysheetfile) {

					if (exportJson.sheets == null || exportJson.sheets.length == 0) {
						that.$notify.error({
							title: '错误',
							message: '载入失败，当前不支持xlsx以外的其他格式'
						});
						return;
					}
					that.destroy()
					that.isCanGetRange = true
					that.createLuckSheet(exportJson)

				});
			},
			async postMessage(messageTpye, postData) {
				let that = this
				let id = await this.GetDomId()
				return new Promise((resolve, reject) => {
					try {
						let index = setInterval(function() {
							if (window.parent) {
								clearInterval(index)
								// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
								window.parent.postMessage({
									messageTpye: messageTpye,
									postData: postData,
									domid: id
								}, '*');
								resolve(true)
							}
						})
					} catch (e) {
						reject(false, e)
					}

				})

			},
			isMultipleSelectChange(isMultipleSheet) {
				this.isMultipleSheet = isMultipleSheet
			},
			SetIsAutoSelect(isAutoSelect) {
				this.isAutoSelect = isAutoSelect
				this.rangeSelectComplateAutoCopy = isAutoSelect
			},
			closeChange(status) {
				this.close = status
				// if (status) {
				// 	this.getPostMessage({
				// 		isAddEventListener: false
				// 	})
				// } else {
				// 	this.getPostMessage()
				// }
			},
			GetframeElement() {
				return new Promise((resolve, reject) => {
					let index = setInterval(() => {
						if (window && window.frames && window.frames.frameElement) {
							clearInterval(index)
							resolve(window.frames.frameElement)
						}
					})
				})
			},
			async GetDomId() {
				if (this.dom.id) {
					return this.dom.id
				}
				let id = await this.GetframeElement()
				id = id.id
				this.dom.id = id
				return id
			},
			async getPostMessage(option) {
				let _this = this
				let defaultoption = {
					isAddEventListener: true
				}
				if (!option) {
					option = {}
				}
				option = Object.assign(defaultoption, option)

				if (!messageListener || vue_that != this) {
					vue_that = this
					messageListener = function(e) {
						let data = e.data
						let IsEmptyOrNull = judgeVariableIsEmptyOrNull(data)
						if (IsEmptyOrNull) {
							return
						}
						if (_this.close) {
							return
						}
						let type = judgeVariableType(data)
						let typeofdata = typeof data
						switch (type) {
							case variableInfo.string.name:

								break
							case variableInfo.number.name:

								break
							case variableInfo.array.name:
								break
							case variableInfo.json.name:
								// if (data.domid != id) {
								// 	return
								// }
								switch (data.messageTpye) {
									case 'file':
										_this.importExcel(data.postData)
										break
									case 'ManualCopy':
										_this.ManualCopy()
										break
									case 'autoSelect':
										_this.parentAutoSelect()
										break
									case 'MultipleSheetSave':
										_this.GetHasValueRange(data.postData)
										break
									case 'ManualPaste':
										_this.ManualPaste(data.postData)
										break
									case 'isAutoSelect':
										_this.SetIsAutoSelect(data.postData)
										break
									case 'isMultipleSelectChange':
										_this.isMultipleSelectChange(data.postData)
										break
									case 'ManualSheetSave':
										_this.ManualMultiSheet(data.postData)
										break
									case 'resizeLuckSheet':
										_this.resizeLuckSheet()
										break
									case 'close':
										_this.closeChange(true)
										break
									case 'open':
										_this.closeChange(false)
										break
								}
								break
							case variableInfo.function.name:

								break
							case variableInfo.boolean.name:

								break
						}
					}
				}
				try {
					console.log('iframe getPostMessage 移除监听')
					window.removeEventListener('message', messageListener)
				} catch (e) {
					console.log(e)
				}
				let id = await this.GetDomId()
				if (option.isAddEventListener) {
					console.log('iframe getPostMessage 开始监听')
					let that = this
					setTimeout(() => {
						window.addEventListener('message', messageListener)
						that.postMessage('addEventListener', true);
					}, 200)

				}

			},
			parentAutoSelect() {
				if (this.isMultipleSheet) {
					this.dialogShow()
				} else {
					this.GetHasValueRange()
				}
			},
			dialogShow(sheet_list) {
				let isManual = false
				if (!sheet_list) {
					sheet_list = []
					isManual = true
					let sheet_info = luckysheet.getAllSheets();
					let length = sheet_info.length
					for (let i = 0; i < length; i++) {
						let item = sheet_info[i]
						let name = item.name
						if (!name) {
							name = 'sheet' + (i + 1)
						}
						let array_item = {
							order: i,
							name: name
						}
						sheet_list.push(array_item)
					}
				}
				this.postMessage('MultipleSelectDialog', {
					check: {
						sheet_id: sheet_list
					},
					isManual: isManual
				});
			},
			ManualPaste(txt) {
				if (txt) {
					let that = this
					this.destroy()
					this.createLuckSheet()
					let index = setInterval(() => {
						if (that.isHasLuckSheet) {
							clearInterval(index)

							luckysheet.ManualPaste(txt, 0, 0, that.isCompressed)
						}
					}, 500)

				}
			},
			ManualMultiSheet(select_area) {
				this.Copy([0, 0], [0, 0], select_area)
			},
			async ManualCopy() {
				if (this.close) {
					return
				}
				if (this.confirminfo.status) {
					return
				}
				if (!this.range) {
					this.$notify({
						title: '提示',
						message: '请先选择一个区域',
						type: 'warning'
					});
					return
				}
				let tips = ''
				let range = []
				if (this.isMultipleSheet) {
					let sheet_info = luckysheet.getAllSheets();
					console.log('ManualCopy isMultipleSheet', this.isMultipleSheet, this.range)
					let list = []
					for (let key in this.range) {
						let item = this.range[key]
						let name = GetTips(item.name, item.area)
						let order = item.order
						if (order > sheet_info.length - 1 || order < 0) {
							continue
						}
						if (sheet_info[order].name && sheet_info[order].name != item.name) {
							continue
						}
						let sheet_item = {
							name: name,
							order: order,
							area: item.area
						}
						list.push(sheet_item)
					}
					this.dialogShow(list)
					return
				} else {
					let order = await luckysheet.findCurrentSheetIndexAwait()
					if (!this.range || !this.range[order]) {
						this.$notify({
							title: '提示',
							message: '当前页无选中区域',
							type: 'warning'
						});
						return
					}
					range = this.range[order]
					if (range.area.length > 1) {
						this.$notify({
							title: '提示',
							message: '只能选择一个区域，请勿多重选择',
							type: 'warning'
						});
						return
					}
					if (range.area == 0) {
						this.$notify.info({
							title: '提示',
							message: '请先选择一个区域',
						});
						return
					}
					tips = GetTips(range.name, range.area)
					range = range.area
				}

				function GetTips(name, range) {
					let tips = ''
					if (!name) {
						name = ''
					}
					tips = name + '所选范围，行:' + range[0].row[0] +
						'-' + range[0].row[1] + ',共' + (range[0].row[1] - range[0].row[0] + 1) + '行';
					tips = tips + ',列:' + colToStr(range[0].column[0]) +
						'-' + colToStr(range[0].column[1]) + ',共' + (range[0].column[1] - range[0]
							.column[
								0] +
							1) + '列';
					return tips;
				}
				this.confirminfo.status = true
				// this.$confirm(tips, '提示', {
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// 	closeOnClickModal: false,
				// 	type: 'warning',
				// 	center: false
				// }).then(() => {
				// 	this.Copy(this.range[0].row, this.range[0].column)
				// 	this.confirminfo.status = false
				// }).catch(() => {
				// 	this.confirminfo.status = false
				// });
				this.confirminfo.layerid = this.$layer.confirm(tips, {
						title: '提示',
						btn: ['确定', '取消'],
						icon: 3,
						shade: false,
						shadeClose: false,
					},
					layerid => {
						this.$layer.close(layerid);
						this.Copy(range[0].row, range[0].column)
						this.confirminfo.status = false

					},
					layerid => {
						this.confirminfo.status = false
						this.$layer.close(layerid);
					}
				);

			},
			async Copy(rowRange, colRange, isMultipleSheet) {
				let isCopySheetInfo = false
				if (!this.isMultipleSheet) {
					isMultipleSheet = false
					isCopySheetInfo = false
				} else {
					isCopySheetInfo = true
				}
				let resetIsAutoSelect = false
				if (this.isAutoSelect) {
					resetIsAutoSelect = true
					this.isAutoSelect = false
				}
				let content = await luckysheet.ManualCopy(rowRange, colRange, this.isCompressed, true, {
					isCopyHide: {
						row: true,
						col: true
					},
					isCopySheetInfo: isCopySheetInfo,
					isMultipleSheet: isMultipleSheet
				})
				this.postMessage('TemplateJson', content);
				if (resetIsAutoSelect) {
					resetIsAutoSelect = false
					this.isAutoSelect = true
				}
			},

			async GetHasValueRange(sheet_list) {
				let that = this
				let index = setInterval(async () => {
					if (that.isHasLuckSheet) {
						clearInterval(index)
						let range = undefined
						let item = undefined
						if (that.isMultipleSheet) {
							range = await luckysheet.GetHasValueRangeMultiple(sheet_list)
							let temp = JSON.parse(JSON.stringify(range))
							for (let key in temp) {
								item = temp[key]
								if (!item) {
									delete range[key]
									continue
								}
								if (item.range_col.max < 0 || item.range_row.max < 0) {
									delete range[key]
									continue
								}
								range[key].colRange = [item.range_col.min, item.range_col.max]
								range[key].rowRange = [item.range_row.min, item.range_row.max]
							}
							let flag = false
							for (let key in range) {
								if (range[key]) {
									flag = true
									break
								}
							}
							//isMultipleSheet: false, //{index:{colRange:[0,0],rowRange:[0,0]}}
							that.Copy([0, 0], [0, 0], range)
						} else {
							range = await luckysheet.GetHasValueRange()

							if (!range || range.range_col.max < 0 || range.range_row.max < 0) {
								that.$notify.info({
									title: '提示',
									message: '无数据获取',
								});
								return false
							}
							that.Copy([range.range_row.min, range.range_row.max], [range.range_col.min,
								range.range_col
								.max
							])
						}

					}
				})
			},

		},
	}
</script>
<style>

</style>

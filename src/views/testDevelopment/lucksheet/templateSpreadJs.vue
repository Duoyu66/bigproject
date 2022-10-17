<template>
	<div style="position: absolute;height: 100%;width:100%;top:0px;bottom: 0px;left:0px">
		<div id="ss" ref="excel" style="margin:0px;padding:0px;position:absolute;width:100%;left: 0px;top: 0px;bottom:0px;"></div>

	</div>
</template>

<script>
	import {
		doEdit,
		ExecSql,
		QueryExec,
    QueryExecNoCompress,
		QueryExecFile
	} from '@/api/table'
	// import {
	// 	mapActions,
	// 	mapGetters
	// } from 'vuex'
	// import {
	// 	ViewfileUrl,
	// 	UploadFileNameUrl
	// } from '@/utils/servicefile'
	import {
		judgeVariableType,
		variableInfo,
		judgeVariableIsEmptyOrNull
	} from '@/utils/base.helper'
	// import {
	// 	TreeDataDeal,
	// 	TreeDataDealEx
	// } from '@/global/tree_deal'
	import {
		cellConvert,
		cellCount,
		cellConvertToOffice
	} from '@/utils/cellconvert'
  import {
    initexcel,
    setParamterValue,
    ResetSheetCellSize
  } from '@/utils/excelchange'
	import {
		getparamlistone
	} from '@/api/table'
  import {
    getTestTemplateData
  } from '@/api/dataCache'
  import {
  	ZlibHelper
  } from '@/global/zlibHelper'
	export default {
		name: 'ComprehensiveTable',
		components: {
			// parameterTemplate,
			// ParamEdit,
			// pdf
		},
		// filters: {
		// 	statusFilter(status) {
		// 		const statusMap = {
		// 			published: 'success',
		// 			draft: 'gray',
		// 			deleted: 'danger',
		// 		}
		// 		return statusMap[status]
		// 	},
		// },
		// provide() {
		// 	return {
		// 		reload: this.fetchData,
		// 	}
		// },
		data() {
			return {
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				listLoading: true,
				form: {
					param_id: '',
					tpl_class: '1',
					temp_id: ''
				},
				Message: {
					pageType: -1,
					org_pid: -1,
					org_id: -1,
					person_id: -1,
					object_id: -1,
					data_id: -1,
					current_org_id: -1,
					templateInfo: {}
				},
				list: [],
				listsumbit: [],
				queryform: {
					table_type: '',
					title: ''
				},
        rc: [],
				isHasLuckSheet: false,
				item_options: [],
			}
		},
		created() {
      let that = this
      that.getPostMessage()
      window.fetchData = function() {
        return that.fetchData()
      }
      window.addmap = function() {
        return that.addmap()
      }
      window.searchmap = function(meta) {
        return that.searchmap(meta)
      }
      window.clearmap = function() {
        return that.clearmap()
      }
		},
		mounted() {
      let that = this
			let index = setInterval(function() {
				clearInterval(index);
				if (window.$("#ss") && window.$("#ss")[0] && window.$("#ss").wijspread) {
					clearInterval(index);
					window.$("#ss").wijspread({
						sheetCount: 1
					});
          var spread = window.$("#ss").wijspread("spread");
          let data = '{"activeSheetIndex":0,"sheetCount":1,"tabStripRatio":0.5,"tabStripVisible":true,"tabEditable":true,"newTabVisible":true,"referenceStyle":0,"useWijmoTheme":true,"canUserEditFormula":true,"startSheetIndex":0,"allowUndo":true,"allowUserZoom":true,"allowUserResize":true,"allowDragDrop":true,"allowDragFill":true,"highlightInvalidData":false,"sheets":{"Sheet1":{"name":"Sheet1","rightClickMenu":[],"defaults":{"rowHeight":20,"colWidth":62,"rowHeaderColWidth":40,"colHeaderRowHeight":20},"columns":{"length":20},"rows":{"length":200},"autoGenerateColumns":true,"dataSource":null,"frozenRowCount":0,"frozenColCount":0,"rowCount":200,"columnCount":50,"data":{"name":"Sheet1","rowCount":200,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":3,"vAlign":0}}},"sparklineGroupManager":{"groups":[]},"spans":{},"selections":{"0":{"row":0,"rowCount":1,"col":0,"colCount":1},"selectionPolicy":2,"selectionUnit":0,"length":1,"activeSelectedRangeIndex":0},"activeRow":0,"activeCol":0,"gridline":{"color":"#D0D7E5","showVerticalGridline":true,"showHorizontalGridline":true},"allowCellOverflow":false,"referenceStyle":0,"_zoomFactor":1,"theme":{"_name":"Office","_themeColor":{"_name":"Office","_colorList":[{"a":255,"r":255,"g":255,"b":255},{"a":255,"r":238,"g":236,"b":225},{"a":255,"r":0,"g":0,"b":0},{"a":255,"r":31,"g":73,"b":125},{"a":255,"r":79,"g":129,"b":189},{"a":255,"r":192,"g":80,"b":77},{"a":255,"r":155,"g":187,"b":89},{"a":255,"r":128,"g":100,"b":162},{"a":255,"r":75,"g":172,"b":198},{"a":255,"r":247,"g":150,"b":70},{"a":255,"r":0,"g":0,"b":255},{"a":255,"r":128,"g":0,"b":128}]},"_headingFont":"Cambria","_bodyFont":"Calibri"},"showRowRangeGroup":true,"showColumnRangeGroup":true,"rowRangeGroup":{"itemsCount":200,"itemsData":[],"direction":1,"head":null,"tail":null},"colRangeGroup":{"itemsCount":70,"itemsData":[],"direction":1,"head":null,"tail":null},"conditionalFormats":{"rules":[]},"sheetTabColor":null,"frozenlineColor":"black","rowHeaderAutoText":1,"colHeaderAutoText":2,"rowHeaderAutoTextIndex":-1,"colHeaderAutoTextIndex":-1,"rowHeaderVisible":true,"colHeaderVisible":true,"rowHeaderColCount":1,"colHeaderRowCount":1,"rowHeaderData":{"rowCount":200,"colCount":1,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"colHeaderData":{"rowCount":1,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"rowHeaderSpan":{},"colHeaderSpan":{},"rowHeaderColInfos":{},"colHeaderRowInfos":{},"isProtected":false,"borderColor":"black","borderWidth":0,"allowDragDrop":true,"allowDragFill":true,"allowUndo":true,"allowEditorReservedLocations":true}},"names":[]}'

          let datajson = JSON.parse(data)
          spread.fromJSON(datajson);
				}
			})

		},

		methods: {
			import_search() {
				this.fetchData()
			},
			getPostMessage() {
				let _this = this
				window.addEventListener('message', function(e) {
					_this.PostMessageNum++
					let data = e.data
					let IsEmptyOrNull = judgeVariableIsEmptyOrNull(data)
					if (IsEmptyOrNull) {
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
							for (let key in data) {
								_this.Message[key] = data[key]
								//_this.$set(_this.Message, key, data[key])
							}
              _this.fetchData()
							console.log('getPostMessage', _this.Message)
							break
						case variableInfo.function.name:

							break
						case variableInfo.boolean.name:

							break
					}
				})
			},
      async clearmap() {
        this.$baseConfirm('你确定要清空所有映射吗', null, async () => {
          let that = this
          var spread = window.$("#ss").wijspread("spread");
          let num=spread.getActiveSheetIndex()
        	let sData = '[Q]667{' + that.Message.templateInfo.id +'$`'+num.toString()+ '}|^1|^SYS'
          console.log(sData)
        	const res = await ExecSql(sData)
        	if (res > 0) {
            that.$baseMessage('映射清空成功', 'success')
        	} else {
        		that.$baseMessage('映射清空失败', 'error')
        	}

        })
      },
			async addmap() {
        let that = this
        let succorfail = 0
        let count = 0
        console.log(that.listsumbit)
        if(that.Message.templateInfo.object_id === undefined)
        {
          that.Message.templateInfo.object_id=''
        }
				that.listsumbit.forEach(async (item, index) => {
					count = 0
					if (item.state === 'I') {
						let sData = '[Q]452{' + that.Message.templateInfo.object_id + '$`0$`' + item.meta_id + '$`' + item.cell + '$`'+item.sheet_id+'$`'+that.Message.templateInfo.id+'}|^2|^SYS'
						const res = await ExecSql(sData)
            console.log(sData)
						if (res > 0) {

						} else {
							count++
						}
					} else if (item.state === 'U') {
						let sData = '[Q]478{' + item.meta_id + '$`' + item
							.cell + '$`' + that.Message.templateInfo.id +'$`'+item.sheet_id+ '}|^1|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)
						console.log(res)
						if (res > 0) {

						} else {
							count++
						}
					} else if (item.state === 'D') {
						let sData = '[Q]500{' + that.Message.templateInfo.object_id + '$`0$`' + item.meta_id + '$`' +item.sheet_id+ '}|^1|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)
						console.log(res)
						if (res > 0) {

						} else {
							count++
						}
					}
				})
				if (count === 0) {
					that.$baseMessage('映射定义成功', 'success')

				} else {
					that.$baseMessage(count.toString() + '个映射定义失败,请刷新页面查看哪些未定义上', 'error')
				}
        that.listsumbit=[]
			},

			async fetchData() {
        let that = this
        var spread = window.$("#ss").wijspread("spread");
        let data = '{"activeSheetIndex":0,"sheetCount":1,"tabStripRatio":0.5,"tabStripVisible":true,"tabEditable":true,"newTabVisible":true,"referenceStyle":0,"useWijmoTheme":true,"canUserEditFormula":true,"startSheetIndex":0,"allowUndo":true,"allowUserZoom":true,"allowUserResize":true,"allowDragDrop":true,"allowDragFill":true,"highlightInvalidData":false,"sheets":{"Sheet1":{"name":"Sheet1","rightClickMenu":[],"defaults":{"rowHeight":20,"colWidth":62,"rowHeaderColWidth":40,"colHeaderRowHeight":20},"columns":{"length":20},"rows":{"length":200},"autoGenerateColumns":true,"dataSource":null,"frozenRowCount":0,"frozenColCount":0,"rowCount":200,"columnCount":50,"data":{"name":"Sheet1","rowCount":200,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":3,"vAlign":0}}},"sparklineGroupManager":{"groups":[]},"spans":{},"selections":{"0":{"row":0,"rowCount":1,"col":0,"colCount":1},"selectionPolicy":2,"selectionUnit":0,"length":1,"activeSelectedRangeIndex":0},"activeRow":0,"activeCol":0,"gridline":{"color":"#D0D7E5","showVerticalGridline":true,"showHorizontalGridline":true},"allowCellOverflow":false,"referenceStyle":0,"_zoomFactor":1,"theme":{"_name":"Office","_themeColor":{"_name":"Office","_colorList":[{"a":255,"r":255,"g":255,"b":255},{"a":255,"r":238,"g":236,"b":225},{"a":255,"r":0,"g":0,"b":0},{"a":255,"r":31,"g":73,"b":125},{"a":255,"r":79,"g":129,"b":189},{"a":255,"r":192,"g":80,"b":77},{"a":255,"r":155,"g":187,"b":89},{"a":255,"r":128,"g":100,"b":162},{"a":255,"r":75,"g":172,"b":198},{"a":255,"r":247,"g":150,"b":70},{"a":255,"r":0,"g":0,"b":255},{"a":255,"r":128,"g":0,"b":128}]},"_headingFont":"Cambria","_bodyFont":"Calibri"},"showRowRangeGroup":true,"showColumnRangeGroup":true,"rowRangeGroup":{"itemsCount":200,"itemsData":[],"direction":1,"head":null,"tail":null},"colRangeGroup":{"itemsCount":70,"itemsData":[],"direction":1,"head":null,"tail":null},"conditionalFormats":{"rules":[]},"sheetTabColor":null,"frozenlineColor":"black","rowHeaderAutoText":1,"colHeaderAutoText":2,"rowHeaderAutoTextIndex":-1,"colHeaderAutoTextIndex":-1,"rowHeaderVisible":true,"colHeaderVisible":true,"rowHeaderColCount":1,"colHeaderRowCount":1,"rowHeaderData":{"rowCount":200,"colCount":1,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"colHeaderData":{"rowCount":1,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"rowHeaderSpan":{},"colHeaderSpan":{},"rowHeaderColInfos":{},"colHeaderRowInfos":{},"isProtected":false,"borderColor":"black","borderWidth":0,"allowDragDrop":true,"allowDragFill":true,"allowUndo":true,"allowEditorReservedLocations":true}},"names":[]}'

        let datajson = JSON.parse(data)
        spread.fromJSON(datajson);
        console.log(this.Message)
        if(that.$refs.excel && this.Message.templateInfo.id)
        {
          console.log(this.Message.templateInfo)
          let refexcel = that.$refs.excel
          let template_json = await getTestTemplateData(this.Message.templateInfo.id);
          that.listsumbit = []
          let paste = new pasteManual(spread);
          let test = await paste.ManualPaste(template_json, 0, 0, true, undefined, {sheet: { start_sheet_id: 0 }});
          let sheetfirst = spread.getActiveSheet()
          that.rc = await ResetSheetCellSize(spread,refexcel.offsetWidth-30,refexcel.offsetHeight-60,30,60)
          console.log(that.rc)
          let sData1,sData,res1=[],restemp=[]
          let count = 0
          sheetfirst.isPaintSuspended(true);
          while(true)
          {
            sData1 = '[Q]598{' + this.Message.templateInfo.id +'$`'+count+'$`1000}|^SYS'
            res1 = await QueryExec(sData1)
            console.log(sData1,res1)
            count+=1000
            if(res1.data.length===0 || res1.data.length===undefined)
            {
              break;
            }
            res1.data.forEach((item, index) => {
              try {
                let sheetnow = {}
                  if(item.sheet_id !== '')
                  {
                    sheetnow = spread.getSheet(item.sheet_id)
                  }
                  else {
                    sheetnow = sheetfirst

                  }
                  that.listsumbit.push({"meta_id":item.meta_id,"meta_name":item.meta_name,"state":"","cell":item.cell,"sheet_id":item.sheet_id})
                  let coordinate = cellConvert(item.cell)
                  sheetnow.getCell(coordinate[0]+that.rc[Number(item.sheet_id)][0], coordinate[1]+that.rc[Number(item.sheet_id)][1]).text(item.meta_name).foreColor('#ff0000');

              }
              catch(e) {
                console.log(e)
              }
            })

          }

          // console.log(JSON.stringify(res1))


          sheetfirst.isPaintSuspended(false);
          await that.setRightClickMenu(spread)
        }

			},
      async setRightClickMenu(spread) {
        let that=this
        let rightClickMenu = []
        for(let m=0;m<spread.sheets.length;m++)
        {
          let rightMenuRe = await that.setRightMenu(spread,m,'')
          if(m==0)
          {
            rightClickMenu = rightMenuRe
          }
          spread.sheets[m.toString()].paintRightClickMenu(rightMenuRe)
        }
        let sheet = spread.getActiveSheet()
        sheet.paintRightClickMenu(rightClickMenu)
      },
      async searchmap(meta) {
        var spread = window.$("#ss").wijspread("spread");
        let index = spread.getActiveSheetIndex()
        let rightClickMenu = await this.setRightMenu(spread,index,meta)
        let sheet = spread.getActiveSheet()
        sheet.paintRightClickMenu(rightClickMenu)
      },
      async setRightMenu(spread,index,meta) {
        let rightClickMenu = []
        let that = this
        rightClickMenu.push({ "key": "setMeta", "title": "取消", "label": "","func": function(){
          let sheet = spread.getActiveSheet()
          sheet.isPaintSuspended(true);
          let val = sheet.getText(sheet.coordinate[0], sheet.coordinate[1])
          // console.log(val)
          for(let i=0;i<that.listsumbit.length;i++)
          {
            if(that.listsumbit[i].meta_name===val)
            {
              that.listsumbit[i].state = "D"
            }
          }
          sheet.getCell(sheet.coordinate[0], sheet.coordinate[1]).text('D').foreColor('#ff0000')
          sheet.isPaintSuspended(false);
        }})
        rightClickMenu.push({ key: 'divider' })
        let sData,in_entry='',in_order='',in_record='',in_report='',in_mixed='',in_check=''
        if(this.findinstr(this.Message.templateInfo.entry_sheet,index+1))
        {
          in_entry='1'
        }
        if(this.findinstr(this.Message.templateInfo.order_sheet,index+1))
        {
          in_order='1'
        }
        if(this.findinstr(this.Message.templateInfo.record_sheet,index+1))
        {
          in_record='1'
        }
        if(this.findinstr(this.Message.templateInfo.report_sheet,index+1))
        {
          in_report='1'
        }
        if(this.findinstr(this.Message.templateInfo.mixed_sheet,index+1))
        {
          in_mixed='1'
        }
        if(this.findinstr(this.Message.templateInfo.check_sheet,index+1))
        {
          in_check='1'
        }
        sData = '[Q]597{' + this.Message.templateInfo.id + '$`' + index+ '$`' + in_entry+ '$`'
        + in_order+ '$`' + in_record+ '$`' + in_report+ '$`' + in_mixed+ '$`' + in_check+ '$`%' + meta+'%}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData,res)
        res.data.forEach((item, index) => {
          rightClickMenu.push({ "key": "setMeta", "title": item.meta_name, "label": "","func": function(){
            let sheet = spread.getActiveSheet()
            sheet.isPaintSuspended(true);
            let val = sheet.getText(sheet.coordinate[0], sheet.coordinate[1])
            let order_id = spread.getActiveSheetIndex()
            let k = 0
            // console.log(val)
            if (val !== '/' && val !== null) {
              let count = 0
            	for (k = 0; k < that.listsumbit.length; k++) {
            		if (cellConvertToOffice(sheet.coordinate[1]-that.rc[Number(order_id)][1], sheet.coordinate[0]-that.rc[Number(order_id)][0]) === that.listsumbit[k].cell && that.listsumbit[k].sheet_id===order_id) {
                  if(that.listsumbit[k].state !== "I")
                  {
                    that.listsumbit[k].meta_id = item.meta_id
                    that.listsumbit[k].meta_name = item.meta_name
                    that.listsumbit[k].state = "U"
                    that.listsumbit[k].sheet_id = order_id
                  }
                  else {
                    that.listsumbit[k].meta_id = item.meta_id
                    that.listsumbit[k].meta_name = item.meta_name
                    that.listsumbit[k].state = "I"
                    that.listsumbit[k].sheet_id = order_id
                  }
            		}
                else {
                  count++
                }
            	}
              if(k === count)
              {
                that.listsumbit.push({
                	"meta_id": item.meta_id,
                	"meta_name": item.meta_name,
                	"state": "I",
                	"cell": cellConvertToOffice(sheet.coordinate[1]-that.rc[Number(order_id)][1], sheet.coordinate[0]-that.rc[Number(order_id)][0]),
                  "sheet_id": order_id
                })
              }
            } else {
            	that.listsumbit.push({
            		"meta_id": item.meta_id,
            		"meta_name": item.meta_name,
            		"state": "I",
            		"cell": cellConvertToOffice(sheet.coordinate[1]-that.rc[Number(order_id)][1], sheet.coordinate[0]-that.rc[Number(order_id)][0]),
                "sheet_id": order_id
            	})
            }
            sheet.isPaintSuspended(true)
            sheet.getCell(sheet.coordinate[0], sheet.coordinate[1]).text(item.meta_name).foreColor('#ff0000')
            sheet.isPaintSuspended(false)
            for (let i = 0; i < rightClickMenu.length; i++) {
              if(item.meta_name === rightClickMenu[i].title) {
                rightClickMenu.splice(i,1);
                break
              }
            }
            sheet.isPaintSuspended(false);
            sheet.paintRightClickMenu(rightClickMenu)
          }})
        })
        return rightClickMenu
      },
      findinstr(str,index)
      {
        let slist = str.split(',')
        for(let i=0;i<slist.length;i++)
        {
          if(slist[i]==index.toString())
          {
            return true
          }
        }
        return false
      }
		},
	}
</script>

<style>
	.excelTitle {
		margin: 10px 0 0 0;
		height: 40px;
		box-sizing: border-box;
		line-height: 40px;
		width: 100%;
		color: #606266;
		padding-left: 27px;
		font-size: 14px;
		background: #e8f0ff no-repeat 15px 12px;
	}

	.excelTitle button {
		float: right;
		margin: 4px 0 0 0;
		height: 32px;
	}

	#recordsheet {
		margin: 0px;
		padding: 0px;
		height: 350px;
		border: 1px solid #CCCCCC
	}

	#entrustsheet {
		margin: 0px;
		padding: 0px;
		height: 700px;
		border: 1px solid #CCCCCC
	}
</style>

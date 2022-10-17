<template>
	<div style="position: absolute;height: 100%;width:100%;top:0px;bottom: 0px;left:0px">
		<div id="ss" style="margin:0px;padding:0px;position:absolute;width:100%;left: 0px;top: 0px;bottom:0px;"></div>

	</div>
</template>

<script>
	import {
		doEdit,
		ExecSql,
		QueryExec,
		QueryExecFile
	} from '@/api/table'
	import {
		judgeVariableType,
		variableInfo,
		judgeVariableIsEmptyOrNull
	} from '@/utils/base.helper'
	import {
		cellConvert,
		cellCount,
		cellConvertToOffice
	} from '@/utils/cellconvert'
	import Excel from 'exceljs'
  import {
  	getExportData
  } from '@/components/export/exportData'
	import FileSaver from 'file-saver'
  import {exportExcel} from '@/components/export/export.js'
	import {
		getparamlistone
	} from '@/api/table'
	export default {
		name: 'ComprehensiveTable',
		components: {
		},
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
					entrustInfo: {}
				},
				list: [],
				listsumbit: [],
				queryform: {
					table_type: '',
					title: ''
				},
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
      window.exchangejs = function() {
        return that.exchangejs()
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
				}
        that.fetchData()
			})

		},

		methods: {
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
							console.log('getPostMessage', _this.Message)
							break
						case variableInfo.function.name:

							break
						case variableInfo.boolean.name:

							break
					}
				})
			},
			async exportExcel() {
        let that = this
        var spread = window.$("#ss").wijspread("spread");
			},

			async fetchData() {
        let that = this
        let index = setInterval(async function() {
          if(that.Message.entrustInfo.template_id)
          {
            clearInterval(index);
            var spread = window.$("#ss").wijspread("spread");
            let data = '{"activeSheetIndex":0,"sheetCount":1,"tabStripRatio":0.5,"tabStripVisible":true,"tabEditable":true,"newTabVisible":true,"referenceStyle":0,"useWijmoTheme":true,"canUserEditFormula":true,"startSheetIndex":0,"allowUndo":true,"allowUserZoom":true,"allowUserResize":true,"allowDragDrop":true,"allowDragFill":true,"highlightInvalidData":false,"sheets":{"Sheet1":{"name":"Sheet1","rightClickMenu":[],"defaults":{"rowHeight":20,"colWidth":62,"rowHeaderColWidth":40,"colHeaderRowHeight":20},"columns":{"length":20},"rows":{"length":200},"autoGenerateColumns":true,"dataSource":null,"frozenRowCount":0,"frozenColCount":0,"rowCount":200,"columnCount":50,"data":{"name":"Sheet1","rowCount":200,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":3,"vAlign":0}}},"sparklineGroupManager":{"groups":[]},"spans":{},"selections":{"0":{"row":0,"rowCount":1,"col":0,"colCount":1},"selectionPolicy":2,"selectionUnit":0,"length":1,"activeSelectedRangeIndex":0},"activeRow":0,"activeCol":0,"gridline":{"color":"#D0D7E5","showVerticalGridline":true,"showHorizontalGridline":true},"allowCellOverflow":false,"referenceStyle":0,"_zoomFactor":1,"theme":{"_name":"Office","_themeColor":{"_name":"Office","_colorList":[{"a":255,"r":255,"g":255,"b":255},{"a":255,"r":238,"g":236,"b":225},{"a":255,"r":0,"g":0,"b":0},{"a":255,"r":31,"g":73,"b":125},{"a":255,"r":79,"g":129,"b":189},{"a":255,"r":192,"g":80,"b":77},{"a":255,"r":155,"g":187,"b":89},{"a":255,"r":128,"g":100,"b":162},{"a":255,"r":75,"g":172,"b":198},{"a":255,"r":247,"g":150,"b":70},{"a":255,"r":0,"g":0,"b":255},{"a":255,"r":128,"g":0,"b":128}]},"_headingFont":"Cambria","_bodyFont":"Calibri"},"showRowRangeGroup":true,"showColumnRangeGroup":true,"rowRangeGroup":{"itemsCount":200,"itemsData":[],"direction":1,"head":null,"tail":null},"colRangeGroup":{"itemsCount":70,"itemsData":[],"direction":1,"head":null,"tail":null},"conditionalFormats":{"rules":[]},"sheetTabColor":null,"frozenlineColor":"black","rowHeaderAutoText":1,"colHeaderAutoText":2,"rowHeaderAutoTextIndex":-1,"colHeaderAutoTextIndex":-1,"rowHeaderVisible":true,"colHeaderVisible":true,"rowHeaderColCount":1,"colHeaderRowCount":1,"rowHeaderData":{"rowCount":200,"colCount":1,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"colHeaderData":{"rowCount":1,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"rowHeaderSpan":{},"colHeaderSpan":{},"rowHeaderColInfos":{},"colHeaderRowInfos":{},"isProtected":false,"borderColor":"black","borderWidth":0,"allowDragDrop":true,"allowDragFill":true,"allowUndo":true,"allowEditorReservedLocations":true}},"names":[]}'
            let datajson = JSON.parse(data)
            spread.fromJSON(datajson);
            console.log(that.Message.entrustInfo)
            await getExportData(spread,that.Message.entrustInfo.template_id,that.Message.entrustInfo.param)
            console.log(spread.toJSON())
          }
        },100)

			},
      exchangejs()
      {
      	var spread = $("#ss").wijspread("spread");
      	var index = spread.getSheetCount();
      	const workbook = new Excel.Workbook();
      	for(let order=0;order<index;order++)
      	{
      		let spreadsheet = spread.getSheet(order)
      		let sheetjson = spreadsheet.toJSON()
      		const sheet = workbook.addWorksheet(sheetjson.name);

      		let datatablejson = sheetjson.data.dataTable //spreadjs 数据json
      		let spanjson = sheetjson.spans //spreadjs 合并json
      		let rows = sheetjson.rows
      		let columns = sheetjson.columns
      		let defaults = sheetjson.defaults

      		sheet._columns = []

      		let borderstyle = {"empty":0,"thin":1,"medium":2,"dashed":3,"dotted":4,"thick":5,"double":6,"hair":7,"mediumDashed":8,"dashDot":9,"mediumDashDot":10,"dashDotDot":11,"mediumDashDotDot":12,"slantedDashDot":13}
      		let HorizontalAlign = {"left":0,"center":1,"right":2,"general":3}
      		let VerticalAlign = {"top":0,"middle":1,"bottom":2}


      		let columnCount = 0

      		sheet.properties.defaultRowHeight =  parseFloat(defaults.rowHeight)*3/4
      		sheet.properties.defaultColWidth = parseFloat(defaults.colWidth)/8

      		for(let i in rows)
      		{
      			const row = sheet.getRow(Number(i)+1);
      			row.height = parseFloat(rows[i].size)*3/4
      		}
      		for(let i in datatablejson)
      		{
      			const row = sheet.getRow(Number(i)+1);
      			let rowdatajson = datatablejson[i]
      			for(let j in rowdatajson)
      			{
      				if(j!='rs')
      				{
      					row.getCell(Number(j)+1).value = rowdatajson[j].value;
      					let cell = cellConvertToOffice(Number(j),Number(i));
      					// if(style:rowdatajson[j].borderTop.syle)
                let sheetborder = {
                	top: {},
                	left: {},
                	bottom: {},
                	right: {}
                }
                if(rowdatajson[j].style)
                {
                  let topStyle = rowdatajson[j].style.borderTop
                  let bottomStyle = rowdatajson[j].style.borderBottom
                  let leftStyle = rowdatajson[j].style.borderLeft
                  let rightStyle = rowdatajson[j].style.borderRight

                  if(topStyle && topStyle.style) { sheetborder.top.style = this.getKeyFromJson(borderstyle,topStyle.style) }
                  if(leftStyle && leftStyle.style) { sheetborder.left.style = this.getKeyFromJson(borderstyle,leftStyle.style) }
                  if(bottomStyle && bottomStyle.style) { sheetborder.bottom.style = this.getKeyFromJson(borderstyle,bottomStyle.style) }
                  if(rightStyle && rightStyle.style) { sheetborder.right.style = this.getKeyFromJson(borderstyle,rightStyle.style) }

                  if(topStyle && topStyle.color) { sheetborder.top.color = (topStyle.color).colorHex() }
                  if(leftStyle && leftStyle.color) { sheetborder.left.color = (leftStyle.color).colorHex() }
                  if(bottomStyle && bottomStyle.color) { sheetborder.bottom.color = (bottomStyle.color).colorHex() }
                  if(rightStyle && rightStyle.color) { sheetborder.right.color = (rightStyle.color).colorHex() }
                  let vAlign = rowdatajson[j].style.vAlign
                  let hAlign = rowdatajson[j].style.hAlign
                  sheet.getCell(cell).alignment = { vertical: this.getKeyFromJson(VerticalAlign,vAlign), horizontal: this.getKeyFromJson(HorizontalAlign,hAlign) };
                  if(rowdatajson[j].style.wordWrap) { sheet.getCell(cell).alignment.wrapText = true }
                  
                  if(rowdatajson[j].style.font)
                  {
                  	let fontArray = rowdatajson[j].style.font.split(' ')
                  	sheet.getCell(cell).font = {}
                  	// normal normal 10.666666666666666px Times New Roman
                  	let fontname = ''
                  	sheet.getCell(cell).font.size = parseFloat(fontArray[2].substr(0,fontArray[2].length-2))*3/4
                  	if(fontArray[0]==='bold') { sheet.getCell(cell).font.bold = true }
                  	if(fontArray[0]==='italic') { sheet.getCell(cell).font.italic = true }
                  	if(fontArray[1]==='bold') { sheet.getCell(cell).font.bold = true }
                  	if(fontArray[2]==='italic') { sheet.getCell(cell).font.italic = true }
                  	for(let k=3;k<fontArray.length;k++)
                  	{
                  		fontname = fontname+fontArray[i]+' '
                  	}
                  	fontname = fontname.substr(0,fontname.length-1)
                  	sheet.getCell(cell).font.name = fontname
                  }
                }

      					sheet.getCell(cell).border = sheetborder;

      					

      				}

      			}
      		}
      		for(let i=0;i<spanjson.length;i++)
      		{

      			let cellstart = cellConvertToOffice(spanjson[i].col,spanjson[i].row)

      			let cellend = cellConvertToOffice(Number(spanjson[i].col)+Number(spanjson[i].colCount)-1,Number(spanjson[i].row)+Number(spanjson[i].rowCount)-1)
      			sheet.mergeCells(cellstart+':'+cellend);
      		}

      		for(let i in columns)
      		{
      			// let columnData = workbook.[0]._columns[i]
      			if(columns[i].size)
      			{
      				const dobCol = sheet.getColumn(Number(i)+1);
      				dobCol.width = parseFloat(columns[i].size)/8
      				// sheet._columns.push({width:parseFloat(columns[i].size)/8})
      				// columnCount++
      			}
      		}
      	}



      	// sheet.columnCount=columnCount
      	console.log(workbook)
      	const buffer = workbook.xlsx.writeBuffer().then(data => {
      	  // console.log('data', data)
      	  const blob = new Blob([data], {
      	    type: 'application/vnd.ms-excel;charset=utf-8'
      	  })
      	  console.log("导出成功！")
      	  FileSaver.saveAs(blob, 'file.xlsx')
      	})

      },

      getKeyFromJson(data,value) {
      	for(let key in data)
      	{
      		if(data[key] === value)
      		{
      			return key
      		}
      	}
      	return ''
      },
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

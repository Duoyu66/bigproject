<template>
	<div id="approval" style="height: 100%;">
		<div style="height: 100%;">

			<div style="width: 98%;height: 100%;float: left;">
				<div>
					<div style="position: absolute;height: 100%;width:100%;top:0px;bottom: 0px;left:0px" v-loading="loading">
						<div id="ss" ref="ss" :style="lucksheet.style">
						</div>
					</div>
				</div>
			</div>

			<div class="el-custuom-footer">
				<el-tooltip content="打印" placement="bottom" class="button_col">
					<el-button type="primary" size="medium" @click="testprint">
						打印
						<!-- @click="handlHide"> -->
					</el-button>
				</el-tooltip>
			</div>


		</div>
	</div>


</template>

<script>
	import {
		judgeVariableType,
		variableInfo,
		judgeVariableIsEmptyOrNull
	} from '@/utils/base.helper'
  import {
    setParamterValue,
    ResetSheetCellSize
  } from '@/utils/excelchange'
  import {
  	
  } from '@/utils/dataCache'
  import {
  	doEdit,
  	ExecSql,
  	QueryExec,
    QueryExecFile
  } from '@/api/table'


	export default {
		name: 'testDataApprovalLuckSheet',
		model: {
			prop: 'isUpData',
			event: 'on-change'
		},
		props: {

		},
		computed: {
			GetapprovalTableHeight() {
				let hieght = this.windowheight
				console.log('GetapprovalTableHeight', hieght)
				return hieght - 214
			}
		},
		mounted() {
			const that = this

      let index = setInterval(function() {
      	// clearInterval(index);
      	if (window.$("#ss") && window.$("#ss")[0] && window.$("#ss").wijspread) {
      		clearInterval(index);
      		window.$("#ss").wijspread({
      			sheetCount: 1
      		});
          console.log(that)
          that.init()
      	}
      })
			window.onresize = function() {
				that.resizeLuckSheet()
			}
      window.handleAddSeal = function() {
          return that.handleAddSeal()
      }
		},
		data() {
			let that = this
			return {
				windowheight: document.documentElement.clientHeight,
				window: {
					height: document.documentElement.clientHeight
				},
				testData: {

				},
				luckysheet: {
					style: ''
				},
				form: {
					LabelWidth: '120px',
					labelPosition: 'top'
				},
				approvalForm: {
					form: {
						approval_opinion: '',
					},
					rules: {

					}
				},
        loading: true,
				tableOption: {
					approvalTable: {
						listLoading: false,
						tablelist: [],
						elementLoadingText: '获取数据中...'
					}
				},
				lucksheet: {
					isHasLuckSheet: false,
					style: 'margin:0px;padding:0px;position:absolute;width:100%;height: 100%;left: 0px;top:0px;bottom:0px;'
				}
			}

		},

		created() {

		},
		methods: {
			init() {
				this.getPostMessage()
				this.createLuckSheet()
			},
      async handleAddSeal(row) {
        console.log(1)
        var spread = window.$("#ss").wijspread("spread");
        let index = spread.getActiveSheetIndex()
        let sheet = spread.getSheet(index)
        // sheet.setPictureData({ "xAxis": 200, "yAxis": 200, "width": 400, "height": 400, "src": ""})
        let canvashtml = sheet._getCanvas()
        var sheetRender = new GrapeCity.UI._SheetRender(sheet);
        let ctx=sheetRender._getCtx()
        let picture = new Picture(spread);
        let test = await picture.setLocation(ctx,0,0,1920,1080,"http://42.193.118.98:5005/ContractFile/20220105/seal.png",index);

      },
			async resizeLuckSheet(height, width) {
				if (this.timer) {
					return
				}
				height = height ? height : document.documentElement.clientHeight
				width = width ? width : document.documentElement.clientWidth
				let that = this
				this.timer = true
				let iframeid = await this.GetIframeId()
				if (this.lucksheet.isHasLuckSheet) {
					setTimeout(() => {
						that.window.window = height
						that.windowheight = height
						luckysheet.resize();
						that.timer = false
						that.postMessage('onresize', iframeid);
					}, 30)

				} else {
					this.timer = false
				}
			},
			async handlSave() {
        let that = this
        let sData = '[Q]683{'+this.testData.data_id+'$`'+'4'+'$`'+'$`'+that.approvalForm.form.approval_opinion+'}|^1|^SYS'
        console.log(sData)
        const res = await ExecSql(sData)
        if(res>0)
        {
          that.$baseMessage('批准成功', 'success')
        }
        else {
          that.$baseMessage('批准失败', 'error')
        }
			},
			SetTestData(testData) {
				this.testData = testData
			},
			async getPostMessage() {
				let _this = this
				console.log('iframe getPostMessage 开始监听')
				window.addEventListener('message', function(e) {
					let data = e.data
					let IsEmptyOrNull = judgeVariableIsEmptyOrNull(data)
					if (IsEmptyOrNull) {
						return
					}
					console.log('getPostMessage', data)
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
							switch (data.messageTpye) {
								case 'testdata':
									_this.SetTestData(data.postData)
									break
								case 'ManualCopy':
									_this.ManualCopy()
									break
								case 'autoSelect':
									_this.GetHasValueRange()
									break
								case 'ManualPaste':
									_this.ManualPaste(data.postData)
									break
							}
							break
						case variableInfo.function.name:

							break
						case variableInfo.boolean.name:

							break
					}
				})
				//通知父级加载完毕
				let iframeid = await this.GetIframeId()
				this.postMessage('addEventListener', iframeid);
			},
			async GetIframe() {
				await this.getElement()
				return window.frameElement
			},
			async GetIframeId() {
				let iframe = await this.GetIframe()
				return iframe.id
			},
			getElement() {
				let that = this
				return new Promise((resolve, reject) => {
					let index = setInterval(function() {
						if (that.$el) {
							clearInterval(index)
							resolve(that.$el)
						}
					})
				})
			},
			postMessage(messageTpye, postData, data_id) {
				//发送消息
				let that = this
				if (!data_id && this.testData && this.testData.data_id) {
					data_id = this.testData.data_id
				}
				console.log('postMessage', messageTpye, postData, data_id)
				return new Promise((resolve, reject) => {
					try {
						let index = setInterval(function() {
							if (window.parent && window.parent.postMessage) {
								clearInterval(index)
								window.parent.postMessage({
									messageTpye: messageTpye,
									postData: postData,
									data_id: data_id
								}, '*');
								resolve(true)
							}
						})
					} catch (e) {
						reject(false, e)
					}
				})

			},
			destroy() {
				try {
					if (this.lucksheet.isHasLuckSheet) {
						luckysheet.destroy();
						this.lucksheet.isHasLuckSheet = false
					}

				} catch (e) {
					console.log(e)
				}
			},
      async testprint() {
        var spread = window.$("#ss").wijspread("spread");
      	let print = new printExcel(spread)
        let number=spread.getSheetCount();
        console.log(number)
      	let printresult = await print.preview(number,this.rc[2],this.rc[3],'中铁工程设计咨询集团有限公司','ZTZJ/BG-001')
      },
      createLuckSheet(selectFileJson) {
      		let that = this
      		let data = undefined

      		let title = '模板'
      		let userInfo = undefined
      		if (selectFileJson) {
      			data = selectFileJson.sheets
      			title = selectFileJson.info.name
      			userInfo = selectFileJson.info.name.creator
      		}
      		var spread = window.$("#ss").wijspread("spread");
      		let dataEmpty = '{"activeSheetIndex":0,"sheetCount":1,"tabStripRatio":0.5,"tabStripVisible":true,"tabEditable":true,"newTabVisible":true,"referenceStyle":0,"useWijmoTheme":true,"canUserEditFormula":true,"startSheetIndex":0,"allowUndo":true,"allowUserZoom":true,"allowUserResize":true,"allowDragDrop":true,"allowDragFill":true,"highlightInvalidData":false,"sheets":{"Sheet1":{"name":"Sheet1","rightClickMenu":[],"defaults":{"rowHeight":20,"colWidth":62,"rowHeaderColWidth":0,"colHeaderRowHeight":0},"columns":{"length":20},"rows":{"length":200},"autoGenerateColumns":true,"dataSource":null,"frozenRowCount":0,"frozenColCount":0,"rowCount":200,"columnCount":50,"data":{"name":"Sheet1","rowCount":200,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":3,"vAlign":0}}},"sparklineGroupManager":{"groups":[]},"spans":{},"selections":{"0":{"row":0,"rowCount":1,"col":0,"colCount":1},"selectionPolicy":2,"selectionUnit":0,"length":1,"activeSelectedRangeIndex":0},"activeRow":0,"activeCol":0,"gridline":{"color":"#D0D7E5","showVerticalGridline":true,"showHorizontalGridline":true},"allowCellOverflow":false,"referenceStyle":0,"_zoomFactor":1,"theme":{"_name":"Office","_themeColor":{"_name":"Office","_colorList":[{"a":255,"r":255,"g":255,"b":255},{"a":255,"r":238,"g":236,"b":225},{"a":255,"r":0,"g":0,"b":0},{"a":255,"r":31,"g":73,"b":125},{"a":255,"r":79,"g":129,"b":189},{"a":255,"r":192,"g":80,"b":77},{"a":255,"r":155,"g":187,"b":89},{"a":255,"r":128,"g":100,"b":162},{"a":255,"r":75,"g":172,"b":198},{"a":255,"r":247,"g":150,"b":70},{"a":255,"r":0,"g":0,"b":255},{"a":255,"r":128,"g":0,"b":128}]},"_headingFont":"Cambria","_bodyFont":"Calibri"},"showRowRangeGroup":true,"showColumnRangeGroup":true,"rowRangeGroup":{"itemsCount":200,"itemsData":[],"direction":1,"head":null,"tail":null},"colRangeGroup":{"itemsCount":70,"itemsData":[],"direction":1,"head":null,"tail":null},"conditionalFormats":{"rules":[]},"sheetTabColor":null,"frozenlineColor":"black","rowHeaderAutoText":1,"colHeaderAutoText":2,"rowHeaderAutoTextIndex":-1,"colHeaderAutoTextIndex":-1,"rowHeaderVisible":true,"colHeaderVisible":true,"rowHeaderColCount":1,"colHeaderRowCount":1,"rowHeaderData":{"rowCount":200,"colCount":1,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"colHeaderData":{"rowCount":1,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"rowHeaderSpan":{},"colHeaderSpan":{},"rowHeaderColInfos":{},"colHeaderRowInfos":{},"isProtected":false,"borderColor":"black","borderWidth":0,"allowDragDrop":true,"allowDragFill":true,"allowUndo":true,"allowEditorReservedLocations":true}},"names":[]}'
      		let datajson = JSON.parse(dataEmpty)
      		spread.fromJSON(datajson);

      		let index = setInterval(async() => {
      			if (that.$refs['ss'] && that.testData.data_id) {
      				clearInterval(index)
              let refexcel = that.$refs.ss
              console.log(that.testData)
      				let sData = '[Q]511{'+that.testData.data_id.toString()+'}|^SYS'

      				const resparamId = await QueryExec(sData)
              console.log(resparamId)
      				let sParam = '3$`'
      				let listtester = []
      				let listreviewer = []
      				let sTester = ''
      				let sReviewer = ''
      				resparamId.data.forEach((item, index) => {
      				  sParam = sParam + item.param_id + '$`'
      				  if(listtester.length === 0 && item.tester_id !== '')
      				  {
      				    listtester.push(item.tester_id)
      				    sTester=sTester+item.tester_id+';'
      				  }
      				  else {
      				    let countx = 0
      				    for(let i=0;i<listtester.length;i++)
      				    {
      				      if(listtester[i]!==item.tester_id)
      				      {
      				        countx++
      				      }
      				    }
      				    if(countx===listtester.length)
      				    {
      				      listtester.push(item.tester_id)
      				      sTester=sTester+item.tester_id+';'
      				    }
      				  }
      				  if(listreviewer.length === 0 && item.reviewer_id !== '')
      				  {
      				    listreviewer.push(item.reviewer_id)
      				    sReviewer=sReviewer+item.reviewer_id+';'
      				  }
      				  else {
      				    let county = 0
      				    for(let i=0;i<listreviewer.length;i++)
      				    {
      				      if(listreviewer[i]!==item.reviewer_id)
      				      {
      				        county++
      				      }
      				    }
      				    if(county===listreviewer.length)
      				    {
      				      listreviewer.push(item.reviewer_id)
      				      sReviewer=sReviewer+item.reviewer_id+';'
      				    }
      				  }
      				})
      				sParam = sParam.substr(0, sParam.length - 2);
      				sTester = sTester.substr(0, sTester.length - 1);
      				sReviewer = sReviewer.substr(0, sReviewer.length - 1);
      				console.log(that.testData)

      				let sData1 = '[Q]590{'+that.testData.data_id.toString()+'}|^SYS'
      				const resentrustId = await QueryExec(sData1)

      				const entrustdata = await Entrust(that.testData.object_id.toString(),resentrustId.data[0].entrust_id.toString())

      				const paramdata = await ParameterAll(sParam,"0",that.testData.data_id.toString())
      				const specialparamdata = await ParameterAll("1$`2","0",that.testData.data_id.toString())
      				const reportdata = await Report(that.testData.object_id.toString(),that.testData.data_id.toString())
              console.log(entrustdata,paramdata,reportdata)
      				let order = await initprintreportexcel(spread,entrustdata,paramdata,reportdata,that.testData.object_id.toString(),sParam,specialparamdata,that.testData,listtester,listreviewer)
              that.rc = await ResetSheetCellSize(spread,refexcel.offsetWidth-30,refexcel.offsetHeight-60,30,60)
              that.loading = false
      			}
      		}, 300)
      	},
		},
	}
</script>

<style scoped>
	#approval .el-custuom-footer {
    right:30px;
    top:0px;
		text-align: right;
    position:absolute;
		display: flex;
		justify-content: space-around;
		align-items: center
	}
</style>

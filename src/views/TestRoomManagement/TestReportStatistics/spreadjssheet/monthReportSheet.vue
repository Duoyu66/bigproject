<template>

	<div ref="div" class="entrust" style="margin-left: 10px;">

		<div ref="div1" style="position: absolute;height: 98%;width:99%;top:0px;bottom: 0px;left:0px">
			<div id="ss" ref="ss" style="margin:0px;padding:0px;position:absolute;width:98%;height: 100%;left: 0px;top:0px;bottom:0px;float: left;border:1px solid #f0f0f0;">
			</div>

		</div>




	</div>
</template>

<script>
	// import LuckyExcel from 'luckyexcel'
	import {
		ExecTestCacheData
	} from '@/api/dataCache'
	import {
		ViewfileUrl,
		UploadFileNameUrl
	} from '@/utils/servicefile'
	import {
		doEdit,
		ExecSql,
		QueryExec,
		QueryExecFile
	} from '@/api/table'
	import {
		Entrust,
    TestDataHandle
	} from '@/utils/dataCache'
	import {
		cellConvertToOffice,
		cellConvert
	} from '@/utils/cellconvert'
	import {
		judgeVariableType,
		variableInfo,
		judgeVariableIsEmptyOrNull
	} from '@/utils/base.helper'
	import {
		initexcel,
    setParamterValue,
    ResetSheetCellSize
	} from '@/utils/excelchange'
  import {
    testProcessOption,
    bookmap,
    GetBookMapIndexByName
  } from '@/utils/testProcess.Helper'
  import {
  	autocreateentrustno,
    autoCreateNo,
    autoUpdateRule,
    generateTestTask
  } from '@/utils/excelplugin'
	export default {
		name: 'entrust',
		model: {
			prop: 'isUpData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			isUpData: {
				type: Boolean,
				default: false
				//required: true,
			},
		},
		components: {

		},
		watch: {
			'Message.pageType': function(newVal, oldVal) {
				switch (newVal) {
					//委托
					case 10:
						this.tableOption.columnHideList = ['tester_id']
						this.elcollapse.valuation.name = '计价'
						this.info.isReadOnly = true
						break
						//受理委托
					case 20:
						this.elcollapse.valuation.name = '分配试验人'
						this.info.isReadOnly = true
						break
          case 40:
          	this.tableOption.columnHideList = ['tester_id']
          	this.elcollapse.valuation.name = '计价'
          	this.info.isReadOnly = true
          	break
				}
			}
		},
    mounted() {
      let that = this
    	let index = setInterval(function() {
    		clearInterval(index);
    		if (window.$("#ss") && window.$("#ss")[0] && window.$("#ss").wijspread) {
    			clearInterval(index);
          console.log(that.$refs.div1,that.$refs.div,that.$refs.ss)
    			window.$("#ss").wijspread({
    				sheetCount: 1
    			});
          var spread = window.$("#ss").wijspread("spread");
          let dataEmpty = '{"activeSheetIndex":0,"sheetCount":1,"tabStripRatio":0.5,"tabStripVisible":true,"tabEditable":true,"newTabVisible":true,"referenceStyle":0,"useWijmoTheme":true,"canUserEditFormula":true,"startSheetIndex":0,"allowUndo":true,"allowUserZoom":true,"allowUserResize":true,"allowDragDrop":true,"allowDragFill":true,"highlightInvalidData":false,"sheets":{"Sheet1":{"name":"Sheet1","rightClickMenu":[],"defaults":{"rowHeight":20,"colWidth":62,"rowHeaderColWidth":0,"colHeaderRowHeight":0},"columns":{"length":20},"rows":{"length":200},"autoGenerateColumns":true,"dataSource":null,"frozenRowCount":0,"frozenColCount":0,"rowCount":200,"columnCount":50,"data":{"name":"Sheet1","rowCount":200,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":3,"vAlign":0}}},"sparklineGroupManager":{"groups":[]},"spans":{},"selections":{"0":{"row":0,"rowCount":1,"col":0,"colCount":1},"selectionPolicy":2,"selectionUnit":0,"length":1,"activeSelectedRangeIndex":0},"activeRow":0,"activeCol":0,"gridline":{"color":"#D0D7E5","showVerticalGridline":true,"showHorizontalGridline":true},"allowCellOverflow":false,"referenceStyle":0,"_zoomFactor":1,"theme":{"_name":"Office","_themeColor":{"_name":"Office","_colorList":[{"a":255,"r":255,"g":255,"b":255},{"a":255,"r":238,"g":236,"b":225},{"a":255,"r":0,"g":0,"b":0},{"a":255,"r":31,"g":73,"b":125},{"a":255,"r":79,"g":129,"b":189},{"a":255,"r":192,"g":80,"b":77},{"a":255,"r":155,"g":187,"b":89},{"a":255,"r":128,"g":100,"b":162},{"a":255,"r":75,"g":172,"b":198},{"a":255,"r":247,"g":150,"b":70},{"a":255,"r":0,"g":0,"b":255},{"a":255,"r":128,"g":0,"b":128}]},"_headingFont":"Cambria","_bodyFont":"Calibri"},"showRowRangeGroup":true,"showColumnRangeGroup":true,"rowRangeGroup":{"itemsCount":200,"itemsData":[],"direction":1,"head":null,"tail":null},"colRangeGroup":{"itemsCount":70,"itemsData":[],"direction":1,"head":null,"tail":null},"conditionalFormats":{"rules":[]},"sheetTabColor":null,"frozenlineColor":"black","rowHeaderAutoText":1,"colHeaderAutoText":2,"rowHeaderAutoTextIndex":-1,"colHeaderAutoTextIndex":-1,"rowHeaderVisible":true,"colHeaderVisible":true,"rowHeaderColCount":1,"colHeaderRowCount":1,"rowHeaderData":{"rowCount":200,"colCount":1,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"colHeaderData":{"rowCount":1,"colCount":50,"dataTable":{},"_rowDataArray":[],"_columnDataArray":[],"_defaultDataNode":{"style":{"foreColor":"black","hAlign":1,"vAlign":1}}},"rowHeaderSpan":{},"colHeaderSpan":{},"rowHeaderColInfos":{},"colHeaderRowInfos":{},"isProtected":false,"borderColor":"black","borderWidth":0,"allowDragDrop":true,"allowDragFill":true,"allowUndo":true,"allowEditorReservedLocations":true}},"names":[]}'
          let datajson = JSON.parse(dataEmpty)
          spread.fromJSON(datajson);
    		}
    	})
      window.createReport = function(reportInfo) {
          return that.createReport(reportInfo)
      }
    },
		data() {
			return {
				iframe: {
					PostMessageNum: 0,
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
        loading: true,
				form: {

				},
				info: {
					isShow: true,
					isReadOnly: false,
				},
				selectData: {
					person: []
				},
				selectQuery: {
					person: {
						set: new Set()
					}
				},
        visible: false,
				labelPosition: 'left',
				listdataold: [],
        contract_no_options: [],
				listdatanew: [],
				listdatafinal: '',
				listmap: [],
				listmeta: [],
        listdata: [],
				strsub: '1',
				title: '',
        entrust_number: '',
				activeNames: ['valuation', 'sample_info'],
				tableOption: {
					columnHideList: [],
					listLoading: false,
					tablelist: [],
					elementLoadingText: '加载中...'
				},
				elcollapse: {
					valuation: {
						name: '计价'
					}
				},
				valuationForm: {
					total: 0,
          back_reason: ''
				},
        contractForm: {
        	contract_no: '',
          contract_id: ''
        },
        contractRules: {},
				valuationLabelWidth: '100px',
				valuationRules: {},
				sampleForm: {
					sample_name: '',
					sample_desc: '',
					sample_number: '',
          sample_id: ''
				},
        isHasLuckSheet: false,
				sampleRules: {},
				luckysheet: {
					style: 'margin:0px;padding:0px;position:absolute;width:70%;height: 100%;left: 0px;top:0px;bottom:0px;float: left;border:1px solid;',
					style70: 'margin:0px;padding:0px;position:absolute;width:70%;height: 100%;left: 0px;top:0px;bottom:0px;float: left;border:1px solid;',
					styleFullWidth: 'margin:0px;padding:0px;position:absolute;width:100%;height: 100%;left: 0px;top:0px;bottom:0px;float: left;border:1px solid;',
				},
        rc: []
			}
		},

		created() {
			this.getPostMessage()
			this.initLuckySheet()

		},

		methods: {
			handleChange(val) {


			},
      contractChange(val) {
        this.contractForm.contract_id=val.split('^')[1]
      },
			//判断是否隐藏列，ture为不隐藏，false为隐藏
      hidden() {
        if(this.Message.pageType === 10)
        {
          return false
        }
        else {
          return true
        }
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
							console.log('getPostMessage', _this.Message)
              _this.inittable()
							break
						case variableInfo.function.name:

							break
						case variableInfo.boolean.name:

							break
					}
				})
			},

      handlLeftStaus() {
				this.info.isShow = !this.info.isShow
				let style = ''
				if (this.info.isShow) {
					style = this.luckysheet.style70
				} else {
					style = this.luckysheet.styleFullWidth
				}
				this.luckysheet.style = style
				this.$nextTick(() => {
					try {
						window.luckysheet.resize()
					} catch (e) {
						console.log(e)
					}

				})

			},
      async initLuckySheet() {
				let that = this
				let index = setInterval(() => {
					if (that.Message.object_id !== -1) {
						clearInterval(index)
						this.inittable();
					}
				}, 300)

			},
      async createReport(reportInfo) {
        let that = this
        if(reportInfo.length>0)
        {
          var spread = window.$("#ss").wijspread("spread");
          let sheet = spread.getActiveSheet()
          spread.isPaintSuspended(true);
          for(let i=0;i<reportInfo.length;i++)
          {
            sheet.setValue(i,0,reportInfo[i].data_id)
          }
          spread.isPaintSuspended(false);
        }
      },
      async inittable() {
      	let that = this
        let refss = that.$refs.ss
        console.log(that.Message.reportInfo)

      },


      close(status) {

			},
			save() {
				let that = this


			},
		},
	}
</script>

<style>
	#info .el-collapse-item__content {
		padding-bottom: 0px
	}
</style>

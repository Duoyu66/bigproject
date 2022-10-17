<template>

	<div ref="div" class="entrust" style="margin-left: 10px;">
		<div>
			<div style="width:20%;float: left;margin-left: 10px;">
				<div align="left">
					<el-select v-model="org_id" placeholder="请选择受托机构">
					  <el-option
					    v-for="item in org_options"
					    :key="item.value"
					    :label="item.label"
					    :value="item.value">
					  </el-option>
					</el-select>
				</div>
			</div>
			<div >

				<el-tooltip content="保存" placement="bottom">
					<el-button type="primary" icon="fa fa-save" size="medium" @click="handlSave"
						v-if="pageType ==10 || pageType ==40 || pageType ==80">
						<!-- @click="handlHide"> -->
					</el-button>
				</el-tooltip>
        <el-tooltip content="保存" placement="bottom">
        	<el-button type="primary" icon="fa fa-save" size="medium" @click="handlSaveEntry"
        		v-if="pageType == 70">
        		<!-- @click="handlHide"> -->
        	</el-button>
        </el-tooltip>
				<el-tooltip content="关闭" placement="bottom">
					<el-button type="primary" icon="el-icon-close" size="medium" @click="handleClose">
						<!-- @click="handlHide"> -->
					</el-button>
				</el-tooltip>
				<el-tooltip content="委托" placement="bottom">
					<el-button type="primary" icon="fa fa-save" size="medium" @click="handlSubmit"
						v-if="pageType ==10 || pageType ==40 || pageType ==80">
						委托
						<!-- @click="handlHide"> -->
					</el-button>
				</el-tooltip>
				<el-tooltip content="受理委托" placement="bottom">
					<el-button type="primary" icon="el-icon-s-claim" size="medium" @click="handlAccept"
						v-if="pageType ==20">
						受理
						<!-- @click="handlHide"> -->
					</el-button>
				</el-tooltip>
        <el-tooltip content="拒绝委托" placement="bottom">
          <el-popover
            placement="top"
            width="320"
            v-if="pageType ==20"
            v-model="visible">
            <el-input v-model="valuationForm.back_reason" style="" placeholder="请输入拒绝委托的原因"></el-input>
            <div style="text-align: right; margin-top: 10px">
              <el-button size="mini" type="danger" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handlRefuse">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-s-claim" size="medium"
						>拒绝</el-button>
          </el-popover>

        </el-tooltip>
        <el-tooltip content="申请修改委托" placement="bottom">
        	<el-button type="primary" icon="el-icon-s-claim" size="medium" @click="handleApply"
        		v-if="pageType ==50">
        		申请
        		<!-- @click="handlHide"> -->
        	</el-button>
        </el-tooltip>
        <el-tooltip content="同意修改" placement="bottom">
        	<el-button type="success" icon="el-icon-s-claim" size="medium" @click="handleAprroveAgree"
        		v-if="pageType ==60">
        		同意修改
        		<!-- @click="handlHide"> -->
        	</el-button>
        </el-tooltip>
        <el-tooltip content="不同意修改" placement="bottom">
        	<el-button type="success" icon="el-icon-s-claim" size="medium" @click="handleApply"
        		v-if="pageType ==60">
        		不同意修改
        		<!-- @click="handlHide"> -->
        	</el-button>
        </el-tooltip>
        <el-tooltip content="显示旧值" placement="bottom">
        	<el-button type="info" icon="el-icon-s-platform" size="medium" @click="handleOldValue()"
        		v-if="pageType ==60">
        		显示旧值
        		<!-- @click="handlHide"> -->
        	</el-button>
        </el-tooltip>
        <el-tooltip content="显示新值" placement="bottom">
        	<el-button type="info" icon="el-icon-s-platform" size="medium" @click="handleNewValue()"
        		v-if="pageType ==60">
        		显示新值
        		<!-- @click="handlHide"> -->
        	</el-button>
        </el-tooltip>

			</div>
		</div>
		<div ref="div1" style="position: absolute;height: 85%;width:97%;top:52px;bottom: 0px;left:10px">
			<div id="ss" ref="ss" style="margin:0px;padding:0px;position:absolute;width:98%;height: 1000px;left: 0px;top:0px;bottom:0px;float: left;border:1px solid #f0f0f0;">
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
            this.pageType = 10
						break
						//受理委托
					case 20:
						this.elcollapse.valuation.name = '分配试验人'
						this.info.isReadOnly = true
            this.pageType = 20
						break
          case 40:
          	this.tableOption.columnHideList = ['tester_id']
          	this.elcollapse.valuation.name = '计价'
          	this.info.isReadOnly = true
            this.pageType = 40
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
      window.handleNewValue = function() {
          return that.handleNewValue()
      }
      window.handleOldValue = function() {
          return that.handleOldValue()
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
        org_options: [],
        org_id: '',
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
        pageType: -1,
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
							break
						case variableInfo.function.name:

							break
						case variableInfo.boolean.name:

							break
					}
				})
			},
			dateformat() {
				let d = new Date();
				let y = d.getFullYear()
				let Mo = d.getMonth()+1 //月份
				let da = d.getDate() //日
				let h = d.getHours() //小时
				let mi = d.getMinutes() //分
				let s = d.getSeconds() //秒
				let datetime = y + '-' + Mo + '-' + da + ' ' + h + ':' + mi + ':' + s
				return datetime
			},
      achieveentrustdata()
      {
        let that = this
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        let bookmapjson = {}
        for(let j=0;j<that.listmap.length;j++)
        {
          let index = GetBookMapIndexByName(that.listmap[j].share_name)
          if(index>=0 && that.listmap[j].sheet_id===(Number(that.listdata.order_sheet)-1).toString())
          {

            let rowcolum = cellConvert(that.listmap[j].cell)
            let val = sheet.getValue(rowcolum[0]+that.rc[0], rowcolum[1]+that.rc[1])
            console.log(that.listmap[j].share_name,val)
            if(that.listmap[j].share_name==="委托编号")
            {
              that.entrust_number = val
            }
            if(val && val!=='')
            {
              bookmapjson[index] = val
            }
          }
        }

        return bookmapjson
      },
      async handlRefuse() {
        let that = this
        var spread = window.$("#ss").wijspread("spread");
        let sData = '[Q]735{-1$`'+that.valuationForm.back_reason+'$`'+that.Message.entrustInfo.entrust_id+'}|^1|^SYS'
        console.log(sData)
        const resentrustadd = await ExecSql(sData)
        if(resentrustadd>0)
        {
          that.visible=false
          that.Message.pageType = 30
          that.$baseMessage('拒绝委托成功', 'success')
        }
        else {
          that.$baseMessage('拒绝委托失败', 'error')
        }
      },
      async handleApply() {
        let that = this
        let i=0
        if(!that.Message.entrustInfo.witness_id)
        {
          that.Message.entrustInfo.witness_id='-1'
        }
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        let sData = '[Q]1058{'+that.Message.entrustInfo.org_id+'$`'+that.Message.person_id+'$`'+that.Message.entrustInfo.entrust_id+'$`'+
          that.Message.entrustInfo.data_id+'$`$`$`'+that.Message.entrustInfo.witness_id+'}|^2|^SYS'
        const res = await ExecSql(sData)
        console.log(sData,res)
        if(res>0)
        {
          for (let j = 0; j < that.listmap.length; j++) {
            if(that.listmap[j].sheet_id===(Number(that.listdata.order_sheet)-1).toString())
            {
              let rowcolum = cellConvert(that.listmap[j].cell)
              let val = sheet.getValue(rowcolum[0]+that.rc[0], rowcolum[1]+that.rc[1])
              console.log(that.listmap[j].meta_name,that.listmap[j].sheet_id,val)
              let countx = 0
              for (i = 0; i < that.listdataold.length; i++) {
                if(that.listmap[j].meta_id===that.listdataold[i].meta_id)
                {
                  if(val!==that.listdataold[i].value)
                  {
                    let sDataDetail = '[Q]1059{'+res+'$`'+that.Message.entrustInfo.entrust_id+'$`'+that.listdataold[i].meta_id+'$`'
                    +that.listmap[j].meta_name+'$`'+that.listdataold[i].value+'$`'+val+'}|^2|^SYS'
                    const resDetail = await ExecSql(sDataDetail)
                    console.log(sDataDetail,resDetail)
                    if(resDetail>0)
                    {
                      break
                    }
                  }
                  else {
                    break
                  }
                }
              	countx++
              }
              if (countx === that.listdataold.length && val !== '' && val !== null && val !== '/') {
              	let sDataDetail1 = '[Q]1059{'+res+'$`'+that.Message.entrustInfo.entrust_id+'$`'+that.listmap[j].meta_id+'$`'
              	+that.listmap[j].meta_name+'$`$`'+val+'}|^2|^SYS'
              	const resDetail1 = await ExecSql(sDataDetail1)
              }
            }
          }
          let sDataEntrust = '[Q]1061{'+that.Message.entrustInfo.entrust_id+'}|^SYS'
          const resEntrust = await QueryExec(sDataEntrust)
          console.log(sDataEntrust,resEntrust)
          that.$baseMessage('申请修改成功', 'success')
        }
        else {
          that.$baseMessage('申请修改失败', 'error')
        }
      },
      handleAprroveAgree() {
        this.saveCellValue(that.Message.entrustInfo.entrust_id)
        this.saveCellValue1(that.Message.entrustInfo.data_id)
        that.$baseMessage('修改成功', 'success')
      },
      async saveCellValue(resentrustadd) {
        let that = this
        let count=0
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        that.listdatafinal = '2|^'+resentrustadd+'|^' + that.Message.object_id +'|^'
        for (let j = 0; j < that.listmap.length; j++) {
          if(that.listmap[j].sheet_id===(Number(that.listdata.order_sheet)-1).toString())
          {
            let rowcolum = cellConvert(that.listmap[j].cell)
            let val = sheet.getValue(rowcolum[0]+that.rc[0], rowcolum[1]+that.rc[1])
            console.log(that.listmap[j].meta_name,that.listmap[j].sheet_id,val)
            if(val !== null && val != '')
            {
              let countx = 0
              for (let i = 0; i < that.listdataold.length; i++) {
                if(that.listmap[j].meta_id===that.listdataold[i].meta_id)
                {
                  if(val!==that.listdataold[i].value)
                  {
                    if (that.listdataold[i].value === '' && val !== '' && val !== null) {
                    	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`I|^'
                    	break
                    } else if (that.listdataold[i].value !== '' && val === '' && val !== null) {
                    	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`D|^'
                    	break
                    } else if (that.listdataold[i].value !== '' && val !== '' && val !== null) {
                    	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`U|^'
                    	break
                    }
                  }
                  else {
                    break
                  }
                }
              	countx++
              }
              if (countx === that.listdataold.length && val !== '' && val !== null && val !== '/') {
              	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`I|^'
              }
            }
          }
        }

        that.listdatafinal = that.listdatafinal.substr(0, that.listdatafinal.length - 2);
        console.log(that.listdatafinal)
        const res = await ExecTestCacheData(that.listdatafinal)
        console.log(res)
        if(res>0)
        {
          return true
        }
        else {
          return false
        }
      },
      async saveCellValue1(resentrustadd) {
        let that = this
        let count=0
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        that.listdatafinal = '2|^'+resentrustadd+'|^' + that.Message.object_id +'|^'
        for (let j = 0; j < that.listmap.length; j++) {
          if(that.listmap[j].sheet_id===(Number(that.listdata.order_sheet)-1).toString())
          {
            let rowcolum = cellConvert(that.listmap[j].cell)
            let val = sheet.getValue(rowcolum[0]+that.rc[0], rowcolum[1]+that.rc[1])
            console.log(that.listmap[j].meta_name,that.listmap[j].sheet_id,val)
            if(val !== null && val != '')
            {
              let countx = 0
              for (let i = 0; i < that.listdataold.length; i++) {
                if(that.listmap[j].meta_id===that.listdataold[i].meta_id)
                {
                  if(val!==that.listdataold[i].value)
                  {
                    if (that.listdataold[i].value === '' && val !== '' && val !== null) {
                    	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`I|^'
                    	break
                    } else if (that.listdataold[i].value !== '' && val === '' && val !== null) {
                    	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`D|^'
                    	break
                    } else if (that.listdataold[i].value !== '' && val !== '' && val !== null) {
                    	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`U|^'
                    	break
                    }
                  }
                  else {
                    break
                  }
                }
              	countx++
              }
              if (countx === that.listdataold.length && val !== '' && val !== null && val !== '/') {
              	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`I|^'
              }
            }
          }
        }

        that.listdatafinal = that.listdatafinal.substr(0, that.listdatafinal.length - 2);
        console.log(that.listdatafinal)
        const res = await ExecTestCacheData(that.listdatafinal)
        console.log(res)
        if(res>0)
        {
          return true
        }
        else {
          return false
        }
      },

      async handlSaveEntry() {
        let that = this
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        console.log(that)
        let bookmapjson = that.achieveentrustdata()
        let sData = ''
        if(that.Message.entrustInfo.entrust_id)
        {
          sData = '[Q]731{';
          for(let k=0;k<bookmap.meta_desc.length;k++)
          {
            if(bookmap.meta_desc[k].booktype === '1')
            {
              if(bookmapjson[k])
                sData = sData + bookmapjson[k] + '$`'
              else
                sData = sData + '$`'
            }
          }
          sData = sData + '-2' + '$`' + that.Message.entrustInfo.entrust_id
          sData = sData + '}|^1|^SYS'
        }
        else {
          sData = '[Q]707{';
          for(let k=0;k<bookmap.meta_desc.length;k++)
          {
            if(bookmap.meta_desc[k].booktype === '1')
            {
              if(bookmapjson[k])
                sData = sData + bookmapjson[k] + '$`'
              else
                sData = sData + '$`'
            }
          }
          sData = sData + that.Message.current_org_id + '$`' + that.Message.object_id + '$`' + '-2'
          sData = sData + '}|^2|^SYS'
        }
      },
      async handlSave() {
        let that = this
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        console.log(that)
        let bookmapjson = that.achieveentrustdata()
        let sData = ''
        if(that.Message.entrustInfo.entrust_id)
        {
          sData = '[Q]731{';
          for(let k=0;k<bookmap.meta_desc.length;k++)
          {
            if(bookmap.meta_desc[k].booktype === '1')
            {
              if(bookmapjson[k])
                sData = sData + bookmapjson[k] + '$`'
              else
                sData = sData + '$`'
            }
          }
          sData = sData + '-2' + '$`' + that.Message.entrustInfo.entrust_id
          sData = sData + '}|^1|^SYS'
        }
        else {
          sData = '[Q]707{';
          for(let k=0;k<bookmap.meta_desc.length;k++)
          {
            if(bookmap.meta_desc[k].booktype === '1')
            {
              if(bookmapjson[k])
                sData = sData + bookmapjson[k] + '$`'
              else
                sData = sData + '$`'
            }
          }
          sData = sData + that.Message.current_org_id + '$`' + that.Message.object_id + '$`' + '-2'
          sData = sData + '}|^2|^SYS'
        }
        console.log(sData)
        let resentrustadd = await ExecSql(sData)
        if(that.Message.entrustInfo.entrust_id) {
          resentrustadd=that.Message.entrustInfo.entrust_id
        }
        if(resentrustadd > 0)
        {
          let res = await that.saveCellValue(resentrustadd)
          if(res)
          {
            that.Message.pageType = 30
            that.$baseMessage('保存成功', 'success')
          }
          else {
            that.$baseMessage('保存失败', 'error')
          }
        }
        else {
          that.$baseMessage('保存失败', 'error')
        }
      },
      handleNewValue() {
        let that = this
        // that.Message.entrustTablelist = []
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        spread.isPaintSuspended(true)
        for(let i=0;i<that.Message.entrustTablelist.length;i++)
        {
          for(let j=0;j<that.listmap.length;j++)
          {
            if(that.Message.entrustTablelist[i].meta_id===that.listmap[j].meta_id)
            {
              let rowcolum = cellConvert(that.listmap[j].cell)
              sheet.getCell(rowcolum[0]+that.rc[0], rowcolum[1]+that.rc[1]).backColor('#ffff6f');
              sheet.setValue(rowcolum[0]+that.rc[0], rowcolum[1]+that.rc[1], that.Message.entrustTablelist[i].new_value)

            }
          }
        }

        spread.isPaintSuspended(false)
      },
      handleOldValue() {
        let that = this
        // that.Message.entrustTablelist = []
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        spread.isPaintSuspended(true)
        for(let i=0;i<that.Message.entrustTablelist.length;i++)
        {
          for(let j=0;j<that.listmap.length;j++)
          {
            if(that.Message.entrustTablelist[i].meta_id===that.listmap[j].meta_id)
            {
              let rowcolum = cellConvert(that.listmap[j].cell)
              sheet.getCell(rowcolum[0]+that.rc[0], rowcolum[1]+that.rc[1]).backColor('#ffff6f');
              sheet.setValue(rowcolum[0]+that.rc[0], rowcolum[1]+that.rc[1], that.Message.entrustTablelist[i].old_value)
            }
          }
        }

        spread.isPaintSuspended(false)
      },
			async handlSubmit() {
				let that = this
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        console.log(that)
        let bookmapjson = that.achieveentrustdata()
        let sData
        if(that.Message.entrustInfo.entrust_id)
        {
          sData = '[Q]731{';
          for(let k=0;k<bookmap.meta_desc.length;k++)
          {
            if(bookmap.meta_desc[k].booktype === '1')
            {
              if(bookmapjson[k])
                sData = sData + bookmapjson[k] + '$`'
              else
                sData = sData + '$`'
            }
          }
          sData = sData + '0' + '$`' + that.Message.entrustInfo.entrust_id
          sData = sData + '}|^1|^SYS'
        }
        else {
          sData = '[Q]707{';
          for(let k=0;k<bookmap.meta_desc.length;k++)
          {
            if(bookmap.meta_desc[k].booktype === '1')
            {
              if(bookmapjson[k])
                sData = sData + bookmapjson[k] + '$`'
              else
                sData = sData + '$`'
            }
          }
          sData = sData + that.Message.current_org_id + '$`' + that.Message.object_id + '$`' + '0'+'$`' + '0'
          sData = sData + '}|^2|^SYS'
        }
        console.log(sData)
        let resentrustadd = await ExecSql(sData)
        if(that.Message.entrustInfo.entrust_id) {
          resentrustadd=that.Message.entrustInfo.entrust_id
        }
        if(resentrustadd > 0)
        {
          let res = await that.saveCellValue(resentrustadd)
          if(res)
          {
            that.Message.pageType = 30
            that.$baseMessage('委托成功', 'success')
          }
          else {
            that.$baseMessage('委托失败', 'error')
          }
        }
        else {
          that.$baseMessage('委托失败', 'error')
        }
      },
			async handlAccept() {
        let that = this
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        let bookmapjson = that.achieveentrustdata()
        let sData = '[Q]780{';
        for(let k=0;k<bookmap.meta_desc.length;k++)
        {
          if(bookmap.meta_desc[k].booktype === '1' || bookmap.meta_desc[k].booktype === '2')
          {
            if(bookmapjson[k])
              sData = sData + bookmapjson[k] + '$`'
            else
              sData = sData + '$`'
          }
        }
        sData = sData + that.Message.current_org_id + '$`' + that.Message.object_id + '$`' + '0' + '$`' + that.Message.entrustInfo.order_date
        sData = sData +'$`'+that.Message.entrustInfo.entrust_id+'}|^SYS'
        const restestadd = await QueryExec(sData)
        console.log(restestadd)
        if(restestadd.data.length>0)
        {
          let count=0
          that.listdataold=[]
          that.listdatafinal = '1|^'+restestadd.data[0].Column1+'|^' + that.Message.object_id +'|^'
          console.log(that.listdataold)
          for (let j = 0; j < that.listmap.length; j++) {
            if(that.listmap[j].sheet_id===(Number(that.listdata.order_sheet)-1).toString())
            {
              let rowcolum = cellConvert(that.listmap[j].cell)
              	let val = sheet.getValue(rowcolum[0]+that.rc[0], rowcolum[1]+that.rc[1])
                console.log(that.listmap[j].meta_name,that.listmap[j].sheet_id,val)
              	if(val !== null && val != '')
              	{
              	  let countx = 0
              	  for (let i = 0; i < that.listdataold.length; i++) {
              	    if(that.listmap[j].meta_id===that.listdataold[i].meta_id)
              	    {
              	      if(val!==that.listdataold[i].value)
              	      {
              	        if (that.listdataold[i].value === '' && val !== '' && val !== null) {
              	        	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`I|^'
              	        	break
              	        } else if (that.listdataold[i].value !== '' && val === '' && val !== null) {
              	        	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`D|^'
              	        	break
              	        } else if (that.listdataold[i].value !== '' && val !== '' && val !== null) {
              	        	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`U|^'
              	        	break
              	        }
              	      }
              	      else {
              	        break
              	      }
              	    }
              	  	countx++
              	  }
              	  if (countx === that.listdataold.length && val !== '' && val !== null && val !== '/') {
              	  	that.listdatafinal = that.listdatafinal + that.listmap[j].meta_id + '$`' + val + '$`I|^'
              	  }
              	}
            }
          }
          that.listdatafinal = that.listdatafinal.substr(0, that.listdatafinal.length - 2);
          console.log(that.listdatafinal)
          // const res = await generateTestTask(that.listdata,that.Message.object_id,that.Message.current_org_id,restestadd.data[0].Column1)
          const res = await ExecTestCacheData(that.listdatafinal)
          console.log(res)
          if(res>0)
          {
            that.Message.pageType = 30
            const re = await generateTestTask(that.listdata,that.Message.object_id,that.current_org_id,restestadd.data[0].Column1)
            that.$baseMessage('受理成功', 'success')
          }
          else {
            that.$baseMessage('受理失败', 'error')
          }
        }
        else {
          that.$baseMessage('有人已经受理此委托', 'error')
        }
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
      handleClose() {

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
      async inittable() {
      	let that = this

        let refss = that.$refs.ss
        console.log(that.Message.org_cache)
        let entrust_id
        if(that.Message.entrustInfo.entrust_id)
        {
          entrust_id = that.Message.entrustInfo.entrust_id
        }
        else{
          entrust_id=0
        }

      	const data = await TestDataHandle(that.Message.object_id.toString(),entrust_id.toString(),'20')
        console.log(data)
      	let listnew = []

        that.listdata = data
      	that.listdataold = data.datadetail

      	that.listmap = data.mapdata


        var spread = window.$("#ss").wijspread("spread");
        spread.isPaintSuspended(true)

        if(that.Message.pageType === 10) {
          await initexcel(spread, data, 0, '0', that.Message.object_id, that.Message.current_org_id,0)
        }
        else if(that.Message.pageType === 70) {
          await initexcel(spread, data, 0, '0', that.Message.object_id, that.Message.current_org_id,2)
        }
        else {
          await initexcel(spread, data, 0, '0', that.Message.object_id, that.Message.current_org_id,1)
        }
        let rc = await ResetSheetCellSize(spread,refss.offsetWidth-60,refss.offsetHeight-60,60,60)
        this.pageType=this.Message.pageType
        console.log(rc)
        that.rc=rc[0]
        // spread.tabStripVisible(false);
        // spread.tabEditable(false);
        // spread.newTabVisible(false);

        let sheet = spread.getActiveSheet()

        if(that.Message.pageType === 10)
        {
          // let entrustno = await autoCreateNo(that.Message.current_org_id,that.Message.object_id,'委托编号')
          for(let i=0;i<data.mapdata.length;i++)
          {

          }
        }
        else if(that.Message.pageType === 70) {
          if(data.entry_sheet) {
            let listEntrySheetNum = data.entry_sheet.split(',')
            console.log(listEntrySheetNum)
            for(let i=0;i<spread.getSheetCount();i++) {
              if(listEntrySheetNum) {
                let count=0;
                for(let j=0;j<listEntrySheetNum.length;j++)
                {
                  console.log(listEntrySheetNum[j],(i+1).toString())
                  if(listEntrySheetNum[j]===(i+1).toString())
                  {
                    console.log(listEntrySheetNum[j],(i+1).toString())
                    spread.setActiveSheetIndex(i);
                    count=1;
                    break;
                  }
                }
                if(count===1) {
                  break;
                }
              }
            }
          }
        }
        spread.isPaintSuspended(false)
        if(that.Message.pageType === 50 && that.Message.entrustTablelist)
        {
          that.handleNewValue()
        }




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

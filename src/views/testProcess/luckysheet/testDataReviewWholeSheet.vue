<template>
	<div id="approval" style="height: 100%;">
		<div style="height: 100%;">

			<div style="width: 98%;height: 100%;float: left;">
				<div>
          <el-tooltip content="关闭" placement="bottom">
          	<el-button type="primary" icon="el-icon-close" size="medium" @click="">
          		<!-- @click="handlHide"> -->
              关闭
          	</el-button>
          </el-tooltip>
          <el-tooltip content="保存" placement="bottom">
          	<el-button type="primary" icon="fa fa-save" size="medium" @click="handlSave"
            v-if="testData.windowstate === 1">
          		<!-- @click="handlHide"> -->
              保存
          	</el-button>
          </el-tooltip>
          <el-tooltip content="生成试验采集任务" placement="bottom">
          	<el-button type="primary" icon="fa fa-save" size="medium" @click="handlSave"
            v-if="testData.windowstate === 1">
          		<!-- @click="handlHide"> -->
              生成任务
          	</el-button>
          </el-tooltip>
          <el-tooltip content="复核" placement="bottom">
          	<el-button type="primary" icon="fa fa-save" size="medium" @click="handlSave"
          		v-if="testData.windowstate === 2">
          		复核
          		<!-- @click="handlHide"> -->
          	</el-button>
          </el-tooltip>
          <el-tooltip content="批准" placement="bottom">
          	<el-button type="primary" icon="el-icon-s-claim" size="medium" @click="handlSave"
          		v-if="testData.windowstate == 3">
          		批准
          		<!-- @click="handlHide"> -->
          	</el-button>
          </el-tooltip>
          <el-tooltip content="申请" placement="bottom">
          	<el-button type="primary" icon="el-icon-s-claim" size="medium" @click="handlApply"
          		v-if="testData.windowstate == 4">
          		申请
          		<!-- @click="handlHide"> -->
          	</el-button>
          </el-tooltip>
          <el-tooltip content="导出" placement="bottom">
          	<el-button type="primary" icon="el-icon-s-claim" size="medium" @click="handlApply">
          		导出
          		<!-- @click="handlHide"> -->
          	</el-button>
          </el-tooltip>
          <el-tooltip content="打印" placement="bottom">
          	<el-button type="primary" icon="el-icon-s-claim" size="medium" @click="handlApply">
          		打印
          		<!-- @click="handlHide"> -->
          	</el-button>
          </el-tooltip>
					<div style="position: absolute;height: 90%;width:98%;top:52px;bottom: 0px;left:15px">
						<div id="ss" ref="ss" :style="lucksheet.style">
						</div>
					</div>
				</div>
			</div>
			<!-- <div style="width: 25%;height: 100%;float: right;margin-top: -10px;margin-left: 10px;"> -->
<!-- 				<el-table ref="approvalTable" v-loading="tableOption.approvalTable.listLoading"
					:data="tableOption.approvalTable.tablelist" border @selection-change="handleSelectionChange"
					:element-loading-text="tableOption.approvalTable.elementLoadingText" highlight-current-row
					:height="GetapprovalTableHeight" :header-cell-style="{ background: '#e8f0ff' }" size="mini">
					<el-table-column show-overflow-tooltip prop="param_name" label="项目">

					</el-table-column>
          <el-table-column show-overflow-tooltip prop="tester" label="试验员">

          </el-table-column>
          <el-table-column show-overflow-tooltip
                type="selection"
                width="55">
              </el-table-column>
				</el-table> -->

<!-- 				<div>
					<div>
						<el-form ref="approvalForm" :model="approvalForm.form" :label-position="form.labelPosition"
							size="mini" :rules="approvalForm.rules" :label-width="form.LabelWidth">
							<el-form-item label="复核意见(不合格参数请于上面表格中选中)" :label-width="form.LabelWidth">
								<el-input type="textarea" placeholder="请输入复核意见"
									v-model="approvalForm.form.approval_opinion" :autosize="{ minRows:6,maxRows: 10}"
									style="width: 100%;">
								</el-input>
							</el-form-item>
						</el-form>
					</div>
					<div>
						<div class="el-custuom-footer">
							<el-tooltip content="通过" placement="bottom" class="button_col">
								<el-button type="primary" size="medium" @click="handlSave">
									通过
								</el-button>
							</el-tooltip>

							<el-tooltip content="不通过" placement="bottom" class="button_col">
								<el-button type="danger" size="medium" @click="testprint">
									不通过
								</el-button>
							</el-tooltip>
						</div>
					</div>
				</div> -->
			<!-- </div> -->
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
  	ExecTestCacheData
  } from '@/api/dataCache'
  import {
    initreportexcel,
    initreviewexcel,
    setParamterValue,
    JudgeTestAndGetConclusion,
    ResetSheetCellSize
  } from '@/utils/excelchange'
  import {
    TestDataHandleForTest
  } from '@/utils/dataCache'
  import {
  	ExecSql,
  	QueryExec,
    QueryExecFile
  } from '@/api/table'
  import {
  	cellConvertToOffice,
  	cellConvert
  } from '@/utils/cellconvert'
  import { mapGetters	} from 'vuex'

	export default {
		name: 'testDataApprovalLuckSheet',
		model: {
			prop: 'isUpData',
			event: 'on-change'
		},
		props: {

		},
		computed: {
      ...mapGetters({
      	org_pid: 'user/org_pid',
      	org_id: 'user/org_id',
      	current_org_id: 'org/current_org',
      	current_and_chrilren_org: 'org/current_and_chrilren_org',
      	person_id: 'user/person_id',
      }),
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
        person_id: '',
				luckysheet: {
					style: ''
				},
				form: {
					LabelWidth: '120px',
					labelPosition: 'top'
				},
        listdata:[],
				approvalForm: {
					form: {
						approval_opinion: '',
					},
					rules: {

					}
				},
				tableOption: {
					approvalTable: {
						listLoading: false,
						tablelist: [],
						elementLoadingText: '获取数据中...'
					}
				},
        multipleSelection: [],
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
      async handleRefuse() {
        for(let i=0;i<that.multipleSelection.length;i++)
        {
          // let sDataParam = '[Q]641{'+this.class.tabs.tabList[i].row.entrust_id+'$`'+this.class.tabs.tabList[i].row.param_id+
          // '$`'+'2'+'$`'+this.person_id+'$`'+this.reviewForm.form[this.class.tabs.tabList[i].row.id].review_opinion+'}|^1|^SYS'
        }
      },
			async handlSave() {
        let that = this
        if(this.testData.windowstate===1)
        {
          let sData = '[Q]548{'+this.testData.data_id+'$`'+'2'+'$`'+this.person_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            if(that.saveCellValue())
            {
              that.$baseMessage('试验数据保存成功', 'success')
            }
            else {
              that.$baseMessage('试验数据保存失败', 'error')
            }
          }
          else {
            that.$baseMessage('试验保存失败', 'error')
          }
        }
        else if(this.testData.windowstate===2) {
          let sData = '[Q]548{'+this.testData.data_id+'$`'+'3'+'$`'+this.person_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            that.$baseMessage('复核成功', 'success')
          }
          else {
            that.$baseMessage('复核失败', 'error')
          }
        }
			},
      strmatch(str,strmatch)
      {
        if(str.match(strmatch))
        {
          return true
        }
        else {
          return false
        }
      },
      async handlApply() {
        var spread = window.$("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        let sData = '[Q]1058{'+that.testData.org_id+'$`'+that.testDataperson_id+'$`'
        +that.testData.data_id.toString()+'$`$`$`}|^2|^SYS'
        const res = await ExecSql(sData)
        console.log(sData,res)
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
              for (let i = 0; i < that.listdataold.length; i++) {
                if(that.listmap[j].meta_id===that.listdataold[i].meta_id)
                {
                  if(val!==that.listdataold[i].value)
                  {
                    let sDataDetail = '[Q]1059{'+res+'$`'+that.Message.entrustInfo.entrust_id+'$`'+that.listdataold[i].meta_id+'$`'
                    +that.listdataold[i].value+'$`'+val+'}|^2|^SYS'
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
              	let sDataDetail1 = '[Q]1059{'+res+'$`'+that.Message.entrustInfo.entrust_id+'$`'+that.listdataold[i].meta_id+'$`'
              	+that.listdataold[i].value+'$`'+val+'}|^2|^SYS'
              	const resDetail1 = await ExecSql(sDataDetail1)
              }
            }
          }
          for(let j=0;j<that.listmap.length;j++)
          {
            let recordsheet=that.listdata.record_sheet+','
            if(that.strmatch(recordsheet,(Number(that.listmap[j].sheet_id)+1).toString()))
            {
              let countx=0
              let rowcolum = cellConvert(that.listmap[j].cell)
              var sheet = spread.getSheet(Number(that.listmap[j].sheet_id))
              let rc=that.rc[that.listmap[j].sheet_id]
              let val = sheet.getValue(rowcolum[0]+rc[0], rowcolum[1]+rc[1])
              console.log(j,Number(that.listmap[j].sheet_id),rowcolum[0]+rc[0], rowcolum[1]+rc[1],val)
              for(let i=0;i<that.listdataold.length;i++)
              {
                if(that.listdataold[i].meta_id === that.listmap[j].meta_id)
                {
                  console.log(val)
                  if(val==='' && that.listdataold[i].value === '') {}
                  else if(val===null && that.listdataold[i].value === null) {}
                  else if(val===null && that.listdataold[i].value === '') {}
                  else if(val==='' && that.listdataold[i].value === null) {}
                  else if(that.listdataold[i].value === '' && val !=='' && val !== null && val !=='/' )
                  {
                    let sDataDetail = '[Q]1059{'+res+'$`'+that.Message.entrustInfo.entrust_id+'$`'+that.listdataold[i].meta_id+'$`'
                    +that.listdataold[i].value+'$`'+val+'}|^2|^SYS'
                    const resDetail = await ExecSql(sDataDetail)
                    console.log(sDataDetail,resDetail)
                    if(resDetail>0)
                    {
                      break
                    }
                  }
                  else if(that.listdataold[i].value !== '' && (val ==='' || val === null || val ==='/') )
                  {
                    that.listdatafinal=that.listdatafinal + that.listmap[j].meta_id +'$`'+ val +'$`D|^'
                    countx++
                    break
                  }
                  else if(that.listdataold[i].value !== '' && val !=='' && val !=='/' && val !== null && that.listdataold[i].value !== val)
                  {
                    let sDataDetail = '[Q]1059{'+res+'$`'+that.Message.entrustInfo.entrust_id+'$`'+that.listdataold[i].meta_id+'$`'
                    +that.listdataold[i].value+'$`'+val+'}|^2|^SYS'
                    const resDetail = await ExecSql(sDataDetail)
                    console.log(sDataDetail,resDetail)
                    if(resDetail>0)
                    {
                      break
                    }
                    countx++
                    break
                  }
                  countx++
                }
              }
              if(countx === 0 && val !== '' && val !== null && val !== '/')
              {
                that.listdatafinal=that.listdatafinal + that.listmap[j].meta_id +'$`'+ val +'$`I|^'
                that.listdataold.push({
                  "entrust_id":that.testData.data_id.toString(),
                  "meta_id":that.listmap[j].meta_id.toString(),
                  "value":val
                })
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
      async saveCellValue() {
        let that = this
        var spread = window.$("#ss").wijspread("spread");
        console.log(that.listdataold,that.listmap)
        that.listdatafinal = ''
        let listdatanew = []
        for(let j=0;j<that.listmap.length;j++)
        {
          let recordsheet=that.listdata.record_sheet+','
          let reportsheet=that.listdata.report_sheet+','
          if(that.strmatch(recordsheet,(Number(that.listmap[j].sheet_id)+1).toString()) || that.strmatch(reportsheet,(Number(that.listmap[j].sheet_id)+1).toString()))
          {
            let countx=0
            let rowcolum = cellConvert(that.listmap[j].cell)
            var sheet = spread.getSheet(Number(that.listmap[j].sheet_id))
            let rc=that.rc[that.listmap[j].sheet_id]
            console.log(j,Number(that.listmap[j].sheet_id),that.listmap[j].meta_name,rowcolum[0]+rc[0], rowcolum[1]+rc[1])
            let val = sheet.getValue(rowcolum[0]+rc[0], rowcolum[1]+rc[1])
            if(val!==null) {
              val=val.toString()
            }
            else {
              val='';
            }

            for(let i=0;i<that.listdataold.length;i++)
            {
              if(that.listdataold[i].meta_id === that.listmap[j].meta_id)
              {
                console.log(val)
                if(val==='' && that.listdataold[i].value === '') {}
                else if(val===null && that.listdataold[i].value === null) {}
                else if(val===null && that.listdataold[i].value === '') {}
                else if(val==='' && that.listdataold[i].value === null) {}
                else if(that.listdataold[i].value === '' && val !=='' && val !== null && val !=='/' )
                {
                  listdatanew.push({
                    "entrust_id":that.testData.data_id.toString(),
                    "meta_id":that.listmap[j].meta_id.toString(),
                    "value":val
                  })
                  that.listdatafinal=that.listdatafinal + that.listmap[j].meta_id +'$`'+ val +'$`I|^'
                  countx++
                  break
                }
                else if(that.listdataold[i].value !== '' && (val ==='' || val === null || val ==='/') )
                {
                  that.listdatafinal=that.listdatafinal + that.listmap[j].meta_id +'$`'+ val +'$`D|^'
                  countx++
                  break
                }
                else if(that.listdataold[i].value !== '' && val !=='' && val !=='/' && val !== null && that.listdataold[i].value !== val)
                {
                  listdatanew.push({
                    "entrust_id":that.testData.data_id.toString(),
                    "meta_id":that.listmap[j].meta_id.toString(),
                    "value":val
                  })
                  that.listdatafinal=that.listdatafinal + that.listmap[j].meta_id +'$`'+ val +'$`U|^'
                  countx++
                  break
                }
                countx++
              }
            }
            if(countx === 0 && val !== '' && val !== null && val !== '/')
            {
              that.listdatafinal=that.listdatafinal + that.listmap[j].meta_id +'$`'+ val +'$`I|^'
              that.listdataold.push({
                "entrust_id":that.testData.data_id.toString(),
                "meta_id":that.listmap[j].meta_id.toString(),
                "value":val
              })
            }
          }
        }
        that.listdatafinal = that.listdatafinal.substr(0, that.listdatafinal.length - 2);
        that.listdatafinal = '1|^'+that.testData.data_id+'|^' + that.testData.object_id +'|^' +that.listdatafinal
        const res = await ExecTestCacheData(that.listdatafinal)
        console.log(res,that.listdatafinal)
        if(res>0)
        {
          return true
        }
        else {
          return false
        }
        // if(!that.submitsimple)
        // {

        // }
        // else {

        // }

      },
			SetTestData(testData,person_id) {
				this.testData = testData
        this.person_id = person_id
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
									_this.SetTestData(data.postData,data.person_id)
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
      testprint() {
        var spread = window.$("#ss").wijspread("spread");
      	let print = new printExcel(spread)
      	let printresult = print.preview(3,'中铁工程设计咨询集团有限公司','ZTZJ/BG-001')
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val)
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
              const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(240, 240, 240, 0.7)'
              });
      				clearInterval(index)
              let refexcel = that.$refs.ss
              console.log(that.testData)
      				// let sData = '[Q]511{'+that.testData.data_id.toString()+'}|^SYS'

      				// const resparamId = await QueryExec(sData)
          //     that.tableOption.approvalTable.tablelist=resparamId.data
              // console.log(resparamId)
      				let sParam = '3$`'
      				let listtester = []
      				let listreviewer = []
      				let sTester = ''
      				let sReviewer = ''

      				sParam = sParam.substr(0, sParam.length - 2);


      				let sData1 = '[Q]590{'+that.testData.data_id.toString()+'}|^SYS'
      				const resentrustId = await QueryExec(sData1)

      				const entrustdata = await TestDataHandleForTest(that.testData.object_id.toString(), that.testData.data_id.toString(),'20')
              console.log(entrustdata)
              that.listdataold = entrustdata.datadetail
              that.listDataDetail = entrustdata.datadetail
              that.listmap=entrustdata.mapdata
              that.listdata=entrustdata

      				// const paramdata = await ParameterAll(sParam,"0",that.testData.data_id.toString())
      				// const specialparamdata = await ParameterAll("1$`2","0",that.testData.data_id.toString())
      				// const reportdata = await Report(that.testData.object_id.toString(),that.testData.data_id.toString())
              // console.log(paramdata)
              that.listdata=entrustdata
      				let order = await initreviewexcel(spread,entrustdata,that.testData.data_id.toString(),that.testData.object_id.toString(),that.testData)
              if(that.testData.windowstate===3)
              {
                await JudgeTestAndGetConclusion(spread,entrustdata,that.testData.data_id.toString())
              }
      				//
              let rc = await ResetSheetCellSize(spread,refexcel.offsetWidth-30,refexcel.offsetHeight-60,30,60)
              console.log(rc)
              that.rc=rc
              // that.initSheetBind(spread,3)
              setTimeout(() => {
                loading.close();
              }, 10);
      			}
      		}, 300)
      	},

		},
	}
</script>

<style scoped>
	#approval .el-custuom-footer {
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: space-around;
		align-items: center
	}
</style>

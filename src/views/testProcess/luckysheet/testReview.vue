<template>
	<div id="test" style="padding: 10px;width:1180px">
		<el-row :gutter="15">
			<el-col :span="4">
				<el-table ref="testData" v-loading="tableOption.listLoading" :data="tableOption.tablelist" border
					:element-loading-text="tableOption.elementLoadingText" highlight-current-row height="59vh"
					:header-cell-style="{ background: '#e8f0ff' }" size="mini" @row-click="rowClick">
					<el-table-column show-overflow-tooltip prop="testTask" label="试验项目">
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :span="20">
				<div>
					<el-form ref="form" :model="sampleForm" :label-position="labelPosition" size="mini"
						:rules="testDataRules" :label-width="valuationLabelWidth" :inline="true">
						<el-form-item label="试验日期" :label-width="valuationLabelWidth">
							<el-input v-model="sampleForm.test_date" style="width: 100%;" readonly></el-input>
						</el-form-item>
						<el-form-item label="样品编号" :label-width="valuationLabelWidth">
							<el-input v-model.number="sampleForm.sample_name" style="width: 100%;" readonly></el-input>
						</el-form-item>
						<el-form-item label="样品规格" :label-width="valuationLabelWidth">
							<el-input v-model="sampleForm.sample_spec" style="width: 100%;" readonly></el-input>
						</el-form-item>
						<el-form-item label="任务号" :label-width="valuationLabelWidth">
							<el-input v-model="sampleForm.test_no" style="width: 100%;" readonly></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div>
					<el-tabs v-model="editableTabsValue" closable @tab-remove="removeTab">
						<el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title"
							:name="item.name">
							<iframe :id="item.domid" :ref="item.domid" width="100%" :height="iframe.height"
								src="/mainLuckysheetTestData.html"
								:style="'height:'+iframe.height+'px !important'"></iframe>
              <div ref="reviewDiv" style="margin-top: 10px;">
              	<el-form ref="review" :model="reviewForm.form[item.id]" :label-position="labelPosition" size="mini"
              		:rules="reviewForm.rules" :label-width="valuationLabelWidth" :inline="false">
              		<el-form-item label="复核意见" :label-width="valuationLabelWidth">
              			<el-input type="textarea" placeholder="请输入复核意见" v-model="reviewForm.form[item.id].review_opinion" @input="change($event)"
              				:rows="2" style="width: 100%;">
              			</el-input>
              		</el-form-item>
              	</el-form>
              </div>
						</el-tab-pane>
					</el-tabs>
				</div>

			</el-col>
			<el-col :span="24">
        <div class="test-footer">
          <el-tooltip content="通过" placement="bottom">
          	<el-button type="primary" size="medium" @click="handlSave">
          		通过
          		<!-- @click="handlHide"> -->
          	</el-button>
          </el-tooltip>
          <el-tooltip content="不通过" placement="bottom">
          	<el-button type="primary"  size="medium" @click="handleRefuse">
          		不通过
          		<!-- @click="handlHide"> -->
          	</el-button>
          </el-tooltip>
          <el-tooltip content="关闭" placement="bottom">
          	<el-button type="danger" size="medium" @click="">
          		关闭
          		<!-- @click="handlHide"> -->
          	</el-button>
          </el-tooltip>
        </div>

			</el-col>
		</el-row>
	</div>
</template>

<script>
  import { QueryExec,ExecSql } from '@/api/table'
  import {
  	mapGetters
  } from 'vuex'
  import {
  	judgeVariableType,
  	variableInfo,
  	judgeVariableIsEmptyOrNull
  } from '@/utils/base.helper'
	export default {
		name: 'testReview',
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
      layerid: {//自动注入的layerid
        type: String,
        default: ''
      },
      testDataRow: {//传递的数据
        type: Object,
        default: () => {
          return {};
        }
      },
      TestData: {
      	type: Object,
      	default: function() {
      		return {}
      	}
      }
		},
		watch: {
      iframeData: {
        handler: async function () {
          console.log(this.testDataRow)
          this.form = this.testDataRow;
          let sData = '[Q]532{'+this.testDataRow.data_id+'$`'+'}|^SYS'
          const res = await QueryExec(sData)
          console.log(res)
          this.tableOption.tablelist=res.data
          this.sampleForm.test_date=this.testDataRow.test_time
          this.sampleForm.sample_name=this.testDataRow.sample_name
          this.sampleForm.sample_spec=this.testDataRow.sample_desc
          this.sampleForm.sample_number=this.testDataRow.sample_qty
          this.sampleForm.test_no=this.testDataRow.task_no
          this.$refs.testData.setCurrentRow(this.tableOption.tablelist[0])
          this.reviewForm.form[this.tableOption.tablelist[0].id]={
          	review_opinion: ''
          }
          this.class.tabs.AddAndChangeTabsSelect(this.tableOption.tablelist[0], this, 'editableTabsValue')
          this.iframeHeight()
        },
        deep: true,
        immediate: true
      },
			screenWidth: function(val) {

				this.iframeHeight()
			}
		},
		mounted: function() {
			let that = this
			window.addEventListener('resize', function() {
				if (that.screenWidth != document.body.offsetWidth) {
					that.screenWidth = document.body.offsetWidth;
				}
			})
		},
		components: {

		},
		data() {
			let that = this
			return {
				class: {
					tabs: undefined
				},
				info: {
					isShow: true,
				},
				screenWidth: document.documentElement.clientWidth, //屏幕宽度
				iframe: {
					Height: 300
				},
				labelPosition: 'left',

				tableOption: {
					listLoading: false,
					tablelist: [],
					elementLoadingText: '加载中...'
				},
				reviewForm: {
					form: {
            review_opinion: ''
          },
					rules: {}
				},
				valuationLabelWidth: '100px',
				sampleForm: {
					test_date: '',
					sample_name: '',
					sample_spec: '',
					sample_number: '',
					test_no: ''
				},
				testDataRules: {},
				luckysheet: {
					style: 'margin:0px;padding:0px;position:absolute;width:70%;height: 100%;left: 0px;top:0px;bottom:0px;float: left;',
					style70: 'margin:0px;padding:0px;position:absolute;width:70%;height: 100%;left: 0px;top:0px;bottom:0px;float: left;',
					styleFullWidth: 'margin:0px;padding:0px;position:absolute;width:100%;height: 100%;left: 0px;top:0px;bottom:0px;float: left;',
				},
				editableTabsValue: '2',
				editableTabs: [{
					id: 1,
					title: 'Tab 1',
					name: '1',
					content: 'Tab 1 content'
				}, {
					title: 'Tab 2',
					name: '2',
					content: 'Tab 2 content'
				}],
				tabIndex: 2
			}

		},
    computed: {
    	...mapGetters({
    		org_pid: 'user/org_pid',
    		org_id: 'user/org_id',
    		current_org_id: 'org/current_org',
    		current_and_chrilren_org: 'org/current_and_chrilren_org',
    		person_id: 'user/person_id',
    	}),
    },
		created() {
			//this.initLuckySheet()
			this.init()
		},
		methods: {
			init() {
        this.getPostMessage()
				let tabs = new tabsList(this, 'editableTabsValue')
				this.iframeHeight()
				this.class.tabs = tabs
				this.editableTabs = tabs.tabList
			},
			async iframeHeight() {
				//window.getComputedStyle(this.$refs.init).height;  还可以获取带有单位的数值
				// offsetWidth 返回元素的宽度（包括元素宽度、内边距和边框，不包括外边距）
				// offsetHeight  返回元素的高度（包括元素高度、内边距和边框，不包括外边距）
				// clientWidth 返回元素的宽度（包括元素宽度、内边距，不包括边框和外边距）
				// clientHeight 返回元素的高度（包括元素高度、内边距，不包括边框和外边距）
				// style.width  返回元素的宽度（包括元素宽度，不包括内边距、边框和外边距）
				// style.height 返回元素的高度（包括元素高度，不包括内边距、边框和外边距）
				// scrollWidth 返回元素的宽度（包括元素宽度、内边距和溢出尺寸，不包括边框和外边距），无溢出的情况，与clientWidth相同
				// scrollHeigh 返回元素的高度（包括元素高度、内边距和溢出尺寸，不包括边框和外边距），无溢出的情况，与clientHeight相同
				let that = this
				return new Promise((resolve, reject) => {
					let index = setInterval(function() {
						if (that.$refs.testData.$el && that.$refs.form.$el) {
							clearInterval(index)
							let HeightTable = that.$refs.testData.$el.offsetHeight
							let HeightForm = that.$refs.form.$el.offsetHeight
              console.log(that.$refs)
							//let HeightReview = that.$refs.review.$el.offsetHeight
							//let height = HeightTable - HeightForm - HeightReview - 60
							let height = HeightTable - HeightForm - 120

							that.iframe.height = height
							let iframeArry = document.getElementsByTagName('iframe')
							let length = iframeArry.length
							for (let i = 0; i < length; i++) {
								iframeArry[i].height = height
							}
							let eltabpaneArry = document.getElementsByClassName('el-tab-pane')
							length = eltabpaneArry.length
							for (let i = 0; i < length; i++) {
								eltabpaneArry[i].height = height
							}
							console.log(HeightTable, HeightForm, height)
							resolve(height)
						}
					})
				})

			},
			handleChange(val) {


			},
      change(e) {
        this.$forceUpdate()
      },
      async handleRefuse() {
        let sData = '[Q]548{'+this.class.tabs.tabList[0].row.data_id+'$`'+'-2'+'$`'+this.person_id+'$`'+this.reviewForm.form.review_opinion+'}|^1|^SYS'
        console.log(sData)
        const res = await ExecSql(sData)
        if(res>0)
        {
          this.$baseMessage('复核成功,试验已被退回', 'success')
        }
        else {
          this.$baseMessage('复核失败', 'error')
        }
      },
			async handlSave() {
				var iframe_home = document.querySelector('#luckysheetTestData1')
        console.log(this.reviewForm)
        for(let i=0;i<this.class.tabs.tabList.length;i++)
        {
          var iframe_home = document.querySelector('#'+this.class.tabs.tabList[i].domid)
          // iframe_home.contentWindow.testget()
          let sDataParam = '[Q]641{'+this.class.tabs.tabList[i].row.entrust_id+'$`'+this.class.tabs.tabList[i].row.param_id+
          '$`'+'2'+'$`'+this.person_id+'$`'+this.reviewForm.form[this.class.tabs.tabList[i].row.id].review_opinion+'}|^1|^SYS'
          console.log(sDataParam)
          const resParam = await ExecSql(sDataParam)
          if(resParam>0)
          {

          }
          else {
            
          }
        }
				iframe_home.contentWindow.testget()
        let sData = '[Q]548{'+this.class.tabs.tabList[0].row.data_id+'$`'+'3'+'$`'+this.person_id+'$`'+this.reviewForm.form[this.class.tabs.tabList[0].row.id].review_opinion+'$`0}|^1|^SYS'
        console.log(sData)
        const res = await ExecSql(sData)
        if(res>0)
        {
          this.$baseMessage('复核成功', 'success')
        }
        else {
          this.$baseMessage('复核失败', 'error')
        }
			},
			removeTab(targetName) {
				this.class.tabs.removeAndChangeTabsSelect(targetName, this, 'editableTabsValue')
			},
			rowClick(row, column, event) {
				this.class.tabs.AddAndChangeTabsSelect(row, this, 'editableTabsValue')
        console.log(row)
        this.reviewForm.form[row.id]={
					review_opinion: '',
				}
				this.iframeHeight()
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
					window.luckysheet.resize()
				})

			},
      SetiframeLoad(id) {
        console.log(this.class.tabs)
      	//iframe添加addEventListener
      	if (!this.class.tabs) {
      		return false
      	}
      	this.class.tabs.SetiframeLoad(id)

      	let testData = this.class.tabs.GetRowByDomId(id)
      	this.postMessage(id, 'testdata', testData);
      },
      getPostMessage() {
      	let _this = this
      	console.log('testDataApproval getPostMessage 开始监听iframe')
      	window.addEventListener('message', function(e) {
      		let data = e.data
          console.log('getPostMessage', data)
      		let IsEmptyOrNull = judgeVariableIsEmptyOrNull(data)
      		if (IsEmptyOrNull) {
      			return
      		}

      		let type = judgeVariableType(data)
      		let typeofdata = typeof data
          console.log(type)
      		switch (type) {
      			case variableInfo.string.name:

      				break
      			case variableInfo.number.name:

      				break
      			case variableInfo.array.name:
      				break
      			case variableInfo.json.name:
      				switch (data.messageTpye) {
      					case 'addEventListener':
                  console.log(data)
      						_this.SetiframeLoad(data.postData)
      						break
      					case 'onresize':
      						_this.resizeLuckSheet()
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
      },
      postMessage(iframeRef, messageTpye, postData) {
      	//发送消息
      	let that = this
      	return new Promise((resolve, reject) => {
      		try {
      			let index = setInterval(function() {
      				let dom = that.$refs[iframeRef]
      				if (dom && dom[0]) {
      					clearInterval(index)

      					// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
      					dom[0].contentWindow.postMessage({
      						messageTpye: messageTpye,
      						postData: postData
      					}, '*');
      					resolve(true)
      				}
      			})
      		} catch (e) {
      			reject(false, e)
      		}
      	})
      },
			async initLuckySheet() {
				const data = await Entrust('1001')
				console.log(data.template_json)
				const template_json = await QueryExecFile('/TempFile' + data.template_json)
				console.log(template_json)
				let option = {
					container: "luckysheet",
					showinfobar: false,
					showtoolbar: false,
					sheetFormulaBar: false,
					showstatisticBar: false,
					showsheetbar: false,
					data: template_json
				};

				luckysheet.create(option);
			},

			close(status) {

			},
			save() {
				let that = this


			},
		},
	}

	class tabsList {
		tabList = []
		id = 'id'
		testTask = 'testTask'
		ref = {}
		domSuff = "luckysheetTestData"
		constructor(vueThat, TabsSelectKey) {
			this.vueThat = vueThat
			this.TabsSelectKey = TabsSelectKey
		}
		ReinitList() {
			this.tabList = []
			this.ref = {}
			return this.tabList
		}
		async postMessage(ref) {

		}
    SetiframeLoad(id) {
      console.log(this)
    	if (!this.ref[id]) {
    		return false
    	}
    	let refInfo = this.ref[id]
    	if (!refInfo) {
    		return false
    	}
    	refInfo.addEventListener = true
    	let index = refInfo.index
    	if (index < 0 || index > this.tabList.length - 1) {
    		return false
    	}
    	this.tabList[index].addEventListener = true
    	console.log('SetiframeLoad', id, '添加监听事件完成')
    }
		getContent(row) {
			let id = this.domSuff
			if (row && row[this.id]) {
				id = id + row[this.id]
			}

			return content
		}

    tabListAdd(key, title, row) {
    	let domid = this.domSuff
    	if (row && row[this.id]) {
    		domid = domid + row[this.id]
    	}
    	let tab = {
    		id: key,
    		title: title,
    		name: key.toString(),
    		domid: domid,
    		row: row
    		//content: this.getContent(row)
    	}
    	tab[this.id] = key
    	console.log(tab)
    	this.tabList.push(tab)
    	this.ref[domid] = {
    		domid: domid,
    		index: this.tabList.length - 1,
    		row: row
    	}

    }
		tabListFind(id, key) {
			let searchList = this.tabList
			if (!id) {
				return {}
			}
			if (!key) {
				key = this.id
			}
			let length = searchList.length

			let item = undefined
			for (let i = 0; i < length; i++) {
				item = searchList[i]
				if (item[key] == id) {
					return item
				}
			}
			return {}
		}
		remove(targetName) {
			let item = this.tabListFind(targetName, 'name')
			if (!(item && item[this.id])) {
				return -1
			}
			let index = this.tabList.indexOf(item)
			if (index < 0 || index > this.tabList.length - 1) {
				return -2
			}
			this.tabList.splice(index, 1);
			this.ref[this.domSuff + item[this.id]] = undefined
			return index
		}
		removeAndChangeTabsSelect(targetName, that, TabsSelectKey) {
			let nTemp = this.remove(targetName)
			if (nTemp < 0) {
				return nTemp
			}
			if (!that) {
				that = this.vueThat
			}
			if (!TabsSelectKey) {
				TabsSelectKey = this.TabsSelectKey
			}
			if (that[TabsSelectKey] == targetName) {
				if (this.tabList.length == 0) {
					return 0
				}
				if (nTemp > this.tabList.length - 1) {
					nTemp = this.tabList.length - 1
				}
				that[TabsSelectKey] = this.tabList[nTemp].name
			}

		}
    GetRowByDomId(id) {
    	if (!id) {
    		return false
    	}
    	if (!this.ref[id]) {
    		return false
    	}
    	return this.ref[id].row
    }
		Add(row) {
			let key = row[this.id]
			let testTask = row[this.testTask]
			let item = this.tabListFind(key)
			if (item && item[this.id]) {
				return item.name
			}
			this.tabListAdd(key, testTask, row)
			return key.toString()
		}
		AddAndChangeTabsSelect(row, that, TabsSelectKey) {
			let sTemp = this.Add(row)
			that[TabsSelectKey] = sTemp
		}
	}
</script>

<style>
	#test .el-tab-pane {
		height: 100%;
	}

	.test-footer {
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: space-around;
		align-items: center
	}
</style>

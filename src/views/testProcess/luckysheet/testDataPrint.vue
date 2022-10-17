<template>
	<div style="width:100%;">
		<el-tabs v-model="editableTabsValue" closable @tab-remove="removeTab" type="card">
			<el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
				<!--  -->
        <el-col :span="span">
				<iframe :id="item.domid" :ref="item.domid" width="100%" :height="GetiframeHeight"
					src="/TestDataPrint.html" style="height: 85%;width:99%;"
					:style="'height:'+GetiframeHeight+' !important'" @onload="iframeLoad"></iframe>
        </el-col>
        <el-col :span="6" v-if="dispalyTable">
          <el-table ref="testData" v-loading="tableOption.listLoading" :data="tableOption.tablelist" border
          	:element-loading-text="tableOption.elementLoadingText" highlight-current-row height="59vh"
          	:header-cell-style="{ background: '#e8f0ff' }" size="mini">
          	<el-table-column show-overflow-tooltip prop="seal_name" label="已申请的印章名声">

          	</el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="操作"
              width="80px"
            >
              <template #default="{ row }">
                <el-button
                  type="primary"
                  class="normal"
                  @click="handleAddSeal(row)"
                >
                  添加印章
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

				<!-- {{$createElement(item.content)}} -->
			</el-tab-pane>
		</el-tabs>
	</div>


</template>

<script>
	import {
		judgeVariableType,
		variableInfo,
		judgeVariableIsEmptyOrNull
	} from '@/utils/base.helper'
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
  import { QueryExec } from '@/api/table'
	export default {
		name: 'testDataApproval',
		model: {
			prop: 'isUpData',
			event: 'on-change'
		},
		props: {
			TestData: {
				type: Object,
				default: function() {
					return {}
				}
			},
      state: {
        type: Number,
        default: 1
      }
		},
		mounted() {
			const that = this
			window.onresize = function() {
				that.resizeLuckSheet()
			}

			let index = setInterval(() => {
				if (that.$el && that.$el.parentElement && that.$el.parentElement.parentElement) {
					clearInterval(index)
					that.$el.parentElement.parentElement.addEventListener("resize",
						() => {
							console.log('this.$el.resize')
							that.resizeLuckSheet()
						});
					that.$el.parentElement.parentElement.onresize = function() {
						console.log('this.$el.onresize')
						that.resizeLuckSheet()
					}
				}
			})

		},
		computed: {
      ...mapGetters({
      	person_id: 'user/person_id',
      }),
			GetiframeHeight() {
				let height = this.iframeheight - 65;
				//let height = this.$el.offsetHeight - 75
				return height + 'px'
			},
			GetElOffsetHeight() {
				return this.$el.offsetHeight
			}
		},
		data() {
			let that = this
			return {
        span:'18',
				editableTabsValue: '0',
				editableTabs: [],
				iframeheight: '100',
				iframe: {
					height: '100'
				},
				tabs: {
					instances: ''
				},
        tableOption: {
        	listLoading: false,
        	tablelist: [],
        	elementLoadingText: '加载中...'
        },
        dispalyTable: true,
			}

		},
		destroyed() {
			this.tabs.instances = ''
		},
		created() {
			this.init()
		},
		methods: {
			resizeLuckSheet() {

				if (this.timer) {
					return
				}
				let that = this
				this.timer = true
				setTimeout(() => {
					that.iframeHeight()
					that.timer = false
				}, 50)

			},
			iframeHeight() {
				let that = this
				let index = setInterval(() => {
					if (that.$el) {
						clearInterval(index)
						let height = that.$el.offsetHeight
						that.$set(that, 'iframeheight', height)
					}
				})

			},

			async init() {
        if(this.state==2)
        {
          this.dispalyTable=true
          // this.span="24"
        }
				this.getPostMessage()
				this.iframeHeight()

				this.tabs.instances = new tabsList(this, 'editableTabsValue')
				await this.GetObjectName()
				this.editableTabs = this.tabs.instances.tabList
				this.pushTestData(this.TestData)
        this.getSealData()
        console.log(this.tabs.instances.tabList)

			},
      async getSealData() {
        let sData = '[Q]839{'+this.person_id+'$`'+this.TestData.data_id+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData,res)
        this.tableOption.tablelist = res.data
      },
      async handleAddSeal(row) {
        var iframe_home = document.querySelector('#'+this.tabs.instances.tabList[0].domid)
        iframe_home.contentWindow.handleAddSeal()
        // let sheet = spread.getSheet(0)
        // // sheet.setPictureData({ "xAxis": 0, "yAxis": 0, "width": 200, "height": 200, "src": ""})
        // let canvashtml = sheet._getCanvas()
        // let picture = new Picture(spread);
        // let test = await picture.setLocation();
      },
			pushTestData(TestData) {
				this.GetInstances().AddAndChangeTabsSelect(TestData, this, 'editableTabsValue')
			},
			GetInstances() {
				return this.tabs.instances
			},
			removeTab(targetName) {
				this.GetInstances().removeAndChangeTabsSelect(targetName, this, 'editableTabsValue')
			},
			iframeLoad(event) {
				console.log('iframeLoad', event)
			},
			SetiframeLoad(id) {
				//iframe添加addEventListener
				if (!this.tabs.instances) {
					return false
				}
				this.tabs.instances.SetiframeLoad(id)

				let testData = this.tabs.instances.GetRowByDomId(id)
				this.postMessage(id, 'testdata', testData);
			},
			getPostMessage() {
				let _this = this
				console.log('testDataApproval getPostMessage 开始监听iframe')
				window.addEventListener('message', function(e) {
					let data = e.data
					let IsEmptyOrNull = judgeVariableIsEmptyOrNull(data)
					if (IsEmptyOrNull) {
						return
					}
					console.log('getPostMessage', data)
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
			async GetObjectName() {
				let data = await this.$store.dispatch('testObject/GetJsonKeyObejctIdAll')
				this.GetInstances().setObjectName(data)
				return 1;
			},
		},
	}

	class tabsList {
		ObjectName = []
		tabList = []
		id = 'data_id'
		order_id = 'order_id'
		ref = {}
		domSuff = "luckysheetTestData"
		constructor(vueThat, TabsSelectKey) {
			this.vueThat = vueThat
			this.TabsSelectKey = TabsSelectKey
		}
		setObjectName(data) {
			this.ObjectName = data
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
		GetRowByDomId(id) {
			if (!id) {
				return false
			}
			if (!this.ref[id]) {
				return false
			}
			return this.ref[id].row
		}
		ReinitList() {
			this.tabList = []
			this.ref = {}
			return this.tabList
		}
		async postMessage(ref) {

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
		Add(row) {
			let key = row[this.id]
			let title = row[this.order_id]
			let item = this.tabListFind(key)
			if (item && item[this.id]) {
				return item.name
			}
			if (this.ObjectName[row.object_id]) {
				title = title + ' ' + this.ObjectName[row.object_id].object_name
			}

			this.tabListAdd(key, title, row)
			return key.toString()
		}
		AddAndChangeTabsSelect(row, that, TabsSelectKey) {
			let sTemp = this.Add(row)
			if (!that) {
				that = this.vueThat
			}
			if (!TabsSelectKey) {
				TabsSelectKey = this.TabsSelectKey
			}
			that[TabsSelectKey] = sTemp
		}
	}
</script>

<style scoped>

</style>

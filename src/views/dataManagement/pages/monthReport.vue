<template>
  <!-- 报告模板 -->
	<div class="table-container definition2 purchase equipment equipment_btn parameterdictionary" style="overflow: auto;margin-right: 10px;">

			<el-row :gutter="15">
				<el-col :span="8" style="float: left;padding-right: 10px!important;x;padding-left: 0!important;" >
					<el-row>


            <div class="baseBox" style="margin-bottom: 10px;">
              <el-col :span="24" style="margin-bottom: 10px;">
                <el-col :span="24">
<!--                  <el-input v-model="queryForm.meta_name" placeholder="按报告字典项名称搜索">
                    <template #append>
                      <el-button icon="el-icon-search" @click="meta_search"></el-button>
                    </template>
                  </el-input> -->
                  <div style="text-align: right;">
                    <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
                    	<el-form-item  style="margin-bottom: 0px;margin-right:10px;">
                    		<el-input v-model="queryForm.meta_name" placeholder="按报告字典项名称搜索" prefix-icon="el-icon-search">
                    		</el-input>
                    	</el-form-item>
                      <el-form-item  style="margin-bottom: 0px;margin-right:0px">
                        <el-button
                          type="primary"
                          native-type="submit"
                          @click="meta_search"
                        >
                          查询
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>

                </el-col>
              </el-col>
              <el-col :span="24">
                <el-table ref="tableSort" v-loading="listChildLoading" :data="listChild" border
                  :element-loading-text="elementLoadingText" highlight-current-row :height="height"
                  @selection-change="setSelectRows" @sort-change="tableSortChange"
                  :header-cell-style="{ background: '#e8f0ff' }">
                  <el-table-column show-overflow-tooltip label="所属部门" prop="org_name" align="center">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="name" label="姓名" min-width="100px">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="month" label="月份" width="100px"
                    align="center"></el-table-column>
                  <el-table-column show-overflow-tooltip label="职位" prop="data_type" align="center">
                  </el-table-column>

                  <el-table-column show-overflow-tooltip label="操作" width="120px">
                    <template #default="{ row }">
                      <el-button type="primary" class="normal" @click="handleMetaEdit(row)">
                        修改
                      </el-button>
                      <el-button class="danger" @click="handleMetaDelete(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
                  :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"></el-pagination>
              </el-col>
            </div>
					</el-row>

				</el-col>

				<el-col :span="16" class="baseBox" >
					<el-row>
						<el-col :span="24">
							<h1 class="excelTitle" style="margin: 0;">
								<i></i>月报
								<el-button style="margin: 4px 10px 0 0;" type="primary" @click="addmap">保存报告</el-button>
                <el-button style="margin: 4px 10px 0 0;" type="primary" @click="clearmap" >修改报告</el-button>
							</h1>
						</el-col>

					</el-row>
					<el-row>
						<el-col :span="24">
<!-- 							<div id="entrustsheet" ref="entrustsheet"></div> -->
              <iframe src="/SpreadJsDictionary.html" frameborder="0" width="100%" style="margin:0px;padding:0px;height:calc(100vh - 185px );border:1px solid #CCCCCC" id="myframe" ref="myframe"
                	@load="loaded"></iframe>
						</el-col>
					</el-row>

				</el-col>
			</el-row>
<!-- 		<parameterDictionary ref="parameterDictionary" @fetchDataChild="fetchDataTemplate"></parameterDictionary>
		<parameterTemplate ref="parameterTemplate" @addDictionary="addDictionary"></parameterTemplate> -->
	</div>
</template>

<script>
	import {
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		ViewfileUrl,
		UploadFileNameUrl
	} from '@/utils/servicefile'
	import {
		TreeDataDeal,
		TreeDataDealEx
	} from '@/global/tree_deal'
	import {
		cellConvert,
		cellCount,
		cellConvertToOffice
	} from '@/utils/cellconvert'
  import { DeleteSheet } from '@/utils/excelchange'
	// import parameterDictionary from '../components/reportDictionary.vue'
	// import parameterTemplate from './../components/reportTemplate'
	// import TableEdit2 from '../components/parameterDictionary2.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			// parameterDictionary,
			// parameterTemplate,
			treeData,
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger',
				}
				return statusMap[status]
			},
		},
		data() {
			return {
				imgShow: true,
				list: [],
				imageList: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				listChild: [],
				listChildFile: [],
				listChildLoading: true,
				layoutChild: 'total, sizes, prev, pager, next, jumper',
				layoutParam: 'total, sizes, jumper',
				total: 0,
				totalparam: 0,
				totalFile: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				search: {
					object_name: '',
					tpl_name: '',
					enable_time_start: '',
					enable_time_end: '',
					enable: '1'
				},
				templist: {
					object_id: '',
					param_id: '',
					template_id: ''
				},
				template: {},
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
					meta_name: ''
				},
				queryFormFile: {
					pageNo: 1,
					pageSize: 20,
					title: '',
					meta_name: ''
				},
				queryFormParam: {
					pageNo: 1,
					pageSize: 20,
					title: '',
					meta_name: ''
				},
				listChildFileLoading: false,
				dialogFormVisible: false,
				templateold: false,
				multipleSelection: [],
				columnHideList: ['selection'],
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight() * 1.23
			},
			heightchild() {
				return this.$baseTableHeight() * 0.555
			}
		},
		created() {
			this.fetchDataEx()
		},
		beforeDestroy() {},
		mounted() {

		},
		methods: {
			async init() {
				switch (this.type) {
					case 0:
						this.height = 'calc(80%)'
						this.columnHideList = ['selection']
						break
					case 1:
						this.columnHideList = ['selection']
						this.height = 'calc(80%)'
						break
					case 22:
					case 20:
						this.columnHideList = ['selection', 'object_id', 'group_id', 'repeat_rate', 'witness_rate',
							'auto_judge',
							'workflow', 'version', 'has_entry_str'
						]
						break
					case 21:
						this.columnHideList = []
						break
				}
			},
			handleRowClick(row) {
				this.templist.object_id = row.object_id
				this.templist.param_id = row.object_id
				this.fetchDataTemplate(row)

			},
			hideColFob(col_name) {
				try {
					let that = this
					if (!col_name) {
						return true
					}
					if (that.columnHideList.indexOf(col_name) < 0) {
						return true
					}
					return false
				} catch (e) {
					console.log(e)
					return false
				}
			},
      clearmap() {
        let that = this
        this.$baseConfirm('你确定要清空所有映射吗', null, async () => {

        	let sData = '[Q]667{' + that.templist.template_id + '}|^1|^SYS'
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
				let count = -1
				console.log(that.listsumbit)
        var childWindow = document.getElementById("myframe").contentWindow;
        console.log(childWindow)
        await childWindow.addmap()
				// that.listsumbit.forEach(async (item, index) => {
				// 	count = 0
				// 	if (item.state === 'I') {
				// 		let sData = '[Q]452{' + that.templist.object_id + '$`0$`' + item.meta_id + '$`' + item
				// 			.cell + '$`' + this.templist.template_id + '$`'+item.sheet_id+'}|^2|^SYS'
				// 		const res = await ExecSql(sData)
    //         console.log(sData)
				// 		if (res > 0) {

				// 		} else {
				// 			count++
				// 		}
				// 	} else if (item.state === 'U') {
				// 		let sData = '[Q]478{' + item.meta_id + '$`' + item
				// 			.cell + '$`' + this.templist.template_id +'$`'+item.sheet_id+ '}|^1|^SYS'
				// 		console.log(sData)
				// 		const res = await ExecSql(sData)
				// 		console.log(res)
				// 		if (res > 0) {

				// 		} else {
				// 			count++
				// 		}
				// 	} else if (item.state === 'D') {
				// 		let sData = '[Q]500{' + that.templist.object_id + '$`0$`' + item.meta_id + '$`' + this
				// 			.templist.template_id + '}|^1|^SYS'
				// 		console.log(sData)
				// 		const res = await ExecSql(sData)
				// 		console.log(res)
				// 		if (res > 0) {

				// 		} else {
				// 			count++
				// 		}
				// 	}
				// })
				// if (count === 0) {
				// 	that.$baseMessage('映射定义成功', 'success')
				// } else {
				// 	that.$baseMessage(count.toString() + '个映射定义失败,请刷新页面查看哪些未定义上', 'error')
				// }
			},
			tableSortChange() {
				const imageList = []
				this.$refs.tableSort.tableData.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
			},
			paramsearch() {
				this.fetchDataEx()
        this.queryForm.pageNo = 1
			},
			meta_search() {
				if (this.templist.object_id === '') {
					this.$baseMessage('请选中试验')
				} else {
					this.fetchDataChild(this.templist)
				}
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				if (this.templist.object_id === '') {
					this.$baseMessage('请选中试验','error')
				}
				else if(this.templist.template_id === '')
				{
				  this.$baseMessage('请先添加模板','error')
				} else {
					this.$refs['parameterDictionary'].showEdit(this.templist, '0')
				}
			},

			handleOldAdd(row) {
				this.$refs['parameterDictionary'].showEdit()
			},
			handleEdit(row) {
				this.$refs['parameterDictionary'].showEdit(row, '1')
			},
			handleMetaEdit(row) {
				this.$refs['parameterDictionary'].showEdit(row, '1')
			},
			handleTemplateEdit() {
				if (this.templist.object_id === '') {
					this.$baseMessage('请选中试验')
				} else {
					let arr = Object.keys(this.template);
          console.log(this.template.template_id)
					if (arr.length === 0 || this.template.template_id.length === 0) {
            console.log(this.template.template_id)
						this.$refs['parameterTemplate'].showEdit(this.templist, '0')
					} else {
						this.$refs['parameterTemplate'].showEdit(this.template, '1')
					}
				}

			},
      handleTemplateCopy() {
				if (this.templist.object_id === '') {
					this.$baseMessage('请选中试验')
				} else {
					let arr = Object.keys(this.template);
          console.log(this.template.template_id)
					if (arr.length === 0 || this.template.template_id.length === 0) {
            console.log(this.template.template_id)
						this.$refs['parameterTemplate'].showEdit(this.templist, '2')
					} else {
						// this.$refs['parameterTemplate'].showEdit(this.template, '1')
					}
				}

			},
			handleTemplateDelete(row) {
				let that = this
				if (this.template.template_id) {
				  this.$baseConfirm('你确定要删除此模板吗', null, async () => {
						let sData = '[Q]743{'+this.template.template_id+'}|^1|^SYS'
						const res = await ExecSql(sData)
						if(res>0)
						{
							that.$baseMessage('模板删除成功', 'success')
				      that.fetchDataChildFile()
						}
						else {
							that.$baseMessage('模板删除失败', 'error')
						}
				  })
				}
			},
			handleMetaDelete(row) {
			  let that = this
			  if (row.id) {
			    that.$baseConfirm('你确定要删除此指标吗', null, async () => {
        		let sData = '[Q]785{'+row.id+'}|^1|^SYS'
        		const res = await ExecSql(sData)
            console.log(res)
        		if(res>0)
        		{
              that.fetchDataChild()
              that.$baseMessage('指标删除成功', 'success')
        		}
        		else {
        			that.$baseMessage('指标删除失败', 'error')
        		}
			    })
			  }
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchDataChild(this.templist)
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchDataChild(this.templist)
			},
			handleSizeChangeParam(val) {
				this.queryForm.pageSize = val
				this.fetchDataEx()
			},
			handleCurrentChangeParam(val) {
				this.queryForm.pageNo = val
				this.fetchDataEx()
			},
			async fetchData(row) {
				this.listLoading = true
				if (row) {

				}
				setTimeout(() => {
					this.listLoading = false
				}, 500)
			},
			testMessage() {
				this.$baseMessage('test1', 'success')
			},
			testNotify() {
				this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
			},
			async fetchDataChild(row) {
				this.listChildLoading = true

				console.log(row)
				this.templist.template_id = row.template_id
				if (row) {
					let sData = '[Q]499{' + row.object_id + '$`' + row.template_id + '$`%' + this.queryForm.meta_name +
						'%$`' + ((Number(this.queryForm.pageNo) - 1) * Number(this.queryForm.pageSize)).toString() +
						'$`' + this.queryForm.pageSize + '}|^SYS'
					const res = await QueryExec(sData)
					console.log(sData)
					this.listChild = res.data
					this.total = res.total
				}
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},
      async addDictionary(temp)
      {
        let sData = '[Q]742{' + temp.old_id + '$`' + temp.new_id + '}|^1|^SYS'
        const res = await ExecSql(sData)
        console.log(sData)
        if (res > 0) {
          this.$baseMessage('复制模板成功', 'success')
        } else {
        	this.$baseMessage('复制模板失败', 'error')
        }
      },
			async fetchDataTemplate(row) {
				this.listChildFileLoading = true

				this.template = {}
				if (row) {
					let sDataFile = '[Q]491{' + this.templist.object_id + '}|^SYS'
					const resFile = await QueryExec(sDataFile)
          console.log(resFile)
          if(resFile.total > 0)
          {
            resFile.data[0].object_id = resFile.data[0].obj_id
            this.templist.object_id=resFile.data[0].obj_id
            this.templist.param_id=resFile.data[0].obj_id
            this.templist.template_id=resFile.data[0].template_id
            this.template = resFile.data[0]
            this.entrustInfo = resFile.data[0]
            this.loaded()
            this.fetchDataChild(this.templist)
          }
          else {
            this.templist.object_id=row.object_id
            this.templist.param_id=row.object_id
            this.templist.template_id=''

            this.fetchDataChild(this.templist)
            this.template = {}
          }
				}
				setTimeout(() => {
					this.listChildFileLoading = false
				}, 500)
			},
			async fetchDataEx(row, treeNode, resolve) {
				//console.log(row, treeNode, resolve)
				this.listLoading = true
				this.listChildLoading = true
				try {
					let sData;
					let form = Object.assign({}, this.queryForm)
					if (row) {
						form.parent_id = row.object_id
					} else {
						form.parent_id = '0'
					}
					sData = '[Q]243{' + form.parent_id + '$`%' + this.search.object_name + '%$`' + this.search
						.tpl_name + '}|^SYS'

					// console.log(row)
					if (row) {
						const res = await QueryExec(sData)
						const data = res.data
						// console.log(res)
						for (let i = 0; i < data.length; i++) {
							if (Number(data[i].children) > 0) {
								data[i].hasChildren = true
							} else {
								data[i].hasChildren = false
							}
						}
						if (resolve) {
							console.log('resolve')
							resolve(data)
						} else if (this.resolve && this.resolve[form.parent_id]) {
							console.log('this.resolve')
							this.$set(this.$refs.tableSort.store.states.lazyTreeNodeMap, form.parent_id, []);
							this.resolve[form.parent_id](data)
						} else if (form.parent_id == 0) {
							this.list = data
							//this.tableDataTemp = JSON.parse(JSON.stringify(data))
							return
						}

					} else {

						const res = await QueryExec(sData)
						console.log(res)
						const data = TreeDataDealEx(res.data, 0, 'object_id', 'parent_id', 'hasChildren')
						// console.log(data)
						this.list = data
						this.totalparam = res.total
					}
				} catch (e) {
					console.log(e)
				}
				setTimeout(() => {
					this.listLoading = false
				}, 500)
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
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

      loaded() {
      	let that = this
      	let index = setInterval(function() {
      		if (that.$refs.myframe) {
      			clearInterval(index)
      			// 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
      			that.$refs.myframe.contentWindow.postMessage({
      				org_pid: that.org_pid,
      				person_id: that.person_id,
      				pageType: that.pageType,
      				data: that.data,
      				object_id: that.object_id,
      				entrustInfo: that.entrustInfo,
              current_org_id: that.current_org_id
      			}, '*');
      		}
      	})

      },
		},
	}
</script>
<style lang="scss" scoped>
.el-row{margin: 0!important;}
.baseBox{overflow:hidden;padding:10px!important;}
</style>

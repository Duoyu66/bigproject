<template>
  <!-- 报告模板 -->
	<div class="table-container definition2 purchase equipment equipment_btn parameterdictionary" style="overflow: auto;margin-right: 10px;">
		<vab-query-form class="template dictionary">
			<el-row :gutter="15">
				<!-- <el-col :span="12">
					<el-input v-model="search.param" placeholder="按试验名称搜索" prefix-icon="el-icon-search">
						<template #append>
							<el-button icon="el-icon-search" @click="paramsearch"></el-button>
						</template>
					</el-input>
				</el-col> -->
			</el-row>
		</vab-query-form>

		<el-container class="colors">
			<el-row :gutter="15">
				<el-col :span="12" style="float: left;padding-right: 10px!important;x;padding-left: 0!important;" >
					<el-row>
            <div class="baseBox" style="margin-bottom: 10px;">
              <el-col :span="8">
              <el-button
                  type="primary"
                  @click=""
                  disabled
                >
                  添加模板
                </el-button>

              </el-col>
              <el-col :span="16">
                <div style="text-align: right;">
                  <el-form ref="form" :model="search" :inline="true" @submit.native.prevent>
                  	<el-form-item label="行业" label-width="100px" prop="tpl_name">
                  		<el-select v-model="search.tpl_id" style="width: 100%;" placeholder="请选择行业..." @change="tplchange">
                  			<el-option v-for="data in selectData.tpl_id" :key="data.key" :label="data.value"
                  				:value="data.key">
                  			</el-option>
                  		</el-select>
                  	</el-form-item>
                  </el-form>
                </div>

              </el-col>
              <el-col :span="24">
                <el-table ref="tableSort" :data="list" border :element-loading-text="elementLoadingText"
                  :height="heightchild" row-key="object_id" highlight-current-row
                  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy
                  tooltip-effect="dark" :load="fetchDataEx" @row-click="handleRowClick">
                  <el-table-column show-overflow-tooltip prop="object_name" label="试验名称" min-width="200px"
                    alig="left">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip label="试验标识" prop="object_id"
                    v-if="hideColFob('object_id')">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip label="平行率" prop="repeat_rate" width="70px"
                    v-if="hideColFob('repeat_rate')"></el-table-column>
                  <el-table-column show-overflow-tooltip label="见证率" prop="witness_rate" width="70px"
                    v-if="hideColFob('witness_rate')"></el-table-column>
                  <el-table-column show-overflow-tooltip label="自动计算" prop="auto_judge" width="90px"
                    v-if="hideColFob('auto_judge')">
                    <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.auto_judge=='0'">
                        否
                      </el-tag>
                      <el-tag type="success" v-else-if="scope.row.auto_judge=='1'">
                        是
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip label="版本" prop="version" width="70px"
                    v-if="hideColFob('version')">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip label="试验类型" prop="has_entry_str" width="150px"
                    v-if="hideColFob('has_entry_str')"></el-table-column>
                </el-table>
                <el-pagination :background="background" :current-page="queryFormParam.pageNo"
                  :layout="layoutParam" :page-size="queryFormParam.pageSize" :total="totalparam"
                  @current-change="handleCurrentChangeParam" @size-change="handleSizeChangeParam">
                </el-pagination>
              </el-col>
             </div>

           <div class="baseBox" style="margin-bottom: 10px;">
              <el-col :span="24" style="margin-bottom: 10px;">
                <el-col :span="14">

                    <el-button type="primary" @click="handleAdd()">添加字典项</el-button>

                    <el-popover
                      placement="top"
                      width="280"
                      v-model="visible">
                      <el-select v-model="template_id" placeholder="请选择要复制的字典的模板">
                        <el-option
                          v-for="item in options"
                          :key="item.id"
                          :label="item.template_name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                      <div style="text-align: right; margin: 10">
                        <el-button type="primary" size="mini" @click="handleCopy()">确定</el-button>
                        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                      </div>
                      <el-button slot="reference" type="primary">复制字典项</el-button>
                    </el-popover>
                </el-col>
                <el-col :span="10">
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
                  :element-loading-text="elementLoadingText" highlight-current-row :height="heightchild"
                  @selection-change="setSelectRows" @sort-change="tableSortChange"
                  :header-cell-style="{ background: '#e8f0ff' }">
                  <el-table-column show-overflow-tooltip label="指标标识" prop="meta_id" align="center">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="meta_name" label="指标名称" min-width="100px">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="group_id" label="所属组" width="100px"
                    align="center"></el-table-column>
                  <el-table-column show-overflow-tooltip label="数据类型" prop="data_type" align="center">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="is_auto" label="自动计算" align="center">
                  </el-table-column>
                  <el-table-column show-overflow-tooltip label="数据项类别" prop="item_category" width="150px"
                    align="center"></el-table-column>
                  <el-table-column show-overflow-tooltip label="操作" width="90px">
                    <template #default="{ row }">
                      <el-dropdown trigger="click" placement="left-start">
                        <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                        <el-dropdown-menu slot="dropdown" class="more">
                          <el-button  class="normal" @click="handleMetaEdit(row)">
                            修改
                          </el-button>
                          <el-button  @click="handleMetaDelete(row)">删除</el-button>
                          <el-button  @click="handleMetaDeleteMap(row)">删除映射</el-button>

                        </el-dropdown-menu>
                      </el-dropdown>
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

				<el-col :span="12" class="baseBox" >
					<el-row>
						<el-col :span="24">
							<h1 class="excelTitle" style="margin: 0;">
								<i></i>
                <el-row>
                  <el-col :span="6">
                    <div>试验模板定义</div>
                  </el-col>
                  <el-col :span="10">
                    <el-input placeholder="请输入菜单过滤关键词" v-model="metaname" style="margin: 0px 10px 0px 0px; width: 250px;">
                      <el-button slot="append" icon="el-icon-search" @click="searchmap"></el-button>
                    </el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button @click="addmap">保存映射</el-button>
                  </el-col>
                  <el-col :span="4" style="text-align: right;">
                    <el-dropdown trigger="click" placement="left-start">
                      <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                      <el-dropdown-menu slot="dropdown" class="more">

                        <el-button @click="clearmap" >清空映射</el-button>
                        <el-button @click="handleTemplateEdit">修改模板</el-button>
                        <el-button @click="handleTemplateDelete">删除模板</el-button>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
							</h1>
						</el-col>


					</el-row>
					<el-row>
						<el-col :span="24">
              <iframe src="/SpreadJsDictionary.html" frameborder="0" width="100%" style="margin:0px;padding:0px;height:calc(100vh - 185px );border:1px solid #CCCCCC" id="myframe" ref="myframe"
                	@load="loaded"></iframe>
						</el-col>
					</el-row>

				</el-col>
			</el-row>
		</el-container>
		<parameterDictionary ref="parameterDictionary" @fetchDataChild="fetchDataChild"></parameterDictionary>
		<testTemplate ref="testTemplate" @addDictionary="addDictionary"></testTemplate>
		<table-edit1 ref="edit1"></table-edit1>

	</div>
</template>

<script>
	import {
		doEdit,
		ExecSql,
		QueryExec,
    QueryExecNoCom
	} from '@/api/table'
  import {
  	ZlibHelper
  } from '@/global/zlibHelper'
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
  import {
  	GetGroupData,
  	GetGroupDataEx,
  	GetGroupDataEx2,
  	GetGroupDataCustomEx
  } from '@/utils/htmlDataGroup'
  import {
    getTestTemplateData
  } from '@/api/dataCache'
  import { DeleteSheet } from '@/utils/excelchange'
	import parameterDictionary from '../components/reportDictionary.vue'
	import TableEdit1 from '../components/parameterDictionary1.vue'
	import testTemplate from './../components/reportTemplate'
	// import TableEdit2 from '../components/parameterDictionary2.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			parameterDictionary,
			TableEdit1,
			testTemplate,
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
        visible: false,
				layout: 'total, sizes, prev, pager, next, jumper',
				listChild: [],
				listChildFile: [],
				listChildLoading: true,
				layoutChild: 'total, sizes, prev, pager, next, jumper',
				layoutParam: 'total, sizes, jumper',
				total: 0,
        metaname: '',
				totalparam: 0,
				totalFile: 0,
				background: true,
				selectRows: '',
        selectRow: {},
        selectRowFile: {},
        tplOption: [],
        template_id: '',
        options: [],
				elementLoadingText: '正在加载...',
				search: {
					object_name: '',
					tpl_id: '',
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
        selectData: {
        	supervisee: [],
          tpl_id: []
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
				return this.$baseTableHeight() * 1.2
			},
			heightchild() {
				return this.$baseTableHeight() * 0.5
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
				this.fetchDataTemplate(row)
        this.GetTemplate(row)
			},
      async GetTemplate(row) {

        if(row.object_id)
        {
          let sData = '[Q]1064{' + row.object_id + '}|^SYS'
          const res = await QueryExec(sData)
          console.log(sData,res)
          this.options = res.data
        }

      },
      tplchange(){
        this.fetchDataEx()
      },
      async GetGroupEx() {

      	let list = [{
      		data: "tpl_id",
      		sqlcode: 241
      	}];
      	await GetGroupDataCustomEx(this, list)
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
      async clearmap() {
        let that = this
        var childWindow = document.getElementById("myframe").contentWindow;
        await childWindow.clearmap()

      },
      async handleCopy()
      {
        let that = this
        let sData = '[Q]742{' + that.template_id + '$`' + that.selectRowFile.id + '}|^1|^SYS'
        const res = await ExecSql(sData)
        console.log(sData,res)
        if (res > 0) {
          this.$baseMessage('复制字典成功', 'success')
        } else {
        	this.$baseMessage('复制字典失败', 'error')
        }
      },
      handleMetaDeleteMap(row) {
        let that = this
        this.$baseConfirm('你确定要删除此指标的映射吗', null, async () => {

        	let sData = '[Q]1053{' + row.object_id +'$`'+ row.meta_id + '}|^1|^SYS'
        	const res = await ExecSql(sData)
        	if (res > 0) {
            that.$baseMessage('映射删除成功', 'success')
        	} else {
        		that.$baseMessage('映射删除失败', 'error')
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
        this.fetchDataTemplate(that.templist)
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
        this.queryForm.pageNo = 1
				if (this.selectRow.object_id === '') {
					this.$baseMessage('请选中试验')
				} else {
					this.fetchDataChild(this.selectRowFile)
				}
			},
      async searchmap() {
        let that=this
        var childWindow = document.getElementById("myframe").contentWindow;
        console.log(childWindow)
        await childWindow.searchmap(that.metaname)
      },
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				if (this.selectRowFile.object_id === '') {
					this.$baseMessage('请选中试验','error')
				}
				else if(this.selectRowFile.id === '')
				{
				  this.$baseMessage('请先添加模板','error')
				} else {
					this.$refs['parameterDictionary'].showEdit(this.selectRowFile, '0')
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
				if (this.selectRow.object_id === '') {
					this.$baseMessage('请选中试验')
				} else {
					let arr = Object.keys(this.selectRowFile);
          console.log(this.selectRowFile.object_id)
					if (!this.selectRowFile.object_id) {
            console.log(this.selectRowFile.object_id)
						this.$refs['testTemplate'].showEdit(this.selectRow, '0')
					} else {
						this.$refs['testTemplate'].showEdit(this.selectRowFile, '1')
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
						this.$refs['testTemplate'].showEdit(this.templist, '2')
					} else {
						// this.$refs['parameterTemplate'].showEdit(this.template, '1')
					}
				}

			},
			handleTemplateDelete(row) {
				let that = this
				if (this.selectRowFile.object_id) {
				  this.$baseConfirm('你确定要删除此模板吗', null, async () => {
						let sData = '[Q]743{'+this.selectRowFile.id+'$`'+this.selectRowFile.object_id+'$`'+this.selectRowFile.template_version+'}|^1|^SYS'
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
              that.fetchDataChild(this.selectRowFile)
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
				this.fetchDataChild(this.selectRowFile)
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchDataChild(this.selectRowFile)
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
        let template_id
				console.log(row)

				if (row) {
          if(row.meta_id)
          {
            template_id=row.template_id
          }
          else {
            template_id=row.id
          }
					let sData = '[Q]499{' + template_id +  '$`%' + this.queryForm.meta_name +
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
        this.selectRow=row
        if(this.search.tpl_id!=='')
        {
          let sDataFile = '[Q]491{' + row.object_id +'$`'+this.search.tpl_id +'}|^SYS'
          const resFile = await QueryExec(sDataFile)
          console.log(sDataFile,resFile)
          if(resFile.data && resFile.data.length>0)
          {
            this.selectRowFile=resFile.data[0]
            let template_json = await getTestTemplateData(this.selectRowFile.id);
            this.selectRowFile.t_json = template_json
            this.loaded()
            this.fetchDataChild(this.selectRowFile)
          }
          else {
            this.selectRowFile={}
          }
        }
				else {
          this.$baseMessage('请选择行业', 'error')
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
          this.GetGroupEx()
					let sData;
					let form = Object.assign({}, this.queryForm)
					if (row) {
						form.parent_id = row.object_id
					} else {
						form.parent_id = '0'
					}
					sData = '[Q]243{' + form.parent_id + '$`%' + this.search.object_name + '%$`}|^SYS'

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
      				templateInfo: that.selectRowFile,
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

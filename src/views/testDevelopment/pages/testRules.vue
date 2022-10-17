<template>
  <!-- 判定规则 -->
	<div class="table-container definition2  purchase equipment equipment_btn parameterdictionary" style="overflow: auto;">
<!-- 		<vab-query-form class="template dictionary">
			<el-row :gutter="15">
				<el-col :span="19">
					<el-col :span="24">
					</el-col>
				</el-col>
			</el-row>
		</vab-query-form> -->
		<el-container class="colors" style="">
			<el-row :gutter="15" style="margin:0;height: calc(100vh - 118px);">
				<el-col :span="5" class="baseBox" style="padding:10px!important;">
          	<el-input v-model="search.param" placeholder="按试验名称搜索" prefix-icon="el-icon-search" style="margin-bottom: 10px;">
              <template #prepend>
              	<el-select v-model="search.tpl_name" style="width: 120px">
              		<el-option v-for="data in selectData.tpl_id" :key="data.key" :label="data.value"
              			:value="data.key">
              		</el-option>
              	</el-select>
              </template>
          		<template #append>
          			<el-button icon="el-icon-search" @click="paramsearch"></el-button>
          		</template>
          	</el-input>


        	<el-table ref="tableSort" :data="list" border :element-loading-text="elementLoadingText"
        		:height="height" row-key="object_id" highlight-current-row
        		:tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy tooltip-effect="dark"
        		:load="fetchDataEx" @row-click="handleRowClick">
            <el-table-column min-width="80%" align="left" show-overflow-tooltip label="试验" prop="object_name"></el-table-column>
<!--            <el-table-column min-width="20%">
              <template slot-scope="scope" >
                <el-dropdown trigger="click" placement="left-start">
                  <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                  <el-dropdown-menu slot="dropdown" class="more" >
                    <el-button>添加同级试验项目</el-button>
                    <el-button>添加子试验项目</el-button>
                    <el-button>修改试验项目</el-button>
                    <el-button>删除试验项目</el-button>
                    <el-button>试验项目详情</el-button>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column> -->
          </el-table>
          <el-pagination :background="background" :current-page="queryFormParam.pageNo" :layout="layoutParam"
          	:page-size="queryFormParam.pageSize" :total="totalparam" @current-change="handleCurrentChangeParam"
          	@size-change="handleSizeChangeParam">
          </el-pagination>
				</el-col>

<!--        <el-col :span="5">
					<el-table ref="tableSort" v-loading="listChildLoading" :data="listparam" border @row-click="handleRowClickParam"
						:element-loading-text="elementLoadingText" highlight-current-row :height="height"
						@selection-change="setSelectRows" @sort-change="tableSortChange"
						:header-cell-style="{ background: '#e8f0ff' }">
        		<el-table-column show-overflow-tooltip prop="item_name" label="参数名称" min-width="80%" align="left">
        		</el-table-column>
        		<el-table-column min-width="20%">

        			<template slot-scope="scope">
        				<el-dropdown trigger="click" placement="left-start">
        					<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
        					</el-button>
        					<el-dropdown-menu slot="dropdown" class="more">
        						<el-button>添加同级试验项目</el-button>
        						<el-button>添加子试验项目</el-button>
        						<el-button>修改试验项目</el-button>
        						<el-button>删除试验项目</el-button>
        						<el-button>试验项目详情</el-button>
        					</el-dropdown-menu>
        				</el-dropdown>
        			</template>
        		</el-table-column>
        	</el-table>
          <el-pagination :background="background" :current-page="queryFormParam.pageNo" :layout="layoutParam"
          	:page-size="queryFormParam.pageSize" :total="totalparam" @current-change="handleCurrentChangeParam"
          	@size-change="handleSizeChangeParam"></el-pagination>
        </el-col> -->

				<el-col :span="19" >
					<el-row>


						<el-col :span="24" class="baseBox" style="margin-bottom:10px;">

              <el-input style="margin-bottom: 10px;" v-model="queryForm.meta_name" placeholder="按指标名称搜索">
              	<template #append>
              		<el-button icon="el-icon-search" @click="meta_search"></el-button>
              	</template>
              </el-input>


							<el-table ref="tableSort" v-loading="listChildLoading" :data="listChild" border
								:element-loading-text="elementLoadingText" highlight-current-row :height="heightchild"
								@selection-change="setSelectRows" @sort-change="tableSortChange" @row-click="handleRowClickFile"
								:header-cell-style="{ background: '#e8f0ff' }">
								<el-table-column show-overflow-tooltip label="指标标识" prop="meta_id" align="center">
								</el-table-column>
								<el-table-column show-overflow-tooltip prop="meta_name" label="指标名称" min-width="100px">
								</el-table-column>
								<el-table-column show-overflow-tooltip prop="need_judge" label="是否自动计算" width="150px"
									align="center"></el-table-column>

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
           <!-- <el-col :span="24" style="margin: 10px 0 0 0;">

            </el-col> -->
            <el-col :span="24" class="baseBox">
              <div>
                <el-col :span="16" style="margin-bottom:10px;">
                  <el-button type="primary" @click="handleAdd()">添加判定规则</el-button>
                </el-col>
                <!-- <el-col :span="8" style="left:0!important;">
                  <el-input v-model="queryForm.meta_name" placeholder="按规则名称搜索">
                    <template #append>
                      <el-button icon="el-icon-search" @click="rule_search"></el-button>
                    </template>
                  </el-input>
                </el-col> -->
              </div>

            	<el-table ref="tableSort" v-loading="listChildFileLoading" :data="listChildFile" border
            		@row-click="" :element-loading-text="elementLoadingText"
            		highlight-current-row :height="heightchild" @selection-change="setSelectRows"
            		@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
            		<el-table-column show-overflow-tooltip label="标准值显示" prop="spec_hint">
            		</el-table-column>
                <el-table-column show-overflow-tooltip label="最小值或定值" prop="min_value">
                </el-table-column>
                <el-table-column show-overflow-tooltip label="最大值" prop="max_value">
                </el-table-column>
            		<el-table-column show-overflow-tooltip prop="compare_op" label="比较操作符">
            		</el-table-column>
                <el-table-column show-overflow-tooltip prop="condition" label="判定条件">
                </el-table-column>

            		<el-table-column show-overflow-tooltip label="操作" width="120px">
            			<template #default="{ row }">
            				<el-button type="primary" class="normal" @click="handleCriteriaEdit(row)">修改</el-button>
            				<el-button @click="handleCriteriaDelete(row)" class="danger">删除</el-button>
            			</template>
            		</el-table-column>
            	</el-table>
            	<el-pagination :background="background" :current-page="queryFormFile.pageNo"
            		:layout="layoutChild" :page-size="queryFormFile.pageSize" :total="totalFile"
            		@current-change="handleCurrentChangeRule" @size-change="handleSizeChangeRule"></el-pagination>
            </el-col>
					</el-row>

				</el-col>
			</el-row>
		</el-container>
		<parameterDictionary ref="parameterDictionary" @fetchDataChild="fetchDataChild"></parameterDictionary>
		<parameterTemplate ref="parameterTemplate" @fetchDataChildFile="fetchDataChildFile"></parameterTemplate>
    <criteria ref="criteria" @fetchDataChildFile="fetchDataChildFile"></criteria>
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
  	GetGroupDataCustomEx
  } from '@/utils/htmlDataGroup'
	import parameterDictionary from '../components/parameterDictionary.vue'
  import criteria from '../components/criteria.vue'
	import parameterTemplate from './../components/parameterTemplate'
	// import TableEdit2 from '../components/parameterDictionary2.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			parameterDictionary,
			parameterTemplate,
			treeData,
      criteria
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
        listparam: [],
				listChildFile: [],
				listChildLoading: true,
				layoutChild: 'total, sizes, prev, pager, next, jumper',
        layoutParam: 'total, sizes, jumper',
				total: 0,
        totalparam: 0,
				totalFile: 0,
				background: true,
				selectRows: '',
        object_id: '',
				elementLoadingText: '正在加载...',
				search: {
					param: '',
					tpl_name: '',
					enable_time_start: '',
					enable_time_end: '',
					enable: '1',
          object_name: ''
				},
				templist: {
					object_id: '',
          object_name: '',
          meta_name: '',
					meta_id: ''
				},
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
          tpl_id: []
        },
				listChildFileLoading: false,
				dialogFormVisible: false,
				multipleSelection: [],
				table: {
					tableHeight: this.$(window).height()
				},
				options: [{
					value1: '选项1',
					label: '请选择行业'
				}, {
					value1: '选项2',
					label: '铁路'
				}],
				value1: '选项1'
			}
		},
		computed: {
			height() {
				// return this.$baseTableHeight() * 1.2
        return 'calc(100vh - 224px)'//左侧第一个表格优化高度 2022/01/12 王玲慧
			},
			heightchild() {
				// return this.$baseTableHeight() * 0.5
        return this.$baseTableHeight() * 0.52
        // return this.height = 'calc(63vh)'
			}
		},
		created() {
			this.fetchDataEx()

		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			handleRowClick(row) {
        if(this.search.tpl_name=='')
        {
          this.$baseMessage('请选择行业')
        }
        else {
          this.templist.object_id = row.object_id
          this.templist.object_name = row.object_name
          this.templist.tpl_class = this.search.tpl_name
          this.fetchDataChild(row)
        }

			},
			handleRowClickFile(row) {
				this.templist.meta_id = row.meta_id
        this.templist.meta_name = row.meta_name
				this.fetchDataChildFile(row)
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
			},
			meta_search() {
				if (this.templist.object_id === '') {
					this.$baseMessage('请选中参数')
				} else {
					this.fetchDataChild(this.templist)
				}
			},
      rule_search() {
      	if (this.templist.meta_id === '') {
      		this.$baseMessage('请选中指标')
      	} else {
      		this.fetchDataChildFile(this.templist)
      	}
      },
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				if (this.templist.object_id === '' || this.templist.meta_id === '') {
					this.$baseMessage('请选中试验和指标')
				} else {
					this.$refs['criteria'].showEdit(this.templist, '0')
				}
			},

			handleMetaAdd(row) {
				// this.$refs['parameterDictionary'].showEdit(row, '0')
			},
			handleMetaEdit(row) {
				this.$refs['parameterDictionary'].showEdit(row, '1')
			},
      handleCriteriaEdit(row) {
        this.$refs['criteria'].showEdit(row, '1')
      },
      handleCriteriaDelete(row) {
        console.log(row)
      	let that = this
      	if (row.criteria_id) {
      		that.$baseConfirm('你确定要删除此判定规则吗', null, async () => {

      			let sData = '[Q]630{' + row.criteria_id + '}|^1|^SYS'
      			const res = await ExecSql(sData)
      			if (res > 0) {
      				that.fetchDataChildFile(row)
      				that.$baseMessage('指标删除成功', 'success')
      			} else {
      				that.$baseMessage('指标删除失败', 'error')
      			}
      		})
      	}
      },
      handleMetaDelete(row) {
        console.log(row)
      	let that = this
      	if (row.id) {
      		that.$baseConfirm('你确定要删除此指标吗', null, async () => {

      			let sData = '[Q]488{' + row.id + '}|^1|^SYS'
      			const res = await ExecSql(sData)
      			if (res > 0) {
      				that.fetchDataChild(row)
      				that.$baseMessage('指标删除成功', 'success')
      			} else {
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
      handleSizeChangeRule(val) {
      	this.queryFormFile.pageSize = val
      	this.fetchDataChildFile()
      },
      handleCurrentChangeRule(val) {
      	this.queryFormFile.pageNo = val
      	this.fetchDataChildFile()
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
			handleFileAdd() {
				if (this.templist.param_id === '') {
					this.$baseMessage('请选中参数')
				} else {
					this.$refs['parameterTemplate'].showEdit(this.templist, '0')
				}
			},
      async GetGroupEx() {
      	let list = [{
      		data: "tpl_id",
      		sqlcode: 241
      	}];
      	await GetGroupDataCustomEx(this, list)
      },
			async fetchDataChild(row) {
				this.listChildLoading = true
				console.log(row)
				if (row) {
          if(row.object_id)
          {
            this.object_id=row.object_id
          }
          else {
            row.object_id=this.object_id
          }
					let sData = '[Q]486{' + row.object_id + '$`%' + this.queryForm.meta_name +
						'%$`' + ((Number(this.queryForm.pageNo) - 1) * Number(this.queryForm.pageSize)).toString() +
						'$`' + this.queryForm.pageSize +'$`' + this.search.tpl_name + '}|^SYS'
					const res = await QueryExec(sData)
					console.log(sData,res)
					this.listChild = res.data
					this.total = res.total
				}
				setTimeout(() => {
					this.listChildLoading = false
				}, 500)
			},
			async fetchDataChildFile(row) {
        console.log(row)
				this.listChildFileLoading = true
				if (row) {

					let sDataFile = '[Q]487{' + this.templist.object_id + '$`' + this.templist.meta_id + '$`' + ((Number(this.queryFormFile.pageNo) - 1) *
							Number(this.queryFormFile.pageSize)).toString() + '$`' + this.queryFormFile.pageSize + '$`' + this.search.tpl_name +
						'}|^SYS'
					const resFile = await QueryExec(sDataFile)
					console.log(sDataFile,resFile)
					this.listChildFile = resFile.data
					this.totalFile = resFile.total
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
          this.GetGroupEx()
					if(row)
          {
            form.parent_id = row.object_id
          }
					else {
            form.parent_id = '0'
          }
					sData = '[Q]243{' + form.parent_id + '$`%' + this.search.object_name + '%$`}|^SYS'

					console.log(sData)
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
      async fetchDataParamEx(row) {
      	console.log(row)
      	this.listChildLoading = true
      	try {
      		let sData;
      		let form = Object.assign({}, this.queryForm)
          sData = '[Q]473{' + row.object_id + '}|^SYS'

      		const res = await QueryExec(sData)
      		this.listparam = res.data
          this.totalparam = res.total

      	} catch (e) {
      		console.log(e)
      	}
      	setTimeout(() => {
      		this.listChildLoading = false
      	}, 500)
      },

		},
	}
</script>
<style>

</style>

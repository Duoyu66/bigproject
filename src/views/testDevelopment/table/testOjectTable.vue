<template>
	<div>
		<el-table ref="tableSort"  v-loading="listLoading" :data="list" border
			:element-loading-text="elementLoadingText" :height="height" row-key="object_id" highlight-current-row
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy :load="fetchData"
			@row-click="rowClick" @selection-change="handleSelectionChange" @select="handleSelectionChange"
			v-if="table.isShow" :header-cell-style="{ background: '#e8f0ff' }">
			<el-table-column  type="selection" width="40" fixed="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="object_name" label="试验名称" v-if="hideColFob()"
				min-width="200px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="试验标识" prop="object_id" v-if="hideColFob('object_id')">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="试验父标识" prop="group_id" v-if="hideColFob('group_id')">
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
			<el-table-column show-overflow-tooltip label="操作流程" prop="workflow" min-width="200px"
				:formatter="workflow_formatter" v-if="hideColFob('workflow')"></el-table-column>
			<el-table-column show-overflow-tooltip label="版本" prop="version" width="70px" v-if="hideColFob('version')">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="试验类型" prop="has_entry_str" width="150px"
				v-if="hideColFob('has_entry_str')"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="60px" fixed="right" v-if="hideColFob('operation')">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start">
						<!-- <span class="el-dropdown-link">
		          下拉菜单<i class="el-icon-arrow-down el-icon-right"></i>
		    </span>-->
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown" class="more">
							<!-- <el-button>删除</el-button> -->
							<el-button @click="handleAddChildren(row)"
								v-if="row.group_id == '0'&&ishasPermission('add') ">添加子试验</el-button>
							<el-button @click="handleAddEqual(row)" v-if="ishasPermission('add')">添加同级试验</el-button>
							<el-button @click="edit(row)" v-if="ishasPermission('edit')">修改试验项目</el-button>
							<el-button @click="handleDelete(row)" v-if="!row.hasChildren&&ishasPermission('delete')">
								删除试验项目</el-button>
							<el-button @click="handleAddd()" v-if="ishasPermission('testObejctParamManage')">
								添加试验参数</el-button>
              <el-button @click="handleManageParam(row)" v-if="ishasPermission('testObejctParamManage')">
              	管理试验参数</el-button>
							<el-button @click="handleManageCommonParam(row)"
								v-if="ishasPermission('routineTestparameters')">管理机构常用参数
							</el-button>
							<el-button @click="handleStandardManage(row)"
								v-if="ishasPermission('testObjectStandraAdd')">
								添加评定依据
							</el-button>
              <el-button @click="handleStandardManage1(row)"
              	v-if="ishasPermission('testObjectStandraAdd')">
              	添加试验依据
              </el-button>
							<!-- <el-button @click="dialogFormVisible5=true">试验项目详情</el-button> -->
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-empty v-else :description="emptyConfigDescript"></el-empty>
		<testitemManage ref="edit"></testitemManage>
		<obejctParamRelationshipDialog ref="obejctParamRelationshipDialog" @reloadChildren="reloadChildren">
		</obejctParamRelationshipDialog>
		<testObjectStandardDialog ref="testObjectStandardDialog" @reloadChildren="reloadChildren">
		</testObjectStandardDialog>
    <table-edit ref="edit1"></table-edit>
	</div>
</template>

<script>
	import {
		TreeDataDealExGetData,
		TreeDataDealEx,
		TreeDataSecondary
	} from '@/global/tree_deal'

	import {
		treePaging
	} from '@/global/form.helper'
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'


	import testitemManage from '../components/testitemManage'

	import obejctParamRelationshipDialog from '../component/obejctParamRelationshipDialog'
	import testObjectStandardDialog from '../component/testObjectStandardDialog'
  import TableEdit from '../components/parameterManagement'
	export default {
		name: 'testOjectTable',
		components: {
			testitemManage,
			obejctParamRelationshipDialog,
			testObjectStandardDialog,
      TableEdit
		},
		props: {
			//1: 试验主表  22 常用试验参数  20 /试验参数映射 21 机构常用试验
			type: {
				type: Number,
				default: 0,
			},
			primary_key: {
				type: Number,
				default: 0,
			},
			permission: {
				type: Object,
				default: function() {
					return {}
				},
			},
			nextStatus: {
				type: String
			},
			status: {
				type: String,
				default: '0'
			}
		},
		provide() {
			return {
				objectReload: this.fetchData,
			}
		},
		computed: {
			...mapGetters({
				org_pid: 'user/org_pid',
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
			}),
			emptyConfigDescript() {
				return '加载中，如果加载时间太长请刷新重试'
			},
		},
		watch: {
			primary_key(newVal, oldVal) {
				if (this.type == 0) {
					this.fetchData({
						reload: 1,
					})
				}

			},
			main_dialog(newVal, oldVal) {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					object_id: -1
				}
				this.fetchData()
				setTimeout(function() {
					console.log('main_dialog setTimeout selectedRow', selectedRow)
					this.selectedRow = selectedRow
				}, 500)

			},
			current_org_id() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {
				if (newVal && newVal.object_id) {
					switch (this.type) {
						case 20:
						case 22:
						case 1:
							this.$emit('update:primary_key', Number(newVal.object_id));
							break
					}

				}

			},
		},
		data() {
			return {
				height: 'calc(80%)',
				main_dialog: false,

				formLabelWidth: '120px',
				list: [],
				tableDataCurrent: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectedRow: '',
				selectionRows: [],
				elementLoadingText: '正在加载...',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				table: {
					tableHeight: this.$(window).height(),
					isShow: false
				},
				columnHideList: ['selection'],
				getDataRelation: {
					sqlcodePading: 414,
					select_list: [{
								field: 'org_id',
								type: 3,
								level: 1,
							}, {
								field: 'group_id',
								type: 3,
								level: 2,
							},
							{
								field: 'object_name',
								type: 2,
								level: 3,
							}, {
								field: 'tpl_name',
								type: 2,
								level: 4,
							},
					]
				},
				getDataRelationConfig: {
					main: {
						sqlcodePading: 414,
						select_list: [{
								field: 'org_id',
								type: 3,
								level: 1,
							}, {
								field: 'group_id',
								type: 3,
								level: 2,
							},
							{
								field: 'object_name',
								type: 2,
								level: 3,
							}, {
								field: 'tpl_name',
								type: 2,
								level: 4,
							},
						]
					},
					objectRelation: {
						sqlcodePading: 414,
						select_list: [{
								field: 'org_id',
								type: 3,
								level: 1,
							}, {
								field: 'group_id',
								type: 3,
								level: 2,
							},
							{
								field: 'object_name',
								type: 2,
								level: 3,
							}, {
								field: 'tpl_name',
								type: 2,
								level: 4,
							},
						]
					},
					CommonParam: {
						sqlcodePading: 416,
						select_list: [{
								field: 'org_id',
								type: 3,
								level: 1,
							}, {
								field: 'group_id',
								type: 3,
								level: 2,
							},
							{
								field: 'object_name',
								type: 2,
								level: 3,
							}, {
								field: 'tpl_name',
								type: 2,
								level: 4,
							},
						]
					}
				},
				load: {
					status: {
						allComplete: false
					},
					pagination: {
						isDestory: false
					}
				},


			}
		},
		created() {
			this.init()
		},
		methods: {

			async init() {
				await this.GetDataGroup()
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 0: //未用到
						this.height = 'calc(80%)'
						this.columnHideList = ['selection']
						break
					case 1: //试验主表-试验配置--试验第一个表格高度控制
						this.columnHideList = ['selection']
						this.height = 'calc(64vh - 165px)'
						break
					case 22: //常用试验参数
					case 20: ///试验参数映射
						this.columnHideList = ['selection', 'object_id', 'group_id', 'repeat_rate', 'witness_rate',
							'auto_judge',
							'workflow', 'version', 'has_entry_str', 'operation'
						]
						this.height = 'calc(100vh - 185px)'
						break
					case 21: //机构常用试验  表格高度控制
						console.log('机构常用试验')
						this.columnHideList = ['operation']
						this.height = 'calc(100vh - 180px)'
						break
				}
			},
			async GetDataGroup() {
				// let list = [{
				// 	data: "post_mode",
				// 	group_id: 1019
				// }];
				// await GetGroupDataEx(this, list)
			},

			reloadChildren(row) {
				if (!row) {
					row = JSON.parse(JSON.stringify(this.selectedRow))
				}
				this.selectedRow = {
					object_id: -1
				}
				let that = this
				setTimeout(() => {
					that.selectedRow = row
				}, 500)
			},
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
			},
			async getOrgId() {
				let org_id = ''

				if (!this.role_max) {
					this.role_max = await this.$store.dispatch('user/getRoleMax')
				}
        console.log(this.current_org_id)
				switch (this.role_max) {
					case 'super_admin':
						org_id = this.current_org_id
						break;
					default:
						org_id = this.org_pid
						break
				}
				return org_id;
			},
			handleSelectionChange(val, row) {
				this.selectionRows = val
				if (row && this.load.status.allComplete) {
					let selected = val.length && val.indexOf(row) !== -1
					console.log(selected) // true就是选中，0或者false是取消选中
					let flag = false
					if (selected == true) {
						flag = true
					} else if (selected == false || selected == 0) {
						flag = false
					} else {
						flag = false
					}
					let opertion_type = 0;
					if (flag) {
						opertion_type = 0
					} else {
						opertion_type = 1
					}
					this.SelectionChangeDataBase(row, opertion_type)
				}
			},
			async SelectionChangeDataBase(row, opertion_type) {
				//opertion_type 0 选中【添加】 1 取消选中【删除】
				let sqlcode = 413
				let list = [{
						field: 'opertion_type',
						type: 3,
						level: 1,
					}, {
						field: 'org_id',
						type: 3,
						level: 2,
					},
					{
						field: 'object_id',
						type: 3,
						level: 3,
					}
				]
				let form = {
					org_id: await this.getOrgId(),
					opertion_type: opertion_type,
					object_id: row.object_id
				}
				let info = await this.objectRelationChange(sqlcode, list, form)
				this.SelectionChangeNotify(info[0], info[1]);
			},
			async objectRelationChange(sqlcode, list, form) {
				let msg = '更新';
				const {
					code,
					influence,
					data
				} = await this.QueryExec_fob(sqlcode, list, form)
				console.log(code, influence, data);
				if (code != 200) {
					return [false, msg + '失败']
				}
				if (!data || data.length == 0) {
					return [false, msg + '失败']
				}
				let json = JSON.parse(data[0].info)

				if (json.code > 0) {
					switch (json.code) {
						case 1:
							return [true, json.msg]
							break
						case 2:
							msg = json.msg
							break
						default:
							msg = json.msg
							break
					}
					return [false, msg]
				} else {
					msg = json.msg
					return [false, msg]
				}
			},
			SelectionChangeNotify(isSuccess, msg) {
				if (!msg) {
					if (isSuccess) {
						msg = '更新成功'
					} else {
						msg = '更新失败,请刷新重试'
					}
				}

				if (isSuccess) {
					this.$notify({
						title: '成功',
						message: msg,
						type: 'success'
					});
				} else {
					this.$notify.error({
						title: '错误',
						message: msg
					});
				}
			},
			GetHeight() {},
			//判断是否隐藏列，ture为不隐藏，false为隐藏
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
			ishasPermission(name, row) {
				let permission_name = ''
				switch (name) {
					case 'add':
						permission_name = 'testManage_add'
						break
					case 'edit':
						permission_name = 'testManage_edit'
						break

					case 'delete':
						permission_name = 'testManage_delete'
						break
					case 'testObjectStandraAdd':
						permission_name = 'testObjectStandraAdd'
						break
					case 'testObejctParamManage':
						permission_name = 'testObejctParamManage'
						break
					case 'routineTestparameters':
						permission_name = 'routineTestparameters'
						break
					default:
						permission_name = name
						break
				}
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					//flag = true
					//return flag
				}
				if (!flag) {
					return flag
				}
				switch (name) {

					case 'edit':
						flag = flag
						break
					default:
						flag = flag
						break;
				}
				return flag
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},
			search(data) {
				console.log('search', data)
				this.queryForm = Object.assign(data, this.queryForm)
				this.fetchData()
			},
			GetCurrentOrg() {
				if (this.current_org_id > 0) {
					return this.current_org_id
				}
				return this.org_id
			},

			tableSortChange() {

			},
			setSelectRows(val) {
				this.selectedRow = val
			},
			edit(row) {
				this.formShow(row)
			},
			handleAdd() {
				this.formShow(undefined, {
					group_id: '0',

				})
			},
			handleAddChildren(row) {
				this.formShow(undefined, {
					group_id: row.object_id,
					double_group_id: Object.assign({}, row).group_id
				})
			},
			handleAddEqual(row) {
				this.formShow(undefined, {
					group_id: row.group_id
				})
			},
			handleStandardManage(row) {
				this.$refs['testObjectStandardDialog'].showEdit(undefined, row)
			},
      handleStandardManage1(row) {
      	this.$refs['testObjectStandardDialog'].showEdit(undefined, row, '1')
      },
			handleManageParam(row) {
				this.$refs['obejctParamRelationshipDialog'].showEdit(row, {
					formType: 20
				})
			},
      handleAddd() {
      	this.$refs['edit1'].showEdit()
      },
			handleManageCommonParam(row) {
				this.$refs['obejctParamRelationshipDialog'].showEdit(row, {
					formType: 10
				})
			},
			formShow(row, info) {
				this.$refs['edit'].showEdit(row, info)
			},
			handleDelete(row) {
				if (row.object_id) {
					let that = this
					that.delete_from_fob(that, row, 244, {
						///fetchData: 'fetchData', //加载数据
						main_key: 'object_id', //主键
					}, function() {
						that.fetchData({
							object_id: row.group_id,
							type: '重载'
						})
					})
				}
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData()
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData()
			},
			handleQuery() {
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			updateDataRelation(key) {
				if (!this.getDataRelationConfig[key]) {
					return -1
				}
				let config = this.getDataRelationConfig[key]
				for (let key in config) {
					if (!config[key]) {
						continue
					}
					let type = typeof config[key]
					switch (type.toLowerCase()) {
						case 'object':
							this.getDataRelation[key] = JSON.parse(JSON.stringify(config[key]))
							break
						default:
							this.getDataRelation[key] = config[key]
							break
					}

				}
			},
			toggleSelection(rows) {
				if (!rows) {
					return;
				}
				let that = this
				rows.forEach(row => {
					that.$nextTick(() => {
						if (that.$refs.tableSort) {
							that.$refs.tableSort.toggleRowSelection(row)
						} else {
							let index = setInterval(() => {
								if (that.$refs.tableSort) {
									clearInterval(index)
									that.$refs.tableSort.toggleRowSelection(row)
								}
							})
						}
					})
				});
			},
			objectRelationSelect() {
				let data = this.tableDataCurrent
				let length = data.length
				let selectList = []

				for (let i = 0; i < length; i++) {
					try {
						let item = data[i]
						if (!item.hasNum) {
							continue
						}
						let hasNum = Number(item.hasNum)
						if (hasNum <= 0) {
							continue
						}
						selectList.push(item)
					} catch (e) {
						console.log(e)
					}

				}
				this.toggleSelection(selectList);
				this.load.status.allComplete = true
			},
			async fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 0:
						that.fetchData1(pageInfo, treeNode, resolve)

						break
					case 21:
						that.updateDataRelation('objectRelation')
						this.queryForm.org_id = await this.getOrgId()
            console.log(this.queryForm.org_id)
						await that.fetchDataEx(pageInfo, treeNode, resolve)
						this.objectRelationSelect()
						break
					case 22:

						that.updateDataRelation('CommonParam')
						this.queryForm.org_id = await this.getOrgId()
						await that.fetchDataEx(pageInfo, treeNode, resolve)
						break
					case 20:

					case 1:
						this.updateDataRelation('main')
            this.queryForm.org_id = await this.getOrgId()
						that.fetchDataEx(pageInfo, treeNode, resolve)
            this.objectRelationSelect()
						break
				}
				setTimeout(() => {
					this.$nextTick(() => {
						if (this.$refs.tableSort) {
							this.$refs.tableSort.doLayout()
						}

					})
				}, 300)
			},
			async fetchDataEx(row, treeNode, resolve) {
				//console.log(row, treeNode, resolve)
				this.listLoading = true
				try {
					let sqlcode = this.getDataRelation.sqlcodePading
          console.log(this.queryForm)
					let form = Object.assign({}, this.queryForm)
					if (row) {
						form.group_id = row.object_id
					} else {
						form.group_id = 0
					}
					if (resolve && (!this.resolve || !this.resolve[form.group_id])) {
						if (!this.resolve) {
							this.resolve = {}
						}
						this.resolve[form.group_id] = resolve
					}
					//person_info
					if (resolve) {} else if (this.resolve && this.resolve[form.group_id]) {} else if (row && row
						.info &&
						row.info.double_group_id) {
						form.group_id = row.info.double_group_id

					}
					let select_list = this.getDataRelation.select_list

					if (row) {

						const {
							data
						} = await this.QueryExec_fob(sqlcode, select_list, form, )
						for (let i = 0; i < data.length; i++) {
							if (Number(data[i].hasChildren) > 0) {
								data[i].hasChildren = true
							} else {
								data[i].hasChildren = false
							}
						}
						this.listLoading = false
						this.$set(this, 'tableDataCurrent', data)
						if (resolve) {
							console.log('resolve')
							resolve(data)
						} else if (this.resolve && this.resolve[form.group_id]) {
							console.log('this.resolve')
							this.$set(this.$refs.tableSort.store.states.lazyTreeNodeMap, form.group_id, []);
							this.resolve[form.group_id](data)
						} else if (form.group_id == 0) {
							this.list = data
							//this.tableDataTemp = JSON.parse(JSON.stringify(data))
							console.log('this.list')
							return
						}

					} else {
						const data = await TreeDataDealExGetData(
							sqlcode,
							select_list,
							form,
							0,
							'object_id',
							'group_id',
							'hasChildren'
						)
						this.$set(this, 'tableDataCurrent', data)
						this.list = data
					}
          console.log(sqlcode)
				} catch (e) {
					console.log(e)
				}
				this.listLoading = false
				if (!this.table.isShow) {
					this.table.isShow = true
				}
			},
			workflow_formatter(row, column) {
				let str = row.workflow
				let array_ = ['委托', '收样', '取样', '试验', '复核', '批准', '监理']
				let array = [];
				for (let i = 0; i < str.length; i++) {
					if (str[i] == '1') {
						array.push(array_[i])
					}
				}
				return array.join(',');
			}
		},
	}
</script>

<style>

</style>

<template>
	<div>
		<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist" border
			:element-loading-text="elementLoadingText" :height="GetTableHeight"
			:header-cell-style="{ background: '#e8f0ff' }" @sort-change="tableSortChange"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" @select-all="selectall"
			v-if="table.isShow">
			<el-table-column show-overflow-tooltip prop="store_name" label="标准物质名称" width="130px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="mat_name" label="类别"></el-table-column>
			<el-table-column show-overflow-tooltip prop="check_method" label="核查方式" width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="handler" label="核查人" width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="implementation_date" label="核查日期" width="140px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="result" label="结果"></el-table-column>
			<el-table-column show-overflow-tooltip prop="result_detailed" label="结果详情"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="70px" fixed="right" v-if="hideColFob('operation')">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start">
						<!-- <span class="el-dropdown-link">
					          下拉菜单<i class="el-icon-arrow-down el-icon-right"></i>
					    </span>-->
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown" class="more">
							<!-- <el-button>删除</el-button> -->
							<template v-for="item in dropdown.menu">
								<el-dropdown-item @click.native="handleCommand(item.command, row)"
									v-if="ishasPermission(item.permission_name,row) ">{{ item.label }}
								</el-dropdown-item>
							</template>
						</el-dropdown-menu>
					</el-dropdown>

					<!-- <el-button type="primary" class="normal" @click="handleEdit(row)"
						v-if="ishasPermission('edit',row)">
						修改
					</el-button>
					<el-button type="primary" class="normal" disabled v-else>
						修改
					</el-button>
					<el-button type="primary" class="normal" @click="handleCheck(row)"
						v-if="ishasPermission('edit',row)">
						执行校检
					</el-button>
					<el-button type="primary" class="normal" disabled v-else>
						执行校检
					</el-button>
					<el-button class="danger" @click="handleDelete(row)" v-if="ishasPermission('delete',row)">
						删除
					</el-button>
					<el-button class="danger" disabled v-else>
						删除
					</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<HistoryDialog ref="HistoryDialog" @reload="searchTable"></HistoryDialog>
		<HistoryShowDialog ref="HistoryShowDialog"></HistoryShowDialog>
	</div>
</template>

<script>
	import {
		Notify,
		dealRespond,
	} from '@/utils/respondDeal'
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
		handleSelectionChange,
		toggleSelectionList
	} from '@/utils/tableHelper'
	import {
		GetChemicalAlloc,
		GetOrgId,
		GetPersonRoleMax,
	} from '../commonJs/common.substanceCategory'
	import HistoryDialog from '../component/materiaExamineAndVerifyCheckHistoryDialog'
	import HistoryShowDialog from '../component/materiaExamineAndVerifyCheckHistoryShowDialog'
	export default {
		name: 'periodVerificationCheckHistoryTable',
		components: {
			HistoryDialog,
			HistoryShowDialog
		},
		props: {
			type: {
				type: String,
				default: 'rm_type',
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
			select_org_id: {
				type: String,
				default: '',
			}
		},
		provide() {
			return {
				reload: this.fetchData,
			}
		},
		computed: {
			...mapGetters({
				org_pid: 'user/org_pid',
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
			}),
			GetTableHeight() {
				let height = this.table.tableHeight;
				switch (this.type) {
					case 'periodVerificationHistory':
						if (this.$el && this.$el.offsetHeight > 0) {
							height = this.$el.offsetHeight - 45;
							return height + 'px'
						}
						break
					case 'chemical_store':
						height = this.table.tableHeight;
						return height
				}
			
				height = this.$baseTableHeight()
				return height + 'px'
			}
		},
		watch: {
			primary_key(newVal, oldVal) {
				switch (this.type) {
					case 'chemical_store':
					case 'periodVerificationHistory':
						this.fetchData({
							reload: 1,
						})
						break
				}

			},
			tableReload(newVal, oldVal) {
				this.fetchData({

				})
			},
			main_dialog(newVal, oldVal) {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					seal_id: -1
				}
				this.fetchData()
				setTimeout(function() {
					this.selectedRow = selectedRow
				}, 500)

			},
			current_org_id() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {
				if (newVal && newVal.seal_id) {
					this.$emit('update:primary_key', Number(newVal.seal_id));
				}

			},
			tablelist(newVal, oldVal) {
				if (newVal && newVal.length > 0) {
					this.$set(this.table, 'isShow', false)
					this.$nextTick(() => {
						this.$set(this.table, 'isShow', true)
					})
				}
			},
		},
		data() {
			return {
				dropdown: {
					menu: [{
							command: 'edithistory',
							permission_name: 'edithistory',
							label: '修改'
						},
						{
							command: 'showhistory',
							permission_name: 'showhistory',
							label: '查看核验记录'
						},
						{
							command: 'Delete',
							permission_name: 'delete',
							label: '删除'
						},

						{
							command: '',
							permission_name: 'empty',
							label: '无权限操作此行数据'
						}
					],
					count: {

					}
				},

				tableReload: false,
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				selectedRow: {},
				selectedRowList: {},
				elementLoadingText: '加载数据中',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
				},
				demotableexpand: {
					mainTable: [{
						field: 'doc_id',
						label: '收文编号',
						isShow: true,
					}]
				},
				layout: 'total, prev, next, jumper',
				total: 0,
				columnHideList: ['selection'],

				table: {
					tableHeight: 'calc(80%)',
					isShow: true,
				},

			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 'chemical_store':
						this.table.tableHeight = 'calc(72%)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 'periodVerificationHistory':
						this.columnHideList = ['selection']
						this.table.tableHeight = 'calc(93%)'
						this.fetchData()
						break
				}
			},
			async selectall(val) {
				this.selectedRowList = val
				let length = val.length
				let opertion_type = 1;
				let sqlcode = -1;
				let list = [];
				let form = {}
				if (length == 0) {
					opertion_type = 0
					val = this.tablelist
					length = val.length
				}
				let mat_id_list = []
				for (let i = 0; i < length; i++) {
					let item = val[i]
					if (item.mat_id) {
						mat_id_list.push(item.mat_id)
					}
				}
				switch (this.type) {
					case 'Rm_alloc': //子表显示勾选的试验参数
						sqlcode = 562
						list = [{
								field: 'opertion_type',
								type: 3,
								level: 1,
							}, {
								field: 'mat_id',
								type: 3,
								level: 2,
							},
							{
								field: 'org_id',
								type: 3,
								level: 3,
							}
						]
						form = {
							opertion_type: opertion_type,
							org_id: await this.getOrgId(),
							mat_id: mat_id_list.join(',')
						}
						break
				}
				if (sqlcode < 0) {
					return
				}
				let info = await dealRespond(sqlcode, list, form)
				Notify(this, info[0], info[1]);
			},
			handleSelectionChange(val, row) {
				if (!val || val.length == 0) {
					val = []
				}
				this.selectedRowList = val
				if (!row) {
					return false
				}

				if (this.listLoading) {
					return false
				}
				let select_stauts = handleSelectionChange(val, row)
				if (select_stauts.code != 200) {
					return false
				}
				let opertion_type = 0;
				if (select_stauts.data) {
					opertion_type = 0
				} else {
					opertion_type = 1
				}
				this.SelectionChangeDataBase(row, opertion_type)
			},
			async SelectionChangeDataBase(row, opertion_type) {
				//opertion_type 0 选中【添加】 1 取消选中【删除】
				let sqlcode = 561

				let list = [{
						field: 'opertion_type',
						type: 3,
						level: 1,
					}, {
						field: 'mat_id',
						type: 3,
						level: 2,
					},
					{
						field: 'org_id',
						type: 3,
						level: 3,
					}
				]
				switch (this.type) {
					case 'Rm_alloc': //子表显示勾选的试验参数
						sqlcode = 561
						list = [{
								field: 'opertion_type',
								type: 3,
								level: 1,
							}, {
								field: 'mat_id',
								type: 3,
								level: 2,
							},
							{
								field: 'org_id',
								type: 3,
								level: 3,
							}
						]
						break
				}
				let form = {
					opertion_type: opertion_type,
					org_id: await this.getOrgId(),
					mat_id: row.mat_id
				}
				let info = await dealRespond(sqlcode, list, form)
				Notify(this, info[0], info[1]);
			},
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
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
			handleCommand(command, row) {
				switch (command) {
					case 'addhistory':
						this.handleCheck(row)
						break
					case 'edithistory':
						this.handleCheckEdit(row)
						break
					case 'Delete':
						this.handleDelete(row)
						break
					case 'showhistory':
						this.handleCheckShow(row)
						break
				}
			},
			ishasPermission(name, row) {
				if (!name) {
					if (this.dropdown.count[row.store_id]) {
						this.dropdown.count[row.store_id]++
					} else {
						this.dropdown.count[row.store_id] = 1
					}
					return true
				}
				let permission_name = ''
				let permissionRegister = {
					periodVerificationHistory: {
						edithistory: 'PVHisotryEdit',
						delete: 'PVHisotryDelete',
						addhistory: 'PVHisotryAdd',
					},
					chemical_store: {
						edithistory: 'RMCalibrationEdit',
						delete: 'RMCalibrationDelete',
					},
				}
				switch (name) {

					default:
						if (permissionRegister[this.type] && permissionRegister[this.type][name]) {
							permission_name = permissionRegister[this.type][name]
						} else {
							permission_name = name
						}
						break
				}
				let flag = hasPermission(this.permission, permission_name);
				switch (name) {
					case 'showhistory':
						flag = true
						break
				}
				if (name == 'empty') {
					if (!this.dropdown.count[row.store_id]) {
						flag = true;
					}
				}
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					//flag = true
					//return flag
				}
				// case 'chemical_consumption':
				// case 'chemical_check':
				// case 'chemicalNullify':
				let dropdowMenu = {
					periodVerificationHistory: ['all'],
				}
				if (dropdowMenu[this.type]) {
					let menu_list = dropdowMenu[this.type];
					if (menu_list.indexOf('all') >= 0) {

					} else if (menu_list.indexOf(name) < 0) {
						flag = false
					}
				}
				if (row.org_id != this.org_pid) {
					switch (name) {
						case 'empty':
							break
						default:
							flag = false
							break
					}

				}
				if (!flag) {
					return flag
				}
				switch (name) {
					// case 'showhistory':
					// 	if (!row.history_id) {
					// 		flag = false
					// 	}
					// 	break
					// case 'addhistory':
					// 	if (row.history_id) {
					// 		flag = false
					// 	}
					// 	break
					// case 'edithistory':
					// 	if (!row.history_id) {
					// 		flag = false
					// 	}
					// 	break
					default:
						flag = flag
						break;
				}
				if (flag) {
					switch (name) {

						case 'empty':
							break
						default:
							if (this.dropdown.count[row.store_id]) {
								this.dropdown.count[row.store_id]++
							} else {
								this.dropdown.count[row.store_id] = 1
							}
							break
					}

				}

				return flag
			},
			getHideColist() {},
			tableSortChange() {},
			handleCheckShow(row) {
				this.$refs['HistoryShowDialog'].showEdit(row)
			},
			handleCheckEdit(row) {
				this.$refs['HistoryDialog'].showEdit(row)
			},
			handleCheck(row) {
				//implementation_date
				let array = ['handler', 'result', 'result_detailed', 'enclosure', 'remarks']
				let info = {
					store_name: row.store_name,
					check_id: row.check_id,
					mat_name: row.mat_name
				}
				let length = array.length
				let item = ''
				for (let i = 0; i < length; i++) {
					item = array[i]
					if (!info[item]) {
						info[item] = ''
					}

				}
				this.$refs['HistoryDialog'].showEdit(undefined, info)
			},
			handleEdit(row) {
				this.$refs['edit'].showEdit(row)
			},
			handleDelete(row) {
				const vue = this
				let tips = '此操作将永久删除' + row.handler + '在' + row.implementation_date + '执行的核查记录' + ', 是否继续?'
				let sqlcode = 595
				this.delete_from_fob(vue, row, sqlcode, {
					//"selectRows": "selectRows", //复选框选中数据
					"fetchData": "fetchData", //加载数据
					"main_key": "history_id", //主键
					'confirmMsg': tips,
					'successMsg': '删除成功',
					'fail': '删除失败',
				});

			},
			paginationHadle() {},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData({
					pageNo: val,
				})
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData({
					pageNo: this.queryForm.pageNo,
				})
			},
			searchTable() {
				this.fetchData({
					pageNo: this.queryForm.pageNo
				})
			},
			search(data) {
				if (data) {
					this.queryForm = Object.assign(data, this.queryForm)
				}
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			GetCurrentOrg() {
				if (this.current_org_id > 0) {
					return this.current_org_id
				}
				return this.org_id
			},
			toggleSelection() {
				let data = this.tablelist
				let length = data.length
				let selectList = []
				for (let i = 0; i < length; i++) {
					try {
						let item = data[i]

						if (!item.alloc_num) {
							continue
						}

						let hasNum = Number(item.alloc_num)
						if (hasNum <= 0) {
							continue
						}
						selectList.push(item)
					} catch (e) {
						console.log(e)
					}
				}
				toggleSelectionList(this, 'tableSort', selectList)
			},
			async fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 'periodVerificationHistory':
						await that.fetchDataperiodVerificationHistory(pageInfo, treeNode, resolve)
						break
					case 'chemical_store':
						await that.fetchDataStore(pageInfo, treeNode, resolve)
						break
				}
			},
			async getOrgId() {
				let org_id = ''
				if (this.select_org_id) {
					return this.select_org_id
				}
				org_id = await GetOrgId()
				return org_id;
			},
			async fetchDataperiodVerificationHistory(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'org_id',
						type: 3,
						level: 1
					},
					{
						field: 'plan_id',
						type: 3,
						level: 2
					},
					{
						field: 'store_name',
						type: 2,
						level: 3
					},
					{
						field: 'mat_name',
						type: 2,
						level: 4
					},
					{
						field: 'handler',
						type: 2,
						level: 5
					},
					{
						field: 'result',
						type: 2,
						level: 6
					},
					{
						field: 'result_detailed',
						type: 2,
						level: 7
					},
					{
						field: 'implementation_date_start',
						type: 3,
						level: 8
					},
					{
						field: 'implementation_date_end',
						type: 3,
						level: 9
					},
					{
						field: 'pageNo',
						type: 3,
						level: 10
					},
					{
						field: 'pageSize',
						type: 3,
						level: 11
					},
				]
				//this.queryForm.org_id = await this.getOrgId()
				this.queryForm.plan_id = this.primary_key
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 592, key_json)
			},
			async fetchDataStore(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'store_id',
						type: 3,
						level: 1
					},
					{
						field: 'pageNo',
						type: 3,
						level: 10
					},
					{
						field: 'pageSize',
						type: 3,
						level: 11
					},
				]
				//this.queryForm.org_id = await this.getOrgId()
				this.queryForm.store_id = this.primary_key
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 620, key_json)
			},
		},
	}
</script>

<style>

</style>

<template>
	<div>
		<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist" border
			:element-loading-text="elementLoadingText" :height="table.tableHeight"
			:header-cell-style="{ background: '#e8f0ff' }" @sort-change="tableSortChange"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" v-if="table.isShow"
			@row-click="rowClick">
			<el-table-column show-overflow-tooltip prop="manage_id" label="管理编号"></el-table-column>
			<el-table-column show-overflow-tooltip label="名称" prop="name" min-width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="mat_name" label="规格型号" v-if="hideColFob('mat_name')">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="quantity" label="数量"></el-table-column>
			<el-table-column show-overflow-tooltip label="保管人" prop="keeper" v-if="hideColFob('keeper')">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="单位" prop="unit" v-if="hideColFob('unit')"></el-table-column>
			<el-table-column show-overflow-tooltip label="用途" prop="usage" v-if="hideColFob('usage')"></el-table-column>
			<el-table-column show-overflow-tooltip label="存放地" prop="position" v-if="hideColFob('position')">
			</el-table-column>
	
			<el-table-column show-overflow-tooltip label="操作" width="60px" fixed="right" v-if="hideColFob('operation')">
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
							<!-- <el-button @click="handleEidtStore(row)" v-if="ishasPermission('edit',row) ">修改库存
							</el-button>
							<el-button @click="handleBuy(row)" v-if="ishasPermission('buy',row) ">添加购入记录
							</el-button>
							<el-button @click="handleAddNullify(row)" v-if="ishasPermission('nullify',row) ">添加作废记录
							</el-button>
							<el-button @click="handleChemicalChecky(row)"
								v-if="ishasPermission('chemicalCheckAdd',row) ">
								添加盘库记录
							</el-button>
							<el-button @click="handleConsumeAdd(row)" v-if="ishasPermission('chemicalConsumeAdd',row) ">
								添加消耗记录
							</el-button>
							<el-button @click="handleDelete(row)" v-if="ishasPermission('delete',row) ">
								删除
							</el-button> -->
							<!-- <el-button @click="dialogFormVisible5=true">试验项目详情</el-button> -->
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<materiaNullifyDialog ref="materiaNullifyDialog" @reloadChildren="reloadChildren" @reload="searchTable"></materiaNullifyDialog>
		<rmCheckDialog ref="rmCheckDialog" @reloadChildren="reloadChildren" @reload="searchTable"></rmCheckDialog>
		<materialConsumeDialog ref="materialConsumeDialog" @reloadChildren="reloadChildren" @reload="searchTable"></materialConsumeDialog>
		<RmBuyEdit ref="RmBuyEdit" @reloadChildren="reloadChildren" @reload="searchTable"></RmBuyEdit>
		<rmStoreDialog ref="rmStoreDialog" @reload="searchTable"></rmStoreDialog>
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
		GetOrgId,
		GetCurrentOrgId,
		GetPersonRoleMax,
		getOrgNameByselect,
		GetPersonList,
		file_about
	} from '../commonJs/common.substanceCategory'

	import materiaNullifyDialog from '../component/materiaNullifyDialog'
	import materialConsumeDialog from '../component/materialConsumeDialog'
	import RmBuyEdit from '../component/materialPurchaseDialog.vue'
	import rmStoreDialog from '../component/rmStoreDialog'


	import rmCheckDialog from '../component/rmCheckDialog'
	export default {
		name: 'chemicalStoreTable',
		components: {
			RmBuyEdit,
			materiaNullifyDialog,
			rmCheckDialog,
			materialConsumeDialog,
			rmStoreDialog,
		},
		props: {
			type: {
				type: String,
				default: 'chemical_type',
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
		},
		watch: {
			primary_key(newVal, oldVal) {
				if (this.type == 0) {
					this.fetchData({
						reload: 1,
					})
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
				if (newVal && newVal.store_id) {
					switch (this.type) {
						case 'RmStoreTable':
							this.$emit('update:primary_key', Number(newVal.store_id));
							break
					}

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
							command: 'EidtStore',
							permission_name: 'edit',
							label: '修改库存'
						},
						{
							command: 'Buy',
							permission_name: 'buy',
							label: '添加购入记录'
						},
						{
							command: 'AddNullify',
							permission_name: 'nullify',
							label: '添加作废记录'
						},
						{
							command: 'ChemicalChecky',
							permission_name: 'chemicalCheckAdd',
							label: '添加盘库记录'
						},
						{
							command: 'ConsumeAdd',
							permission_name: 'chemicalConsumeAdd',
							label: '添加消耗记录'
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
				layout: 'total, sizes, prev, pager, next, jumper',
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
					case 0:
						this.table.tableHeight = 'calc(27vh)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 'RmStoreTable':
						this.table.tableHeight = 'calc(85%)'
						this.fetchData()
						break
					case 'chemical_consumption':
					case 'chemical_check':
					case 'chemicalNullify':
					case 'chemical_left':
						this.columnHideList = ['model', 'quantity', 'keeper', 'usage', 'unit', 'storage_place',
							'danger'
						]
						this.layout = 'total,prev,next,jumper'
						this.table.tableHeight = 'calc(93%)'
						this.fetchData()
						break
				}
			},
			handleCommand(command, row) {
				switch (command) {
					case 'EidtStore':
						this.handleEidtStore(row)
						break
					case 'Buy':
						this.handleBuy(row)
						break
					case 'AddNullify':
						this.handleAddNullify(row)
						break
					case 'ConsumeAdd':
						this.handleConsumeAdd(row)
						break
					case 'ChemicalChecky':
						this.handleChemicalChecky(row)
						break
					case 'Delete':
						this.handleDelete(row)
						break
				}
			},
			handleBuy(row) {
				let info = {
					rm_store_name: row.name,
					store_id: row.store_id,
					mat_id: row.mat_id,
					org_id: row.org_id
				}
				this.$refs['RmBuyEdit'].showEdit(undefined, info);
			},
			handleEidtStore(row) {
				this.$refs['rmStoreDialog'].showEdit(row);
			},
			handleAddNullify(row) {
				this.$refs['materiaNullifyDialog'].showEdit(undefined, row);
			},
			handleChemicalChecky(row) {
				let info = {
					store_name: row.name,
					store_id: row.store_id,
					mat_id: row.mat_id,
					org_id: row.org_id
				}
				this.$refs['rmCheckDialog'].showEdit(undefined, info);
			},
			handleConsumeAdd(row) {
				let info = {
					rm_store_name: row.name,
					store_id: row.store_id,
					mat_id: row.mat_id,
					org_id: row.org_id
				}
				this.$refs['materialConsumeDialog'].showEdit(undefined, info);
			},
			handleSelectionChange(val, row) {

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
					RmStoreTable: {
						edit: 'materialStoreEdit',
						delete: 'materialStoreDelete',
						buy: 'materialBuyAdd',
						nullify: 'materialNullifyAdd',
						chemicalCheckAdd: 'materialCheckAdd',
						chemicalConsumeAdd: 'materialConsumeAdd'
					}
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
				let flag = hasPermission(this.permission, permission_name)
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
					RmStoreTable: ['all'],
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
			handleDelete(row) {
				const vue = this
				let sqlcode = 623
				let tips = '确定删除？'
				this.$confirm('此操作将永久删除该标准物质[' + row.name + ']的所有记录，包括购入、消耗、盘点等, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
					.then(async () => {
						this.delete_from_fob(vue, row, sqlcode, {
							//"selectRows": "selectRows", //复选框选中数据
							"fetchData": "fetchData", //加载数据
							"main_key": "store_id", //主键
							'confirmMsg': tips,
							'successMsg': '删除成功',
						});
					})
					.catch(() => {

					})
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
			reloadChildren(row) {
				if (!row) {
					row = JSON.parse(JSON.stringify(this.selectedRow))
				}
				this.selectedRow = {
					store_id: -1
				}
				let that = this
				setTimeout(() => {
					that.selectedRow = row
				}, 500)
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
			async getOrgId() {
				let org_id = ''
				if (this.select_org_id) {
					return this.select_org_id
				}
				org_id = await GetCurrentOrgId()
				return org_id
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
					case 'RmStoreTable':
						await that.fetchDataMain(pageInfo, treeNode, resolve)
						break
					case 'chemical_consumption':
					case 'chemical_check':
					case 'chemicalNullify':
					case 'chemical_left':
						await that.fetchDataChemicaLeft(pageInfo, treeNode, resolve)
						break
					case 1:
						break
				}
			},
			async fetchDataMain(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'mat_name',
						type: 2,
						level: 1,
					}, {
						field: 'store_name',
						type: 2,
						level: 2,
					},
					{
						field: 'keeper',
						type: 2,
						level: 3,
					},
					{
						field: 'storage_place',
						type: 2,
						level: 4,
					},
					{
						field: 'usage',
						type: 2,
						level: 5,
					},
					{
						field: 'org_id',
						type: 3,
						level: 6,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 7,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 8,
					},
				]
				this.queryForm.org_id = await this.getOrgId()
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 612, key_json)
			},
			async fetchDataChemicaLeft(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'name',
						type: 2,
						level: 1,
					}, {
						field: 'org_id',
						type: 3,
						level: 2,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 3,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 4,
					},
				]
				this.queryForm.org_id = await this.getOrgId()
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 534, key_json)
			}
		},
	}
</script>

<style>

</style>

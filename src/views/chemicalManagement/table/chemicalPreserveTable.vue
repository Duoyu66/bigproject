<template>
  <!-- 化学品品种维护表格 -->
	<div class="heightControl">
		<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist" border
			:element-loading-text="elementLoadingText" :height="table.tableHeight"
			:header-cell-style="{ background: '#e8f0ff' }" @sort-change="tableSortChange"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" @select-all="selectall"
			v-if="table.isShow">
			<el-table-column type="selection" width="40" fixed="left" v-if="hideColFob('selection')">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="化学品管理编码" prop="chemical_id"></el-table-column>
			<el-table-column show-overflow-tooltip prop="name" label="化学品名称"></el-table-column>
			<el-table-column show-overflow-tooltip label="化学品规格" prop="model"></el-table-column>
			<el-table-column show-overflow-tooltip label="计量单位" prop="unit"></el-table-column>
			<el-table-column show-overflow-tooltip label="是危险品">
				<template #default="{ row }">
					<el-switch v-if="row.danger == 1" value="true" active-value="true" disabled></el-switch>
					<el-switch v-else value="false" active-value="true" disabled></el-switch>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="120px" v-if="hideColFob('operation')">
				<template #default="{ row }">
					<el-button type="primary" class="normal" @click="handleEdit(row)"
						v-if="ishasPermission('chemicalPreserveedit')">
						修改
					</el-button>
					<el-button type="primary" class="normal" disabled v-else>
						修改
					</el-button>
					<el-button class="danger" @click="handleDelete(row.chemical_id)"
						v-if="ishasPermission('chemicalPreserveDelete')">
						删除
					</el-button>
					<el-button class="danger" disabled v-else>
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<table-edit ref="edit" @reload="searchTable"></table-edit>
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

	import TableEdit from '../component/chemicalPreserve.vue'
	export default {
		name: 'chemicalPreserveTable',
		components: {
			TableEdit
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
						this.table.tableHeight = 'calc(80%)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 'chemical_type':
						this.columnHideList = ['selection']
						this.table.tableHeight = 'calc(95%)'
						this.fetchData()
						break
					case 'chemical_alloc':
						this.columnHideList = ['operation']
						this.table.tableHeight = 'calc(95%)'
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
				let chemical_id_list = []
				for (let i = 0; i < length; i++) {
					let item = val[i]
					if (item.chemical_id) {
						chemical_id_list.push(item.chemical_id)
					}
				}
				switch (this.type) {
					case 'chemical_alloc': //子表显示勾选的试验参数
						sqlcode = 522
						list = [{
								field: 'opertion_type',
								type: 3,
								level: 1,
							}, {
								field: 'chemical_id',
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
							chemical_id: chemical_id_list.join(',')
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
				let sqlcode = 410

				let list = [{
						field: 'opertion_type',
						type: 3,
						level: 1,
					}, {
						field: 'object_id',
						type: 3,
						level: 2,
					},
					{
						field: 'param_id',
						type: 3,
						level: 3,
					}
				]
				switch (this.type) {
					case 'chemical_alloc': //子表显示勾选的试验参数
						sqlcode = 521
						list = [{
								field: 'opertion_type',
								type: 3,
								level: 1,
							}, {
								field: 'chemical_id',
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
					chemical_id: row.chemical_id
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
			ishasPermission(name, row) {
				let permission_name = ''
				switch (name) {

					default:
						permission_name = name
						break
				}
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

					default:
						flag = flag
						break;
				}
				return flag
			},
			getHideColist() {},
			tableSortChange() {},
			handleEdit(row) {
				this.$refs['edit'].showEdit(row)
			},
			handleDelete(rowid) {
				const vue = this
				this.$confirm('此操作将永久删除该条目' + rowid + ', 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
					.then(async () => {
						let _list = [{
							field: 'chemical_id',
							type: 4,
							level: 1
						}]
						let _field = {
							chemical_id: rowid
						}
						let res = await this.delete_fob(vue, _list, _field, 61)
						if (res.status == 200) {
							vue.fetchData()
						}
					})
					.catch(async () => {

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
					case 'chemical_type':
						await that.fetchDataChemicaType(pageInfo, treeNode, resolve)

						break
					case 'chemical_alloc':
						await that.fetchDataChemicaAlloc(pageInfo, treeNode, resolve)
						this.toggleSelection()
						break
					case 1:
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async getOrgId() {
				let org_id = ''
				if (this.select_org_id) {
					return this.select_org_id
				}
				if (!this.role_max) {
					this.role_max = await this.$store.dispatch('user/getRoleMax')
				}
				switch (this.role_max) {
					case 'super_admin':
						org_id = this.$store.getters['org/current_org']
						break;
					default:
						org_id = this.$store.getters['user/org_pid']
						break
				}

				return org_id;
			},
			async fetchDataChemicaType(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'title',
						type: 2,
						level: 1,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 2,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 3,
					},
				]
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 58, key_json)
			},
			async fetchDataChemicaAlloc(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'title',
						type: 2,
						level: 2,
					},
					{
						field: 'chemical_id',
						type: 2,
						level: 3,
					},
					{
						field: 'model',
						type: 2,
						level: 4,
					},
					{
						field: 'unit',
						type: 2,
						level: 5,
					},
					{
						field: 'alloc_num',
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
				await this.search_fob(alist, this, 520, key_json)
			}
		},
	}
</script>

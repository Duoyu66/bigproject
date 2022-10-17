<template>
	<div>
		<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist" border
			:element-loading-text="elementLoadingText" :height="table.tableHeight"
			:header-cell-style="{ background: '#e8f0ff' }" @sort-change="tableSortChange"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" v-if="table.isShow"
			@row-click="rowClick">
			<el-table-column show-overflow-tooltip label="盘点日期" prop="check_date" width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="系统库存" prop="sys_quantity"></el-table-column>
			<el-table-column show-overflow-tooltip label="实际库存" prop="actual_quantity"></el-table-column>
			<el-table-column show-overflow-tooltip label="相差数量" prop="diff_quantity"></el-table-column>
			<el-table-column show-overflow-tooltip prop="check_type" label="状态"></el-table-column>
			<el-table-column show-overflow-tooltip label="盘点人" prop="check_person"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="180px"></el-table-column>

			<el-table-column show-overflow-tooltip label="操作" width="120px" fixed="right"
				v-if="hideColFob('operation')">
				<template #default="{ row }">
					<el-button type="primary" class="normal" @click="handleEdit(row)"
						v-if="ishasPermission('edit',row)">
						修改
					</el-button>
					<el-button type="primary" class="normal" disabled v-else>
						修改
					</el-button>
					<el-button class="danger" @click="handleDelete(row)" v-if="ishasPermission('delete',row)">
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
		<rmCheckDialog ref="rmCheckDialog" @reload="searchTable"></rmCheckDialog>
	</div>
</template>

<script>
	import {
		Notify,
		dealRespond,
	} from '@/utils/respondDeal'


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
		GetRmAlloc,
		GetOrgId,
		GetCurrentOrgId,
		GetPersonRoleMax,
		getOrgNameByselect,
		GetPersonList,
		file_about,
		GetRmStore
	} from '../commonJs/common.substanceCategory'
	import rmCheckDialog from '../component/rmCheckDialog'
	export default {
		name: 'rmCheckTable',
		components: {
			rmCheckDialog
		},
		props: {
			type: {
				type: String,
				default: 'main',
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
				switch (this.type) {
					case 'chemical_store':
					case 'main':
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
				if (newVal && newVal.store_id) {
					switch (this.type) {
						case 'chemical_left':
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
					case 'chemical_store':
						this.table.tableHeight = 'calc(72%)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 'main':
						this.columnHideList = []
						this.layout = 'total, sizes, prev, pager, next, jumper';
						this.table.tableHeight = 'calc(93%)'
						this.fetchData()
						break
				}
			},
			handleAddNullify() {

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
				let permission_name = ''
				let permissionRegister = {
					main: {
						add: 'chemicalInventoryAdd',
						edit: 'chemicalInventoryEdit',
						delete: 'chemicalInventoryDelete',
					},
					chemical_store: {
						add: 'materialCheckAdd',
						edit: 'materialCheckEdit',
						delete: 'materialCheckDelete',
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
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					//flag = true
					//return flag
				}
				if (row.org_id != this.org_pid) {
					flag = false
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
				this.$refs['rmCheckDialog'].showEdit(row)
			},
			handleDelete(row) {
				let sqlcode = 622;
				let tips = '确定删除日期：' + row.check_date + '盘点人' + row.check_person + '的盘点记录？'
				let that = this
				this.$baseConfirm(tips, '提示', async () => {
						tips = '删除时是否修改库存记录？'
						this.$baseConfirm(tips, '提示', async () => {
								delete_fob(1)
							},
							function() {
								delete_fob(2)
							})
					},
					function() {

					})

				async function delete_fob(isEditStore) {
					let field = {
						isEditStore: isEditStore,
						check_id: row.check_id
					}
					let list = [{
						field: 'check_id',
						level: 1,
					}, {
						field: 'isEditStore',
						level: 2,
					}]
					let {
						status
					} = await that.delete_fob(that, list, field, sqlcode)
					if (status == 200) {
						that.fetchData({
							pageNo: that.queryForm.pageNo,
						})
					}
				}
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
					case 'chemical_store':
					case 'main':
						await that.fetchDataMain(pageInfo, treeNode, resolve)
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
				org_id = await GetCurrentOrgId()
				return org_id
			},

			async fetchDataMain(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'store_id',
						type: 3,
						level: 1,
					}, {
						field: 'check_person',
						type: 2,
						level: 2,
					}, {
						field: 'check_date_start',
						type: 3,
						level: 3,
					}, {
						field: 'check_date_end',
						type: 3,
						level: 4,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 5,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 6,
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
				await this.search_fob(alist, this, 621, key_json)
			}
		},
	}
</script>

<style>

</style>

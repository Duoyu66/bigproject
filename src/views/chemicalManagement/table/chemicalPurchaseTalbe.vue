<template>
	<div>
		<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist" border
			:element-loading-text="elementLoadingText" :height="table.tableHeight"
			:header-cell-style="{ background: '#e8f0ff' }" @sort-change="tableSortChange"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" v-if="table.isShow">
			<el-table-column show-overflow-tooltip label="名称" prop="name"></el-table-column>
			<el-table-column show-overflow-tooltip prop="model" label="规格型号"></el-table-column>
			<el-table-column show-overflow-tooltip label="采购日期" prop="buy_date"></el-table-column>
			<el-table-column show-overflow-tooltip label="有效期至" prop="val_date"></el-table-column>
			<el-table-column show-overflow-tooltip prop="quantity" label="数量"></el-table-column>
			<el-table-column show-overflow-tooltip label="生产厂家" prop="factory"></el-table-column>
			<el-table-column show-overflow-tooltip label="价格" prop="price"></el-table-column>
			<el-table-column show-overflow-tooltip label="购买人" prop="buyer"></el-table-column>
			<el-table-column show-overflow-tooltip label="主要成分" prop="element"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="120px" v-if="hideColFob('operation')"
				fixed="right">
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
		<ChemicalBuyEdit ref="ChemicalBuyEdit" @reload="searchTable"></ChemicalBuyEdit>
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
		GetCurrentOrgId,
		GetPersonRoleMax,
		getOrgNameByselect,
		GetPersonList,
		file_about,
		GetChemicalStore
	} from '../commonjs/common.chemical'

	import ChemicalBuyEdit from '../components/chemicalPurchase.vue'
	export default {
		name: 'chemicalPurchaseTalbe',
		components: {
			ChemicalBuyEdit
		},
		props: {
			type: {
				type: String,
				default: 'chemical_purchase',
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
				switch (this.type) {
					case 'chemical_purchase':
						if (newVal && newVal.seal_id) {
							this.$emit('update:primary_key', Number(newVal.seal_id));
						}
						break
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
						this.table.tableHeight = 'calc(100vh - 262px)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 'chemical_purchase':
						this.columnHideList = []
						this.table.tableHeight = 'calc(100vh - 262px)'
						this.fetchData()
						break
				}
			},

			handleSelectionChange(val, row) {
				if (!val || val.length == 0) {
					val = []
				}
				this.selectedRowList = val
				if (!row) {
					return false
				}


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
			ishasPermission(name, row, e) {
				let permission_name = ''
				let permissionRegister = {
					chemical_purchase: {
						add: 'chemical_buy_add',
						edit: 'chemical_buy_edit',
						delete: 'chemical_buy_delete',
					},
					chemical_store: {
						edit: 'chemicaBuyEdit',
						delete: 'chemicaBuyDelete',
					}
				}
				switch (name) {
					// case 'add':
					// 	permission_name = 'chemical_buy_add'
					// 	break
					// case 'edit':
					// 	permission_name = 'chemical_buy_edit'
					// 	break
					// case 'delete':
					// 	permission_name = 'chemical_buy_delete'
					// 	break
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
				this.$refs['ChemicalBuyEdit'].showEdit(row)
			},
			async handleDelete(row) {
				let sqlcode = -1;
				let tips = ''
				switch (this.type) {
					case 'chemical_store':
					case 'chemical_purchase':
						sqlcode = 533;
						let list = await GetChemicalStore(await GetOrgId(), row.chemical_id)
						if (list && list.length > 0) {
							let item = list[0]
							if (parseFloat(item.quantity) - parseFloat(row.quantity) < 0) {
								this.$baseMessage('无法删除，删除后库存将小于0', 'error')
								return
							}
						}
						tips = '确定删除日期：' + row.buy_date + ' 化学品名称：' + row.name + ' 购买人：' + row.buyer + '的购入记录？'
						break
					case 10:

						break
					case 11:

						break
				}
				if (sqlcode < 0) {
					return
				}
				this.delete_from_fob(this, row, sqlcode, {
					//"selectRows": "selectRows", //复选框选中数据
					"fetchData": "fetchData", //加载数据
					"main_key": "buy_id", //主键
					'confirmMsg': tips
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
					case 'chemical_store':
						await that.fetchDataChemicaStroe(pageInfo, treeNode, resolve)
						break
					case 'chemical_purchase':
						await that.fetchDataChemicaPurchase(pageInfo, treeNode, resolve)
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
			async fetchDataChemicaStroe(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'store_id',
						type: 3,
						level: 1,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 8,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 9,
					},
				]
				this.queryForm.store_id = this.primary_key
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 554, key_json)
			},
			async fetchDataChemicaPurchase(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'chemical_name',
						type: 2,
						level: 1,
					}, {
						field: 'model',
						type: 2,
						level: 2,
					},
					{
						field: 'buy_date_start',
						type: 3,
						level: 3,
					},
					{
						field: 'buy_date_end',
						type: 3,
						level: 4,
					},
					{
						field: 'factory',
						type: 2,
						level: 5,
					},
					{
						field: 'buyer',
						type: 2,
						level: 6,
					},
					{
						field: 'org_id',
						type: 3,
						level: 7,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 8,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 9,
					},
				]
				this.queryForm.org_id = await this.getOrgId()
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 530, key_json)
			}
		},
	}
</script>

<style>

</style>

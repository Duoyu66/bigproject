<template>
	<div>
		<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist" border
			:element-loading-text="elementLoadingText" :height="table.tableHeight"
			:header-cell-style="{ background: '#e8f0ff' }" @sort-change="tableSortChange"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" v-if="table.isShow">
			<el-table-column show-overflow-tooltip label="操作人" prop="operator" width="65px" header-align="center"
				align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="动作" prop="operation" width="200px" header-align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="时间" prop="operation_time" width="200px" header-align="center"
				align="center">
				<template slot-scope="scope">
					<el-tag type="success">{{scope.row.operation_time}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="意见" prop="opinion" width="200px"></el-table-column>
			<el-table-column label="附件" prop="enclosure" min-width="200px" header-align="center">
				<template slot-scope="scope">
					<FileShowAndDownLoad v-show="scope.row.enclosure" :src="scope.row.enclosure"
						:fileName="scope.row.enclosure_name" :fileTypeUrl="file_upload_type" :maxShowChar="16">
					</FileShowAndDownLoad>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="备注" prop="remarks" width="200px" header-align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="60px" fixed="right" header-align="center"
				align="center" v-if="false">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown" class="more">
							<template v-for="item in dropdown.menu">
								<el-dropdown-item v-if="ishasPermission(item.permission_name,row)"
									@click.native="handleCommand(item.command, row)" :icon="item.icon ?item.icon:''">
									{{ item.label }}
								</el-dropdown-item>
							</template>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
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
		file_upload_type,
		type_str,
		type_array,
		GetOrgId,
		GetCurrentOrgId
	} from '../common/common.js'


	import FileShowAndDownLoad from '@/components/fileAbout/FileShowAndDownLoad'
	export default {
		name: 'GeophysicalProspectingReportTable',
		components: {
			FileShowAndDownLoad
		},
		props: {
			type: {
				type: String,
				default: 'report_main',
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
					case 'history_main':
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
					case 'report_main':
						if (newVal && newVal.report_id) {
							this.$emit('update:primary_key', Number(newVal.report_id));
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
				file_upload_type: file_upload_type,
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
				dropdown: {
					menu: [{
							command: 'details',
							permission_name: 'details',
							label: '详情'
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
			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 'history_main':
						this.columnHideList = []
						this.table.tableHeight = 'calc(80%)'
						if (this.primary_key > 0) {
							this.fetchData();
						}
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
					report_main: {
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
					if (name != 'empty') {
						flag = true
					}

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
			handleCommand(command, row) {
				switch (command) {
					case 'editReport':
						this.handleEdit(row)
						break
					case 'review':
						this.GeoReportReview(row)
						break
					case 'examine':
						this.GeoReportExamine(row)
						break
					case 'approve':
						this.GeoReportApprove(row)
						break
					case 'ChemicalChecky':
						this.handleChemicalChecky(row)
						break
					case 'Delete':
						this.handleDelete(row)
						break
					default:
						break;
				}
			},
			GeoReportApprove(row) {
				this.$refs['GeoReportApproveDialog'].showEdit(undefined, row);
			},
			GeoReportExamine(row) {
				this.$refs['GeoReportExamineDialog'].showEdit(undefined, row);
			},
			GeoReportReview(row) {
				this.$refs['GeoReportReviewDialog'].showEdit(undefined, row);
			},
			getHideColist() {},
			tableSortChange() {},
			handleEdit(row) {
				this.$refs['GeophysicalProspectingReportAdd'].showEdit(row)
			},
			
			async handleDelete(row) {
				let sqlcode = -1;
				let tips = ''
				switch (this.type) {
					case 'chemical_store':
					case 'chemical_purchase':
						// sqlcode = 533;
						// let list = await GetChemicalStore(await GetOrgId(), row.chemical_id)
						// if (list && list.length > 0) {
						// 	let item = list[0]
						// 	if (parseFloat(item.quantity) - parseFloat(row.quantity) < 0) {
						// 		this.$baseMessage('无法删除，删除后库存将小于0', 'error')
						// 		return
						// 	}
						// }
						// tips = '确定删除日期：' + row.buy_date + ' 化学品名称：' + row.name + ' 购买人：' + row.buyer + '的购入记录？'
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
					case 'history_main':
						that.fetchDataHistorymain(pageInfo, treeNode, resolve);
						break;
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
			async fetchDataHistorymain(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'report_id',
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
				this.queryForm.org_id = await this.getOrgId();
				this.queryForm.report_id = this.primary_key;
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 860, key_json)
			}
		},
	}
</script>

<style>

</style>

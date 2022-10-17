<template>
	<div>
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy
			:load="fetchData" row-key="org_id">
			<el-table-column show-overflow-tooltip label="机构名称" prop="org_name" min-width="170" align="left"
				fixed="left"></el-table-column>
			<el-table-column show-overflow-tooltip label="机构号" prop="org_id" min-width="170"></el-table-column>
			<el-table-column show-overflow-tooltip label="机构类型" prop="org_type" align="center" min-width="170">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="状态" prop="out_org_status_name" align="center" min-width="170">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start" :hide-on-click="true">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
						</el-button>
						<el-dropdown-menu slot="dropdown" class="more" style="min-width: 115px">
							<el-dropdown-item @click.native="EditInfo(row)" v-show="ishasPermission('edit')">
								修改
							</el-dropdown-item>
							<el-dropdown-item @click.native="handleAddChild(row)" v-show="ishasPermission('edit')">
								添加子节点
							</el-dropdown-item>
							<el-dropdown-item @click.native="handleAddLevel(row)" v-show="ishasPermission('edit')">
								添加同级
							</el-dropdown-item>
							<el-dropdown-item @click.native="handleDeletemodify(row)"
								v-show="ishasPermission('delete')&&!row.hasChildren">
								删除
							</el-dropdown-item>

<!-- 							<el-button v-show="ishasPermission('edit')" type="primary" class="normal"
								@click="EditInfo(row)">修改
							</el-button>
							<el-button v-show="ishasPermission('edit')" type="primary" class="normal"
								@click="handleAddChild(row)">添加子节点
							</el-button>
							<el-button v-show="ishasPermission('edit')" type="primary" class="normal"
								@click="handleAddLevel(row)">添加同级
							</el-button>
							<el-button v-show="ishasPermission('delete')&&!row.hasChildren"
								@click="handleDeletemodify(row)" class="danger">删除
							</el-button> -->

						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<expatriateProjectDialog ref="expatriateProjectDialog" :is-up-data.sync="main_dialog" :type="2">
		</expatriateProjectDialog>

	</div>
</template>

<script>
	import {
		treePaging
	} from '@/global/form.helper'
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'

	import expatriateProjectDialog from '../components/expatriateProjectDialog'

	export default {
		name: 'expatriateProjectTable',
		components: {
			expatriateProjectDialog,
		},
		props: {
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
		},
		provide() {
			return {
				reload: this.fetchData,
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				this.fetchData({
					reload: 1,
				})
			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			current_org_id() {
				this.fetchData()
			},
		},
		data() {
			return {
				height: 'calc(80%)',
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				elementLoadingText: '加载数据中',
				queryForm: {
					table_type: 1,

					pageSize: 10,
					pageNo: 1,
				},
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				columnHideList: [],
			}
		},
		created() {
			this.init()
		},
		methods: {
			GetHeight() {},
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 0:
						this.height = 'calc(80%)'
						this.columnHideList = ['user_name']
						break
					case 1:
						this.height = 'calc(100%)'
						break
				}
			},
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
						permission_name = 'expatriateProjectAdd'
						break
					case 'edit':
						permission_name = 'expatriateProjectEdit'
						break
					case 'delete':
						permission_name = 'expatriateProjectDelete'
						break
					default:
						permission_name = name
						break
				}
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					flag = true
					return flag
				}
				switch (name) {
					default:
						flag = flag
						break;
				}
				return flag
			},

			EditInfo(row) {
				let json = {
					parent_id: Object.assign({}, row).parent_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(row, json)
			},
			handleAdd(row, parent_info) {
				this.$refs['expatriateProjectDialog'].showEdit(row, parent_info, {
					outOrgStatus: true,
					table_type: "1"
				})
			},
			handleAddLevel(row) {
				let json = {
					parent_id: Object.assign({}, row).parent_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(undefined, json)
			},
			handleAddChild(row) {
				let json = {
					parent_id: Object.assign({}, row).org_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(undefined, json, )
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},
			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 324, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'org_id', //主键
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
			search(data) {
				console.log('search', data)
				this.queryForm = Object.assign(data, this.queryForm)
				this.fetchData()
			},
			fetchData(pageInfo, treeNode, resolve) {

				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 0:
						this.columnHideList = ['user_name']
						that.fetchData1(pageInfo, treeNode, resolve)
						break
					case 1:
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async fetchDataMain(row, treeNode, resolve) {
				let that = this
				let config = {
					"form": {
						"select": "queryForm",
						"page": "queryForm"
					},
					"key": {
						"parent_id": "parent_id",
						"primary_id": "org_id",
						"double_parent_id_filed": "double_parent_id",
						"parent_info": "info",
						"hasChildren": "hasChildren"
					},
					"resolve": "resolve",
					"listLoading": "listLoading",
					"data": {
						"table_ref": "branchInstitutions",
						"data": "tablelist",
						"total": "total"
					}
				}
				let options = {
					"select_list": {
						"main": [{
								field: 'org_name',
								type: 2,
								level: 1,
							},
							{
								field: 'org_type',
								type: 2,
								level: 2,
							}, {
								field: 'parent_id',
								type: 3,
								level: 3,
							}, {
								field: 'table_type',
								type: 3,
								level: 4,
							}, {
								field: 'out_org_status',
								type: 3,
								level: 5,
							},
						],
						"supply": [{
							field: 'pageNo',
							type: 3,
							level: 5,
						}, {
							field: 'pageSize',
							type: 3,
							level: 6,
						}]
					},
					"sqlcode": {
						"zero": 325,
						"other": 326
					},
					"key": {
						"parent_id": this.current_org_id,
					}
				}
				//console.log(config, options, row, treeNode, resolve)
				treePaging(this, config, options, row, treeNode, resolve)
			},
			//子表从表加载数据
			async fetchData1() {
				let that = this
				let select_list = [{
						field: 'person_id',
						type: 3,
						level: 1,
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
				that.queryForm.person_id = that.primary_key
				that.search_fob(select_list, that, 167, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
		},
	}
</script>

<style>
	.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
	.el-table__body tr.current-row>td {
		background-color: #0000FF;
	}

	.el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #6495ED;
	}
</style>

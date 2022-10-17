<template>
	<div>
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy
			:load="fetchData" row-key="item_id" @row-click="rowClick">
			<el-table-column show-overflow-tooltip label="名称" prop="item_name" min-width="100" align="left"
				fixed="left"></el-table-column>
			<el-table-column show-overflow-tooltip label="字典id" prop="item_id" align="center" width="90"></el-table-column>
			<el-table-column show-overflow-tooltip label="分组id" prop="group_id" align="center" width="70"
				v-if="hideColFob('group_id')">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start" :hide-on-click="true">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
						</el-button>
						<el-dropdown-menu slot="dropdown" class="more" style="min-width: 115px">
							<template v-for="item in dropdown.menu">
								<el-dropdown-item @click.native="handleCommand(item.command, row)"
									v-if="ishasPermission(item.permission_name,row) ">{{ item.label }}
								</el-dropdown-item>
							</template>
							<!-- 							<el-dropdown-item @click.native="EditInfo(row)" v-show="ishasPermission('edit')">
								修改
							</el-dropdown-item>
							<el-dropdown-item @click.native="handleAddChild(row)" v-show="ishasPermission('edit')">
								添加子节点
							</el-dropdown-item> -->
							<!-- <el-dropdown-item @click.native="handleAddLevel(row)" v-show="ishasPermission('edit')">
								添加同级
							</el-dropdown-item> -->
							<!-- 							<el-dropdown-item @click.native="handleDeletemodify(row)"
								v-show="ishasPermission('delete')&&!row.hasChildren">
								删除
							</el-dropdown-item> -->
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
			@size-change="handleSizeChange" :small="true"></el-pagination>
		<sysDataGroupDialog ref="sysDataGroupDialog" @fencthRelod="fencthRelod">
		</sysDataGroupDialog>

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

	import sysDataGroupDialog from '../component/sysDataGroupDialog'

	export default {
		name: 'sysDataGroupTable',
		components: {
			sysDataGroupDialog,
		},
		props: {
			type: {
				type: String,
				default: 'main_table',
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
			group_id: {
				type: Number,
				default: 0
			}
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
			group_id(newVal, oldVal) {
				switch (this.type) {
					case 'side_table':
						this.fetchData({
							reload: 1,
						})
						break
				}
			},
			primary_key(newVal, oldVal) {
				switch (this.type) {
					case 'side_table':
						this.fetchData({
							reload: 1,
						})
						break
				}
			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			current_org_id() {
				this.fetchData()
			},
			rowClickData(newVal) {
				switch (this.type) {
					case 'main_table':
						if (newVal && newVal.item_id) {
							this.$emit('update:group_id', Number(newVal.item_id))
						}
						break
				}
			}
		},
		data() {
			return {
				dropdown: {
					menu: [{
							command: 'edit',
							permission_name: 'edit',
							label: '修改'
						},
						{
							command: 'addChildren',
							permission_name: 'addChildren',
							label: '添加子节点'
						},
						{
							command: 'delete',
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
				height: 'calc(80%)',
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				elementLoadingText: '加载数据中',
				queryForm: {
					group_id: 0,
					pageSize: 10,
					pageNo: 1,
				},
				layout: 'total, sizes, prev, next, jumper',
				total: 0,
				columnHideList: [],
				rowClickData: {

				}
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
					case 'main_table':
						this.height = 'calc(95%)';
						this.columnHideList = ['group_id'];
						this.fetchData()
						break
					case 'side_table':
						this.height = 'calc(95%)'
						if (this.group_id > 0) {
							this.fetchData()
						}
						break

				}
			},
			rowClick(row, col, event) {
				this.rowClickData = row
			},
			clearChildren() {
				this.rowClickData = {
					item_id: -1
				}
			},
			fencthRelod(row) {
				if (!row) {
					row = JSON.parse(JSON.stringify(this.rowClickData))
				}
				this.clearChildren()
				let that = this
				setTimeout(() => {
					that.rowClickData = row
				}, 500)
				this.fetchData({
					pageNo: this.queryForm.pageNo
				})
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
			handleCommand(command, row) {
				switch (command) {
					case 'edit':
						this.EditInfo(row)
						break
					case 'addChildren':
						this.handleAddChild(row)
						break
					case 'delete':
						this.handleDeletemodify(row)
						break
				}
			},
			ishasPermission(name, row) {

				if (!name) {
					if (this.dropdown.count[row.item_id]) {
						this.dropdown.count[row.item_id]++
					} else {
						this.dropdown.count[row.item_id] = 1
					}
					return true
				}
				let permissionRegister = {
					main_table: {
						edit: 'sysDataGroupEdit',
						delete: 'sysDataGroupDelete',
						addChildren: 'sysDataGroupAdd',
					},
					side_table: {
						edit: 'sysDataGroupEdit',
						delete: 'sysDataGroupDelete',
						addChildren: 'sysDataGroupAdd',
					}
				}
				let permission_name = ''
				switch (name) {
					default:
						if (permissionRegister[this.type] && permissionRegister[this.type][name]) {
							permission_name = permissionRegister[this.type][name]
						} else {
							permission_name = name
						}
						break
				}
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (name == 'empty') {
					if (!this.dropdown.count[row.item_id]) {
						flag = true;
					}
				}
				if (role_max == 'super_admin') {
					//flag = true
					//return flag
				}
				let dropdowMenu = {
					main_table: ['all'],
				}
				if (dropdowMenu[this.type]) {
					let menu_list = dropdowMenu[this.type];
					if (menu_list.indexOf('all') >= 0) {

					} else if (menu_list.indexOf(name) < 0) {
						flag = false
					}
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'addChildren':
						if (row.nDeep > 0) {
							flag = false
						}
						break
					default:
						flag = flag
						break;
				}
				if (flag) {
					switch (name) {
						case 'empty':
							break
						default:
							if (this.dropdown.count[row.item_id]) {
								this.dropdown.count[row.item_id]++
							} else {
								this.dropdown.count[row.item_id] = 1
							}
							break
					}

				}
				return flag
			},

			EditInfo(row) {
				let json = {
					parent_id: Object.assign({}, row).parent_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(row, json, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['sysDataGroupDialog'].showEdit(row, parent_info, disable)
			},
			handleAddLevel(row) {
				let json = {
					parent_id: Object.assign({}, row).parent_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(undefined, json, undefined)
			},
			handleAddChild(row) {
				let json = {
					group_id: Object.assign({}, row).item_id,
					double_parent_id: Object.assign({}, row).group_id,
					item_id: 0,
				}
				this.handleAdd(undefined, json, undefined)
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},

			handleDeletemodify(row) {
				let that = this
				let tips = '确定删除' + row.item_id + '-' + row.item_name
				if (row.nDeep == 0) {
					tips = tips + "以及其子节点"
				}
				tips = tips + "?"
				that.delete_from_fobEx(that, row, 661, {
					"fetchData": "fetchData", //加载数据
					"main_key": "item_id", //主键
					'confirmMsg': tips,
					'successMsg': '删除成功',
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
					case 'side_table':
					case 'main_table':
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async fetchDataMain() {
				let that = this
				let select_list = [{
						field: 'item_id',
						type: 3,
						level: 1,
					},
					{
						field: 'group_id',
						type: 3,
						level: 2,
					}, {
						field: 'item_name',
						type: 2,
						level: 3,
					}, {
						field: 'nDeep',
						type: 3,
						level: 4,
					}, {
						field: 'pageNo',
						type: 3,
						level: 5,
					}, {
						field: 'pageSize',
						type: 3,
						level: 6,
					}
				]
				switch (that.type) {
					case 'side_table':
						that.queryForm.group_id = that.group_id
						break
				}

				await that.search_fob(select_list, that, 658, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
				this.clearChildren()
			},
			async fetchDataLazy(row, treeNode, resolve) {
				let that = this
				let config = {
					"form": {
						"select": "queryForm",
						"page": "queryForm"
					},
					"key": {
						"parent_id": "group_id",
						"primary_id": "item_id",
						"double_parent_id_filed": "double_group_id",
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
								field: 'item_id',
								type: 3,
								level: 1,
							},
							{
								field: 'group_id',
								type: 3,
								level: 2,
							}, {
								field: 'item_name',
								type: 2,
								level: 3,
							}, {
								field: 'nDeep',
								type: 3,
								level: 4,
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
						"zero": 658,
						"other": 659
					},
					"key": {
						"parent_id": 0,
					}
				}
				if (that.group_id > 0) {
					that.queryForm.group_id = that.group_id
					that.queryForm.nDeep = undefined
				} else {
					that.queryForm.group_id = 0
					that.queryForm.nDeep = 0
				}
				//console.log(config, options, row, treeNode, resolve)
				treePaging(this, config, options, row, treeNode, resolve)
			},

		},
	}
</script>

<style>
</style>

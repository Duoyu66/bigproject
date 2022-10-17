<template>
	<div class="draftPageHigh">
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column show-overflow-tooltip label="问题描述" prop="risks" min-width="180px"></el-table-column>
			<el-table-column show-overflow-tooltip label="问题来源" prop="risk_source" min-width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="问题等级" prop="risk_level" min-width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="扣分值" prop="credit" min-width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="责任单位" prop="charge_department" min-width="100px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="责任人" prop="charge_person" min-width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="问题状态" prop="r_status" min-width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="问题时间" prop="risk_c_time" min-width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="问题确认" prop="risk_confirm" min-width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="添加人" prop="risk_person" min-width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
							<template v-for="item in dropdown.menu">
								<el-dropdown-item @click.native="handleCommand(item.command, scope.row)"
									v-if="ishasPermission(item.permission_name, scope.row) ">{{ item.label }}
								</el-dropdown-item>
							</template>
							<!-- <el-dropdown-item @click.native="handleCommand('view', scope.$index, scope.row)">详情
							</el-dropdown-item>
							<el-dropdown-item @click.native="handleCommand('edit', scope.$index, scope.row)">修改
							</el-dropdown-item>
							<el-dropdown-item @click.native="handleCommand('del', scope.$index, scope.row)">删除
							</el-dropdown-item>
							<el-dropdown-item @click.native="handleCommand('add', scope.$index, scope.row)">添加
							</el-dropdown-item> -->
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<noSupervisorHandleRisksDialog ref="noSupervisorHandleRisksDialog" @fencthRelod="reloadTable">
		</noSupervisorHandleRisksDialog>
	</div>
</template>

<script>
	import {
		treePaging
	} from '@/global/form.helper'
	import {
		QueryExec
	} from '@/api/table'
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'
	import riskLedgerDialog from '../component/riskLedgerDialog'
	import noSupervisorHandleRisksDialog from '../dialog/noSupervisorHandleRisksDialog'
	export default {
		name: 'riskLedgerTable',
		components: {
			riskLedgerDialog,
			noSupervisorHandleRisksDialog
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
			group_id: {
				type: Number,
				default: 0
			},
			tablename: {
				type: String,
				default: ''
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
				mixDeviceId: 'org/mixDeviceId',
				currentTab: 'org/currentTab',
				projectPrimaryId: 'projectInfo/primaryId',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
				person_id: 'user/person_id',
				isHasSupervisorOrg: 'user/isHasSupervisorOrg',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				if (this.type == 1 || this.type == 2 || this.type == 3) {
					this.fetchData({
						reload: 1,
					})
				}
			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			current_org_id() {
				this.fetchData()
			},
			rowClickData(newVal) {
				if (newVal && newVal.id) {
					switch (this.type) {
						case 0:
							this.$emit('update:primary_key', Number(newVal.id));
							break;
					}
				}
			},
		},
		data() {
			return {
				dropdown: {
					menu: [{
							command: 'view',
							permission_name: 'info',
							label: '详情'
						},
						{
							command: 'deal',
							permission_name: 'deal',
							label: '处置'
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
				height: 'calc(85%)',
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
				tabledata: [],
				layout: 'total, sizes, prev, next, jumper',
				total: 0,
				columnHideList: [],
				rowClickData: {}
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
						this.height = 'calc(85%)'
						break
					case 1:
						this.height = 'calc(85%)'
						break
					case 3:
						this.height = 'calc(85%)'
						break
				}
			},
			rowClick(row, col, event) {
				this.rowClickData = row
			},
			clearChildren() {
				this.rowClickData = {
					id: -1,
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
			handleCommand(command, row) {
				switch (command) {
					case 'deal':
						this.RiskDeal(row);
						break;
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
			RiskDeal(row) {
				this.$refs["noSupervisorHandleRisksDialog"].showEdit(row);
			},
			ishasPermission(name, row) {
				//console.log(name, row);
				if (!name) {
					if (this.dropdown.count[row.id]) {
						this.dropdown.count[row.id]++
					} else {
						this.dropdown.count[row.id] = 1
					}
					return true
				}
				let permissionRegister = {
					'0': {
						//main_table
						deal: 'riskLedgerDeal',
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
				let flag = hasPermission(this.permission, permission_name);
				//console.log(this.permission, permission_name,flag,this.type);
				let role_max = this.role_max
				if (name == 'empty') {
					if (!this.dropdown.count[row.id]) {
						flag = true;
					}
				} else if (name == 'info') {
					flag = true;
				}
				if (role_max == 'super_admin') {}
				let dropdowMenu = {
					main_table: ['all'],
				}
				if (dropdowMenu[this.type]) {
					let menu_list = dropdowMenu[this.type];
					if (menu_list.indexOf('all') >= 0) {} else if (menu_list.indexOf(name) < 0) {
						flag = false
					}
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'info':
						flag = true;
						break;
					case 'deal':
						console.log('deal', this.isHasSupervisorOrg, row)
						if (this.isHasSupervisorOrg && (row.r_status == '1' || row.r_status == '2')) {
							//有监理，且当前没有到整改获取没有整改确认(还可以修改)
							flag = true;
						} else if (!this.isHasSupervisorOrg && row.is_deal == '0') {
							//没有监理，并且没有处理
							flag = true;
						} else {
							flag = false;
						}
						//不是当前机构无法修改
						if (row.org_id != this.org_id) {
							flag = false;
						}
						break;
					case 'addChildren':
						if (row.nDeep > 0) {
							flag = false;
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
							if (this.dropdown.count[row.id]) {
								this.dropdown.count[row.id]++
							} else {
								this.dropdown.count[row.id] = 1
							}
							break
					}
				}
				return flag
			},
			EditInfo(row) {
				this.handleAdd(row, undefined, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['sysDataGroupDialog'].showEdit(row, parent_info, disable)
			},
			handleDeletemodify(row) {
				let that = this
				let tips = '确定删除' + id
				tips = tips + '?'
				that.delete_from_fobEx(that, row, 661, {
					'fetchData': 'fetchData', //加载数据
					'main_key': 'item_id', //主键
					'confirmMsg': tips,
					'successMsg': '删除成功',
				})
			},
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
				this.queryForm = Object.assign(data, this.queryForm)
				this.fetchData()
			},
			reloadTable() {
				console.log('reloadTable');
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
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			setSelectRows() {},
			tableSortChange() {},
			async fetchDataMain(pageInfo, treeNode, resolve) {
				let that = this
				let select_list = [{
						field: 'risks',
						type: 2,
						level: 1
					},
					{
						field: 'risk_source',
						type: 2,
						level: 2
					},
					{
						field: 'risk_level',
						type: 2,
						level: 3
					},
					{
						field: 'pageNo',
						type: 3,
						level: 4
					},
					{
						field: 'pageSize',
						type: 3,
						level: 5
					},
					{
						field: 'org_id',
						type: 3,
						level: 6
					},
				]
				that.queryForm.org_id = that.current_and_chrilren_org

				await that.search_fob(select_list, that, 961, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
				console.log(that.tablelist)
				// this.clearChildren()
			},
		},
	}
</script>

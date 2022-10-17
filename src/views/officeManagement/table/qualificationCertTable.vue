<template>
	<div>
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column show-overflow-tooltip prop="name" label="证书名称"></el-table-column>
			<el-table-column show-overflow-tooltip prop="type" label="类型" width="80px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="cert_org" label="发证机构"></el-table-column>
			<el-table-column show-overflow-tooltip prop="issuing_time" label="发证时间" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="deadline" label="有效期至" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="add_person" label="登记人" width="70px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="add_time" label="登记时间" width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
							<template v-for="item in dropdown.menu">
								<el-dropdown-item @click.native="handleCommand(item.command, scope.$index, scope.row)"
									v-if="ishasPermission(item.permission_name,scope.row) ">{{ item.label }}
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
		<qualificationCertTableDialog ref="qualificationCertTableDialog" :is-up-data.sync="main_dialog">
		</qualificationCertTableDialog>
		<qualificationCertApplyDialog ref="qualificationCertApplyDialog" :is-up-data.sync="children_dialog">
		</qualificationCertApplyDialog>
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
	import qualificationCertTableDialog from '../component/qualificationCertTableDialog'
	import qualificationCertApplyDialog from '../component/qualificationCertApplyDialog'
	export default {
		name: 'qualificationCertTable',
		components: {
			qualificationCertTableDialog,
			qualificationCertApplyDialog
		},
		props: {
			type: {
				type: String,
				default: 'qualificationCert',
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
					case 0:
						this.fetchData({
							reload: 1,
						})
						break
				}

			},
			children_dialog() {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					id: -1
				}
				let that = this;
				setTimeout(function() {
					that.selectedRow = selectedRow
				}, 500)
			},
			main_dialog(newVal, oldVal) {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					seal_id: -1
				}
				this.fetchData()
				let that = this;
				setTimeout(function() {
					that.selectedRow = selectedRow
				}, 500)

			},
			current_org_id() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {
				if (newVal && newVal.id) {
					switch (this.type) {
						case 'qualificationCert':
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
							command: 'edit',
							permission_name: 'edit',
							label: '修改资质证书'
						},
						{
							command: 'delete',
							permission_name: 'delete',
							label: '删除资质证书'
						},
						{
							command: 'applyDownLoad',
							permission_name: '',
							label: '申请下载证书'
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
				children_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				selectedRow: {},
				elementLoadingText: '加载数据中',
				queryForm: {
					table_type: 0,

					pageSize: 10,
					pageNo: 1,
				},
				demotableexpand: {
					mainTable: []
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

			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 'qualificationCert':
						this.height = 'calc(84%)'
						this.fetchData()
						break
				}
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (!row) {
					return '';
				}
				let className = ''
				switch (row.degreeOfUrgency) {
					case '特急':
						className = 'extra-urgent-row'
						break
					case '紧急':
						className = 'urgent-row'
						break
					case '常规':
						className = 'commonly-row'
						break
				}
				return className
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
				let primery_id = row.id
				if (!name) {
					if (this.dropdown.count[primery_id]) {
						this.dropdown.count[primery_id]++
					} else {
						this.dropdown.count[primery_id] = 1
					}
					return true
				}
				let permission_name = ''
				let permissionRegister = {
					qualificationCert: {
						add: 'qualificationCertAdd',
						edit: 'qualificationCertEdit',
						delete: 'qualificationCertDelete',
						applyDownLoad: 'qualificationCertDownAdd'
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
				if (name == 'empty') {
					if (!this.dropdown.count[primery_id]) {
						flag = true;
					}
				}
				let role_max = this.role_max

				// case 'chemical_consumption':
				// case 'chemical_check':
				// case 'chemicalNullify':
				let dropdowMenu = {
					qualificationCert: ['all'],
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
							if (role_max == 'super_admin') {
								//flag = true
								//return flag
							} else {
								flag = false
							}

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
							if (this.dropdown.count[primery_id]) {
								this.dropdown.count[primery_id]++
							} else {
								this.dropdown.count[primery_id] = 1
							}
							break
					}
				}
				return flag
			},
			handleCommand(command, index, row) {
				let that = this
				switch (command) {
					//查看
					case 'view':
						that.handleView(row)
						break
						//编辑
					case 'edit':
						that.EditInfo(row)
						break
					case 'applyDownLoad':
						that.applyDownLoad(row)
						break
						//删除
					case 'delete':
						that.handleDeletemodify(row)
						break
				}
			},
			applyDownLoad(row) {
				let form_info = {
					cert_id: row.id,
					cert_name: row.name,
					org_id: row.org_id
				}
				this.$refs['qualificationCertApplyDialog'].showEdit(undefined, form_info)
			},
			handleView(row) {
				this.$refs['sealLedgerViewDialog'].showEdit(row, undefined, undefined)
			},
			Examine(row) {
				this.$refs['postRegistrationExamineDialog'].showEdit(row, undefined, undefined)
			},
			EditInfo(row) {
				this.handleAdd(row, undefined, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['qualificationCertTableDialog'].showEdit(row, parent_info, disable)
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
					parent_id: Object.assign({}, row).org_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(undefined, json, undefined)
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},

			handleDeletemodify(row) {
				let that = this
				that.$confirm('此操作会清空所有相关信息，是否继续？', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '取消',
						cancelButtonText: '确定删除'
					})
					.then(() => {

					})
					.catch(action => {
						that.delete_from_fob(that, row, 674, {
							//"selectRows": "selectRows", //复选框选中数据
							fetchData: 'fetchData', //加载数据
							main_key: 'id', //主键
							file: {
								enclosure: 12,
							}
						})
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
			fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 'qualificationCert':
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async fetchDataMain(row, treeNode, resolve) {
				let that = this
				let select_list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'name',
						type: 2,
						level: 2,
					}, {
						field: 'type',
						type: 2,
						level: 3,
					}, {
						field: 'cert_no',
						type: 2,
						level: 4,
					}, {
						field: 'cert_org',
						type: 2,
						level: 5,
					}, {
						field: 'issuing_time_start',
						type: 3,
						level: 6,
					}, {
						field: 'issuing_time_end',
						type: 3,
						level: 7,
					}, {
						field: 'deadline_start',
						type: 3,
						level: 8,
					}, {
						field: 'deadline_end',
						type: 3,
						level: 8,
					}, {
						field: 'pageNo',
						type: 3,
						level: 10,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 11,
					},
				]
				let sqlcode = 673
				that.queryForm.org_id = that.GetCurrentOrg()
				that.search_fob(select_list, that, sqlcode, {
					'loading': 'listLoading', //加载画面
					'data': 'tablelist', //数据存放位置
					'total': 'total', //数据数量，根据该数量分页
					'queryForm': 'queryForm' //查询数据表单，请将分页条件也放置在其中
				});
			},


		},
	}
</script>

<style>

</style>

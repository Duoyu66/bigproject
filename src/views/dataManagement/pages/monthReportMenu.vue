<template>
	<!--不居中，颜色不同，字体，显出界面  -->
	<div class=" definition purchase equipment_btn calc">

		<!-- <el-main class="box1" style="height: calc(100vh); min-height: 300px"> -->
		<!-- style="margin-bottom: 0px;" -->
		<div class="baseBox">
			<vab-query-form>
				<el-form ref="form" :inline="true" @submit.native.prevent>
					<el-form-item style="">
						<el-select v-model="projectName" style="" filterable placeholder="项目选择">
							<el-option v-for="item in projectForm" :key="item.name" :label="item.name"
								:value="item.name">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item style="">
						<el-date-picker v-model="time1" type="month" placeholder="起始月">
						</el-date-picker>
					</el-form-item>
					<el-form-item style="">
						<el-date-picker v-model="time2" type="month" placeholder="结束月">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="">
							查询
						</el-button>
						<el-button type="primary" @click="">
							统计
						</el-button>
						<el-button type="primary" @click="">
							导出
						</el-button>
						<el-button type="primary" @click="dialogVisible=true">
							添加
						</el-button>
					</el-form-item>
				</el-form>
			</vab-query-form>
			<div style="display: flex;">
				<div style="width: 49%;" border>
					<!-- handleSelectionChange     sortChange -->
					<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist1" border
						:element-loading-text="elementLoadingText" max-height="height"
						:default-sort="{prop: 'money', order: 'descending'}"
						:header-cell-style="{ background: '#e8f0ff' }" @row-click="rowClick" :cell-style="setRowStyle">
						<el-table-column style="" label="成本汇总明细--项目">
							<el-table-column show-overflow-tooltip prop="time" sortable label="时间"></el-table-column>
							<el-table-column show-overflow-tooltip label="科目" prop="subject">
							</el-table-column>
							<el-table-column show-overflow-tooltip prop="money" sortable label="金额">
							</el-table-column>
							<el-table-column show-overflow-tooltip label="操作" fixed="right">
								<template slot-scope="scope">
									<el-button type="primary" class="normal"
										@click="handleEdit(scope.$index,scope.row,tablelist1)">编辑
									</el-button>
									<el-button class="danger" @click="handleDelete(scope.$index,scope.row,tablelist1)">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table-column>

					</el-table>
					<el-pagination :background="background" :current-page="queryForm1.pageNo" :layout="layout"
						:page-size="queryForm1.pageSize" :total="total1" @current-change="handleCurrentChange"
						@size-change="handleSizeChange"></el-pagination>
				</div>
				<div style="width: 1%;"></div>
				<div style="width: 49%;">
					<el-table v-loading="listLoading" highlight-current-row :data="tablelist2" border max-height="height"
						:element-loading-text="elementLoadingText" :header-cell-style="{ background: '#e8f0ff' }"
						@row-click="rowClick" :default-sort="{prop: 'money', order: 'descending'}">

						<el-table-column label="收入汇总明细--项目">
							<el-table-column show-overflow-tooltip prop="time" sortable label="时间">
							</el-table-column>
							<el-table-column show-overflow-tooltip label="科目" prop="subject">
							</el-table-column>
							<el-table-column show-overflow-tooltip prop="money" sortable label="金额">
							</el-table-column>
							<el-table-column show-overflow-tooltip label="操作" fixed="right">

								<template slot-scope="scope">
									<el-button type="primary" class="normal"
										@click="handleEdit(scope.$index,scope.row,tablelist2)">编辑
									</el-button>
									<el-button class="danger" @click="handleDelete(scope.$index,scope.row,tablelist2)">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
					<el-pagination :background="background" :current-page="queryForm2.pageNo" :layout="layout"
						:page-size="queryForm2.pageSize" :total="total2" @current-change="handleCurrentChange"
						@size-change="handleSizeChange"></el-pagination>
				</div>

			</div>

		</div>

		<el-dialog :visible.sync="dialogVisible" custom-class="width:50%;height:50%" title="添加明细">
			<el-form ref="form" :model="form">
				<el-form-item label="选择类别">
					<el-radio v-model="inorout" label="1">成本</el-radio>
					<el-radio v-model="inorout" label="2">收入</el-radio>
				</el-form-item>
				<el-form-item label="选择时间">
					<el-date-picker v-model="form.addtime" type="month" placeholder="结束月">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="选择科目">
					<el-select v-model="form.subject" style="" filterable placeholder="科目选择">
						<el-option v-for="item in subjectForm" :key="item.name" :label="item.name" :value="item.name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="填写金额">
					<el-input v-model="form.money" placeholder="填写金额量"></el-input>

				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">添加</el-button>
					<el-button @click="cancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
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
		getList,
		doDelete,
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	export default {
		provide() {
			return {
				reload: this.reload,
			}
		},
		props: {
			nextStatus: {
				type: String,
			},
			status: {
				type: String,
				default: '0'
			}
		},
		data() {
			return {
				dropdown: {
					menu: [{
							command: 'EidtStore',
							permission_name: 'edit',
							label: '修改'
						},
						{
							command: 'Delete',
							permission_name: 'delete',
							label: '删除'
						},
					],
					count: {

					}
				},
				dialogVisible: false,
				form: {
					addtime: '',
					subject: '',
					money: ''
				},
				inorout: '',
				time1: '',
				time2: '',
				projectName: '',
				subjectForm: [{
						name: '交通'
					},
					{
						name: '住宿'
					}
				],
				projectForm:[],
				tableReload: false,
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist1: [],
				tablelist2: [],
				selectedRow: {},
				selectedRowList: {},
				elementLoadingText: '加载数据中',
				queryForm1: {
					pageNo: 1,
					pageSize: 20,
				},
				queryForm2: {
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
				total1: 0,
				total2: 0,
				columnHideList: ['selection'],
				table: {
					// tableHeight: 'calc(80%)',
					isShow: true,
				},

			}
		},

		computed: {
			height() {
				return this.$baseTableHeight()
			},
			...mapGetters({
				current_org: 'org/current_org',
			})
		},
		created() {
			this.fetchData()

		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			tableSortChange() {},
			handleEdit(index, row, list) {

			},
			cancel(){
				
			},
			handleDelete(index, row, list) {
				console.log(index, row)
			},
			setRowStyle(row, column, rowIndex, columnIndex) {
				if (rowIndex === 0) {
					return 'color: green'
				}
			},
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
			},
			calcel() {
				this.dialogVisible = false
			},
			onSubmit() {
				let obj = {
					time: this.form.addtime.getFullYear() + '.' + (this.form.addtime.getMonth() + 1),
					subject: this.form.subject,
					money: this.form.money
				}
				if (this.inorout == "1") {
					this.tablelist1.push(obj)
				} else {
					this.tablelist2.push(obj)
				}
				this.dialogVisible = false
				this.form = {
					addtime: '',
					subject: '',
					money: ''
				}
			},
			handleCommand(command, row) {
				switch (command) {
					case 'EidtStore':
						this.handleEidtStore(row)
						break
					case 'Delete':
						this.handleDelete(row)
						break
				}
			},
			handleCurrentChange(val, num) {
				var list;
				if (num == 1) {
					list = this.queryForm1
				}
				if (num == 2) {
					list = this.queryForm2
				}
				list.pageNo = val
				this.fetchData({
					pageNo: val,
				})
			},
			handleSizeChange(val, num) {
				var list;
				if (num == 1) {
					list = this.queryForm1
				}
				if (num == 2) {
					list = this.queryForm2
				}
				list.pageSize = val
				// this.fetchData({
				// 	pageNo: this.queryForm.pageNo,
				// })
			},
			async init() {
				let permissionList = ['materialLedger'];
				let permission = '';
				for (let i = 0; i < permissionList.length; i++) {
					permission = await this.$store.dispatch(
						'permission/GetALLPermissionByModel',
						permissionList[i]
					)
					if (permission) {
						this.permission = Object.assign(this.permission, permission)
					}
				}
				await this.fetchData()
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
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				// this.$nextTick(() => {
				// 	this.$refs['RmStoreTable'].fetchData()
				// })
				let sData = '[Q]862{' + this.current_org + '}|^SYS'
				const res = await QueryExec(sData)
				res.data.forEach((item, index) => {
					this.projectForm.push({
						'name':item.org_type
					})
				})
				this.tablelist1 = []
				this.tablelist2 = []
				this.projectName=this.projectForm[0]
				this.total1 = this.tablelist1.length
				this.total2 = this.tablelist2.length
				let sData2 = '[Q]852{' + this.current_org + '$`'+this.projectName+'}|^SYS'
				let sData1 = '[Q]861{' + this.current_org + '$`'+this.projectName+'}|^SYS'
				const res1 = await QueryExec(sData1)
				const res2 = await QueryExec(sData2)
				res2.data.forEach((item, index) => {
					this.tablelist2.push({
						'id': item.id,
						'name': item.name,
						'subject': item.sub_project,
						'amount': item.amount,
						'time': item.income_date
					})
				})
				res1.data.forEach((item, index) => {
					this.tablelist1.push({
						'id': item.id,
						'name': item.name,
						'subject': item.sub_project,
						'amount': item.amount,
						'time': item.cost_date
					})
					console.log(index+" "+item)
				})
				console.log("************8")
				console.log(this.tablelist2)
			},
			toRmAlloc(event) {
				this.$router.push('materialCustomizations')
			},
			selectData() {
				// this.search_main_fob(this.queryForm)
			},
			search_main_fob(data) {
				//search
				this.$refs['RmStoreTable'].search(data)
			},
		},
	}
</script>

<style>
	/* .el-form-item--small.el-form-item {
		margin-bottom: 10px;
	} */
</style>

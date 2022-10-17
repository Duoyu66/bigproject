<template>
	<!--不居中，颜色不同，字体，显出界面  -->
	<div class=" definition purchase equipment_btn calc">

		<!-- <el-main class="box1" style="height: calc(100vh); min-height: 300px"> -->
		<!-- style="margin-bottom: 0px;" -->
		<el-tabs type="border-card" :value="this.$route.query.tabs ? this.$route.query.tabs : 1" class="box_center"
			style="height: calc(100vh)">
			<el-tab-pane label="每月收入登记" class="center">
				<div class="usage">
					<!-- <ContactForm ref="ContactForm" @transferTable="transferTable"></ContactForm> -->
					<el-form ref="form" :model="form">
						<el-form-item label="选择时间">
							<el-date-picker v-model="form.addtime" type="month" placeholder="结束月">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="选择项目">
							<el-select v-model="form.subject" style="" filterable placeholder="项目选择">
								<el-option v-for="item in subjectForm" :key="item.id" :label="item.name" :value="item.name">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="填写金额">
							<el-input v-model="form.money" placeholder="填写金额量"></el-input>
					
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit(1)">确定</el-button>
							<el-button @click="cancel">取消</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-tab-pane>
			<el-tab-pane label="每月成本登记" class="center">
				<div class="usage">
		
					<el-form ref="form" :model="inform">
						<el-form-item label="选择时间">
							<el-date-picker v-model="form.addtime" type="month" placeholder="结束月">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="选择项目">
							<el-select v-model="inform.subject" style="" filterable placeholder="项目选择">
								<el-option v-for="item in subjectinForm" :key="item.id" :label="item.name" :value="item.name">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="填写单价">
							<el-input v-model="inform.unitprice" placeholder="填写单价金额"></el-input>
					
						</el-form-item>
						<el-form-item label="数目">
							<el-input v-model="inform.count" placeholder="填写数目"></el-input>
					
						</el-form-item>
						<el-form-item label="总金额">
							<el-input v-model="getAmount" readonly></el-input>
					
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit(2)">确定</el-button>
							<el-button @click="cancel">取消</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-tab-pane>
			<el-tab-pane label="月报台账">
				<div class="baseBox">
					<vab-query-form>
						<el-form ref="form" :inline="true" @submit.native.prevent>
							<el-form-item style="">

								<el-select v-model="projectId" style="" filterable placeholder="项目选择">
									<el-option v-for="item in projectForm" :key="item.id" :label="item.name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item style="">
								<el-date-picker v-model="time" type="month" placeholder="选择月份">
								</el-date-picker>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="">
									查询
								</el-button>
								<el-button type="primary" @click="dialogVisible1=true">
									添加成本
								</el-button>
								<el-button type="primary" @click="dialogVisible2=true">
									添加收入
								</el-button>

							</el-form-item>
						</el-form>
					</vab-query-form>
					<div style="display: flex;">
						<div style="width: 49%;" border>
							<!-- handleSelectionChange     sortChange -->
							<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist1"
								border :element-loading-text="elementLoadingText" max-height="height"
								:header-cell-style="{ background: '#e8f0ff' }" @row-click="rowClick"
								:cell-style="setRowStyle">
								<el-table-column style="" label="当月成本明细--项目">

									<!-- <el-table-column show-overflow-tooltip prop="time" sortable label="时间"></el-table-column> -->
									<el-table-column show-overflow-tooltip label="工程" prop="name">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="项目" prop="subject">
									</el-table-column>
									<el-table-column show-overflow-tooltip prop="amount" label="金额">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="操作" fixed="right">
										<template slot-scope="scope">
											<el-button type="primary" class="normal"
												@click="handleEdit(scope.$index,scope.row,tablelist1,1)">编辑
											</el-button>
											<el-button class="danger"
												@click="handleDelete(scope.$index,scope.row,tablelist1,1)">
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
							<el-table v-loading="listLoading" highlight-current-row :data="tablelist2" border
								max-height="height" :element-loading-text="elementLoadingText"
								:header-cell-style="{ background: '#e8f0ff' }" @row-click="rowClick"
								:default-sort="{prop: 'amount', order: 'descending'}">

								<el-table-column label="当月收入明细--项目">
									<!-- <el-table-column show-overflow-tooltip prop="time" sortable label="时间">
							</el-table-column> -->
									<el-table-column show-overflow-tooltip label="工程" prop="name">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="项目" prop="subject">
									</el-table-column>
									<el-table-column show-overflow-tooltip prop="amount" label="金额">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="操作" fixed="right">

										<template slot-scope="scope">
											<el-button type="primary" class="normal"
												@click="handleEdit(scope.$index,scope.row,tablelist2,2)">编辑
											</el-button>
											<el-button class="danger"
												@click="handleDelete(scope.$index,scope.row,tablelist2,2)">
												删除
											</el-button>
										</template>
									</el-table-column>
								</el-table-column>
							</el-table>
							<!-- <el-pagination :background="background" :current-page="queryForm2.pageNo" :layout="layout"
						:page-size="queryForm2.pageSize" :total="total2" @current-change="handleCurrentChange"
						@size-change="handleSizeChange"></el-pagination> -->
						</div>

					</div>

				</div>
			</el-tab-pane>
		</el-tabs>

		<el-dialog :visible.sync="dialogVisible1" custom-class="width:50%;height:50%" title="实体检测月报成本录入">
			<el-form ref="form" :model="form">
				<!-- <el-form-item label="选择时间">
					<el-date-picker v-model="form.addtime" type="month" placeholder="结束月">
					</el-date-picker>
				</el-form-item> -->
				<el-form-item label="选择项目">
					<el-select v-model="form.subject" style="" filterable placeholder="项目选择">
						<el-option v-for="item in subjectForm" :key="item.id" :label="item.name" :value="item.name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="填写金额">
					<el-input v-model="form.money" placeholder="填写金额量"></el-input>

				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit(1)">确定</el-button>
					<el-button @click="cancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>


		<el-dialog :visible.sync="dialogVisible2" custom-class="width:50%;height:50%" title="实体检测月报成本录入">
			<el-form ref="form" :model="inform">
				<!-- <el-form-item label="选择时间">
					<el-date-picker v-model="form.addtime" type="month" placeholder="结束月">
					</el-date-picker>
				</el-form-item> -->
				<el-form-item label="选择项目">
					<el-select v-model="inform.subject" style="" filterable placeholder="项目选择">
						<el-option v-for="item in subjectinForm" :key="item.id" :label="item.name" :value="item.name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="填写单价">
					<el-input v-model="inform.unitprice" placeholder="填写单价金额"></el-input>

				</el-form-item>
				<el-form-item label="数目">
					<el-input v-model="inform.count" placeholder="填写数目"></el-input>

				</el-form-item>
				<el-form-item label="总金额">
					<el-input v-model="getAmount" readonly></el-input>

				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit(2)">确定</el-button>
					<el-button @click="cancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<el-dialog :visible.sync="dialogVisible3" custom-class="width:50%;height:50%" title="编辑条目">
			<el-form ref="form">
				<el-form-item label="选择项目" v-if="editflag==1">
					<el-select v-model="formToEdit.subject" style="" filterable placeholder="项目选择">
						<el-option v-for="item in subjectForm" :key="item.id" :label="item.name" :value="item.name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择项目" v-if="editflag==2">
					<el-select v-model="formToEdit.subject" style="" filterable placeholder="项目选择">
						<el-option v-for="item in subjectinForm" :key="item.id" :label="item.name" :value="item.name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="填写金额">
					<el-input v-model="formToEdit.amount" placeholder="填写金额量"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onEdit()">确定</el-button>
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
				dialogVisible1: false,
				dialogVisible2: false,
				dialogVisible3: false,
				editflag: -1,
				form: {
					addtime: ((new Date()).getFullYear()) + '-' + ((new Date()).getMonth() + 1),
					subject: '',
					money: ''
				},
				inform: {
					addtime: ((new Date()).getFullYear()) + '-' + ((new Date()).getMonth() + 1),
					subject: '',
					count: '',
					unitprice: '',
					money: this.getAmount
				},
				inorout: '',
				time: '',
				projectId: '',
				subjectForm: [],
				subjectinForm: [],
				projectForm: [],
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
				formToEdit: {},
			}
		},

		computed: {
			height() {
				return this.$baseTableHeight()
			},
			...mapGetters({
				current_org: 'org/current_org',
			}),
			getAmount: {
				get() {
					// return (typeof this.inform.count == 'number' && typeof this.inform.unitprice == 'number') ? this.inform.count * this.inform.unitprice : ''
					return Number(this.inform.count) * Number(this.inform.unitprice)
				}
			}
		},
		created() {
			this.fetchDataList()
			this.fetchData()
		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			tableSortChange() {},
			async onEdit() {
				if (this.editflag == 1) {
					let sData = '[Q]868{' + this.formToEdit.id + '$`' +
						this.formToEdit.subject + '$`' + this.formToEdit.amount + '}|^1|^SYS';
					const res = await ExecSql(sData)
					if (res > 0) {
						this.$baseMessage('修改成功', 'success')
						await this.fetchData()
					} else {
						this.$baseMessage('客户修改失败', 'error')
					}
				} else if (this.editflag == 2) {
					let sData = '[Q]865{' + this.formToEdit.id + '$`' +
						this.formToEdit.subject + '$`' + this.formToEdit.amount +
						'$`' + this.formToEdit.unitprice + '$`' + this.formToEdit.count + '}|^1|^SYS';
					const res = await ExecSql(sData)
					if (res > 0) {
						this.$baseMessage('修改成功', 'success')
						await this.fetchData()
					} else {
						this.$baseMessage('客户修改失败', 'error')
					}
				}
				this.dialogVisible3 = false
			},
			handleEdit(index, row, list, flag) {
				if (flag == 1) {
					this.editflag = 1
				} else if (flag == 2) {
					this.editflag = 2
				}
				this.formToEdit = {
					amount: row.amount,
					subject: row.subject,
					id: row.id
				}

				this.dialogVisible3 = true;
			},
			cancel() {

			},
			async handleDelete(index, row, list, flag) {
				let sData;
				if (flag == 1) {
					console.log(row.id)
					sData = '[Q]870{' + row.id + '}|^3|^SYS';


				} else if (flag == 2) {
					sData = '[Q]869{' + row.id + '}|^3|^SYS';
				}
				const res = await ExecSql(sData)
				if (res > 0) {
					this.$baseMessage('删除成功', 'success')
					await this.fetchData()
				} else {
					this.$baseMessage('删除失败', 'error')
				}

			},
			handleAdd() {

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
			async onSubmit(flag) {
				let sData;
				if (flag == 1) {
					sData = '[Q]872{' + this.current_org + '$`' + this.time + '-01' + '$`' +
						this.form.subject + '$`' + this.form.money + '$`' + this.projectId + '}|^2|^SYS'
				} else if (flag == 2) {
					sData = '[Q]871{' + this.current_org + '$`' + this.time + '-01' + '$`' +
						this.inform.subject + '$`' + this.getAmount + '$`' + this.projectId +
						'$`' + this.inform.unitprice + '$`' + this.inform.count + '}|^2|^SYS'
					this.inform.money = this.getAmount

				}
				const res = await ExecSql(sData)

				if (res > 0) {
					this.$baseMessage('添加成功', 'success')
					await this.fetchData()
				} else {
					this.$baseMessage('添加失败', 'error')
				}
				this.dialogVisible1 = false
				this.dialogVisible2 = false
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
			async fetchDataList() {
				let sData = '[Q]676{' + '项目成本项' + '}|^SYS'
				let res = await QueryExec(sData)
				res.data.forEach((item, index) => {
					this.subjectForm.push({
						'id': item.item_id,
						'name': item.item_name
					})
				})

				sData = '[Q]676{' + '项目收入项' + '}|^SYS'
				res = await QueryExec(sData)
				res.data.forEach((item, index) => {
					this.subjectinForm.push({
						'id': item.item_id,
						'name': item.item_name
					})
				})

				sData = '[Q]876{' + this.current_org + '}|^SYS'
				res = await QueryExec(sData)
				res.data.forEach((item, index) => {
					this.projectForm.push({
						'id': item.id,
						'name': item.org_name
					})
				})

				this.time = ((new Date()).getFullYear()) + '-' + ((new Date()).getMonth() + 1)

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
				this.tablelist1 = []
				this.tablelist2 = []
				let sData2 = '[Q]852{' + this.current_org + '$`' + this.projectId + '}|^SYS'
				let sData1 = '[Q]861{' + this.current_org + '$`' + this.projectId + '}|^SYS'
				const res1 = await QueryExec(sData1)
				const res2 = await QueryExec(sData2)
				res2.data.forEach((item, index) => {
					this.tablelist2.push({
						'id': item.id,
						'name': item.name,
						'subject': item.sub_project,
						'amount': item.amount,
						'time': item.income_date,
						'unitprice': item.unitprice,
						'count': item.count,

					})
				})

				res1.data.forEach((item, index) => {
					this.tablelist1.push({
						'id': item.id,
						'name': item.name,
						'subject': item.sub_project,
						'amount': item.amount,
						'time': item.cost_date,

					})
				})
				this.total1 = this.tablelist1.length
				this.total2 = this.tablelist2.length

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

</style>

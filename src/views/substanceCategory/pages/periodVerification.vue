<template>
	<div id="" class="definition purchase equipment_btn calc" name="yfdc_buy_reg_rec">
		<!--计划录入购入台账-->
		<el-tabs v-model="tabs" type="border-card" class="box_center" @tab-click="handleClick">
			<el-tab-pane label="计划录入" class="buy center" name="form" v-if="permission.periodVerificationPlanAdd">
				<div
					style="display: flex;justify-content: center;box-shadow: rgb(170, 170, 170) 1px 1px 10px 1px;width: 1200px;margin: 0 auto;flex-wrap: wrap; padding-bottom: 20px; ">
					<div style="width: 100%;">
						<div style="height: 100%">
							<div class="purchasefrom">
								<materiaExamineAndVerify ref="materiaExamineAndVerify" :chemicalSelectStatus="false"
									:rmSelectStatus="false" style="padding: 20px 20px;">
								</materiaExamineAndVerify>
							</div>
						</div>
					</div>
					<div style="width: 100%; height: 60px; display: flex">
						<el-button @click="handleCllickOk"
							style="margin: 0 auto; height: 40px; width: 200px;margin-top: 10px;" type="primary">
							确 定
						</el-button>
					</div>
				</div>
				<!-- <div class="usage">
					<div style="max-height: calc(100vh - 250px); overflow-y: auto;margin-top: 30px;">
						<materiaExamineAndVerify ref="materiaExamineAndVerify"></materiaExamineAndVerify>
					</div>
					<div>
						
					</div>
				</div> -->
			</el-tab-pane>
			<el-tab-pane label="核查计划台账" name="table">
				<vab-query-form style="margin-bottom: 0px">
					<vab-query-form-left-panel style="float: left;width:320px">
						<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;width: 123px;"
									v-model="queryForm.plan_name" placeholder="计划名称" />
							</el-form-item>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;width: 123px;"
									v-model="queryForm.planner" placeholder="计划人" />
							</el-form-item>

							<el-form-item>
								<el-button icon="el-icon-search" type="primary" @click="searchTablePlan">

								</el-button>
							</el-form-item>
						</el-form>
					</vab-query-form-left-panel>
					<vab-query-form-right-panel style="float: right;margin-right: 15px" v-show="primary_key>0">
						<el-form ref="form" :model="queryFormCheck" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;width: 123px;"
									v-model="queryFormCheck.store_name" placeholder="标准物质名称" />
							</el-form-item>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;width: 123px;"
									v-model="queryFormCheck.mat_name" placeholder="标准物质类别" />
							</el-form-item>

							<el-form-item>
								<el-button icon="el-icon-search" type="primary" @click="searchTableCheck">

								</el-button>
							</el-form-item>
						</el-form>
					</vab-query-form-right-panel>
					<div style="clear: both;">
					</div>
				</vab-query-form>
				<el-container style="height: calc(100%)">
					<el-aside width="320px">
						<!-- height: calc(67vh) -->
						<periodVerificationPlanTable ref="periodVerificationPlanTable" :permission="permission"
							type="periodVerificationPlan" style="height: 100%" :primary_key.sync="primary_key">
						</periodVerificationPlanTable>
					</el-aside>
					<el-main>
						<periodVerificationCheckTable ref="periodVerificationCheckTable" :permission="permission"
							type="periodVerificationCheck" style="height:100%" :primary_key="primary_key"
							v-if="primary_key>0">
						</periodVerificationCheckTable>
						<el-empty description="请先选择计划" v-else></el-empty>
					</el-main>
				</el-container>

			</el-tab-pane>
			<el-tab-pane label="核查计划台账" name="tableHistory">
				<vab-query-form style="margin-bottom: 0px">
					<vab-query-form-left-panel style="float: left;width:320px">
						<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;width: 123px;"
									v-model="queryFormPlanHistroy.plan_name" placeholder="计划名称" />
							</el-form-item>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;width: 123px;"
									v-model="queryFormPlanHistroy.planner" placeholder="计划人" />
							</el-form-item>

							<el-form-item>
								<el-button icon="el-icon-search" type="primary" @click="searchTablePlanHistory">

								</el-button>
							</el-form-item>
						</el-form>
					</vab-query-form-left-panel>
					<vab-query-form-right-panel style="float: right;;margin-right: 15px" v-show="primary_key_history>0">
						<el-form ref="form" :model="queryFormCheck" :inline="true" @submit.native.prevent>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;width: 123px;"
									v-model="queryFormCheckHistory.store_name" placeholder="标准物质名称" />
							</el-form-item>
							<el-form-item>
								<el-input clearable style="border-radius: 30px;width: 123px;"
									v-model="queryFormCheckHistory.mat_name" placeholder="标准物质类别" />
							</el-form-item>

							<el-form-item>
								<el-button icon="el-icon-search" type="primary" @click="searchTableCheckHistory">

								</el-button>
							</el-form-item>
						</el-form>
					</vab-query-form-right-panel>
					<div style="clear: both;">
					</div>
				</vab-query-form>
				<el-container style="height: calc(100%)">
					<el-aside width="320px">
						<!-- calc(73vh) -->
						<periodVerificationPlanTable ref="periodVerificationPlanHistory" :permission="permission"
							type="periodVerificationPlan" style="height: 100%"
							:primary_key.sync="primary_key_history">
						</periodVerificationPlanTable>
					</el-aside>
					<el-main>
						<periodVerificationCheckHistoryTable ref="periodVerificationCheckHistoryTable"
							:permission="permission" type="periodVerificationHistory" style="height: 100%"
							:primary_key="primary_key_history" v-if="primary_key_history>0">
						</periodVerificationCheckHistoryTable>
						<el-empty description="请先选择计划" v-else></el-empty>
					</el-main>
				</el-container>

			</el-tab-pane>
		</el-tabs>
		<!-- <table-edit1 ref="edit1"></table-edit1> -->
	</div>
</template>

<script>
	import {
		search_fob
	} from '@/global/form.helper'
	import {
		insert_fob,
		delete_fob
	} from '@/global/form.helper'
	import setting from '@/config/setting.config'



	import materiaExamineAndVerify from '../form/materiaExamineAndVerify'

	import periodVerificationPlanTable from '../table/periodVerificationPlanTable'
	import periodVerificationCheckTable from '../table/periodVerificationCheckTable'
	import periodVerificationCheckHistoryTable from '../table/periodVerificationCheckHistoryTable'
	export default {
		name: 'materialPurchase',
		components: {
			materiaExamineAndVerify,
			periodVerificationPlanTable,
			periodVerificationCheckTable,
			periodVerificationCheckHistoryTable
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger',
				}
				return statusMap[status]
			},
		},
		data() {
			return {
				primary_key: -1,
				primary_key_history: -1,
				permission: {
					periodVerificationPlanAdd: false,
				},
				c_name: '',
				queryFormPlanHistroy: {
					plan_name: '',
					planner: '',
				},
				queryForm: {
					plan_name: '',
					planner: '',
				},
				queryFormCheck: {
					store_name: '',
					mat_name: '',

				},
				queryFormCheckHistory: {
					store_name: '',
					mat_name: '',
				},
				listLoading: true,

				elementLoadingText: '正在加载...',
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight()
			},
			tabs: {
				//getter 方法
				get() {
					console.log('computed getter...')
					let dafault = 'table'
					if (this.c_name) {
						return this.c_name
					}
					if (this.$route.query.tabs) {
						return this.$route.query.tabs
					}
					return dafault
				},
				//setter 方法
				set(newValue) {
					console.log('computed setter...')
					this.c_name = newValue
				}

			}
		},
		created() {
			this.init()
		},
		beforeDestroy() {
			console.log('periodVerification')
		},
		mounted: function() {

		},
		methods: {
			async init() {
				let permissionList = ['periodVerification'];
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
			},
			handleCllickCancel() {
				this.$refs['materiaExamineAndVerify'].reset_form()
			},
			handleCllickOk() {
				let that = this
				this.$refs['materiaExamineAndVerify'].save(function(status) {
					if (status) {
						that.$refs["materiaExamineAndVerify"].resetForm()
						that.$baseConfirm('是否继续添加？', '提示', async () => {

							},
							function() {
								that.c_name = 'table'
								that.searchTablePlan()
							})
					}


				})
			},
			handleClick(VueComponent, MouseEvent) {
				//console.log(tab, event);
				this.c_name = VueComponent.name
				try {
					this.$router
						.push({
							path: this.$route.path,
							query: {
								tabs: '' + this.c_name
							},
						})
						.then(function() {})
						.catch(function() {})
				} catch (e) {
					console.log(e)
				}
			},
			handleAdd(row) {
				this.$refs['edit'].showEdit(row)
			},
			searchTablePlanHistory() {
				this.$refs['periodVerificationPlanHistory'].search(this.queryFormPlanHistroy)
			},
			searchTablePlan() {
				this.$refs['periodVerificationPlanTable'].search(this.queryForm)
			},
			searchTableCheck() {
				this.$refs['periodVerificationCheckTable'].search(this.queryFormCheck)
			},
			searchTableCheckHistory() {
				this.$refs['periodVerificationCheckHistoryTable'].search(this.queryFormCheckHistory)
			},

		},
	}
</script>

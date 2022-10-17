v<template>
	<div id="sxau_20171611244_yfdc_buy_reg_rec" class="definition  equipment_btn calc" name="yfdc_buy_reg_rec">
		<!--计划录入购入台账-->
		<el-tabs v-model="tabs" type="border-card" class="box_center" @tab-click="handleClick">
			<el-tab-pane label="计划录入" class="buy center" name="form" v-if="permission.verificationPlanAdd">
				<div
					style="display: flex;justify-content: center;box-shadow: rgb(170, 170, 170) 1px 1px 10px 1px;width: 1200px;margin: 0 auto;flex-wrap: wrap; padding-bottom: 20px; ">
					<div style="width: 100%;">
						<div style="height: 100%">
							<div class="purchasefrom">
								<verificationPlanForm ref="verificationPlanForm" :chemicalSelectStatus="false"
									:rmSelectStatus="false" style="padding: 20px 20px;">
								</verificationPlanForm>
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
						<verificationPlanForm ref="verificationPlanForm"></verificationPlanForm>
					</div>
					<div>
						
					</div>
				</div> -->
			</el-tab-pane>
			<el-tab-pane label="校验计划台账" name="table">
				<vab-query-form style="margin-bottom: 0px" ref="verificationPlanForm">
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
						<!-- style="height: calc(72vh)" -->
						<verificationPlanTable ref="verificationPlanTable" :permission="permission"
							type="verificationPlan" style="height: 100%" :primary_key.sync="primary_key">
						</verificationPlanTable>
					</el-aside>
					<el-main>
						<verificationPlanCheckTable ref="verificationPlanCheckTable" :permission="permission"
							type="verificationPlanCheck" style="height: 100%" :primary_key="primary_key"
							v-if="primary_key>0">
						</verificationPlanCheckTable>
						<el-empty description="请先选择计划" v-else></el-empty>
					</el-main>
				</el-container>

			</el-tab-pane>
			<el-tab-pane label="校验记录台账" name="tableHistory">
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
						<!-- calc(72vh) -->
						<verificationPlanTable ref="periodVerificationPlanHistory" :permission="permission"
							type="verificationPlan" style="height: 100%" :primary_key.sync="primary_key_history">
						</verificationPlanTable>
					</el-aside>
					<el-main>
						<verificationPlanCheckHistoryTable ref="verificationPlanCheckHistoryTable"
							:permission="permission" type="verificationPlanHistory" style="height: 100%"
							:primary_key="primary_key_history" v-if="primary_key_history>0">
						</verificationPlanCheckHistoryTable>
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



	import verificationPlanForm from '../form/verificationPlanForm'

	import verificationPlanTable from '../table/verificationPlanTable'
	import verificationPlanCheckTable from '../table/verificationPlanCheckTable'
	import verificationPlanCheckHistoryTable from '../table/verificationPlanCheckHistoryTable'
	export default {
		name: 'verificationPlan',
		components: {
			verificationPlanForm,
			verificationPlanTable,
			verificationPlanCheckTable,
			verificationPlanCheckHistoryTable
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
					verificationPlanAdd: false,
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
			GetPlanContainerStyle() {
				let form = this.$refs['verificationPlanForm']
				let formHight = form.$el.offsetHeight

			},
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
				let permissionList = ['verificationPlan'];
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
				this.$refs['verificationPlanForm'].reset_form()
			},
			handleCllickOk() {
				let that = this
				this.$refs['verificationPlanForm'].save(function(status) {
					if (status) {
						that.$refs["verificationPlanForm"].resetForm()
						that.$baseConfirm('是否继续添加？', '提示', async () => {

							},
							function() {
								that.tabs = 'table'
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
					this.$route.query.tabs = this.c_name
					// this.$router
					// 	.push({
					// 		path: this.$route.path,
					// 		query: {
					// 			tabs: '' + this.c_name
					// 		},
					// 	})
					// 	.then(function() {})
					// 	.catch(function() {})
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
				this.$refs['verificationPlanTable'].search(this.queryForm)
			},
			searchTableCheck() {
				this.$refs['verificationPlanCheckTable'].search(this.queryFormCheck)
			},
			searchTableCheckHistory() {
				this.$refs['verificationPlanCheckHistoryTable'].search(this.queryFormCheckHistory)
			},

		},
	}
</script>

<template>
	<!-- 人员登记 人员台账 -->
	<div class="definition purchase equipment_btn calc cardStyle">
		<el-tabs :value="activeName" class="box_center" @tab-click="clickTab">
			<el-tab-pane label="人员登记" class="center" v-if="permission.person_about.person_add" name="add">
				<div class="tabBox" style="margin-right:10px ;">
					<div style="width: 100%;">
						<div style="height: 100%">
							<div class="purchasefrom">
								<personnelFrom ref="personnelFrom"></personnelFrom>
							</div>
						</div>
					</div>
					<div style="width: 100%; height: 60px; display: flex">
						<el-button @click="submitForm"
							style="margin: 0 auto; height: 40px; width: 200px;margin-top: 10px;" type="primary">
							确 定
						</el-button>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="人员台账" name="table">
				<div class="table-container definition2 purchase distribution ledger" style="margin-right: 10px;">
					<el-container style="height: calc(100vh - 46px - 123px);overflow-y: auto;">
						<div class="baseBox" style="margin-bottom:10px;">
							<vab-query-form>
								<personelSearch ref="personelSearch" v-model='searchData' :search_fob="search_main_fob"
									style="float:right;">
								</personelSearch>
							</vab-query-form>
							<el-main style="height: calc(45%); min-height:265px" class="box1">
								<personelTable ref="personelTable" style="height: calc(100%);min-height:265px;"
									:selectForm.sync="searchData" :primary_key.sync="primary_key"
									:permission="permission">
								</personelTable>
							</el-main>
						</div>
						<el-footer style="height: calc(55% - 12px); min-height:280px;overflow-y: auto;"
							class="table_auto">


							<el-tabs type="border-card" style="height: calc(100%)">
								<el-tab-pane label="教育经历">
									<educationalTable style="height: calc(33vh)" ref="educationalTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</educationalTable>
								</el-tab-pane>
								<el-tab-pane label="工作经历">
									<personWorkTable style="height: calc(33vh)" ref="personWorkTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</personWorkTable>
								</el-tab-pane>
								<el-tab-pane label="培训经历">
									<personTrainingTable style="height: calc(33vh)" ref="personTrainingTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</personTrainingTable>
								</el-tab-pane>
								<el-tab-pane label="主持项目">
									<personHostTable style="height: calc(33vh)" ref="personHostTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</personHostTable>
								</el-tab-pane>
								<el-tab-pane label="调动记录">
									<personMoveTable style="height: calc(33vh)" ref="personMoveTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</personMoveTable>
								</el-tab-pane>
								<el-tab-pane label="分工记录">
									<personelDivisionTable style="height: calc(33vh)" ref="personelDivisionTable"
										:type="0" :primary_key.sync="primary_key" :permission="permission">
									</personelDivisionTable>
								</el-tab-pane>
								<el-tab-pane label="发表论文">
									<personnelPaperTable style="height: calc(33vh)" ref="personnelPaperTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</personnelPaperTable>
								</el-tab-pane>
								<el-tab-pane label="科技成果">
									<personnelTechTable style="height: calc(33vh)" ref="personnelTechTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</personnelTechTable>
								</el-tab-pane>
								<el-tab-pane label="相关证书">
									<personCartTable style="height: calc(33vh)" ref="personCartTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</personCartTable>
								</el-tab-pane>
								<el-tab-pane label="授权记录">
									<personelGrantTable style="height: calc(33vh)" ref="personelGrantTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</personelGrantTable>
								</el-tab-pane>
								<el-tab-pane label="人员角色" v-if="permission.person_role">
									<personRoleTable style="height: calc(33vh)" ref="personRoleTable" :type="0"
										:primary_key.sync="primary_key" :permission="permission">
									</personRoleTable>
								</el-tab-pane>
								<el-tab-pane label="监督检查记录" v-if="permission.person_supervise">
									<personelSuperviseTable style="height: calc(33vh)" ref="personelSuperviseTable"
										:type="0" :primary_key.sync="primary_key" :permission="permission">
									</personelSuperviseTable>
								</el-tab-pane>
							</el-tabs>
						</el-footer>
					</el-container>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import {
		getList,
		doDelete,
		doEdit
	} from '@/api/table'
	import educationalTable from '../table/educationalExperienceTable'
	import personelTable from '../table/personelTable'
	import personWorkTable from '../table/personWorkTable'
	import personTrainingTable from '../table/personTrainingTable'
	import personHostTable from '../table/personHostTable'
	import personnelPaperTable from '../table/personnelPaperTable'
	import personnelTechTable from '../table/personnelTechTable'
	import personMoveTable from '../table/personMoveTable'

	import personRoleTable from '../table/personRoleTable'

	import personCartTable from '../table/personCartTable'
	import personelGrantTable from '../table/personelGrantTable'
	import personelDivisionTable from '../table/personelDivisionTable'
	import personelSuperviseTable from '../table/personelSuperviseTable'

	import personelSearch from '../form/personelSearch'
	import personnelFrom from '../form/personnelFrom'


	export default {
		name: 'personnelLedger',
		components: {
			personelSearch,
			personelTable,
			educationalTable,
			personnelFrom,
			personWorkTable,
			personTrainingTable,
			personHostTable,
			personnelPaperTable,
			personnelTechTable,
			personCartTable,
			personelGrantTable,
			personelDivisionTable,
			personMoveTable,
			personRoleTable,
			personelSuperviseTable
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
		provide() {
			return {
				reload: this.reload,
			}
		},

		data() {
			return {
				activeName: this.$route.query.tabs ? this.$route.query.tabs : 'table',
				searchData: undefined,
				primary_key: -1,
				permission: {
					//人员主表
					person_about: {
						person_add: false,
						person_edit: false,
						person_delete: false,
						permission: false,
						all_person_info: false,
					},
					//教育经历
					education: {
						education_add: false,
						education_edit: false,
						education_delete: false,
						education_examine: false,
					},
					//工作记录
					work: {
						work_add: false,
						work_edit: false,
						work_delete: false,
						work_examine: false,
					},
					//培训记录
					train: {
						train_add: false,
						train_edit: false,
						train_delete: false,
						train_examine: false,
					},
					//主持项目
					host: {
						host_add: false,
						host_edit: false,
						host_delete: false,
						host_examine: false,
					},
					//调动记录
					move: {
						move_add: false,
						move_edit: false,
						move_delete: false,
						move_examine: false
					},
					//分工记录
					division: {
						division_add: false,
						division_edit: false,
						division_delete: false,
						division_examine: false
					},
					//发表论文
					paper: {
						paper_add: false,
						paper_edit: false,
						paper_delete: false,
						paper_examine: false,
					},
					//科学成果
					award: {
						award_add: false,
						award_edit: false,
						award_delete: false,
						award_examine: false,
					},
					//相关证书
					cert: {
						cert_add: false,
						cert_edit: false,
						cert_delete: false,
						cert_examine: false
					},
					//授权记录
					empower: {
						empower_add: false,
						empower_edit: false,
						empower_delete: false,
						empower_examine: false
					},
					person_role: false,
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false
				},
			}
		},
		computed: {

		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			async init() {
				const permission = await this.$store.dispatch('permission/GetALLPermissionByModel', 'person_table')
				this.permission = Object.assign(this.permission, permission)
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {

			},
			async fetchData() {
				let that = this;
				try {

				} catch (e) {
					console.log(e)
				}
			},
			submitForm() {
				let that = this
				that.activeName = 'add'
				that.$refs["personnelFrom"].save(function(status) {
					if (!status) {
						return false
					}
					that.$refs["personnelFrom"].resetForm()
					that.$refs["personelTable"].fetchData()
					that.$baseConfirm('是否继续添加？', '提示', async () => {

						},
						function() {
							that.activeName = 'table'

						})
				})
			},
			search_main_fob(data) {
				//search
				this.$refs["personelTable"].search(data)
			},
		},


	}
</script>
<style>
	.vab-query-form {
		margin-bottom: 0px !important;
	}

	.el-form-item--small.el-form-item {
		margin-bottom: 10px
	}

	/* .el-col-21{float: right;}
.el-col-4{width: auto;} */
	.cardStyle .el-tabs__header:not(.el-footer .el-tabs__header) {
		margin-bottom: 10px;
		margin-right: 10px;
		background: #fff;
		border-radius: 5px;
		border: 1px solid #dbe0e6;
		padding: 10px;
		box-sizing: border-box;
		box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
	}

	.tabBox {
		display: flex;
		background: #fff;
		border-radius: 5px;
		padding: 10px;
		height: 100%;
		box-sizing: border-box;
		box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
		border: 1px solid #dbe0e6;
		justify-content: center;
		width: 100%;
		margin: 0 auto;
		flex-wrap: wrap;
	}

	.definition .center {
		align-items: flex-start;
	}
</style>

<template>
	<!-- 化学品库存 -->
	<!-- definition purchase equipment_btn calc cardStyle -->
	<div class="purchase calc cardStyle">
		<div class="baseBox" style="margin-bottom: 10px; margin-right:10px;">
			<vab-query-form style="margin-bottom: 0px;">

				<!-- <postRegistrationSearchForm ref="postRegistrationSearchForm" v-model="searchData"
          :search_fob="search_main_fob" :permission="permission" :nextStatus="nextStatus">
        </postRegistrationSearchForm> -->
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent style="float: right;">
					<el-form-item style="" v-show="!status">
						<el-select v-model="queryForm.status" style="width: 100%" placeholder='请选择状态...' clearable>
							<el-option v-for="data in selectData.status" :key="data.item_id" :label="data.item_name"
								:value="data.custom">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item style="">
						<el-input v-model="queryForm.compiler" clearable style="width: 100%;" placeholder="编写人">
						</el-input>
					</el-form-item>
					<el-form-item style="">
						<el-input v-model="queryForm.review_person" clearable style="width: 100%;" placeholder="复核人">
						</el-input>
					</el-form-item>
					<el-form-item style="">
						<el-input v-model="queryForm.examine_person" clearable style="width: 100%;" placeholder="审核人">
						</el-input>
					</el-form-item>
					<el-form-item style="">
						<el-input v-model="queryForm.approve_person" clearable style="width: 100%;" placeholder="审定人">
						</el-input>
					</el-form-item>
					<el-form-item style="margin-right:0px;">
						<el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectMain">
						</el-button>
						<el-button icon="el-icon-plus" native-type="submit" @click="HandlAddReport">

						</el-button>
						<!-- <el-button type="primary" @click="toChemicalAlloc">
							前往化学品分配页面
						</el-button> -->
					</el-form-item>
				</el-form>
			</vab-query-form>
			<GeophysicalProspectingReportTable ref="GeophysicalProspectingReportTable" :type="'report_main'"
				style="height: calc(45%); min-height: 300px" :select-form.sync="searchData"
				:primary_key.sync="primary_key" :permission="permission" :nextStatus="nextStatus" :status="status">
			</GeophysicalProspectingReportTable>
		</div>

		<el-main class="box1" style="margin-right: 10px;">
			<el-footer style="height: calc(50%); min-height:280px;" class="table_auto">
				<el-tabs type="border-card" style="height: calc(100%)">
					<el-tab-pane label="审核记录">
						<GeoReportExaminationHistoryTable style="height: calc(41vh)"
							ref="GeoReportExaminationHistoryTable" :type="'history_main'"
							:primary_key.sync="primary_key" :permission="permission">
						</GeoReportExaminationHistoryTable>
					</el-tab-pane>
					<!-- <el-tab-pane label="购入记录">
						<chemicalPurchaseTalbe style="height: calc(41vh)" ref="chemicalPurchaseTalbe"
							:type="'chemical_store'" :primary_key.sync="primary_key" :permission="permission">
						</chemicalPurchaseTalbe>
					</el-tab-pane>
					<el-tab-pane label="消耗记录">
						<chemicalConsumeTable style="height: calc(41vh)" ref="chemicalConsumeTable"
							:type="'chemical_store'" :primary_key.sync="primary_key" :permission="permission">
						</chemicalConsumeTable>
					</el-tab-pane>
					<el-tab-pane label="盘点记录">
						<chemicalCheckTable style="height: calc(41vh)" ref="chemicalCheckTable" :type="'chemical_store'"
							:primary_key.sync="primary_key" :permission="permission">
						</chemicalCheckTable>
					</el-tab-pane>
					<el-tab-pane label="作废记录">
						<chemicalNullifyTable style="height: calc(41vh)" ref="chemicalNullifyTable"
							:type="'chemical_store'" :primary_key.sync="primary_key" :permission="permission">
						</chemicalNullifyTable>
					</el-tab-pane>
					<el-tab-pane label="标准物质制作">
						<rmMakeTable style="height: calc(41vh)" ref="rmMakeTable" :type="'chemical_store'"
							:primary_key.sync="primary_key" :permission="permission">
						</rmMakeTable>
					</el-tab-pane> -->

				</el-tabs>
			</el-footer>
		</el-main>
		<GeophysicalProspectingReportDialog ref="geoReportDialog" @reload="selectMain">
		</GeophysicalProspectingReportDialog>
	</div>
</template>

<script>
	import {
		GetGroupData,
		GetGroupDataEx
	} from '@/utils/htmlDataGroup'
	import GeophysicalProspectingReportTable from '../table/GeophysicalProspectingReportTable';
	import GeoReportExaminationHistoryTable from '../table/GeoReportExaminationHistoryTable';
	import GeophysicalProspectingReportDialog from '../dialog/GeophysicalProspectingReportAdd'
	// import chemicalPurchaseTalbe from '../table/chemicalPurchaseTalbe'


	// import chemicalConsumeTable from '../table/chemicalConsumeTable'

	// import chemicalCheckTable from '../table/chemicalCheckTable'
	// import chemicalNullifyTable from '../table/chemicalNullifyTable'
	//import rmMakeTable from '../table/rmMakeTable'
	//chemicalPurchaseTalbe
	export default {
		name: 'GeophysicalProspectingReport',
		components: {
			GeophysicalProspectingReportTable,
			GeophysicalProspectingReportDialog,
			GeoReportExaminationHistoryTable

		},
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
				default: ''
			}
		},
		data() {
			return {
				selectData: {
					status: [],
				},
				searchData: undefined,
				primary_key: -1,
				queryForm: {
					name: ''
				},
				permission: {

					person_role: false,
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
			}
		},
		computed: {

		},
		created: async function() {
			await this.init()
		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			async init() {
				this.GetGroup();
				let permissionList = ['GeoReport'];
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
			async GetGroup() {
				let list = [{
					data: "status",
					group_id: 1041
				}];
				await GetGroupDataEx(this, list);
				//console.log(this.selectData.status)
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			HandlAddReport() {
				this.$refs['geoReportDialog'].showEdit();
			},
			async fetchData() {
				this.$nextTick(() => {
					this.$refs['GeophysicalProspectingReportTable'].fetchData()
				})

			},
			toChemicalAlloc(event) {
				this.$router.push('chemicalDistribution')
			},
			selectMain() {
				this.search_main_fob(this.queryForm)
			},
			search_main_fob(data) {
				//search
				this.$refs['GeophysicalProspectingReportTable'].search(data)
			},
		},
	}
</script>

<style>
	.el-form-item--small.el-form-item {
		margin-bottom: 10px;
	}


	@media only screen and (max-width: 1366px) {
		.el-footer {
			height: calc(50%) !important;
			min-height: 280px !important;
		}
	}
</style>

<template>
	<!-- 化学品库存 -->
	<div class=" definition purchase equipment_btn calc">
		<div class="baseBox" style="margin-bottom: 10px; margin-right:10px;">
			<vab-query-form style="margin-bottom: 0px;">
				<!-- <postRegistrationSearchForm ref="postRegistrationSearchForm" v-model="searchData"
          :search_fob="search_main_fob" :permission="permission" :nextStatus="nextStatus">
        </postRegistrationSearchForm> -->
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent style="float: right;">
					<el-form-item style="">
						<el-input v-model="queryForm.name" clearable style="width: 100%;" placeholder="化学品名称">
						</el-input>
					</el-form-item>
					<el-form-item style="">
						<el-input v-model="queryForm.keeper" clearable style="width: 100%;" placeholder="保管人">
						</el-input>
					</el-form-item>
					<el-form-item style="margin-right:0px;">
						<el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData">
						</el-button>
						<el-button type="primary" @click="toChemicalAlloc">
							前往化学品分配页面
						</el-button>
					</el-form-item>
				</el-form>
			</vab-query-form>
			<chemicalStoreTable ref="chemicalStoreTable" :type="'chemical_store'"
				style="height: calc(45%); min-height: 300px" :select-form.sync="searchData"
				:primary_key.sync="primary_key" :permission="permission" :nextStatus="nextStatus" :status="status">
			</chemicalStoreTable>
		</div>

		<el-main class="box1" style="margin-right: 10px;">
			<el-footer style="height: calc(50%); min-height:280px;" class="table_auto">
				<el-tabs type="border-card" style="height: calc(100%)">
					<el-tab-pane label="购入记录">
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
					</el-tab-pane>

				</el-tabs>
			</el-footer>
		</el-main>
	</div>
</template>

<script>
	import chemicalStoreTable from '../table/chemicalStoreTable'
	import chemicalPurchaseTalbe from '../table/chemicalPurchaseTalbe'


	import chemicalConsumeTable from '../table/chemicalConsumeTable'

	import chemicalCheckTable from '../table/chemicalCheckTable'
	import chemicalNullifyTable from '../table/chemicalNullifyTable'
	import rmMakeTable from '../table/rmMakeTable'
	//chemicalPurchaseTalbe
	export default {
		name: 'dispatchRegister',
		components: {
			chemicalStoreTable,
			chemicalPurchaseTalbe,
			chemicalConsumeTable,
			chemicalCheckTable,
			chemicalNullifyTable,
			rmMakeTable
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
				default: '0'
			}
		},
		data() {
			return {
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
				let permissionList = ['chemicalStock'];
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
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				this.$nextTick(() => {
					this.$refs['chemicalStoreTable'].fetchData()
				})

			},
			toChemicalAlloc(event) {
				this.$router.push('chemicalDistribution')
			},
			selectData() {
				this.search_main_fob(this.queryForm)
			},
			search_main_fob(data) {
				//search
				this.$refs['chemicalStoreTable'].search(data)
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

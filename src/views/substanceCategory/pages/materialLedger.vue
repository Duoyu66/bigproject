<template>
  <!-- 标准物质台账 -->
	<div class=" definition purchase equipment_btn calc">
		<el-main class="box1" style="height: calc(100vh - 120px); min-height: 300px">
      <div class="baseBox" style="margin-bottom: 10px;">
        <vab-query-form style="margin-bottom: 0px;">
          <!-- <postRegistrationSearchForm ref="postRegistrationSearchForm" v-model="searchData"
            :search_fob="search_main_fob" :permission="permission" :nextStatus="nextStatus">
          </postRegistrationSearchForm> -->
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
            <el-form-item style="">
              <el-input v-model="queryForm.store_name" clearable style="width: 100%;" placeholder="标准物质名称">
              </el-input>
            </el-form-item>
            <el-form-item style="">
              <el-input v-model="queryForm.mat_name" clearable style="width: 100%;" placeholder="标准物质类别">
              </el-input>
            </el-form-item>
            <el-form-item style="">
              <el-input v-model="queryForm.keeper" clearable style="width: 100%;" placeholder="保管人">
              </el-input>
            </el-form-item>
            <el-form-item style="">
              <el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData">
              </el-button>
              <el-button type="primary" @click="toRmAlloc">
                前往标准物质分配页面
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form>
        <RmStoreTable ref="RmStoreTable" :type="'RmStoreTable'" style="height: calc(45%); min-height: 300px"
				:select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission"
				:nextStatus="nextStatus" :status="status">
        </RmStoreTable>
			</div>


      <el-footer style="height: calc(54%); min-height: 300px;padding-left: 0px;padding-right: 0px;"
				class="table_auto">
          <el-tabs type="border-card" style="height: calc(100%)">
            <el-tab-pane label="购入记录">
              <materialPurchaseTable style="height: calc(35vh)" ref="materialPurchaseTable"
                :type="'chemical_store'" :primary_key.sync="primary_key" :permission="permission">
              </materialPurchaseTable>
            </el-tab-pane>
            <el-tab-pane label="消耗记录">
              <materialConsumeTable style="height: calc(35vh)" ref="materialConsumeTable"
                :type="'chemical_store'" :primary_key.sync="primary_key" :permission="permission">
              </materialConsumeTable>
            </el-tab-pane>
            <el-tab-pane label="盘点记录">
              <rmCheckTable style="height: calc(35vh)" ref="rmCheckTable" :type="'chemical_store'"
                :primary_key.sync="primary_key" :permission="permission">
              </rmCheckTable>
            </el-tab-pane>
            <el-tab-pane label="作废记录">
              <materiaNullifylTable style="height: calc(35vh)" ref="materiaNullifylTable"
                :type="'chemical_store'" :primary_key.sync="primary_key" :permission="permission">
              </materiaNullifylTable>
            </el-tab-pane>
            <el-tab-pane label="校验记录">
              <verificationPlanCheckHistoryTable style="height: calc(35vh)"
                ref="verificationPlanCheckHistoryTable" :type="'chemical_store'"
                :primary_key.sync="primary_key" :permission="permission">
              </verificationPlanCheckHistoryTable>
            </el-tab-pane>
            <el-tab-pane label="核查记录">
              <periodVerificationCheckHistoryTable style="height: calc(35vh)"
                ref="periodVerificationCheckHistoryTable" :type="'chemical_store'"
                :primary_key.sync="primary_key" :permission="permission">
              </periodVerificationCheckHistoryTable>
            </el-tab-pane>
          </el-tabs>

      </el-footer>
		</el-main>
	</div>
</template>

<script>
	import RmStoreTable from '../table/RmStoreTable'
	import materialPurchaseTable from '../table/materialPurchaseTable'
	import verificationPlanCheckHistoryTable from '../table/verificationPlanCheckHistoryTable'
	import periodVerificationCheckHistoryTable from '../table/periodVerificationCheckHistoryTable'
	import materialConsumeTable from '../table/materialConsumeTable'

	import rmCheckTable from '../table/rmCheckTable'
	import materiaNullifylTable from '../table/materiaNullifylTable'
	//materialPurchaseTable
	export default {
		name: 'dispatchRegister',
		components: {
			RmStoreTable,
			materialPurchaseTable,
			materialConsumeTable,
			rmCheckTable,
			materiaNullifylTable,
			verificationPlanCheckHistoryTable,
			periodVerificationCheckHistoryTable
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
					store_name: ''
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
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				this.$nextTick(() => {
					this.$refs['RmStoreTable'].fetchData()
				})

			},
			toRmAlloc(event) {
				this.$router.push('materialCustomizations')
			},
			selectData() {
				this.search_main_fob(this.queryForm)
			},
			search_main_fob(data) {
				//search
				this.$refs['RmStoreTable'].search(data)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px;}
</style>

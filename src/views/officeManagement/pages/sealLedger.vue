<template>
  <!-- 印章台账 -->
	<div class=" definition purchase equipment_btn calc" style="margin-right:10px;overflow: auto;">
    <div class="baseBox" style="margin-bottom:10px;">
      <vab-query-form >
        <sealLedgerSearchForm ref="sealLedgerSearchForm" v-model="searchData" :search_fob="search_main_fob"
          :permission="permission" :nextStatus="nextStatus" style="float: right;">
        </sealLedgerSearchForm>
      </vab-query-form>
      <sealLedgerTable ref="sealLedgerTable" :type="1" style="height: calc(48%); min-height: 300px"
        :select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission"
        :nextStatus="nextStatus" :status="status">
      </sealLedgerTable>
    </div>
		<el-main class="box1" >
			<el-footer style="height: calc(50%); padding: 0px;" class="table_auto">
				<el-tabs type="border-card" style="height: calc(100%)">
					<el-tab-pane label="用印记录">
						<sealApplyTable style="height: calc(30vh)" ref="sealApplyTable" :type="0"
							:primary_key.sync="primary_key" :permission="permission">
						</sealApplyTable>
					</el-tab-pane>
				</el-tabs>
			</el-footer>
		</el-main>
	</div>
</template>

<script>
	import sealLedgerTable from '../table/sealLedgerTable'
	import sealApplyTable from '../table/sealApplyTable'
	import sealLedgerSearchForm from '../searchForm/sealLedgerSearchForm'
	//sealApplyTable
	export default {
		name: 'sealLedger',
		components: {
			sealLedgerTable,
			sealApplyTable,
			sealLedgerSearchForm,
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
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {},
		methods: {
			async init() {
				let permissionList = ['sealLedger'];
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
				this.$refs['sealLedgerTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['sealLedgerTable'].search(data)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px}
.vab-query-form{margin-bottom:0px!important}
.el-form--inline .el-form-item:last-of-type{margin-right: 0;}



</style>

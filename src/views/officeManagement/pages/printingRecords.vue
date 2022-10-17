<template>
  <!-- 用印记录 -->
	<div class=" definition purchase equipment_btn calc" style="margin-right:10px;">
    <div class="baseBox">
      <vab-query-form >
        <sealProcSearchForm ref="sealProcSearchForm" v-model="searchData" :search_fob="search_main_fob"
          :permission="permission" :nextStatus="nextStatus" style="float: right;">
        </sealProcSearchForm>
      </vab-query-form>
      <el-main class="box1" style="height: calc(100vh - 182px); min-height: 300px">
        <sealApplyTable style="height: calc(80vh)" ref="sealApplyTable" :type="1" :primary_key.sync="primary_key"
          :permission="permission">
        </sealApplyTable>
      </el-main>
    </div>
	</div>
</template>

<script>
	import sealLedgerTable from '../table/sealLedgerTable'
	import sealApplyTable from '../table/sealApplyTable'
	import sealProcSearchForm from '../searchForm/sealProcSearchForm'
	//sealApplyTable
	export default {
		name: 'printingRecords',
		components: {
			sealLedgerTable,
			sealApplyTable,
			sealProcSearchForm,
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
				this.$refs['sealApplyTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['sealApplyTable'].search(data)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px}
.vab-query-form{margin-bottom:0px!important;}
.el-form--inline .el-form-item:last-of-type{margin-right: 0;}
</style>

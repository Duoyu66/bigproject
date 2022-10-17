<template>
	<!-- definition purchase equipment_btn calc -->
	<div class="permissions-container " style="overflow: auto;margin-right:10px;">
    <div class="baseBox">
      <vab-query-form style="">
        <TrcuckManageSearch ref="TrcuckManageSearch" v-model="searchData"
          :search_fob="search_main_fob" :permission="permission"></TrcuckManageSearch>
      </vab-query-form>
      <el-main class="box1" style="height: calc(100vh - 180px); min-height: 300px">
        <TruckTable ref="TruckTable" :type="1" style="height: calc(100vh - 317px); min-height: 300px"
          :select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission">
        </TruckTable>
      </el-main>
    </div>
	</div>
</template>

<script>
	import TruckTable from '../table/TruckTable'
	import TrcuckManageSearch from '../searchForm/TrcuckManageSearch'
	export default {
		name: 'TruckManage',
		components: {
			TruckTable,
			TrcuckManageSearch,
		},
		provide() {
			return {
				reload: this.reload,
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
				const permission = await this.$store.dispatch(
					'permission/GetALLPermissionByModel',
					'TruckManage'
				)
				this.permission = Object.assign(this.permission, permission)
				console.log('TruckManage',permission)
				await this.fetchData()
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				this.$refs['TruckTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['TruckTable'].search(data)
			},
		},
	}
</script>

<style>
  .el-form-item--small.el-form-item{margin-bottom:10px;}
  .vab-query-form{margin-bottom:0!important;}
   @media only screen and (max-width: 1366px) {
    .box1{height: calc(100vh - 222px)!important;}
   }
</style>
<template>
  <!-- 外委机构管理 -->
	<div class="definition purchase equipment_btn calc baseBox" style="margin-right:10px;">
		<vab-query-form style="margin-bottom: 0px;">
			<outsourcingOrganization ref="outsourcingOrganization" v-model="searchData"
				:search_fob="search_main_fob" :permission="permission"></outsourcingOrganization>
		</vab-query-form>
		<el-main class="box1" style="height: calc(100vh - 270px); min-height: 300px">
			<outsourcingOrgTable ref="outsourcingOrgTable" :type="1" style="height: calc(100vh - 317px); min-height: 300px"
				:select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission">
			</outsourcingOrgTable>
		</el-main>
	</div>
</template>

<script>
	import outsourcingOrgTable from '../table/outsourcingOrgTable'
	import outsourcingOrganization from '../searchForm/outsourcingOrganization'
	export default {
		name: 'PersonnelAllocation',
		components: {
			outsourcingOrgTable,
			outsourcingOrganization,
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
					'outsourcingOrganization'
				)
				this.permission = Object.assign(this.permission, permission)
				console.log(permission)
				await this.fetchData()
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				this.$refs['outsourcingOrgTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['outsourcingOrgTable'].search(data)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px;}
.el-form-item--small.el-form-item:nth-last-of-type{margin-right:0!important;}

</style>

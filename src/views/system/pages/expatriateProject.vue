<template>
  <!-- 外派项目 -->
	<div class=" purchase equipment_btn calc baseBox" style="margin-right: 10px;">
		<vab-query-form style="margin-bottom:0px;">
			<expatriateProjectSearch ref="expatriateProjectSearch" v-model="searchData" :search_fob="search_main_fob"
				:permission="permission"></expatriateProjectSearch>
		</vab-query-form>
		<el-main class="box1" style="height: calc(100vh - 180px); min-height: 300px">
			<expatriateProjectTable ref="expatriateProjectTable" :type="1"
				style="height: calc(100vh - 222px); min-height: 300px" :select-form.sync="searchData"
				:primary_key.sync="primary_key" :permission="permission">
			</expatriateProjectTable>
		</el-main>
	</div>
</template>

<script>
	import expatriateProjectTable from '../table/expatriateProjectTable'
	import expatriateProjectSearch from '../searchForm/expatriateProjectSearch'
	export default {
		name: 'expatriateProject',
		components: {
			expatriateProjectTable,
			expatriateProjectSearch,
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
					'expatriateProject'
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
				this.$refs['expatriateProjectTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['expatriateProjectTable'].search(data)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px;}
</style>

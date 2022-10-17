<template>
  <!-- 人员监督检查记录 -->
	<div class="definition purchase equipment_btn calc baseBox" style="margin-right: 10px;">
		<vab-query-form style="margin-bottom: 0px;">
			<personelSupervisionSearch ref="personelSupervisionSearch" v-model="searchData"
				:search_fob="search_main_fob" :permission="permission"></personelSupervisionSearch>
		</vab-query-form>
		<el-main class="box1" style="height: calc(100vh - 270px); min-height: 300px">
			<personelSuperviseTable ref="personelSuperviseTable" :type="1"
				style="height: calc(100vh - 317px); min-height: 300px" :select-form.sync="searchData"
				:primary_key.sync="primary_key" :permission="permission">
			</personelSuperviseTable>
		</el-main>
	</div>
</template>

<script>
	import personelSuperviseTable from '../table/personelSuperviseTable'
	import personelSupervisionSearch from '../form/personelSupervisionSearch'
	export default {
		name: 'PersonnelAllocation',
		components: {
			personelSuperviseTable,
			personelSupervisionSearch,
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
					'person_table'
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
				this.$refs['personelSuperviseTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['personelSuperviseTable'].search(data)
			},
		},
	}
</script>
<style>
  .vab-query-form{margin-bottom: 0px!important;}
  .el-form-item--small.el-form-item {margin-bottom: 10px}
</style>
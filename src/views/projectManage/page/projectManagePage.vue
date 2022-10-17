<template>
	<!-- definition purchase equipment_btn calc -->
	<div class="permissions-container " style="overflow: auto;margin-right:10px;">
		<div class="baseBox">
			<vab-query-form style="">
				<projectSearchForm ref="projectSearchForm" v-model="searchData" :search_fob="search_main_fob"
					:permission="permission"></projectSearchForm>
			</vab-query-form>
			<el-main class="box1" style="height: calc(100vh - 180px); min-height: 300px">
				<projectManageTable ref="projectManageTable" :type="0"
					style="height: calc(100vh - 230px); min-height: 300px" :select-form.sync="searchData"
					:primary_key.sync="primary_key" :permission="permission">
				</projectManageTable>
			</el-main>
		</div>
	</div>
</template>

<script>
	import projectManageTable from '../table/projectManageTable'
	import projectSearchForm from '../searchForm/projectSearchForm'
	export default {
		name: 'projectManagePage',
		components: {
			projectManageTable,
			projectSearchForm,
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
					'projectManage'
				)
				this.permission = Object.assign(this.permission, permission)
				await this.fetchData()
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			reload() {},
			handlExport() {},
			async fetchData() {
				this.$refs['projectManageTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['projectManageTable'].search(data)
			},
		},
	}
</script>

<style>
	.el-form-item--small.el-form-item {
		margin-bottom: 10px;
	}

	.vab-query-form {
		margin-bottom: 0 !important;
	}

	@media only screen and (max-width: 1366px) {
		.box1 {
			height: calc(100vh - 222px) !important;
		}
	}
</style>

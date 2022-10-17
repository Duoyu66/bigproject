<template>
  <!-- 权限管理 -->
	<div class="permissions-container baseBox" style="overflow: auto;margin-right:10px;">
		<vab-query-form>
			<vab-query-form-left-panel style="width:50%;">
				<el-button icon="el-icon-plus" type="primary" @click="AddRoot" v-if="permission.permissionManageAdd">
					添加根节点
				</el-button>
			</vab-query-form-left-panel>
			<div style="float: right;width:auto;">
				<el-form ref="form" :model="form" :inline="true" @submit.native.prevent>
					<el-form-item>
						<el-input v-model="form.title" placeholder="标题" />
					</el-form-item>
					<el-form-item style="margin-right:0px;">
						<el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery">
							查询
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</vab-query-form>

		<permissionTable ref="permissionTable" :type="1" style="height: calc(100vh - 317px); min-height: 300px"
			:select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission">
		</permissionTable>
		<permissionFrom ref="permissionFrom" :is-up-data.sync="main_dialog"></permissionFrom>
	</div>
</template>

<script>
	import permissionFrom from './../components/permissionFrom'
	import permissionTable from '../table/permissionTable'

	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'permission',
		components: {
			permissionTable,
			permissionFrom
		},
		provide() {
			return {
				reload: this.handleQuery,
			}
		},

		data() {
			return {
				searchData: undefined,
				primary_key: -1,
				form: {
					account: '',
					title: '',
				},
				main_dialog: false,
				permission: {
					permissionManageAdd: false,
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
					'permissionManage'
				)
				this.permission = Object.assign(this.permission, permission)
				//console.log(permission)
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
					this.$refs['permissionTable'].fetchData()
				})


			},
			handleQuery() {
				this.search_main_fob(this.form)
			},
			search_main_fob(data) {
				//search
				this.$refs['permissionTable'].search(data)
			},
			AddRoot() {
				this.handleshowDialog(undefined, false, {
					parent_id: 0,
				}, {
					title: '添加根节点'
				})
			},
			handleshowDialog(row, disable, person_info, option) {
				//console.log(this.$refs['permissionFrom'])
				this.$refs['permissionFrom'].showEdit(row, disable, person_info, option)
			},
		},
	}
</script>

<style>
.el-form-item--small.el-form-item{margin-bottom:10px;}
.vab-query-form{margin-bottom:0!important;}
</style>

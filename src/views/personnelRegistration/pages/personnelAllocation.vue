<template>
<!-- 人员调动记录 -->
	<div class="table-container definition2 purchase distribution ledger baseBox" style="overflow:auto ;margin-right: 10px;">

      <vab-query-form style="margin-bottom: 0px;">
        <personelStaffAllocationSearch ref="personelStaffAllocationSearch" v-model="searchData"
          :search_fob="search_main_fob" style="float:right;">
          </personelStaffAllocationSearch>
      </vab-query-form>
      <el-main class="box1" style="height: calc(100vh - 200px); min-height: 300px">
        <personMoveTable ref="personMoveTable" :type="1" style="height: calc(100vh - 240px); min-height: 300px"
          :select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission">
        </personMoveTable>
      </el-main>

	</div>
</template>

<script>
	import personMoveTable from '../table/personMoveTable'
	import personelStaffAllocationSearch from '../form/personelStaffAllocationSearch'
	export default {
		name: 'PersonnelAllocation',
		components: {
			personMoveTable,
			personelStaffAllocationSearch,
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
					//人员主表
					person_about: {
						person_add: false,
						person_edit: false,
						person_delete: false,
						permission: false,
						all_person_info: false,
					},
					//调动记录
					move: {
						move_add: false,
						move_edit: false,
						move_delete: false,
						move_examine: false,
					},
					person_role: false,
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false,
				},
			}
		},
		computed: {
			height() {
				//return this.$baseTableHeight()
			},
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
				this.$refs['personMoveTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['personMoveTable'].search(data)
			},
		},
	}
</script>

<style>
/* .table-container{
background:#fff;
border-radius:5px;
border: 1px solid #dbe0e6;
box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
padding: 10px;
box-sizing: border-box;
}
 */
.vab-query-form{margin-bottom: 0px!important;}
.el-form-item--small.el-form-item {margin-bottom: 10px}
.app-main-container .app-main-height{height: 100%;}
.el-input--small .el-input__inner{width:155px;}
</style>

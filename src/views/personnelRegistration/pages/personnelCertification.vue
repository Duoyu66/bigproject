<template>
  <!-- 人员持证记录 -->
	<div class="table-container definition2 purchase distribution ledger" style="padding:0px;margin-right: 10px;">
		<vab-query-form style="margin-left: 10px;margin-bottom: 0px;margin-top: 10px;">
			<personelCertSearch ref="personelCertSearch" v-model="searchData" :search_fob="search_main_fob">
			</personelCertSearch>
		</vab-query-form>

		<el-main class="box1" style="height: calc(100vh - 270px); min-height: 300px">
      <div style="padding-left:10px;">
        <personCartTable ref="personCartTable" style="height: calc(100vh - 317px); min-height: 300px" :type="1"
          :select-form.sync="searchData" :primary_key.sync="primary_key" :permission="permission">
        </personCartTable>
      </div>
		</el-main>
	</div>
</template>

<script>
	import personCartTable from '../table/personCartTable'
	import personelCertSearch from '../form/personelCertSearch'
	export default {
		name: 'PersonnelAllocation',
		components: {
			personCartTable,
			personelCertSearch,
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
					//相关证书
					cert: {
						cert_add: false,
						cert_edit: false,
						cert_delete: false,
						cert_examine: false,
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
				this.$refs['personCartTable'].fetchData()
			},
			search_main_fob(data) {
				//search
				this.$refs['personCartTable'].search(data)
			},
		},
	}
</script>
<style>
.table-container{
background:#fff;
border-radius:5px;
border: 1px solid #dbe0e6;
box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
padding: 10px;
box-sizing: border-box;
}
.el-form-item--small.el-form-item{margin-bottom:10px;}

</style>

<template>
  <!-- 资质证书 -->
	<!-- definition -->
	<div class="definition purchase contract equipment_btn calc" style="overflow: auto;">
		<el-tabs
		  type="border-card"
		  :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
		  class="box_center"
		  style=""
		>
		  <el-tab-pane label="营收统计">
        <monthReportStatisticsTable style="height: calc(80vh)" ref="monthReportStatisticsTable" :type="0"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportStatisticsTable>
      </el-tab-pane>
      <el-tab-pane label="生产成本">
        <monthReportCostTable style="height: calc(80vh)" ref="monthReportCostTable" :type="0"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportCostTable>
      </el-tab-pane>
      <el-tab-pane label="实体检测">
        <monthReportTestTable style="height: calc(80vh)" ref="monthReportCostTable" :type="0"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportTestTable>
      </el-tab-pane>
      <el-tab-pane label="物探项目">
        <monthReportGeoTable style="height: calc(80vh)" ref="monthReportGeoTable" :type="0"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportGeoTable>
      </el-tab-pane>
      <el-tab-pane label="试验建材">
        <monthReportBuildingTable style="height: calc(80vh)" ref="monthReportBuildingTable" :type="0"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportBuildingTable>
      </el-tab-pane>
      <el-tab-pane label="土工试验">
        <monthReportDiggerTable style="height: calc(80vh)" ref="monthReportDiggerTable" :type="0"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportDiggerTable>
      </el-tab-pane>
    </el-tabs>

	</div>
</template>

<script>
  import onDutyAddForm from '../form/onDutyAddForm.vue'
  import monthReportStatisticsTable from '../table/monthReportStatisticsTable'
  import monthReportCostTable from '../table/monthReportCostTable'
  import monthReportTestTable from '../table/monthReportTestTable'
  import monthReportGeoTable from '../table/monthReportGeoTable'
  import monthReportBuildingTable from '../table/monthReportBuildingTable'
  import monthReportDiggerTable from '../table/monthReportDiggerTable'
	export default {
		name: 'detectionRoomdefinition',
		components: {
			onDutyAddForm,
      monthReportStatisticsTable,
      monthReportCostTable,
      monthReportTestTable,
      monthReportGeoTable,
      monthReportBuildingTable,
      monthReportDiggerTable
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger',
				}
				return statusMap[status]
			},
		},
		data() {
			return {
				primary_key: -1,
				btnShow: {
					qualificationCertAdd: false,
				},
				list: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					name: '',
				},
				table: {
					tableHeight: this.$(window).height(),
				},
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
			height() {
				return this.$baseTableHeight()
			},
		}, //,
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
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
			handleEdit(row) {
				this.$refs['edit'].showEdit(row)
			},
			tableSortChange() {

			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				this.$refs['edit'].showEdit()
			},
			searchTable() {

			},
      weekReportAdd() {
        this.$refs['onDutyAddForm'].save()
      },
      async fetchData() {
      	this.$refs['monthReportStatisticsTable'].fetchData()
        this.$refs['monthReportCostTable'].fetchData()
        // this.$refs['monthReportTestTable'].fetchData()
      },
		},
	}
</script>
<style type="text/css">
  .el-form-item--small.el-form-item{margin-bottom:10px;}


</style>

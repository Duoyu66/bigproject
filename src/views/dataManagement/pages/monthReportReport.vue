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
		  <el-tab-pane label="检测收入填报" class="center">
<!--        <monthReportTestTable style="height: calc(80vh)" ref="monthReportTestTable" :type="0"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportTestTable> -->
        <div class="usage" style="padding:60px;">
          <testMonthReportForm ref="testMonthReportForm" :project_type="1" :type="0"></testMonthReportForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="testMonthReportFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="物探收入填报" class="center">
        <div class="usage" style="padding:60px;">
          <geoMonthReportForm ref="geoMonthReportForm" :project_type="3" :type="0"></geoMonthReportForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="geoMonthReportFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="建材收入填报" class="center">
        <div class="usage" style="padding:60px;">
          <buildMonthReportForm ref="buildMonthReportForm" :project_type="4" :type="0"></buildMonthReportForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="buildMonthReportFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="土工收入填报" class="center">
        <div class="usage" style="padding:60px;">
          <diggerMonthReportForm ref="diggerMonthReportForm" :project_type="5" :type="0"></diggerMonthReportForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="diggerMonthReportFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="生产收入填报" class="center">
        <div class="usage" style="padding:60px;">
          <costMonthReportForm ref="costMonthReportForm" :type="0"></costMonthReportForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="costMonthReportFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="检测收入">
        <monthReportTestTableSub style="height: calc(80vh)" ref="monthReportTestTableSub" :type="0" :project_type="1"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportTestTableSub>
      </el-tab-pane>
      <el-tab-pane label="物探收入">
        <monthReportGeoTableSub style="height: calc(80vh)" ref="monthReportGeoTableSub" :type="0" :project_type="3"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportGeoTableSub>
      </el-tab-pane>
      <el-tab-pane label="建材收入">
        <monthReportBuildTableSub style="height: calc(80vh)" ref="monthReportBuildTableSub" :type="0" :project_type="4"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportBuildTableSub>
      </el-tab-pane>
      <el-tab-pane label="土工收入">
        <monthReportDiggerTableSub style="height: calc(80vh)" ref="monthReportDiggerTableSub" :type="0" :project_type="5"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportDiggerTableSub>
      </el-tab-pane>
      <el-tab-pane label="生产成本">
        <monthReportCostTableSub style="height: calc(80vh)" ref="monthReportCostTableSub" :type="0"
        	:primary_key.sync="primary_key" :permission="permission"></monthReportCostTableSub>
      </el-tab-pane>
    </el-tabs>

	</div>
</template>

<script>
  import costMonthReportForm from '../form/costMonthReportForm.vue'
  import testMonthReportForm from '../form/testMonthReportForm.vue'
  import geoMonthReportForm from '../form/testMonthReportForm.vue'
  import buildMonthReportForm from '../form/testMonthReportForm.vue'
  import diggerMonthReportForm from '../form/testMonthReportForm.vue'
  import monthReportStatisticsTable from '../table/monthReportStatisticsTable'
  import monthReportCostTableSub from '../table/monthReportCostTableSub'
  import monthReportTestTableSub from '../table/monthReportTestTableSub'
  import monthReportGeoTableSub from '../table/monthReportTestTableSub'
  import monthReportBuildTableSub from '../table/monthReportTestTableSub'
  import monthReportDiggerTableSub from '../table/monthReportTestTableSub'
	export default {
		name: 'detectionRoomdefinition',
		components: {
			costMonthReportForm,
      testMonthReportForm,
      geoMonthReportForm,
      buildMonthReportForm,
      diggerMonthReportForm,
      monthReportStatisticsTable,
      monthReportCostTableSub,
      monthReportTestTableSub,
      monthReportBuildTableSub,
      monthReportGeoTableSub,
      monthReportDiggerTableSub
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
      geoMonthReportFormAdd() {
        this.$refs['geoMonthReportForm'].save()
      },
      buildMonthReportFormAdd() {
        this.$refs['buildMonthReportForm'].save()
      },
      diggerMonthReportFormAdd() {
        this.$refs['diggerMonthReportForm'].save()
      },
      testMonthReportFormAdd() {
        this.$refs['testMonthReportForm'].save()
      },
			searchTable() {

			},
      weekReportAdd() {
        // this.$refs['onDutyAddForm'].save()
      },
      async fetchData() {
      	this.$refs['monthReportTestTableSub'].fetchData({
					pageNo: 1,
				})
        this.$refs['monthReportBuildTableSub'].fetchData({
        	pageNo: 1,
        })
        this.$refs['monthReportGeoTableSub'].fetchData({
        	pageNo: 1,
        })
        this.$refs['monthReportDiggerTableSub'].fetchData({
        	pageNo: 1,
        })
        this.$refs['monthReportCostTableSub'].fetchData({
        	pageNo: 1,
        })
       //  this.$refs['monthReportCostTableSub'].fetchData()
       //  this.$refs['monthReportTestTable'].fetchData()
      },
		},
	}
</script>
<style type="text/css">
  .el-form-item--small.el-form-item{margin-bottom:10px;}


</style>

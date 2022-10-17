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
		  <el-tab-pane label="出勤登记" class="center">
		    <div class="usage">
		      <onDutyAddForm ref="onDutyAddForm"></onDutyAddForm>
		      <div>
		        <el-button
		          class="purchase_btn"
		          type="primary"
		          @click="weekReportAdd()"
		        >
		          确 定
		        </el-button>
		      </div>
		    </div>
		  </el-tab-pane>
		  <el-tab-pane label="出勤记录">
            <onDutyRecordTable style="height: calc(80vh)" ref="onDutyRecordTable" :type="0"
            	:primary_key.sync="primary_key" :permission="permission"></onDutyRecordTable>
      </el-tab-pane>
    </el-tabs>

	</div>
</template>

<script>
  import onDutyAddForm from '../form/onDutyAddForm.vue'
  import onDutyRecordTable from '../table/onDutyRecordTable'
	export default {
		name: 'detectionRoomdefinition',
		components: {
			onDutyAddForm,
      onDutyRecordTable
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
      	this.$refs['onDutyRecordTable'].fetchData()
      },
		},
	}
</script>
<style type="text/css">
  .el-form-item--small.el-form-item{margin-bottom:10px;}


</style>

<template>
  <!-- 资质证书 -->
	<!-- definition -->
	<div class="table-container " style="overflow: auto;">
		<el-main class="box1" style="height: calc(100vh - 120px);s">
      <div class="baseBox" style="margin-bottom: 10px;">
        <vab-query-form style="margin-bottom: 0px;">
        	<div style="float: left;">
        		<el-button v-show="btnShow.qualificationCertAdd" type="primary" @click="handleAdd">
        			添加资质证书
        		</el-button>
        	</div>
        	<div style="float: right;">
        		<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
        			<el-form-item >
        				<el-input v-model="queryForm.name"  placeholder="名称" clearable />
        			</el-form-item>
        			<el-form-item style="margin-right:0px;">
        				<el-button icon="el-icon-search" type="primary" @click="searchTable">
        				</el-button>
        			</el-form-item>
        		</el-form>
        	</div>
        </vab-query-form>

        <qualificationCertTable ref="qualificationCertTable" :permission="btnShow" type="qualificationCert"
          :primary_key.sync="primary_key" style="height: calc(35.5vh)">
        </qualificationCertTable>
      </div>
			<el-footer style="height: calc(50%); min-height: 300px;padding: 0px;" class="table_auto">
				<el-tabs type="border-card" style="height: calc(100%)">
					<el-tab-pane label="下载申请">
						<qualificationCertApplyTable style="height: calc(37vh)" ref="qualificationCertApplyTable"
							type="qualificationCert" :primary_key="primary_key" :permission="btnShow">
						</qualificationCertApplyTable>
					</el-tab-pane>
					<el-tab-pane label="下载记录">
						<qualificationCertDownloadTable style="height: calc(37vh)" ref="qualificationCertDownloadTable"
							type="qualificationCert" :primary_key="primary_key" :permission="btnShow">
						</qualificationCertDownloadTable>
					</el-tab-pane>
				</el-tabs>
			</el-footer>
		</el-main>

		<table-edit ref="edit" @reload="searchTable"></table-edit>
	</div>
</template>

<script>
	import TableEdit from '../component/qualificationCertTableDialog'

	import qualificationCertTable from '../table/qualificationCertTable'
	import qualificationCertApplyTable from '../table/qualificationCertApplyTable'
	import qualificationCertDownloadTable from '../table/qualificationCertDownloadTable'
	export default {
		name: 'detectionRoomdefinition',
		components: {
			TableEdit,
			qualificationCertTable,
			qualificationCertApplyTable,
			qualificationCertDownloadTable
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
				let res = await this.$store.dispatch('permission/GetALLPermissionByModel', 'qualificationCert')
				this.btnShow = Object.assign(this.btnShow, res)
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
				this.$refs['qualificationCertTable'].search(this.queryForm)
			}


		},
	}
</script>
<style type="text/css">
  .el-form-item--small.el-form-item{margin-bottom:10px;}


</style>

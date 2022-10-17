<template>
  <!-- 周报 -->
	<!-- definition -->
	<div class="table-container " style="overflow: auto;">
      <div class="baseBox" style="margin-bottom: 10px;">
        <vab-query-form style="margin-bottom: 0px;">
        	<div style="float: left;">
        		<el-button v-show="btnShow.qualificationCertAdd" type="primary" @click="handleAdd">
        			添加周报
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


      </div>

		<table-edit ref="edit" @reload="searchTable"></table-edit>
	</div>
</template>

<script>

	export default {
		name: 'detectionRoomdefinition',
		components: {

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

			}


		},
	}
</script>
<style type="text/css">
  .el-form-item--small.el-form-item{margin-bottom:10px;}


</style>

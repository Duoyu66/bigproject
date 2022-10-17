<template>
  <!-- 检测室定义 -->
	<div class="table-container definition baseBox">
		<vab-query-form>
			<vab-query-form-left-panel style="width:200px;">
				<el-button v-show="btnShow.RoomdefinitionAdd" type="primary" @click="handleAdd">
					添加检测室
				</el-button>
			</vab-query-form-left-panel>
			<vab-query-form-right-panel style="width:240px;float:right;">
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item>
						<el-input v-model="queryForm.name" placeholder="按照检测室名称查询"
							prefix-icon="el-icon-search" @change="searchTable" clearable/>
					</el-form-item>
				</el-form>
			</vab-query-form-right-panel>
		</vab-query-form>
		<roomDefintionTable ref="roomDefintionTable" :permission="btnShow" type="room_type"
			style="height: calc(68vh)"></roomDefintionTable>
		<table-edit ref="edit" @reload="searchTable"></table-edit>
	</div>
</template>

<script>
	import TableEdit from '../component/detectionRoomdefinitionDialog'

	import roomDefintionTable from '../table/roomDefintionTable'

	export default {
		name: 'detectionRoomdefinition',
		components: {
			TableEdit,
			roomDefintionTable
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
				btnShow: {
					RoomdefinitionAdd: false,
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
				let res = await this.$store.dispatch('permission/GetALLPermissionByModel', 'detectionRoomdefinition')
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
				this.$refs['roomDefintionTable'].search(this.queryForm)
			}


		},
	}
</script>

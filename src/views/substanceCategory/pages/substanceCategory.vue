<template>
  <!-- 标准物质类别定义 -->
	<div class="table-container definition baseBox">
		<vab-query-form>
			<vab-query-form-left-panel>
				<el-button v-show="btnShow.substanceCategoryAdd" type="primary" @click="handleAdd">
					添加标准物质
				</el-button>
			</vab-query-form-left-panel>
			<vab-query-form-right-panel>
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item style="margin-right: -0.5px;">
						<el-input v-model="queryForm.name" style="border-radius: 30px" placeholder="按照名称查询"
							prefix-icon="el-icon-search" @change="searchTable" />
					</el-form-item>
				</el-form>
			</vab-query-form-right-panel>
		</vab-query-form>
		<standardTable ref="standardTable" :permission="btnShow" type="rm_type"
			style="height: calc(78vh)"></standardTable>
		<table-edit ref="edit" @reload="searchTable"></table-edit>
	</div>
</template>

<script>
	import {
		getList,
		doDelete
	} from '@/api/table'
	import TableEdit from '../component/substanceDialog'

	import standardTable from '../table/standardTable'

	import setting from '@/config/setting.config'
	export default {
		name: 'ComprehensiveTable',
		components: {
			TableEdit,
			standardTable
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
					substanceCategoryAdd: false,
					substanceCategoryEdit: false,
					substanceCategoryDelete: false,
				},
				list: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					title: '',
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
				let res = await this.$store.dispatch('permission/GetALLPermissionByModel', 'substanceCategory')
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
				this.$refs['edit'].showEdit(false)
			},
			searchTable() {
				this.$refs['standardTable'].search(this.queryForm)
			}


		},
	}
</script>

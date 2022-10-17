<template>
	<!-- 化学品品种维护 -->
	<div class="table-container definition baseBox" style="margin-right: 10px; overflow:auto;">
		<vab-query-form>
			<vab-query-form-left-panel style="width:200px;">
				<el-button v-show="btnShow.chemicalPreserveadd" type="primary" @click="handleAdd">
					添加化学品
				</el-button>
			</vab-query-form-left-panel>
			<vab-query-form-right-panel style="width:auto;float: right;">
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item>
						<el-input v-model="queryForm.title" style="border-radius: 30px" placeholder="按照化学品名称查询"
							prefix-icon="el-icon-search" @change="searchTable" clearable>
							<el-button slot="append" icon="el-icon-search" @click="searchTable"></el-button>
						</el-input>
					</el-form-item>
				</el-form>
			</vab-query-form-right-panel>
		</vab-query-form>
		<chemicalPreserveTable ref="chemicalPreserveTable" :permission="btnShow" type="chemical_type"
			style="height: calc(81vh)"></chemicalPreserveTable>
		<table-edit ref="edit" @reload="searchTable"></table-edit>
	</div>
</template>

<script>
	import {
		getList,
		doDelete
	} from '@/api/table'
	import TableEdit from '../component/chemicalPreserve'

	import chemicalPreserveTable from '../table/chemicalPreserveTable'

	import setting from '@/config/setting.config'
	export default {
		name: 'ComprehensiveTable',
		components: {
			TableEdit,
			chemicalPreserveTable
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
					chemicalPreserveadd: false,
					chemicalPreserveedit: false,
					chemicalPreserveDelete: false,
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
				let res = await this.$store.dispatch('permission/GetALLPermissionByModel', 'chemicalPreserve')
				this.btnShow = Object.assign(this.btnShow, res)
				console.log('permission', res, this.btnShow)
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
				this.$refs['chemicalPreserveTable'].search(this.queryForm)
			}


		},
	}
</script>
<style>
	.baseBox {
		background: #fff;
		border-radius: 5px;
		border: 1px solid #dbe0e6;
		padding: 10px;
		box-sizing: border-box;
		box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
	}

	.vab-query-form {
		margin-bottom: 10px;
	}

	.el-form-item--small.el-form-item {
		margin-bottom: 10px !important;
	}

	/* 可能会影响其他页面暂存 */
	.app-main-container .app-main-height {
		min-height: calc(100vh - 40px - 48px - 10px - 10px) !important;
	}

	@media only screen and (max-width: 1366px) {
		.heightControl {
			height: calc(69vh) !important;
		}
	}
</style>

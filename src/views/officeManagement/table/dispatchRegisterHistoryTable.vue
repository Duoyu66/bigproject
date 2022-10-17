<template>
	<div>
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange">
			<el-table-column show-overflow-tooltip label="操作者" prop="operator" width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作日期" prop="operationDate" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="动作" prop="operation" min-width="150px"></el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<dispatchRegisterDialog ref="dispatchRegisterDialog" :is-up-data.sync="main_dialog">
		</dispatchRegisterDialog>
		<dispatchRegisterExamineDialog ref="dispatchRegisterExamineDialog" :is-up-data.sync="main_dialog">
		</dispatchRegisterExamineDialog>
	</div>
</template>

<script>
	import {
		treePaging
	} from '@/global/form.helper'
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'

	import dispatchRegisterDialog from '../components/dispatchRegisterDialog'
	import dispatchRegisterExamineDialog from '../components/dispatchRegisterExamineDialog'
	export default {
		name: 'dispatchRegisterTable',
		components: {
			dispatchRegisterDialog,
			dispatchRegisterExamineDialog
		},
		props: {
			type: {
				type: Number,
				default: 0,
			},
			primary_key: {
				type: Number,
				default: 0,
			},
			permission: {
				type: Object,
				default: function() {
					return {}
				},
			},
		},
		provide() {
			return {
				reload: this.fetchData,
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				this.fetchData({
					reload: 1,
				})
			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			current_org_id() {
				this.fetchData()
			},
		},
		data() {
			return {
				height: 'calc(80%)',
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				elementLoadingText: '加载数据中',
				queryForm: {
					table_type: 0,

					pageSize: 10,
					pageNo: 1,
				},
				demotableexpand: {
					mainTable: [{
						field: 'doc_id',
						label: '收文编号',
						isShow: true,
					}, {
						field: 'docTitle',
						label: '公文标题',
						isShow: true,
					}, {
						field: 'secretClassification',
						label: '密级',
						isShow: true,
					}, {
						field: 'documentType',
						label: '公文类型',
						isShow: true,
					}, {
						field: 'source',
						label: '来源',
						isShow: true,
					}, {
						field: 'IndustryCategory',
						label: '行业分类',
						isShow: true,
					}, {
						field: 'degreeOfUrgency',
						label: '紧急程度',
						isShow: true,
					}, {
						field: 'outgoing_org',
						label: '发文机构',
						isShow: true,
					}, {
						field: 'makeCopyForUnit',
						label: '抄送机构',
						isShow: true,
					}, {
						field: 'DraftUnit',
						label: '拟稿机构',
						isShow: true,
					}, {
						field: 'org_name',
						label: '收文机构',
						isShow: true,
					}, {
						field: 'incoming_date',
						label: '发文日期',
						isShow: true,
					}, {
						field: 'registrant',
						label: '登记人',
						isShow: true,
					}, {
						field: 'registrantDate',
						label: '登记日期',
						isShow: true,
					}, {
						field: 'Signer',
						label: '签收人',
						isShow: true,
					}, {
						field: 'SigneDate',
						label: '签收日期',
						isShow: true,
					}, {
						field: 'reviewer',
						label: '审核人',
						isShow: true,
					}, {
						field: 'revieweDate',
						label: '审核日期',
						isShow: true,
					}, {
						field: 'nextStatus',
						label: '状态',
						isShow: true,
					}]
				},
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				columnHideList: [],
			}
		},
		created() {
			this.init()
		},
		methods: {

			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 0:
						this.height = 'calc(80%)'
						this.columnHideList = ['user_name']
						break
					case 1:
						this.height = 'calc(100%)'
						break
				}
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (!row) {
					return '';
				}
				let className = ''
				switch (row.degreeOfUrgency) {
					case '特急':
						className = 'extra-urgent-row'
						break
					case '紧急':
						className = 'urgent-row'
						break
					case '常规':
						className = 'commonly-row'
						break
				}
				return className
			},
			GetHeight() {},
			//判断是否隐藏列，ture为不隐藏，false为隐藏
			hideColFob(col_name) {
				try {
					let that = this
					if (!col_name) {
						return true
					}
					if (that.columnHideList.indexOf(col_name) < 0) {
						return true
					}
					return false
				} catch (e) {
					console.log(e)
					return false
				}
			},
			ishasPermission(name, row) {
				let permission_name = ''
				switch (name) {
					case 'add':
						permission_name = 'branchInstitutionsAdd'
						break
					case 'edit':
						permission_name = 'branchInstitutionsEdit'
						break
					case 'examin':
						permission_name = 'branchInstitutionsEdit'
						break
					case 'delete':
						permission_name = 'branchInstitutionsDelete'
						break
					default:
						permission_name = name
						break
				}
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					flag = true
					return flag
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'examin':
						if (row.nextStatus == '审核') {
							flag = true
						} else {
							flag = false
						}
						break
					case 'edit':
						if (row.nextStatus == '登记' || row.processingStatus == '登记') {
							flag = true
						} else {
							flag = false
						}
						break
					default:
						flag = flag
						break;
				}
				return flag
			},
			handleCommand(command, index, row) {
				let that = this
				switch (command) {
					//查看
					case 'view':
						//that.handleView(row)
						break
						//编辑
					case 'edit':
						that.EditInfo(row)
						break
					case 'examine':
						that.Examine(row)
						break
						//删除
					case 'delete':
						that.handleDelete(row)
						break
				}
			},
			Examine(row) {
				this.$refs['dispatchRegisterExamineDialog'].showEdit(row, undefined, undefined)
			},
			EditInfo(row) {
				this.handleAdd(row, undefined, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['dispatchRegisterDialog'].showEdit(row, parent_info, disable)
			},
			handleAddLevel(row) {
				let json = {
					parent_id: Object.assign({}, row).parent_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(undefined, json, undefined)
			},
			handleAddChild(row) {
				let json = {
					parent_id: Object.assign({}, row).org_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(undefined, json, undefined)
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},

			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 324, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'org_id', //主键

				})
			},
			paginationHadle() {},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData({
					pageNo: val,
				})
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData({
					pageNo: this.queryForm.pageNo,
				})
			},
			search(data) {
				console.log('search', data)
				this.queryForm = Object.assign(data, this.queryForm)
				this.fetchData()
			},
			fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 0:
						this.columnHideList = ['user_name']
						that.fetchData1(pageInfo, treeNode, resolve)
						break
					case 1:
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async fetchDataMain(row, treeNode, resolve) {
				let that = this
				let select_list = [{
						field: 'doc_id',
						type: 2,
						level: 1,
					}, {
						field: 'docTitle',
						type: 2,
						level: 2,
					}, {
						field: 'secretClassification',
						type: 2,
						level: 3,
					}, {
						field: 'documentType',
						type: 2,
						level: 4,
					}, {
						field: 'source',
						type: 2,
						level: 5,
					}, {
						field: 'IndustryCategory',
						type: 2,
						level: 6,
					}, {
						field: 'degreeOfUrgency',
						type: 2,
						level: 7,
					}, {
						field: 'outgoing_org',
						type: 2,
						level: 8,
					}, {
						field: 'makeCopyForUnit',
						type: 2,
						level: 9,
					}, {
						field: 'DraftUnit',
						type: 2,
						level: 10,
					}, {
						field: 'org_name',
						type: 2,
						level: 11,
					}, {
						field: 'registrant',
						type: 2,
						level: 12,
					}, {
						field: 'Signer',
						type: 2,
						level: 13,
					}, {
						field: 'reviewer',
						type: 2,
						level: 14,
					}, {
						field: 'incoming_date',
						type: 5,
						level: 15,
						split: '~',
					}, {
						field: 'registrantDate',
						type: 5,
						level: 16,
						split: '~',
					}, {
						field: 'revieweDate',
						type: 5,
						level: 17,
						split: '~',
					}, {
						field: 'nextStatus',
						type: 2,
						level: 18,
					}, {
						field: 'org_id',
						type: 3,
						level: 19,
					}, {
						field: 'pageNo',
						type: 3,
						level: 20,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 21,
					},
				]
				that.queryForm.org_id = that.current_org_id
				that.search_fob(select_list, that, 332, {
					'loading': 'listLoading', //加载画面
					'data': 'tablelist', //数据存放位置
					'total': 'total', //数据数量，根据该数量分页
					'queryForm': 'queryForm' //查询数据表单，请将分页条件也放置在其中
				});
			},

			//子表从表加载数据
			async fetchData1() {
				let that = this
				let select_list = [{
						field: 'receive_id',
						type: 3,
						level: 1,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 5,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 6,
					},
				]
				that.queryForm.receive_id = that.primary_key
				that.search_fob(select_list, that, 335, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
		},
	}
</script>

<style>
	.demo-table-expand {
		font-size: 0;
	}

	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}

	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}

	.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
	.el-table__body tr.current-row>td {
		background-color: #0000FF;
	}

	.el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #6495ED;
	}

	.el-table .extra-urgent-row {
		background: #CD5C5C;
	}

	.el-table .urgent-row {
		background: #FFFF00;
	}

	.el-table .commonly-row {
		background: #FFFFFF;
	}
</style>

<template>
	<div>
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column type="expand" fixed="left" width="35px">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item v-for="data in demotableexpand.mainTable" :key="data.field" :label="data.label"
							v-if="data.isShow">
							<span>{{ props.row[data.field] }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="编号" prop="receive_id" min-width="150px" v-if="false">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="收文编号" prop="doc_id" min-width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="公文标题" prop="docTitle" min-width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="发文部门" prop="outgoing_org" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="发文日期" prop="incoming_date" width="170px"></el-table-column>
			<el-table-column show-overflow-tooltip label="登记日期" prop="registrantDate" width="170px"></el-table-column>
			<el-table-column show-overflow-tooltip label="紧急程度" prop="degreeOfUrgency" width="80px">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.degreeOfUrgency=='常规'">{{ scope.row.degreeOfUrgency }}
					</el-tag>
					<el-tag type="warning" v-else-if="scope.row.degreeOfUrgency=='紧急'">{{ scope.row.degreeOfUrgency }}
					</el-tag>
					<el-tag type="danger" v-else-if="scope.row.degreeOfUrgency=='特急'">{{ scope.row.degreeOfUrgency }}
					</el-tag>
					<el-tag v-else>{{ scope.row.degreeOfUrgency }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="密级程度" prop="secretClassification" width="80px">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.secretClassification=='公开'">
						{{ scope.row.secretClassification }}
					</el-tag>
					<el-tag v-else-if="scope.row.secretClassification=='秘密'">{{ scope.row.secretClassification }}
					</el-tag>
					<el-tag type="warning" v-else-if="scope.row.secretClassification=='机密'">
						{{ scope.row.secretClassification }}
					</el-tag>
					<el-tag type="danger" v-else-if="scope.row.secretClassification=='绝密'">
						{{ scope.row.secretClassification }}
					</el-tag>
					<el-tag color="#778899" v-else>{{ scope.row.secretClassification }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column show-overflow-tooltip label="状态" prop="nextStatus" min-width="150px">
				<template slot-scope="scope">
					<el-tag type="warning" v-if="scope.row.nextStatus=='登记'&&scope.row.reviewReason">
						重新登记【退回原因:{{ scope.row.reviewReason }}】
					</el-tag>
					<el-tag color="#6495ED" v-else-if="scope.row.nextStatus=='审核'&&scope.row.reviewReason">
						重新审核【上次退回原因:{{ scope.row.reviewReason }}】
					</el-tag>
					<el-tag v-else>{{ scope.row.nextStatus }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column show-overflow-tooltip label="公文类别" prop="documentType" width="100px"></el-table-column>

			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item icon="el-icon-s-order"
								@click.native="handleCommand('view', scope.$index, scope.row)">
								详情
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('edit', scope.$index, scope.row)"
								v-show="ishasPermission('edit',scope.row)">
								编辑
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-finished" divided
								@click.native="handleCommand('examine', scope.$index, scope.row)"
								v-show="ishasPermission('examin',scope.row)">
								审核
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-delete" divided
								@click.native="handleCommand('delete', scope.$index, scope.row)"
								v-show="ishasPermission('delete',scope.row)">
								删除
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>


			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<dispatchRegisterDialog ref="dispatchRegisterDialog" :is-up-data.sync="main_dialog">
		</dispatchRegisterDialog>
		<dispatchRegisterExamineDialog ref="dispatchRegisterExamineDialog" :is-up-data.sync="main_dialog">
		</dispatchRegisterExamineDialog>
		<dispatchRegisterViewDialog ref="dispatchRegisterViewDialog" :is-up-data.sync="main_dialog">
		</dispatchRegisterViewDialog>
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

	import dispatchRegisterViewDialog from '../components/dispatchRegisterViewDialog'
	import dispatchRegisterDialog from '../components/dispatchRegisterDialog'
	import dispatchRegisterExamineDialog from '../components/dispatchRegisterExamineDialog'
	export default {
		name: 'dispatchRegisterTable',
		components: {
			dispatchRegisterViewDialog,
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
			nextStatus: {
				type: String
			},
			status: {
				type: String,
				default: '0'
			},
			selectForm: {
				type: Object,
				default: function() {
					return {}
				},
			}
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
				if (this.type == 0) {
					this.fetchData({
						reload: 1,
					})
				}

			},
			selectForm(newVal, oldVal) {
				this.queryForm = Object.assign(this.queryForm, newVal)
				this.fetchData()
			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			current_org_id() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {
				if (newVal && newVal.receive_id) {
					this.$emit('update:primary_key', Number(newVal.receive_id));
				}

			},
		},
		data() {
			return {
				height: 'calc(35vh)',//收文登记主表高度控制  影响了收文管理界面
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				selectedRow: {},
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
						field: 'doc_no',
						label: '公文文号',
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
						field: 'org_name',
						label: '收文机构',
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
				console.log(this.selectForm)
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 0:
						this.height = 'calc(35vh)'
						this.columnHideList = ['user_name']
						break
					case 1:
						this.height = 'calc(35vh)'
						break
					case 2:
						this.fetchData()
						this.height = 'calc(52vh)'
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
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
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
						permission_name = 'dispatchRegisterAdd'
						break
					case 'edit':
						permission_name = 'dispatchRegisterEdit'
						break
					case 'examin':
						permission_name = 'dispatchRegisterExamin'
						break
					case 'delete':
						permission_name = 'dispatchRegisterDelete'
						break
					default:
						permission_name = name
						break
				}
				if (row.status == '1') {
					return false
				}
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					//flag = true
					//return flag
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'examin':
						if (row.nextStatus == '审核' || row.processingStatus == '审核') {
							if (row.registrant_id == this.person_id) {
								flag = false
							} else {
								flag = true
							}

						} else {
							flag = false
						}
						break
					case 'edit':
						if (row.nextStatus == '登记' || row.processingStatus == '登记') {
							// if (row.registrant_id == this.person_id) {
							// 	flag = true
							// } else {
							// 	flag = false
							// }
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
						that.handleView(row)
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
						that.handleDeletemodify(row)
						break
				}
			},
			Examine(row) {
				this.$refs['dispatchRegisterExamineDialog'].showEdit(row, undefined, undefined)
			},
			handleView(row) {
				this.$refs['dispatchRegisterViewDialog'].showEdit(row, undefined, undefined)
			},
			EditInfo(row) {
				this.handleAdd(row, undefined, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['dispatchRegisterDialog'].showEdit(row, parent_info, disable)
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},

			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 336, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'receive_id', //主键
					file: {
						proc_abstract: 12,
					}
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
				this.queryForm = Object.assign(this.queryForm, data)
				this.fetchData()
			},
			fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				console.log('fetchData', that.type)
				switch (that.type) {
					case 0:
						this.columnHideList = ['user_name']
						that.fetchData1(pageInfo, treeNode, resolve)
						break
					case 1:
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
					case 2:
						that.fetchDataReply(pageInfo, treeNode, resolve)
						break
				}
			},
			GetCurrentOrg() {
				if (this.current_org_id > 0) {
					return this.current_org_id
				}
				return this.org_id
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
						field: 'doc_no',
						type: 3,
						level: 20,
					}, {
						field: 'power',
						type: 3,
						level: 21,
					}, {
						field: 'status',
						type: 3,
						level: 22,
					}, {
						field: 'nextStatusShow',
						type: 3,
						level: 23,
					}, {
						field: 'pageNo',
						type: 3,
						level: 24,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 25,
					},
				]
				that.queryForm.org_id = that.GetCurrentOrg()
				console.log('that.GetCurrentOrg()', that.GetCurrentOrg())
				that.queryForm.nextStatusShow = that.nextStatus
				that.queryForm.status = that.status
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
						field: 'person_id',
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
				that.queryForm.person_id = that.primary_key
				that.search_fob(select_list, that, 167, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
			async fetchDataReply() {
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
						field: 'doc_no',
						type: 3,
						level: 20,
					}, {
						field: 'power',
						type: 3,
						level: 21,
					}, {
						field: 'status',
						type: 3,
						level: 22,
					}, {
						field: 'nextStatusShow',
						type: 3,
						level: 23,
					}, {
						field: 'post_history_id',
						type: 3,
						level: 24,
					}, {
						field: 'addTime',
						type: 5,
						level: 25,
						split: '~',
					}, {
						field: 'editTime',
						type: 5,
						level: 26,
						split: '~',
					}, {
						field: 'pageNo',
						type: 3,
						level: 27,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 28,
					},
				]
				//that.queryForm.org_id = that.GetCurrentOrg()
				//console.log('that.GetCurrentOrg()', that.GetCurrentOrg())

				//that.queryForm.nextStatusShow = that.nextStatus
				//that.queryForm.status = that.status
				that.search_fob(select_list, that, 391, {
					'loading': 'listLoading', //加载画面
					'data': 'tablelist', //数据存放位置
					'total': 'total', //数据数量，根据该数量分页
					'queryForm': 'queryForm' //查询数据表单，请将分页条件也放置在其中
				});
			}
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

<template>
  <!-- 起草发文主表 -->
	<div>
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<!-- <el-table-column type="expand" fixed="left" width="35px">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item v-for="data in demotableexpand.mainTable" :key="data.field" :label="data.label"
							v-if="data.isShow">
							<span>{{ props.row[data.field] }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column> -->
			<el-table-column show-overflow-tooltip label="编号" prop="receive_id" min-width="150px" v-if="false">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="发文编号" prop="doc_id" min-width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="公文标题" prop="docTitle" min-width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="收文部门" prop="outgoing_org" width="150px"></el-table-column>
			<el-table-column label="起草日期" prop="draftDate" width="170px"></el-table-column>
			<el-table-column label="紧急程度" prop="degreeOfUrgency" width="80px">
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
			<el-table-column label="密级程度" prop="secretClassification" width="80px">
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
					<el-tag type="warning" v-if="scope.row.nextStatus=='起草'&&scope.row.reviewReason">
						修改起草【退回原因:{{ scope.row.reviewReason }}】
					</el-tag>
					<el-tag color="#6495ED" v-else-if="scope.row.nextStatus=='审核'&&scope.row.reviewReason">
						重新审核【上次退回原因:{{ scope.row.reviewReason }}】
					</el-tag>
					<el-tag v-else>{{ scope.row.nextStatus }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column show-overflow-t ooltip label="公文类别" prop="documentType" width="100px"></el-table-column>

			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item icon="el-icon-s-order"
								@click.native="handleCommand('view', scope.$index, scope.row)">
								发文详情
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('edit', scope.$index, scope.row)"
								v-show="ishasPermission('edit',scope.row)">
								编辑发文
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-finished" divided
								@click.native="handleCommand('examine', scope.$index, scope.row)"
								v-show="ishasPermission('examin',scope.row)">
								审核发文
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-coordinate" divided
								@click.native="handleCommand('stamp', scope.$index, scope.row)"
								v-show="ishasPermission('stamp',scope.row)">
								添加用印申请
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-coordinate" divided
								@click.native="handleCommand('stampComplete', scope.$index, scope.row)"
								v-show="ishasPermission('stempEnd',scope.row)">
								完成盖章
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-s-promotion" divided
								@click.native="handleCommand('sendComplete', scope.$index, scope.row)"
								v-show="ishasPermission('sendEnd',scope.row)">
								完成发送
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-s-promotion" divided
								@click.native="handleCommand('sendAdd', scope.$index, scope.row)"
								v-show="ishasPermission('sendAdd',scope.row)">
								发文
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-delete" divided
								@click.native="handleCommand('delete', scope.$index, scope.row)"
								v-show="ishasPermission('delete',scope.row)">
								删除发文
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>


			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>

		<sealApplySelectSealDialog ref="sealApplySelectSealDialog" :is-up-data.sync="main_dialog">
		</sealApplySelectSealDialog>
		<postRegistrationDialog ref="postRegistrationDialog" :is-up-data.sync="main_dialog">
		</postRegistrationDialog>
		<postRegistrationExamineDialog ref="postRegistrationExamineDialog" :is-up-data.sync="main_dialog">
		</postRegistrationExamineDialog>
		<postRegistrationViewDialog ref="postRegistrationViewDialog" :is-up-data.sync="main_dialog">
		</postRegistrationViewDialog>
		<docPostStampComplete ref="docPostStampComplete" :is-up-data.sync="main_dialog">
		</docPostStampComplete>

		<docPostHistoryDialog ref="docPostHistoryDialog" :is-up-data.sync="main_dialog">
		</docPostHistoryDialog>

		<docPostSendEndDialog ref="docPostSendEndDialog" :is-up-data.sync="main_dialog">
		</docPostSendEndDialog>
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
	import postRegistrationViewDialog from '../components/postRegistrationViewDialog'
	import postRegistrationDialog from '../components/postRegistrationDialog'
	import postRegistrationExamineDialog from '../components/postRegistrationExamineDialog'
	import sealApplySelectSealDialog from '../components/sealApplySelectSealDialog'
	import docPostSendEndDialog from '../components/docPostSendEndDialog'

	import docPostStampComplete from '../components/docPostStampComplete'

	import docPostHistoryDialog from '../components/docPostHistoryDialog'
	export default {
		name: 'postRegistrationTable',
		components: {
			sealApplySelectSealDialog,
			postRegistrationViewDialog,
			postRegistrationDialog,
			postRegistrationExamineDialog,
			docPostSendEndDialog,
			docPostStampComplete,
			docPostHistoryDialog
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
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			current_org_id() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {

				if (newVal && newVal.send_id) {
					switch (this.type) {
						case 1:
							this.$emit('update:primary_key', Number(newVal.send_id));
							break
					}

				}

			},
		},
		data() {
			return {
				height: 'calc(34vh)',
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
						label: '发布范围',
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
						label: '收文机构',
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
						label: '起草日期',
						isShow: true,
					}, {
						field: 'draftPersson',
						label: '起草人',
						isShow: true,
					}, {
						field: 'draftDate',
						label: '预计日期',
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
						this.height = 'calc(85%)'
						this.columnHideList = ['user_name']
						break
					case 1:
						this.height = 'calc(34vh)'
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
						permission_name = 'postRegistrationAdd'
						break
					case 'edit':
						permission_name = 'postRegistrationEdit'
						break
					case 'examin':
						permission_name = 'postExamine'
						break
					case 'delete':
						permission_name = 'postRegistrationDelete'
						break
					case 'draftAllPerson':
						permission_name = 'postdraftAllPerson'
						break
					case 'ExamineAllPerson':
						permission_name = 'postExamineAllPerson'
						break
					case 'stamp':
						permission_name = 'sealApplyAdd'
						break
					case 'stempEnd':
						permission_name = 'sealApplyAdd'
						break
					case 'sendEnd':
						permission_name = 'docPostHistoryAdd'
						break
					case 'sendAdd':
						permission_name = 'docPostHistoryAdd'
						break
					default:
						permission_name = name
						break
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
						if (row.nextStatus == '审核') {
							if (row.draftPersonId == this.person_id) {
								flag = false
							} else {
								flag = true
							}
						} else {
							//flag = false
						}
						break
					case 'edit':
						if (row.nextStatus == '起草' || row.processingStatus == '起草') {
							flag = true
						} else {
							flag = false
						}
						break
					case 'stamp':
						if (row.nextStatus == '盖章') {
							flag = true
						} else {
							flag = false
						}
						break
					case 'stempEnd':
						if (row.nextStatus == '盖章') {
							flag = true
						} else {
							flag = false
						}
						break
					case 'sendEnd':

					case 'sendAdd':
						if (row.nextStatus == '发送') {
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
					case 'stamp':
						that.handleStamp(row)
						break
					case 'stampComplete':
						that.handleStampComplete(row)
						break
					case 'sendComplete':
						that.docPostSendEndDialog(row)
						break
					case 'sendAdd':
						that.handleSend(row)
						break
						//删除
					case 'delete':
						that.handleDeletemodify(row)
						break
				}
			},
			docPostSendEndDialog(row) {
				this.$refs['docPostSendEndDialog'].showEdit(row)
			},
			handleSend(row) {
				let form = {
					send_id: row.send_id,
					org_id: row.org_id
				}
				this.$refs['docPostHistoryDialog'].showEdit(undefined, form)
			},
			handleStampComplete(row) {
				this.$refs['docPostStampComplete'].showEdit(row)
			},
			handleStamp(row) {
				let form = {
					apply_type: 1,
					original_id: row.send_id,
					usage: '发文-' + row.doc_id + '-' + row.docTitle
				}
				this.$refs['sealApplySelectSealDialog'].showEdit(undefined, form)
			},
			handleView(row) {
				this.$refs['postRegistrationViewDialog'].showEdit(row, undefined, undefined)
			},
			Examine(row) {
				this.$refs['postRegistrationExamineDialog'].showEdit(row, undefined, undefined)
			},
			EditInfo(row) {
				this.handleAdd(row, undefined, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['postRegistrationDialog'].showEdit(row, parent_info, disable)
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
				that.delete_from_fob(that, row, 397, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'send_id', //主键
					file: {
						revieweEnclosure: 12,
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
				console.log('search', data)
				this.queryForm = Object.assign(data, this.queryForm)
				this.fetchData()
			},
			GetCurrentOrg() {
				if (this.current_org_id > 0) {
					return this.current_org_id
				}
				return this.org_id
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
						field: 'draftPersson',
						type: 2,
						level: 12,
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
						field: 'draftDate',
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
						field: 'draftPersonId',
						type: 3,
						level: 24,
					}, {
						field: 'reviewer_id',
						type: 3,
						level: 25,
					}, {
						field: 'pageNo',
						type: 3,
						level: 26,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 27,
					},
				]
				if (that.nextStatus == '审核' || that.nextStatus == '完成') {
					if (that.ishasPermission('ExamineAllPerson')) {
						that.queryForm.reviewer_id = undefined
					} else {
						that.queryForm.reviewer_id = that.person_id
					}
				} else {
					that.queryForm.reviewer_id = undefined
				}


				if (that.nextStatus == '起草' || that.nextStatus == '完成') {
					if (that.ishasPermission('draftAllPerson')) {
						that.queryForm.draftPersonId = undefined
					} else {
						that.queryForm.draftPersonId = that.person_id
					}
				} else {
					that.queryForm.draftPersonId = undefined
				}

				let sqlcode = 346
				if (that.nextStatus == '完成') {
					sqlcode = 353
				}
				that.queryForm.org_id = that.GetCurrentOrg()
				that.queryForm.nextStatusShow = that.nextStatus
				that.queryForm.status = that.status
				await that.search_fob(select_list, that, sqlcode, {
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

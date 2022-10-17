<template>
	<div class="draftPageHigh">
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column show-overflow-tooltip label="审核状态" prop="nApproverResult" width="80px">
				<template slot-scope="scope">
					<el-tag type="warning" v-if="scope.row.nApproverResult=='0'&&!scope.row.ApproverResult">待审
					</el-tag>
					<el-popover trigger="hover" placement="top"
						v-else-if="scope.row.nApproverResult=='0'&&scope.row.ApproverResult">
						<p>上次审核人: {{ scope.row.approver }}</p>
						<p>上次审核时间: {{ scope.row.approve_time }}</p>
						<p>上次审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="danger">重审</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='-1'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approve_time }}</p>
						<p>审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="danger">退回</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='-2'">
						<p>作废人: {{ scope.row.approver }}</p>
						<p>作废时间: {{ scope.row.approve_time }}</p>
						<p>作废原因: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="danger">作废</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='1'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approve_time }}</p>
						<p>审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="success">通过</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='2'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approve_time }}</p>
						<p>审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="success">通过</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='3'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approve_time }}</p>
						<p>审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="success">结束</el-tag>
						</div>
					</el-popover>
					<el-tag v-else>{{ scope.row.nApproverResult }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="用印状态" prop="nApproverResult" width="100px">
				<template slot-scope="scope">
					<el-tag type="warning" v-if="scope.row.nApproverResult=='0'&&!scope.row.ApproverResult">申请中
					</el-tag>
					<el-popover trigger="hover" placement="top"
						v-else-if="scope.row.nApproverResult=='0'&&scope.row.ApproverResult">
						<p>上传审核人: {{ scope.row.approver }}</p>
						<p>上传审核时间: {{ scope.row.approve_time }}</p>
						<p>上传审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="danger">申请中</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='-1'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approve_time }}</p>
						<p>审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="danger">申请中</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='-2'">
						<p>作废人: {{ scope.row.approver }}</p>
						<p>作废时间: {{ scope.row.approve_time }}</p>
						<p>作废原因: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="danger">申请作废</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='1'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approve_time }}</p>
						<p>审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="success">待添加</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='2'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approve_time }}</p>
						<p>审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="success">已添加</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.nApproverResult=='3'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approve_time }}</p>
						<p>审核回复: {{ scope.row.ApproverResult }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="success">结束</el-tag>
						</div>
					</el-popover>
					<el-tag v-else>{{ scope.row.nApproverResult }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip v-if="hideColFob('seal_name')" label="印章名称" prop="seal_name">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="申请人" prop="applicant" width="90px"></el-table-column>
			<el-table-column show-overflow-tooltip label="申请时间" prop="apply_date" width="170px"></el-table-column>
			<el-table-column show-overflow-tooltip label="预计使用时间" prop="expectedTime" width="170px"></el-table-column>
			<el-table-column show-overflow-tooltip label="用途" prop="usage" min-width="200px"></el-table-column>

			<el-table-column show-overflow-tooltip label="审核人" prop="approver" width="90px"></el-table-column>
			<el-table-column show-overflow-tooltip label="审核时间" prop="approve_time" width="170px"></el-table-column>
			<el-table-column show-overflow-tooltip label="审核回复" prop="ApproverResult"></el-table-column>
			<el-table-column show-overflow-tooltip label="盖章人" prop="sealer" width="90px"></el-table-column>
			<el-table-column show-overflow-tooltip label="实际用途" prop="act_usage"></el-table-column>
			<el-table-column show-overflow-tooltip label="实际使用时间" prop="use_date" width="170px"></el-table-column>
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
							<el-dropdown-item icon="el-icon-coordinate" divided v-if="scope.row.use_id"
								@click.native="handleCommand('sealProc', scope.$index, scope.row)"
								v-show="ishasPermission('sealProcEdit',scope.row)">
								修改用印记录
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-coordinate" divided v-else
								@click.native="handleCommand('sealProc', scope.$index, scope.row)"
								v-show="ishasPermission('sealProcAdd',scope.row)">
								添加用印记录
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-finished" divided
								@click.native="handleCommand('examine', scope.$index, scope.row)"
								v-show="ishasPermission('examin',scope.row)">
								审核
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-finished" divided
								@click.native="handleCommand('confirm', scope.$index, scope.row)"
								v-show="ishasPermission('confirm',scope.row)">
								确认用印记录
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-coordinate" divided v-if="scope.row.apply_type == '1'"
								@click.native="handleCommand('docPostView', scope.$index, scope.row)">
								查看发文记录
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
		<sealLedgerDialog ref="sealLedgerDialog" :is-up-data.sync="main_dialog">
		</sealLedgerDialog>
		<sealApplyDialog ref="sealApplyDialog" :is-up-data.sync="main_dialog">
		</sealApplyDialog>
		<sealProcDialog ref="sealProcDialog" :is-up-data.sync="main_dialog">
		</sealProcDialog>
		<sealApplyEndDialog ref="sealApplyEndDialog" :is-up-data.sync="main_dialog">
		</sealApplyEndDialog>

		<sealApplyExamineDialog ref="sealApplyExamineDialog" :is-up-data.sync="main_dialog">
		</sealApplyExamineDialog>
    <sealApplyReportDialog ref="sealApplyReportDialog" :is-up-data.sync="main_dialog">
    </sealApplyReportDialog>
		<sealApplyViewDialog ref="sealApplyViewDialog" :is-up-data.sync="main_dialog">
		</sealApplyViewDialog>

		<postRegistrationViewDialog ref="postRegistrationViewDialog" :is-up-data.sync="main_dialog">
		</postRegistrationViewDialog>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'
	import {
		calculationDayAndFormat
	} from '@/utils/dateHelp'
	import sealLedgerDialog from '../components/sealLedgerDialog'
  import sealApplyReportDialog from '../components/sealApplyReportDialog'
	import sealApplyDialog from '../components/sealApplyDialog'
	import sealProcDialog from '../components/sealProcDialog'
	import sealApplyViewDialog from '../components/sealApplyViewDialog'
	import sealApplyEndDialog from '../components/sealApplyEndDialog'

	import sealApplyExamineDialog from '../components/sealApplyExamineDialog'

	import postRegistrationViewDialog from '../components/postRegistrationViewDialog'

	export default {
		name: 'sealApplyTable',
		components: {
			sealProcDialog,
			sealApplyDialog,
			sealLedgerDialog,
			sealApplyEndDialog,
			sealApplyViewDialog,
			sealApplyExamineDialog,
      sealApplyReportDialog,
			postRegistrationViewDialog
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
			apply_type: {
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
				org_pid: 'user/org_pid',
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				console.log(this)
				if (this.type == 0 || this.type == 2 || this.type == 3) {
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
				if (newVal && newVal.apply_id) {
					switch (this.type) {
						case 1:
							this.$emit('update:primary_key', Number(newVal.apply_id));
							break;
					}

				}

			},
		},
		data() {
			return {
				height: 'calc(80%)',
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
						label: '起草日期',
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
						this.columnHideList = ['seal_name']
						break
					case 1:
						this.height = 'calc(95%)'
						break
          case 3:
          	this.height = 'calc(80%)'
          	this.columnHideList = ['seal_name']
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
						permission_name = 'sealApplyAdd'
						break
					case 'edit':
						permission_name = 'sealApplyEdit'
						break
					case 'examin':
						permission_name = 'sealApplyExamin'
						break
					case 'confirm':
						permission_name = 'sealApplyExamin'
						break
					case 'delete':
						permission_name = 'sealProcAndApplyDelete'
						break
					case 'sealProcAdd':
						permission_name = 'sealProcAdd'
						break
					case 'sealProcEdit':
						permission_name = 'sealProcEdit'
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
				//不同机构不能操作
				if (row.org_id != this.org_pid) {
					flag = false
					return flag
				}
				//禁用的印章无法操作用印记录
				if (row.enabled != '1') {
					flag = false
				}
				if (!flag) {
					return flag
				}

				switch (name) {
					//申请
					case 'examin':
						//同一个人无法进行添加和审核
						if (row.applicantId == this.person_id) {
							flag = false
						} else {
							flag = true
						}
						break
						//修改
					case 'edit':
						if (row.nApproverResult < 1 && row.nApproverResult > -2) {
							if (row.applicantId == this.person_id) {
								flag = true
							} else {
								flag = false
							}
						} else {
							flag = false
						}

						break
					case 'sealProcAdd':
						if (row.nApproverResult == 1) {
							if (!row.use_id) {
								flag = true
							} else {
								flag = false
							}
						} else {
							flag = false
						}

						break;
					case 'sealProcEdit':
						if (row.nApproverResult == 2) {
							if (row.use_id) {
								flag = true
							} else {
								flag = false
							}
						} else {
							flag = false
						}
						break;
					case 'confirm':
						if (row.nApproverResult == 2) {
							if (row.confirm_id == this.person_id) {
								flag = false
							} else {
								flag = true
							}
						} else {
							flag = false
						}
						break;
					case 'delete':
						if (row.nApproverResult < 3) {
							flag = true
						} else {
							flag = false
						}
						break;
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
					case 'apply':
						that.sealApply(row)
						break
					case 'sealProc':
						that.sealProc(row)
						break
					case 'confirm':
						that.handlSealApplyEnd(row)
						break
					case 'docPostView':
						that.handlDocPostView(row)
						break
						//删除
					case 'delete':
						that.handleDeletemodify(row)
						break
				}
			},
			sealProc(row) {
				if (row.use_id) {
					this.$refs['sealProcDialog'].showEdit(row, undefined)
				} else {
					let row_temp = {}
					row_temp.act_usage = row.usage
					row_temp.apply_date = row.apply_date
					row_temp.apply_id = row.apply_id
					this.$refs['sealProcDialog'].showEdit(undefined, row_temp)
				}
			},
			async handlDocPostView(row) {
				let list = [{
					field: 'send_id',
					type: 3,
					level: 1,
				}]
				let form = {
					send_id: row.original_id
				}
				let {
					data,
					code
				} = await this.QueryExec_fob(380, list, form);
				if (code != 200) {
					this.$baseMessage('查询异常，请刷新重试', 'error')
					return
				}
				if (!data || data.length == 0) {
					this.$baseMessage('未找到对应发文记录，请在发文台账中查找', 'error')
					return
				}
				this.$refs['postRegistrationViewDialog'].showEdit(data[0])
			},
			handlSealApplyEnd(row) {
				this.$refs['sealApplyEndDialog'].showEdit(row)
			},
			sealApply(row) {
				let form_info = {
					seal_id: row.seal_id
				}
				this.$refs['sealApplyDialog'].showEdit(undefined, form_info)
			},
			handleView(row) {
				this.$refs['sealApplyViewDialog'].showEdit(row, undefined, undefined)
			},
			Examine(row) {
        if(row.apply_type == 2) {
          this.$refs['sealApplyReportDialog'].showEdit(row, undefined, undefined)
        }
        else {
          this.$refs['sealApplyExamineDialog'].showEdit(row, undefined, undefined)
        }

			},
			EditInfo(row) {
				this.handleAdd(row, undefined, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['sealApplyDialog'].showEdit(row, parent_info, disable)
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
				that.delete_from_fob(that, row, 365, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'apply_id', //主键
					file: {

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
						this.columnHideList = ['seal_name']
						that.fetchData1(pageInfo, treeNode, resolve)
						break
					case 1:
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
					case 2:
						that.fetchDataPost(pageInfo, treeNode, resolve)
						break
          case 3:
          	that.fetchDataReport(pageInfo, treeNode, resolve)
          	break
				}
			},
			async fetchDataMain(row, treeNode, resolve) {
				let that = this
				let select_list = [{
						field: 'seal_name',
						type: 2,
						level: 1,
					}, {
						field: 'usage',
						type: 2,
						level: 2,
					}, {
						field: 'applicant',
						type: 2,
						level: 3,
					}, {
						field: 'approver',
						type: 2,
						level: 4,
					}, {
						field: 'sealer',
						type: 2,
						level: 5,
					}, {
						field: 'nApproverResult',
						type: 3,
						level: 6,
					}, {
						field: 'approve_time',
						type: 5,
						level: 7,
						split: '~',
					}, {
						field: 'use_date',
						type: 5,
						level: 8,
						split: '~',
					}, {
						field: 'apply_date',
						type: 5,
						level: 9,
						split: '~',
					}, {
						field: 'org_id',
						type: 3,
						level: 10,
					}, {
						field: 'pageNo',
						type: 3,
						level: 11,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 12,
					},
				]
				let sqlcode = 372
				that.queryForm.org_id = that.GetCurrentOrg()
				that.queryForm.nextStatusShow = that.nextStatus
				that.queryForm.status = that.status
				that.search_fob(select_list, that, sqlcode, {
					'loading': 'listLoading', //加载画面
					'data': 'tablelist', //数据存放位置
					'total': 'total', //数据数量，根据该数量分页
					'queryForm': 'queryForm' //查询数据表单，请将分页条件也放置在其中
				});
			},
			//印章子表从表加载数据
			async fetchData1() {
				let that = this
				let select_list = [{
						field: 'seal_id',
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
				that.queryForm.seal_id = that.primary_key
				that.search_fob(select_list, that, 361, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
      //印章子表从表加载数据
      async fetchDataReport() {
      	let that = this
      	let select_list = [{
      			field: 'original_id',
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
      	that.queryForm.original_id = that.primary_key
      	that.search_fob(select_list, that, 843, {
      		loading: 'listLoading', //加载画面
      		data: 'tablelist', //数据存放位置
      		total: 'total', //数据数量，根据该数量分页
      		queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
      	})
        console.log(that.queryForm)
      },
			//子表加载
			async fetchDataPost() {
				let that = this
				let select_list = [{
						field: 'apply_type',
						type: 3,
						level: 1,
					}, {
						field: 'original_id',
						type: 3,
						level: 2,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 3,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 4,
					},
				]
				that.queryForm.apply_type = that.apply_type
				that.queryForm.original_id = that.primary_key
				that.search_fob(select_list, that, 376, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			}
		},
	}
</script>

<style>

</style>

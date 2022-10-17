<template>
	<div>
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column show-overflow-tooltip label="状态" prop="nApproverResult" width="80px" align="center"
				header-align="center">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.stauts=='0'">未提交
					</el-tag>
					<el-tag type="warning" v-else-if="scope.row.stauts=='10'">审核中
					</el-tag>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.stauts=='11'">
						<p>上次审核人: {{ scope.row.approver_last }}</p>
						<p>上次审核时间: {{ scope.row.approval_last_time }}</p>
						<p>上次审核回复: {{ scope.row.approval_last_result }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag color="#FFD700">重审中</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.stauts=='21'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approval_time }}</p>
						<p>审核回复: {{ scope.row.approval_result }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="danger">退回</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.stauts=='20'">
						<p>审核人: {{ scope.row.approver }}</p>
						<p>审核时间: {{ scope.row.approval_time }}</p>
						<p>审核回复: {{ scope.row.approval_result }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="success">审核通过</el-tag>
						</div>
					</el-popover>
					<el-popover trigger="hover" placement="top" v-else-if="scope.row.stauts=='-10'">
						<p>作废人: {{ scope.row.approver }}</p>
						<p>作废时间: {{ scope.row.approval_time }}</p>
						<p>作废原因: {{ scope.row.approval_result }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag type="info">作废</el-tag>
						</div>
					</el-popover>
					<el-tag v-else>{{ scope.row.stauts }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip v-if="hideColFob('cert_name')" label="证书名称" prop="cert_name"
				align="center" header-align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="申请人" prop="applicant" width="90px" align="center"
				header-align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="申请时间" prop="application_time" width="150px" align="center"
				header-align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="用途" prop="purpose" width="170px" align="center"
				header-align="center"></el-table-column>


			<el-table-column show-overflow-tooltip label="审核人" prop="approver" width="90px" align="center"
				header-align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="审核时间" prop="approval_time" width="150px" align="center"
				header-align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="审核回复" prop="approval_result" align="center"
				header-align="center"></el-table-column>

			<el-table-column show-overflow-tooltip label="下载过期时间" prop="download_day" width="150px" align="center"
				header-align="center">
				<template slot-scope="scope">
					<el-tag v-if="parseInt(scope.row.stauts)==20&&parseInt(scope.row.download_day)==0">
						无限制
					</el-tag>
					<el-tag v-else-if="parseInt(scope.row.stauts)==20&&parseInt(scope.row.download_day)>0">
						{{calculationDayAndFormat(scope.row.approval_time,'day',parseInt(scope.row.download_day),1)}}
					</el-tag>
					<span v-else>
					</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="下载次数" prop="download_number" width="80px" align="center"
				header-align="center">
				<template slot-scope="scope">
					<el-tag v-if="parseInt(scope.row.stauts)==20&&parseInt(scope.row.download_number_max)==0">
						{{scope.row.download_number}}
					</el-tag>
					<el-tag v-else-if="parseInt(scope.row.stauts)==20&&parseInt(scope.row.download_number_max)>0">
						{{scope.row.download_number}}
					</el-tag>
					<span v-else>
					</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="可下载次数" prop="download_number_max" width="95px" align="center"
				header-align="center">
				<template slot-scope="scope">
					<el-tag v-if="parseInt(scope.row.stauts)==20&&parseInt(scope.row.download_number_max)>0">
						{{parseInt(scope.row.download_number_max)-parseInt(scope.row.download_number)}}
					</el-tag>
					<el-tag v-else-if="parseInt(scope.row.stauts)==20">
						无限制
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="55px" fixed="right" align="center"
				header-align="center">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
							<template v-for="item in dropdown.menu">
								<el-dropdown-item @click.native="handleCommand(item.command, scope.$index, scope.row)"
									v-if="ishasPermission(item.permission_name,scope.row) ">{{ item.label }}
								</el-dropdown-item>
							</template>
						</el-dropdown-menu>
					</el-dropdown>
				</template>


			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<qualificationCertApplyDialog ref="qualificationCertApplyDialog" :is-up-data.sync="main_dialog">
		</qualificationCertApplyDialog>
		<qualificationCertExamineDialog ref="qualificationCertExamineDialog" :is-up-data.sync="main_dialog">
		</qualificationCertExamineDialog>
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
	import {
		calculationDayAndFormat
	} from '@/utils/dateHelp'
	import {
		base64Download
	} from '@/utils/downLoad'
	import {
		waterMark
	} from '@/api/image'
	import qualificationCertApplyDialog from '../component/qualificationCertApplyDialog'
	import qualificationCertExamineDialog from '../component/qualificationCertExamineDialog'

	export default {
		name: 'qualificationCertApplyTable',
		components: {
			qualificationCertApplyDialog,
			qualificationCertExamineDialog
		},
		props: {
			type: {
				type: String,
				default: 'qualificationCert',
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
				switch (this.type) {
					case 'qualificationCert':
						this.fetchData({
							reload: 1,
						})
						break;
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
				dropdown: {
					menu: [{
							command: 'editapply',
							permission_name: 'editapply',
							label: '修改下载申请'
						},
						{
							command: 'approver',
							permission_name: 'approver',
							label: '审批下载申请'
						},
						{
							command: 'approver',
							permission_name: 'editapprover',
							label: '修改审批'
						},
						{
							command: 'downLoad',
							permission_name: 'downLoad',
							label: '下载证书'
						},
						{
							command: 'delete',
							permission_name: 'delete',
							label: '删除下载申请'
						},
						{
							command: '',
							permission_name: 'empty',
							label: '无权限操作此行数据'
						}
					],
					count: {}
				},
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
			calculationDayAndFormat(date, type, num, format) {
				return calculationDayAndFormat(date, type, num, format);
			},
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 'qualificationCert':
						this.height = 'calc(80%)'
						this.columnHideList = ['cert_name']
						if (this.primary_key > 0) {
							this.fetchData()
						}
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
				let primery_id = row.apply_id
				if (!name) {
					if (this.dropdown.count[primery_id]) {
						this.dropdown.count[primery_id]++
					} else {
						this.dropdown.count[primery_id] = 1
					}
					return true
				}
				let permission_name = ''
				let permissionRegister = {
					qualificationCert: {
						add: 'qualificationCertDownAdd',
						editapply: 'qualificationCertDownAdd',
						approver: 'qCertDownapprover',
						editapprover: 'qCertDownapprover',
						delete: 'qCertDownDelete',
						downLoad: 'qualificationCertDownAdd'
					},
				}
				switch (name) {
					default:
						if (permissionRegister[this.type] && permissionRegister[this.type][name]) {
							permission_name = permissionRegister[this.type][name]
						} else {
							permission_name = name
						}
						break
				}
				let flag = hasPermission(this.permission, permission_name)
				if (name == 'empty') {
					if (!this.dropdown.count[primery_id]) {
						flag = true;
					}
				}
				let role_max = this.role_max
				let dropdowMenu = {
					qualificationCert: ['all'],
				}
				if (dropdowMenu[this.type]) {
					let menu_list = dropdowMenu[this.type];
					if (menu_list.indexOf('all') >= 0) {

					} else if (menu_list.indexOf(name) < 0) {
						flag = false
					}
				}
				if (row.org_id != this.org_pid) {
					switch (name) {
						case 'empty':
							break
						default:
							if (role_max == 'super_admin') {
								//flag = true
							} else {
								flag = false
							}

							break
					}

				}
				if (!flag) {
					return flag
				}
				let array = [];

				switch (name) {
					case 'editapply':
						array = ['0', '10', '11', '21'];
						if (array.indexOf(row.stauts) >= 0 && row.applicant_id == this.person_id) {
							flag = true;
						} else {
							flag = false;
						}
						break;
					case 'approver':
						array = ['10', '11'];
						if (array.indexOf(row.stauts) >= 0 && row.applicant_id != this.person_id) {
							flag = true;
						} else {
							flag = false;
						}
						break
					case 'editapprover':
						array = ['20', '21'];
						if (array.indexOf(row.stauts) >= 0 && row.approver_id == this.person_id) {
							flag = true;
						} else {
							flag = false;
						}
						break;
					case 'downLoad':
						//审批通过且为审批人
						array = ['20'];
						if (array.indexOf(row.stauts) >= 0 && row.applicant_id == this.person_id) {
							flag = true;
						} else {
							flag = false;
						}
						break;
					default:
						flag = flag
						break;
				}
				if (flag) {

					switch (name) {
						case 'empty':
							break
						default:
							if (this.dropdown.count[primery_id]) {
								this.dropdown.count[primery_id]++
							} else {
								this.dropdown.count[primery_id] = 1
							}
							break
					}
				}
				return flag
			},
			handleCommand(command, index, row) {
				let that = this
				switch (command) {
					//查看
					case 'editapply':
						this.editapply(row);
						break;
					case 'approver':
						this.approver(row);
						break;
						//删除
					case 'delete':
						that.handleDeletemodify(row);
						break
					case 'downLoad':
						that.download(row);
						break;
				}
			},
			async download(row) {
				const res = await waterMark(row.apply_id, 12);
				if (res.staus <= 0) {
					return;
				}
				const file_name = res.data.name;
				const extend = res.data.extend;
				let prefix = '';
				switch (extend.toLowerCase()) {
					case "jpg":
					case "jpeg":
						prefix = 'data:image/jpg;base64,';
						break
					case "bmp":
						prefix = 'data:image/bmp;base64,';
						break
					case "gif":
						prefix = 'data:image/gif;base64,';
						break
					case "png":
						prefix = 'data:image/png;base64,';
						break
				}
				base64Download(prefix + res.data.base64, file_name);
				this.fetchData({
					pageNo: this.queryForm.pageNo,
				})
			},
			editapply(row) {
				this.$refs['qualificationCertApplyDialog'].showEdit(row)
			},
			approver(row) {
				this.$refs['qualificationCertExamineDialog'].showEdit(row)
			},

			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},

			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 680, {
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
					case 'qualificationCert':
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async fetchDataMain(row, treeNode, resolve) {
				let that = this
				let select_list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'cert_id',
						type: 3,
						level: 2,
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
				let sqlcode = 678
				that.queryForm.cert_id = that.primary_key
				that.search_fob(select_list, that, sqlcode, {
					'loading': 'listLoading', //加载画面
					'data': 'tablelist', //数据存放位置
					'total': 'total', //数据数量，根据该数量分页
					'queryForm': 'queryForm' //查询数据表单，请将分页条件也放置在其中
				});
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
</style>

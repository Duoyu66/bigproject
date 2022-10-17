<template>
	<div class="draftPageHigh">
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column show-overflow-tooltip label="接收类型" prop="target_post_type" width="80px"></el-table-column>
			<el-table-column show-overflow-tooltip label="接收机构" prop="receiver_org_name" min-width="200px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="签收状态" prop="sign_status" min-width="80px">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.sign_time">
						{{scope.row.sign_status}}
					</el-tag>
					<el-tag type="warning" v-else>
						{{scope.row.sign_status}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="回复状态" prop="reply_status" min-width="80px">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.reply_status.indexOf('已')>=0">
						{{scope.row.reply_status}}
					</el-tag>
					<el-tag type="warning" v-else>
						{{scope.row.reply_status}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="发送人" prop="sender" width="100px"></el-table-column>
			<el-table-column show-overflow-tooltip label="发送时间" prop="post_time" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="发送方式" prop="post_mode">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top" v-if="PostModeInfoConvert(scope.row).length>0">
						<p v-for="data in PostModeInfoConvert(scope.row)" :key="data.index">{{ data.label }}:
							{{data.value}}
						</p>
						<div slot="reference" class="name-wrapper">
							<el-tag>{{scope.row.post_mode}}</el-tag>
						</div>
					</el-popover>
					<el-tag v-else>{{scope.row.post_mode}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="接收人/签收人" prop="receiver" width="115px"></el-table-column>
			<el-table-column show-overflow-tooltip label="签收时间" prop="sign_time" width="150px"></el-table-column>

			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
	<!-- 						<el-dropdown-item icon="el-icon-s-order"
								@click.native="handleCommand('view', scope.$index, scope.row)">
								详情
							</el-dropdown-item> -->
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('edit', scope.$index, scope.row)"
								v-show="ishasPermission('edit',scope.row)">
								编辑
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('replyAdd', scope.$index, scope.row)"
								v-show="ishasPermission('edit',scope.row)">
								登记收文
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('replyBind', scope.$index, scope.row)"
								v-show="ishasPermission('replyBind',scope.row)">
								绑定收文
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('replyViewAll', scope.$index, scope.row)"
								v-show="ishasPermission('edit',scope.row)">
								查看收文
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
		<docPostHistoryDialog ref="docPostHistoryDialog" :is-up-data.sync="main_dialog">
		</docPostHistoryDialog>
		<docPostReplyDialog ref="docPostReplyDialog" :is-up-data.sync="main_dialog">
		</docPostReplyDialog>
		<docPostReplyViewTableDialog ref="docPostReplyViewTableDialog" :is-up-data.sync="main_dialog">
		</docPostReplyViewTableDialog>
		<docPostReplyManualDialog ref="docPostReplyManualDialog" :is-up-data.sync="main_dialog">
		</docPostReplyManualDialog>



		<sealApplyDialog ref="sealApplyDialog" :is-up-data.sync="main_dialog">
		</sealApplyDialog>

		<postRegistrationExamineDialog ref="postRegistrationExamineDialog" :is-up-data.sync="main_dialog">
		</postRegistrationExamineDialog>
		<sealLedgerViewDialog ref="sealLedgerViewDialog" :is-up-data.sync="main_dialog">
		</sealLedgerViewDialog>
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
	import docPostHistoryDialog from '../components/docPostHistoryDialog'
	import docPostReplyDialog from '../components/docPostReplyDialog'
	import docPostReplyViewTableDialog from '../components/docPostReplyViewTableDialog'
	import docPostReplyManualDialog from '../components/docPostReplyManualDialog'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'



	import sealLedgerViewDialog from '../components/sealLedgerViewDialog'
	import sealApplyDialog from '../components/sealApplyDialog'
	import postRegistrationExamineDialog from '../components/postRegistrationExamineDialog'
	export default {
		name: 'docPostHistoryTable',
		components: {
			docPostReplyManualDialog,
			docPostReplyViewTableDialog,
			docPostReplyDialog,
			docPostHistoryDialog,

			sealApplyDialog,


			sealLedgerViewDialog,
			postRegistrationExamineDialog
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
				org_pid: 'user/org_pid',
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				console.log(this)
				if (this.type == 0) {
					this.fetchData({
						reload: 1,
					})
				}

			},
			main_dialog(newVal, oldVal) {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					post_history_id: -1
				}
				this.fetchData()
				setTimeout(function() {
					console.log('main_dialog setTimeout selectedRow', selectedRow)
					this.selectedRow = selectedRow
				}, 500)

			},
			current_org_id() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {
				if (newVal && newVal.post_history_id) {
					switch (this.type) {
						case 1:
							this.$emit('update:primary_key', Number(newVal.post_history_id));
							break
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
				selectData: {
					post_mode: [],
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

			async init() {
				await this.GetDataGroup()
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 0:
						this.height = 'calc(80%)'
						this.columnHideList = ['user_name']
						break
					case 1:
						this.height = 'calc(80%)'
						break
				}
			},
			async GetDataGroup() {
				let list = [{
					data: "post_mode",
					group_id: 1019
				}];
				await GetGroupDataEx(this, list)
			},
			PostModeInfoConvert(row) {
				let list = []
				try {
					if (!row.post_mode_info) {
						return list
					}
					if (this.selectData.post_mode.length == 0) {
						this.GetDataGroup()
					}
					let info = row.post_mode_info
					let infoJson = JSON.parse(info)
					let post_mode = row.post_mode
					let nCount = 0
					let filterList = []
					while (nCount < 3 || filterList.length > 0) {
						filterList = this.selectData.post_mode.filter(function(o) {
							return o.item_name == post_mode;
						});
						if (filterList.length > 0) {
							break
						}
						this.GetDataGroup()
					}
					if (!filterList || filterList.length == 0) {
						return list
					}
					let item = filterList[0]
					let Json = JSON.parse(item.custom)
					Json.forEach(function(item) {
						if (infoJson[item.field]) {
							list.push({
								label: item.label,
								value: infoJson[item.field],
								filed: item.field,
								index: list.length
							})
						}
					})
				} catch (e) {
					console.log(e)
				}
				return list
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
						permission_name = 'docPostHistoryAdd'
						break
					case 'edit':
						permission_name = 'docPostHistoryEdit'
						break

					case 'delete':
						permission_name = 'docPostHistoryDelete'
						break
					case 'sealApplyAdd':
						permission_name = 'sealApplyAdd'
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
				if (row.org_id != this.org_pid) {
					flag = false
					return flag
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'sealApplyAdd':
						if (row.enabled == '1') {
							flag = true
						} else {
							flag = false
						}
						break
					case 'edit':
						flag = flag
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

					case 'replyAdd':
						that.replyAdd(row)
						break
					case 'replyBind':
						that.handlreplyManual(row)
						break
					case 'replyViewAll':
						that.replyViewAll(row)
						break
					case 'apply':
						that.sealApply(row)
						break
						//删除
					case 'delete':
						that.handleDeletemodify(row)
						break
				}
			},
			handlreplyManual(row) {
				let form_info = {
					post_history_id: row.post_history_id,
					org_id: row.org_id
				}
				this.$refs['docPostReplyManualDialog'].showEdit(undefined, form_info)
			},
			replyViewAll(row) {
				let form_info = {
					post_history_id: row.post_history_id
				}
				this.$refs['docPostReplyViewTableDialog'].showEdit(undefined, form_info)
			},
			replyAdd(row) {
				let form_info = {
					post_history_id: row.post_history_id
				}
				this.$refs['docPostReplyDialog'].showEdit(undefined, form_info)
			},
			sealApply(row) {
				let form_info = {
					seal_id: row.seal_id
				}
				this.$refs['sealApplyDialog'].showEdit(undefined, form_info)
			},
			handleView(row) {
				this.$refs['sealLedgerViewDialog'].showEdit(row, undefined, undefined)
			},
			Examine(row) {
				this.$refs['postRegistrationExamineDialog'].showEdit(row, undefined, undefined)
			},
			EditInfo(row) {
				this.handleAdd(row, undefined, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['docPostHistoryDialog'].showEdit(row, parent_info, disable)
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
				that.$confirm('是否删除发送记录？', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '取消',
						cancelButtonText: '确定删除'
					})
					.then(() => {

					})
					.catch(action => {
						that.delete_from_fob(that, row, 395, {
							//"selectRows": "selectRows", //复选框选中数据
							fetchData: 'fetchData', //加载数据
							main_key: 'post_history_id', //主键
							file: {
								//seal_image: 12,
							}
						})
					});

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
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'seal_name',
						type: 2,
						level: 2,
					}, {
						field: 'usage',
						type: 2,
						level: 3,
					}, {
						field: 'location',
						type: 2,
						level: 4,
					}, {
						field: 'type',
						type: 2,
						level: 5,
					}, {
						field: 'enabled',
						type: 3,
						level: 6,
					}, {
						field: 'seal_no',
						type: 2,
						level: 7,
					}, {
						field: 'manage_no',
						type: 2,
						level: 8,
					}, {
						field: 'pageNo',
						type: 3,
						level: 9,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 10,
					},
				]
				let sqlcode = 358
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

			//子表从表加载数据
			async fetchData1() {
				let that = this
				let select_list = [{
						field: 'send_id',
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
				that.queryForm.send_id = that.primary_key
				that.search_fob(select_list, that, 389, {
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

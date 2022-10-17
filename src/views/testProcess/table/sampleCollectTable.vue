<template>
	<div>
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column show-overflow-tooltip prop="status" label="样品状态" width="100px" align="center" fixed="left">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.status=='已检'">{{scope.row.status}}
					</el-tag>
					<el-tag type="warning" v-else-if="scope.row.status=='在检'">{{scope.row.status}}
					</el-tag>
					<el-tag type="danger" v-else-if="scope.row.status=='待检'">{{scope.row.status}}
					</el-tag>
					<el-tag v-else>未知状态{{ scope.row.status }}
					</el-tag>
				</template>
			</el-table-column>


			<el-table-column show-overflow-tooltip prop="sample_no" label="样品编号" min-width="150px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="sample_name" label="样品名称" width="100px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('object_id')" show-overflow-tooltip prop="object_id" label="试验名称"
				min-width="150px" align="center">
				<template slot-scope="scope">
					<el-tag
						v-show="ObjectName.hasOwnProperty(scope.row.object_id)&&ObjectName[scope.row.object_id].hasOwnProperty('object_name')">
						{{GetObjectNameForTable(scope.row.object_id)}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="sample_spc" label="样品规格" width="100px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="quantity" label="收样数量" width="100px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('sender')" show-overflow-tooltip prop="sender" label="送样人" width="100px"
				align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('send_time')" show-overflow-tooltip prop="send_time" label="送样时间"
				width="100px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="checkIn" label="收样人" width="100px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="entry_time" label="收样时间" align="center" width="170px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="location" label="存放位置" width="170px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="entry_type" label="收样方式" width="80px" align="center">
			</el-table-column>

			<el-table-column show-overflow-tooltip prop="unit" label="数量单位" width="100px" align="center">
			</el-table-column>
			<!-- 			<el-table-column show-overflow-tooltip prop="tag_type" label="标签类型" width="120px" align="center">
			</el-table-column> -->
			<el-table-column show-overflow-tooltip prop="env_param" label="环境温湿度" width="170px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="end_time" label="预计留样时间" width="170px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('order_id')" show-overflow-tooltip prop="order_id" label="委托编号"
				min-width="150px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="60px" align="center" fixed="right">
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
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('edit', scope.$index, scope.row)"
								v-show="ishasPermission('edit',scope.row)">
								打印标签
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('retain', scope.$index, scope.row)"
								v-show="ishasPermission('retain',scope.row)">
								留样
							</el-dropdown-item>
							<!-- 							<el-dropdown-item icon="el-icon-folder-checked"
								@click.native="handleCommand('apply', scope.$index, scope.row)"
								v-show="ishasPermission('sealApplyAdd',scope.row)">
								去做试验
							</el-dropdown-item> -->
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
		<preview ref="preview"></preview>
		<!-- <paramRmDialog ref="paramRmDialog" :isUpData.sync="tableReload"></paramRmDialog> -->
	</div>
</template>

<script>
	//import paramRmDialog from '../component/paramRmDialog'
	import {
		Notify,
		dealRespond,
	} from '@/utils/respondDeal'
	import {
		treePaging
	} from '@/global/form.helper'
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'
	// import {
	// 	FileDownLoad,
	// 	fileDetail
	// } from '../js/file.js'

	import preview from '@/components/fileAbout/preview'
	export default {
		name: 'sampleCollectTable',
		components: {
			preview,
			// paramRmDialog
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
			accepted: {
				type: String,
				default: ''
			},
			status: {
				type: String,
				default: ''
			},
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
				if (this.type == 0 || this.type == 10) {
					this.fetchData({
						reload: 1,
					})
				}

			},
			tableReload(newVal, oldVal) {
				this.fetchData({

				})
			},
			main_dialog(newVal, oldVal) {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					sample_id: -1
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
				if (newVal && newVal.sample_id) {
					switch (this.type) {
						case 1:
							this.$emit('update:primary_key', Number(newVal.sample_id));
							break
					}

				}

			},
		},
		data() {
			return {
				pdf_file_type: 12,
				tableReload: false,
				tableTemplateShow: {

				},
				ObjectName: {

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
					}, ]
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
					case 10:
					case 0:
						this.height = 'calc(84%)'
						this.columnHideList = ['order_id', 'object_id', 'sender', 'send_time']
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 20:
						this.columnHideList = ['order_id', 'object_id', 'sender', 'send_time']
					case 1:
						this.height = 'calc(84%)'
						break
				}
				await this.GetObjectName()
			},
			GetOrgNameCall(org_id) {
				let that = this
				that.GetOrgName(org_id).then(orgName => {
					that.$set(that.tableTemplateShow, org_id, orgName)
				})
				return ''
			},
			GetObjectNameForTable(object_id) {
				if (!this.ObjectName) {
					return ''
				}
				if (!this.ObjectName[object_id]) {
					return ''
				}
				if (!this.ObjectName[object_id].object_name) {
					return ''
				}
				return this.ObjectName[object_id].object_name
			},
			async GetObjectName() {
				if (JSON.stringify(this.ObjectName) != '{}') {
					return -1
				}
				// let sqlcode = 455
				// let list = []
				// let form = {}
				// let {
				// 	data
				// } = await this.QueryExec_fob(sqlcode, list, form)
				// if (!data || data.length == 0) {
				// 	return 0
				// }
				// let that = this
				// let object_id = ''
				// let object_name = ''
				// let orgNameOject = {}
				// data.forEach((e) => {
				// 	object_id = e.object_id
				// 	object_name = e.object_name
				// 	orgNameOject[object_id] = {
				// 		object_name: object_name
				// 	}
				// })
				let orgNameOject = await this.$store.dispatch('testObject/GetJsonKeyObejctIdAll')
				this.$set(this, 'ObjectName', orgNameOject)
				return 1;
			},
			async GetOrgName(org_id) {
				//let  orgName = await this.$store.dispatch('org/GetOrgNameByOrgIdSync', org_id)
				let orgName = await this.$store.dispatch('org/GetOrgNameByOrgId', org_id)

				return orgName
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
						//that.EditInfo(row)
						break


					case 'apply':
						//that.sealApply(row)
						break
						//删除
					case 'delete':
						//that.handleDeletemodify(row)
						break
				}
			},
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
			},
			deleteMap(row) {
				let tips = '是否从该参数[' + row.param + ']';
				if (row.std_id) {
					tips = tips + '的[' + row.standard_id + ' ' + row.doc_name + ']标准'
				}
				tips = tips + '中删除该标准物质[' + row.name + '';
				if (row.model && row.model != '/') {
					tips = tips + '  规格:' + row.model + '';
				}
				if (row.unit && row.unit != '/') {
					tips = tips + '  单位:' + row.unit + '';
				}
				tips = tips + ']';
				this.$baseConfirm(tips, null, async () => {
					//opertion_type 0 选中【添加】 1 取消选中【删除】
					let sqlcode = 446

					let list = [{
							field: "opertion_type",
							level: 1
						},
						{
							field: "param_id",
							level: 2
						}, {
							field: "chemical_id",
							level: 3
						},
						{
							field: "std_id",
							level: 4
						},
						{
							field: "tpl_id",
							level: 5
						}, {
							field: "quantity",
							level: 6
						},
						{
							field: "map_id",
							level: 7
						}
					]

					let form = {
						map_id: row.map_id,
						param_id: row.param_id,
						opertion_type: 2,
					}
					console.log(form)
					let info = await dealRespond(sqlcode, list, form)
					Notify(this, info[0], info[1]);
					this.fetchData()
				})
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
						permission_name = 'sealLedgerAdd'
						break
					case 'edit':
						permission_name = 'sealLedgerEdit'
						break

					case 'delete':
						permission_name = 'sealLedgerDelete'
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
					flag = true
					//return flag
				}
				if (row.org_id != this.org_pid) {
					//flag = false
					//return flag
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'retain':
						if (row.status == '已检') {
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
			editDialog(row) {
				this.$refs['paramRmDialog'].showEdit(row)
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


					case 'apply':
						that.sealApply(row)
						break
						//删除
					case 'delete':
						that.handleDeletemodify(row)
						break
				}
			},
			sealApply(row) {
				let form_info = {
					seal_id: row.seal_id
				}

			},
			handleView(row) {

			},
			Examine(row) {

			},
			EditInfo(row) {

			},
			handleAdd(row, parent_info, disable) {
				t
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
				that.$confirm('此操作会清空所有相关信息，是否继续？', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '取消',
						cancelButtonText: '确定删除'
					})
					.then(() => {

					})
					.catch(action => {
						that.delete_from_fob(that, row, 364, {
							//"selectRows": "selectRows", //复选框选中数据
							fetchData: 'fetchData', //加载数据
							main_key: 'seal_id', //主键
							file: {
								seal_image: 12,
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
				console.log('that.type', that.type)

				switch (that.type) {
					case 0:

						that.fetchData1(pageInfo, treeNode, resolve)
						break
					case 20:
					case 1:
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
					case 10:
						that.fetchData2(pageInfo, treeNode, resolve)
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
						field: 'order_id',
						type: 2,
						level: 2,
					}, {
						field: 'order_date_start',
						type: 3,
						level: 3,
					}, {
						field: 'order_date_end',
						type: 3,
						level: 4,
					}, {
						field: 'sample_no',
						type: 2,
						level: 5,
					}, {
						field: 'entry_time_start',
						type: 3,
						level: 6,
					}, {
						field: 'entry_time_ned',
						type: 3,
						level: 7,
					}, {
						field: 'checkIn',
						type: 2,
						level: 8,
					}, {
						field: 'object_id',
						type: 3,
						level: 9,
					}, {
						field: 'status',
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
				let sqlcode = 464
				that.queryForm.org_id = that.GetCurrentOrg()
				that.queryForm.accepted = that.accepted
				that.queryForm.stage = that.stage
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
						field: 'entrust_id',
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
				that.queryForm.entrust_id = that.primary_key
				that.search_fob(select_list, that, 456, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
			//子表从表加载数据
			async fetchData2() {
				let that = this
				let select_list = [{
						field: 'data_id',
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
				that.queryForm.data_id = that.primary_key
				that.search_fob(select_list, that, 462, {
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

	/* .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
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
	} */
</style>

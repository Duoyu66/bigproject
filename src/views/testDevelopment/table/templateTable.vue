<template>
	<div>
		<el-table ref="templateTable" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column show-overflow-tooltip prop="template_name" label="模板名称" min-width="150px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="template_version" label="模板版本" width="100px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="150px" align="center" fixed="right">
				<template #default="{ row }">
					<el-button @click="editDialog(row)" type="primary" class="normal">编辑</el-button>
					<el-button @click="deleteMap(row)" class="danger">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<parameterTemplate ref="parameterTemplate" @fetchDataChild="fetchDataChild"
			@fetchDataChildFile="fetchDataChild"></parameterTemplate>
		<entrustTemplate ref="entrustTemplate" @fetchDataChild="fetchDataChild" @fetchData="fetchDataChild">
		</entrustTemplate>
		<reportTemplate ref="reportTemplate" @fetchDataChild="fetchDataChild" @fetchData="fetchDataChild">
		</reportTemplate>

		<paramTemplateMappingDialig ref="paramTemplateMappingDialig" @reloadChildren="fetchDataChild" @reload="reload">
		</paramTemplateMappingDialig>
	</div>
</template>

<script>
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

	import entrustTemplate from './../components/entrustTemplate'
	import parameterTemplate from './../components/parameterTemplate'
	import reportTemplate from './../components/reportTemplate'

	import paramTemplateMappingDialig from '../component/paramTemplateMappingDialig'
	export default {
		name: 'templateTable',
		components: {
			entrustTemplate,
			parameterTemplate,
			reportTemplate,

			paramTemplateMappingDialig
		},
		props: {
			//0 参数模板 10 委托模板 报告模板
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
				switch (this.type) {
					case 0:
					case 10:
					case 11:
						this.fetchData({
							reload: 1,
						})
						break
				}

			},
			tableReload(newVal, oldVal) {
				this.fetchData({

				})
			},
			main_dialog(newVal, oldVal) {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					seal_id: -1
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
				console.log('selectedRow', newVal)
				if (newVal && newVal.seal_id) {
					this.$emit('update:primary_key', Number(newVal.seal_id));
				}

			},
		},
		data() {
			return {
				pdf_file_type: 12,
				tableReload: false,

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
				switch (this.type) { //0 参数模板 10 委托模板
					case 0:
						this.height = 'calc(80%)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 10: //委托模板
					case 11: //报告模板
						this.height = 'calc(80%)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 1:
						this.height = 'calc(80%)'
						break
				}
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
			deleteMap(row) {
				let sqlcode = -1;
				let tips = ''
				let main_key = ''
				switch (this.type) {
					//参数模板
					case 0:
						sqlcode = 517;
						main_key = 'paramtemp_id'
						tips = '确定从参数[' + row.param + ']中删除' + row.template_name + '模板?'
						break
						//委托模板
					case 10:
						sqlcode = 551;
						main_key = 'entrusttemplate_id'
						tips = '确定从试验[' + row.object_id + ']中删除' + row.template_name + '模板?'
						break
						//报告模板
					case 11:
						sqlcode = 552;
						main_key = 'id'
						tips = '确定从试验[' + row.object_id + ']中删除' + row.template_name + '模板?'
						break
				}

				if (sqlcode < 0) {
					return
				}
				this.delete_from_fob(this, row, sqlcode, {
					//"selectRows": "selectRows", //复选框选中数据
					"fetchData": "fetchData", //加载数据
					"main_key": main_key, //主键
					'confirmMsg': tips
				});
			},
			editDialog(row) {
				switch (this.type) {
					case 0:
						//this.$refs['parameterTemplate'].showEdit(row, '1')
						this.$refs['paramTemplateMappingDialig'].showEdit(row)
						break
					case 10:
						this.$refs['entrustTemplate'].showEdit(row, '1')
						break
					case 11:
						this.$refs['reportTemplate'].showEdit(row, '1')
						break
				}
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
			fetchDataChild() {
				this.reload()
			},
			reload() {
				this.fetchData({
					pageNo: this.queryForm.pageNo
				})
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
						that.fetchData1(pageInfo, treeNode, resolve)
						break
					case 1:
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
					case 10:
						that.fetchDataentrust(pageInfo, treeNode, resolve)
						break
					case 11:
						that.fetchDataReport(pageInfo, treeNode, resolve)
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
			async fetchDataentrust() {
				let that = this
				let select_list = [{
						field: 'object_id',
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
				that.queryForm.object_id = that.primary_key
				that.search_fob(select_list, that, 508, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
			//子表从表加载数据
			async fetchDataReport() {
				let that = this
				let select_list = [{
						field: 'object_id',
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
				that.queryForm.object_id = that.primary_key
				that.search_fob(select_list, that, 509, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
			//子表从表加载数据
			async fetchData1() {
				let that = this
				let select_list = [{
						field: 'param_id',
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
				that.queryForm.param_id = that.primary_key
				that.search_fob(select_list, that, 504, {
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

</style>

<template>
	<div class="parameterRtableBox">
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick" >
			<el-table-column show-overflow-tooltip prop="name" label="化学品名称" min-width="150px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="model" label="规格" width="100px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="unit" label="单位" width="100px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="quantity" label="用量" width="100px" align="center">
			</el-table-column>

			<el-table-column show-overflow-tooltip label="操作" width="150px" align="center" fixed="right">
				<template #default="{ row }">
					<el-button @click="editDialog(row)" type="primary" class="normal" v-if="ishasPermission('edit')">编辑
					</el-button>
					<el-button type="primary" class="normal" v-else disabled>编辑
					</el-button>
					<el-button @click="deleteMap(row)" class="danger" v-if="ishasPermission('delete')">删除</el-button>
					<el-button class="danger" v-else disabled>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<preview ref="preview"></preview>
		<paramChemicalDialog ref="paramChemicalDialog" :isUpData.sync="tableReload"></paramChemicalDialog>
	</div>
</template>

<script>
	import paramChemicalDialog from '../component/paramChemicalDialog'
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
	import {
		FileDownLoad,
		fileDetail
	} from '../js/file.js'

	import preview from '@/components/fileAbout/preview'
	export default {
		name: 'paramChemicalTable',
		components: {
			preview,
			paramChemicalDialog
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
				switch (this.type) {
					case 0:
					case 10:
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
					case 10:
						this.height = 'calc(93%)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 0:
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
			pdfdetail(row) {
				let that = this
				if (row.pdf_file != '') {
					let file = fileDetail(this.pdf_file_type, row.pdf_file, row.doc_name)
					this.$refs['preview'].handleEdit(file, 0)
				} else {
					this.$message.error(
						"服务器无可预览文件"
					)
				}
			},
			pdfDownLoad(row) {
				if (row.pdf_file != '') {
					FileDownLoad(this.pdf_file_type, row.pdf_file, row.standard_id + '  ' + row.doc_name)
				} else {
					this.$message.error(
						"服务器无下载预览文件"
					)
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
				tips = tips + '中删除该化学品[' + row.name + '';
				if (row.model && row.model != '/') {
					tips = tips + '  规格:' + row.model + '';
				}
				if (row.unit && row.unit != '/') {
					tips = tips + '  单位:' + row.unit + '';
				}
				tips = tips + ']';
				this.$baseConfirm(tips, null, async () => {
					//opertion_type 0 选中【添加】 1 取消选中【删除】
					let sqlcode = 439

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
							field: "use_id",
							level: 7
						}
					]

					let form = {
						use_id: row.use_id,
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
				if (this.type == 0) {
					return true
				}
				let permissionRegister = {
					10: {
						add: 'parameterEquipmentAdd',
						edit: 'parameterEquipmentEdit',
						delete: 'parameterEquipmentDelete',
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
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					//flag = true
					//return flag
				}
				// if (row.org_id != this.org_pid) {
				// 	flag = false
				// 	return flag
				// }
				if (!flag) {
					return flag
				}
				switch (name) {

					default:
						flag = flag
						break;
				}
				return flag
			},
			editDialog(row) {
				this.$refs['paramChemicalDialog'].showEdit(row)
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
				switch (that.type) {
					case 10:
					case 0:
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
						field: 'param_id',
						type: 3,
						level: 1,
					},
					{
						field: 'chemical_name',
						type: 2,
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
				that.queryForm.param_id = that.primary_key
				that.search_fob(select_list, that, 442, {
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

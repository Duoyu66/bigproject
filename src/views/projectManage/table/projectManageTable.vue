<template>
	<!-- 机构类型定义 -->
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick" class="roleRTabHigh">
			<el-table-column v-if="hideColFob('project_id')" show-overflow-tooltip label="交易中心工程编号" prop="project_id"
				width="136px" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="交易中心工程名称" prop="project_name" align="center" width="136px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="交易中心单项工程主类别" prop="main_kind" width="184px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="安全监督机构" prop="sec_mgr_org" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="质量监督机构" prop="qua_mgr_org" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="安全报监编号" prop="sec_super_id" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="质量报监编号" prop="qua_super_id" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="施工总承包单位交易中心单位编号" prop="constructor_id" width="232px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="施工总承包单位" prop="constructor_name" width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="监理单位交易中心单位编号" prop="supervisor_id" width="230px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="监理单位" prop="supervisor_name" width="150px"></el-table-column>
			<el-table-column v-if="hideColFob('memo')" show-overflow-tooltip label="备注" prop="memo"></el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="120px" fixed="right">
				<template #default="{ row }">
					<el-button v-if="ishasPermission('edit')" type="primary" class="normal" @click="EditInfo(row)">修改
					</el-button>
					<el-button v-else type="primary" class="normal" disabled>修改</el-button>
					<el-button v-if="ishasPermission('delete')" @click="handleDeletemodify(row)" class="danger">删除
					</el-button>
					<el-button v-else class="danger" disabled>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<projectManageDialog ref="projectManageDialog" :is-up-data.sync="main_dialog"></projectManageDialog>
		<!-- <projectManageDialog ref="projectManageDialogEdit" :is-up-data.sync="main_dialog"></projectManageDialog> -->
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'

	import projectManageDialog from '../dialog/projectManageDialog'

	export default {
		name: 'projectManageTable',
		components: {
			projectManageDialog,
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
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				current_and_chrilren_org: 'org/current_and_chrilren_org',

				person_id: 'user/person_id',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				switch (this.type) {
					case 1:
						this.fetchData({
							reload: 1,
						})
						break
				}

			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			current_and_chrilren_org(newVal, oldVal) {
				this.fetchData()
			},
			tablelist(newVal, oldVal) {

			},
			selectedRow(newVal, oldVal) {
				let primaryKey = -1
				if (newVal && newVal.id) {
					primaryKey = newVal.id
				} else {
					primaryKey = -1
				}
				switch (this.type) {
					case 0:
						this.$emit('update:primary_key', Number(primaryKey));
						break;
				}
			}
		},
		data() {
			return {
				height: 'calc(80%)',
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				elementLoadingText: '加载数据中',
				selectedRow: {},
				queryForm: {
					org_type: 2,
					pageSize: 10,
					pageNo: 1,
				},
				layout: '',
				total: 0,
				columnHideList: [],
			}
		},
		created() {
			this.init()
		},
		methods: {
			GetHeight() {},
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				switch (this.type) {
					case 0:
						this.height = 'calc(100%)'
						this.columnHideList = ['user_name']
						this.layout = 'total, sizes, prev, pager, next, jumper'
						break
					case 1:
						this.height = 'calc(100%)'
						this.layout = 'total, sizes, prev, pager, next, jumper'
						break
					case 2:
						this.height = 'calc(94%)'
						this.columnHideList = ['role_id', 'desc', 'enable', 'builtIn']
						this.layout = 'total, prev, next,jumper'
						break
				}
			},
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
						permission_name = 'projectManageAdd'
						break
					case 'edit':
						permission_name = 'projectManageEdit'
						break
					case 'delete':
						permission_name = 'projectManageDelete'
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
				switch (name) {
					default:
						flag = flag
						break;
				}
				return flag
			},
			handleAdd() {
				this.$refs['projectManageDialog'].showEdit()
			},
			getHideColist() {},
			setSelectRows(row) {
				console.log('setSelectRows', row)
				//this.selectRows = row
			},
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
			},
			tableSortChange() {},

			EditInfo(row) {
				this.$refs['projectManageDialog'].showEdit(row)
			},
			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 1015, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'id', //主键

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
			fetchData(pageInfo) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {

					case 0:
						that.fetchDataMain()
						break

				}
			},
			async fetchDataMain() {
				let that = this
				let select_list = [{
						field: 'pageNo',
						type: 3,
						level: 1,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 2,
					},
					{
						field: 'org_id',
						type: 3,
						level: 3,
					},
					{
						field: 'project_name',
						type: 2,
						level: 4,
					},
					{
						field: 'project_id',
						type: 2,
						level: 5,
					}, {
						field: 'main_kind',
						type: 2,
						level: 6,
					}, {
						field: 'sec_mgr_org',
						type: 2,
						level: 7,
					}, {
						field: 'qua_mgr_org',
						type: 2,
						level: 8,
					}, {
						field: 'sec_super_id',
						type: 2,
						level: 9,
					}, {
						field: 'qua_super_id',
						type: 3,
						level: 10,
					}, {
						field: 'constructor_id',
						type: 3,
						level: 11,
					}, {
						field: 'constructor_name',
						type: 3,
						level: 12,
					}, {
						field: 'supervisor_id',
						type: 3,
						level: 13,
					}, {
						field: 'supervisor_name',
						type: 3,
						level: 14,
					},
				]
				that.queryFormTemp = JSON.parse(JSON.stringify(that.queryForm))
				//that.queryFormTemp.org_id = that.current_org_id;
				that.queryFormTemp.org_id = that.current_and_chrilren_org
				that.search_fob(select_list, that, 1013, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryFormTemp', //查询数据表单，请将分页条件也放置在其中
				})
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

<style></style>

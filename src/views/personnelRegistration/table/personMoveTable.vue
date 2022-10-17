<template>
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange">
			<el-table-column v-if="hideColFob('user_name')" show-overflow-tooltip label="姓名" prop="user_name"
				min-width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="调出机构" prop="orgp_name" min-width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="to_org_name" label="调入机构" min-width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="调动时间" prop="change_date" align="center" width="160px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="调动原因" prop="move_reaon" align="center" width="160px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="申请时间" prop="apply_date" align="center" width="160px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="申请人" prop="applicant" align="center" width="160px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="经手人" prop="handler" align="center" width="160px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="备注" prop="remarks" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip prop="approve" label="审核状态" align="center" width="150px">
				<template slot-scope="scope">
					<span v-if="scope.row.approve === '0'" style="margin-left: 10px">
						未审核
					</span>
					<span v-else-if="scope.row.approve === '1'" style="margin-left: 10px">
						已通过 {{ scope.row.reason }}
					</span>
					<span v-else-if="scope.row.approve === '-1'" style="margin-left: 10px">
						退回[{{ scope.row.reason }}]
					</span>
					<span v-else-if="scope.row.approve === '-2'" style="margin-left: 10px">
						重审中
					</span>
					<span v-else-if="scope.row.approve === '-3'" style="margin-left: 10px">
						作废[{{ scope.row.reason }}]
					</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="approver" label="审核人" align="center" width="90px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="approve_date" label="审核时间" align="center" width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="170px" align="center" fixed="right">
				<template #default="{ row }">
					<el-button v-show="ishasPermission('examine', row)" class="normal" @click="ExamineHost(row)">
						审核
					</el-button>
					<el-button v-show="ishasPermission('edit', row)" class="normal" @click="EditInfo(row)">
						修改
					</el-button>
					<el-button v-show="ishasPermission('delete', row)" class="danger" @click="handleDeletemodify(row)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<personnelAllocation ref="personnelAllocation" :is-up-data.sync="main_dialog"></personnelAllocation>
		<allocationExamine ref="allocationExamine" :is-up-data.sync="main_dialog"></allocationExamine>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission,
		PermissionSubtableDeal
	} from '../js/permission'

	import personnelAllocation from '../components/personnelAllocation'
	import allocationExamine from '../components/allocationExamine'
	export default {
		name: 'PersonMoveTable',
		components: {
			personnelAllocation,
			allocationExamine,
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
				person_id: 'user/person_id',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				switch (this.type) {
					case 0:
						this.fetchData({
							reload: 1,
						})
						break
				}

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
					pageSize: 10,
					pageNo: 1,
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
			GetHeight() {},
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
						permission_name = 'move_add'
						break
					case 'edit':
						permission_name = 'move_edit'
						break
					case 'delete':
						permission_name = 'move_delete'
						break
					case 'examine':
						permission_name = 'move_examine'
						break
					case 'all_info':
						permission_name = 'all_person_info'
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
				if(!flag){
					return false
				}
				flag = PermissionSubtableDeal(flag, name, row, this.person_id, role_max)

				// switch (name) {
				// 	case 'examine':
				// 		if (this.person_id == row.person_id) {
				// 			flag = false
				// 			//console.log('自己无法审批自己')
				// 			return flag
				// 		}
				// 		if (row.approve == '-3' || row.approve == '1') {
				// 			//console.log('完成审批', row.approve)
				// 			flag = false
				// 			return flag
				// 		}
				// 		break
				// 	case 'edit':
				// 	case 'delete':
				// 	case 'add':
				// 		if (Number(row.approve) > 0 || Number(row.approve) < -2) {
				// 			//console.log('完成审批1', row.approve)
				// 			flag = false
				// 		}
				// 		break
				// }
				return flag
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},
			ExamineHost(row) {
				this.$refs['allocationExamine'].showEdit(row)
			},
			EditInfo(row) {
				this.$refs['personnelAllocation'].showEdit(row)
			},
			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 176, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'allocation_id', //主键
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
						this.columnHideList = ['user_name']
						that.fetchData1()
						break
					case 1:
						that.fetchDataMain()
						break
				}
			},
			async fetchDataMain() {
				let that = this
				let select_list = [{
						field: 'change_date',
						type: 5,
						level: 1,
						split: '~',
					},
					{
						field: 'name',
						type: 2,
						level: 2,
					},
					{
						field: 'approver',
						type: 2,
						level: 3,
					},
					{
						field: 'approve',
						type: 3,
						level: 4,
					},
					{
						field: 'from_org',
						type: 3,
						level: 5,
					},
					{
						field: 'to_org',
						type: 3,
						level: 6,
					},
					{
						field: 'person_id',
						type: 3,
						level: 7,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 8,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 9,
					},
				]
				that.queryFormTemp = JSON.parse(JSON.stringify(that.queryForm))
				if (that.queryFormTemp.org_type == 1) {
					that.queryFormTemp.to_org = that.current_org_id
				} else {
					that.queryFormTemp.from_org = that.current_org_id
				}
				if (that.ishasPermission('all_info')) {
					that.queryForm.person_id = undefined
				} else {
					that.queryForm.person_id = that.person_id
				}
				that.search_fob(select_list, that, 292, {
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

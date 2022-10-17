<template>
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange">
			<el-table-column show-overflow-tooltip label="外委机构名称" prop="ext_name" min-width="170"></el-table-column>
			<el-table-column show-overflow-tooltip label="送检检测项目" prop="ext_item" min-width="170"></el-table-column>
			<el-table-column show-overflow-tooltip label="外委单位地址" prop="addr" min-width="170"></el-table-column>
			<el-table-column show-overflow-tooltip label="联系人" prop="contacts" width="110"></el-table-column>
			<el-table-column show-overflow-tooltip label="电话" prop="tel" width="170"></el-table-column>
			<el-table-column show-overflow-tooltip label="外委合同编号" prop="contract_no" min-width="170"></el-table-column>
			<el-table-column show-overflow-tooltip label="生效日期" prop="start_date" width="170"></el-table-column>
			<el-table-column show-overflow-tooltip label="生效日期" prop="end_date" width="170"></el-table-column>
			<el-table-column show-overflow-tooltip label="备注" prop="remarks"></el-table-column>
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
		<ExOrganizationDialog ref="ExOrganizationDialog" :is-up-data.sync="main_dialog"></ExOrganizationDialog>

	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'

	import ExOrganizationDialog from '../components/ExOrganizationDialog.vue'

	export default {
		name: 'outsourcingOrgTable',
		components: {
			ExOrganizationDialog,
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
				this.fetchData({
					reload: 1,
				})
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
					org_type: 2,
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
						permission_name = 'outsourcingOrganizationAdd'
						break
					case 'edit':
						permission_name = 'outsourcingOrganizationEdit'
						break
					case 'delete':
						permission_name = 'outsourcingOrganizationDelete'
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
				this.$refs['ExOrganizationDialog'].showEdit()
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},

			EditInfo(row) {
				this.$refs['ExOrganizationDialog'].showEdit(row)
			},
			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 317, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'exId', //主键
					file: {
						contract_file: 12,
						ext_file: 11
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
						field: 'ext_name',
						type: 2,
						level: 1,
					},
					{
						field: 'ext_item',
						type: 2,
						level: 2,
					},
					{
						field: 'addr',
						type: 2,
						level: 3,
					},
					{
						field: 'contacts',
						type: 2,
						level: 4,
					},
					{
						field: 'tel',
						type: 2,
						level: 5,
					},
					{
						field: 'start_date',
						type: 5,
						level: 6,
						split: '~',
					},
					{
						field: 'end_date',
						type: 5,
						level: 7,
						split: '~',
					},
					{
						field: 'contract_no',
						type: 2,
						level: 8,
					},
					{
						field: 'org_id',
						type: 3,
						level: 9,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 10,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 11,
					},
				]
				that.queryFormTemp = JSON.parse(JSON.stringify(that.queryForm))
				if (that.queryFormTemp.org_type == 2) {
					that.queryFormTemp.to_org = that.current_org_id
				} else {
					that.queryFormTemp.from_org = that.current_org_id
				}
				if (that.ishasPermission('all_info')) {
					that.queryForm.person_id = undefined
				} else {
					that.queryForm.person_id = that.person_id
				}
				that.queryFormTemp.org_id = this.org_id
				that.search_fob(select_list, that, 316, {
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

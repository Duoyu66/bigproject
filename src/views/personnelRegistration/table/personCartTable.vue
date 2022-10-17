<template>
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange">
			<el-table-column show-overflow-tooltip label="姓名" prop="user_name" min-width="150px"
				v-if='hideColFob("user_name")'>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="证书名称" prop="cert_name">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="cert_id" label="证书编号" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="发证机构" prop="auth_org" align="center" width="200px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="approve" label="审核状态" align="center" width="170px">
				<template slot-scope="scope">
					<span style="margin-left: 10px" v-if="scope.row.approve ==='0'">未审核</span>
					<span style="margin-left: 10px" v-else-if="scope.row.approve ==='1'">已通过 {{scope.row.reason}}</span>
					<span style="margin-left: 10px"
						v-else-if="scope.row.approve ==='-1'">退回[{{scope.row.reason}}]</span>
					<span style="margin-left: 10px"
						v-else-if="scope.row.approve ==='-2'">重审中[{{scope.row.reason}}]</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="approver" label="审核人" align="center" width="90px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="approve_date" label="审核时间" align="center" width="160px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="60px" align="center" fixed="right">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown" class="more" style="min-width: 115px">
							<!-- 	<el-button @click="handleamenddetails(row)">
								详情
							</el-button> -->
							<el-button @click="ExamineHost(row)" v-show="ishasPermission('examine',row)">
								审核
							</el-button>
							<el-button @click="EditPersonelCred(row)" v-show="ishasPermission('edit',row)">
								修改
							</el-button>
							<el-button @click="handleDeletemodify(row)" v-show="ishasPermission('delete',row)">
								删除
							</el-button>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<personnelCred ref="personnelCred" :isUpData.sync="main_dialog"></personnelCred>
		<cartExamine ref="cartExamine" :isUpData.sync="main_dialog"></cartExamine>
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
	import personnelCred from '../components/personnelCred'
	import cartExamine from '../components/cartExamine'
	export default {
		name: 'educationalExperienceTable',
		components: {
			personnelCred,
			cartExamine
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
				}
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {

				this.fetchData({
					reload: 1
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
				height: '',
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
				columnHideList: []
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
						permission_name = 'cert_add'
						break
					case 'edit':
						permission_name = 'cert_edit'
						break
					case 'delete':
						permission_name = 'cert_delete'
						break
					case 'examine':
						permission_name = 'cert_examine'
						break
					case 'all_info':
						permission_name = 'all_person_info'
						break
					default:
						permission_name = name
						break
				}
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if(!flag){
					return flag
				}
				flag = PermissionSubtableDeal(flag, name, row, this.person_id, role_max)
				return flag
			},
			getHideColist() {

			},
			setSelectRows() {

			},
			tableSortChange() {

			},
			ExamineHost(row) {
				this.$refs['cartExamine'].showEdit(row)
			},
			EditPersonelCred(row) {
				this.$refs['personnelCred'].showEdit(row)
			},
			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 136, {
					//"selectRows": "selectRows", //复选框选中数据
					"fetchData": "fetchData", //加载数据
					"main_key": "hold_id", //主键
					"file": {
						cert_image: 12
					},
				});
			},
			paginationHadle() {

			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData({
					pageNo: val
				})
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData({
					pageNo: this.queryForm.pageNo
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
				} else {

				}
				switch (that.type) {
					case 0:
						that.fetchData1()
						break
					case 1:
						that.fetchDataMain()
						break
				}
			},
			//主表加载数据
			async fetchDataMain() {
				let that = this
				let select_list = [{
						field: 'name',
						type: 2,
						level: 1,
					}, {
						field: 'cert_name',
						type: 2,
						level: 2,
					}, {
						field: 'cert_id',
						type: 2,
						level: 3,
					}, {
						field: 'validate_from',
						type: 5,
						level: 4,
						split: '~'
					}, {
						field: 'validate_to',
						type: 5,
						level: 5,
						split: '~'
					}, {
						field: 'org_id',
						type: 3,
						level: 6
					}, {
						field: 'person_id',
						type: 3,
						level: 7
					}, {
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
				if (that.ishasPermission("all_info")) {
					that.queryForm.person_id = undefined
				} else {
					that.queryForm.person_id = that.person_id
				}
				that.queryForm.org_id = that.current_org_id
				that.search_fob(select_list, that, 293, {
					'loading': 'listLoading', //加载画面
					'data': 'tablelist', //数据存放位置
					'total': 'total', //数据数量，根据该数量分页
					'queryForm': 'queryForm' //查询数据表单，请将分页条件也放置在其中
				});
			},
			//从表加载数据
			async fetchData1() {
				let that = this
				let select_list = [{
						field: 'person_id',
						type: 3,
						level: 1,
					}, {
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
				that.search_fob(select_list, that, 126, {
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
</style>

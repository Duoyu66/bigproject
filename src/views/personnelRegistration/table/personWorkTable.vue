<template>
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row height="calc(80%)"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange">
			<el-table-column show-overflow-tooltip label="工作单位" prop="company" min-width="110px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="job_content" label="工作内容" min-width="110px"></el-table-column>
			<el-table-column show-overflow-tooltip label="职位" prop="duty">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="职称" prop="professional_title">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="开始日期" prop="start_date" align="center" width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="end_date" label="结束日期" align="center" width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="证明人" prop="witness_person" width="80px"></el-table-column>
			<el-table-column show-overflow-tooltip label="证明人电话" prop="witness_mobile" align="center" width="120px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="approve" label="审核状态" align="center" width="90px">
				<template slot-scope="scope">
					<span style="margin-left: 10px" v-if="scope.row.approve ==='0'">未审核</span>
					<span style="margin-left: 10px" v-else-if="scope.row.approve ==='1'">已通过 {{scope.row.reason}}</span>
					<span style="margin-left: 10px"
						v-else-if="scope.row.approve ==='-1'">退回[{{scope.row.reason}}]</span>
					<span style="margin-left: 10px" v-else-if="scope.row.approve ==='-2'">重审中</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="approver" label="审核人" align="center" width="90px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="approve_date" label="审核时间" align="center" width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="170px" align="center" fixed="right">
				<template #default="{ row }">
					<el-button class="normal" @click="examineWork(row)" v-show="ishasPermission('examine',row)">
						审核
					</el-button>
					<el-button class="normal" @click="EditPersonelWork(row)" v-show="ishasPermission('edit',row)">
						修改
					</el-button>
					<el-button class="danger" @click="handleDeletemodify(row)" v-show="ishasPermission('delete',row)">
						删除
					</el-button>
				</template>
			</el-table-column>


		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<personnelWork ref="personnelWork" :isUpData.sync="main_dialog"></personnelWork>
		<workExamine ref="workExamine" :isUpData.sync="main_dialog"></workExamine>
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
	import personnelWork from '../components/personnelWork'
	import workExamine from '../components/workExamine'
	export default {
		name: 'educationalExperienceTable',
		components: {
			personnelWork,
			workExamine
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
		watch: {
			primary_key(newVal, oldVal) {
				this.fetchData({
					reload: 1
				})
			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),
		},
		data() {
			return {
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
			async init(){
				this.role_max = await this.$store.dispatch('user/getRoleMax')
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
						permission_name = 'work_add'
						break
					case 'edit':
						permission_name = 'work_edit'
						break
					case 'delete':
						permission_name = 'work_delete'
						break
					case 'examine':
						permission_name = 'work_examine'
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
			examineWork(row) {
				this.$refs['workExamine'].showEdit(row)
			},
			EditPersonelWork(row) {
				this.$refs['personnelWork'].showEdit(row)
			},
			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 81, {
					//"selectRows": "selectRows", //复选框选中数据
					"fetchData": "fetchData", //加载数据
					"main_key": "exp_id" //主键
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
				}
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
				that.search_fob(select_list, that, 80, {
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

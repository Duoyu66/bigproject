<template>
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row height="calc(80%)"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange">
			<el-table-column show-overflow-tooltip label="姓名" prop="name" v-if="hideColFob('name')">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="学校" prop="school" min-width="200px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="education" label="学历" align="center" width="100px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="专业" prop="major" min-width="200px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="开始日期" prop="start_date" align="center" width="100px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="end_date" label="结束日期" align="center" width="100px">
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
			<el-table-column show-overflow-tooltip prop="approve_date" label="审核时间" align="center" width="140px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="170px" align="center" fixed="right">
				<template #default="{ row }">
					<el-button class="normal" @click="examineEducation(row)" v-show="ishasPermission('examine',row)">
						审核
					</el-button>
					<el-button class="normal" @click="EditPersonelEducation(row)" v-show="ishasPermission('edit',row)">
						修改
					</el-button>
					<el-button class="danger" @click="handleDeletemodify1(row)" v-show="ishasPermission('delete',row)">
						删除
					</el-button>
				</template>
			</el-table-column>


		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<personnelEducation ref="personnelEducation" :isUpData.sync="main_dialog"></personnelEducation>
		<educationExamine ref="educationExamine" :isUpData.sync="main_dialog"></educationExamine>
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
	import personnelEducation from '../components/personnelEducation'
	import educationExamine from '../components/educationExamine'
	export default {
		name: 'educationalExperienceTable',
		components: {
			personnelEducation,
			educationExamine
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
				columnHideList: ['name'],
				role_max: '',

			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
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
						permission_name = 'education_add'
						break
					case 'edit':
						permission_name = 'education_edit'
						break
					case 'delete':
						permission_name = 'education_delete'
						break
					case 'examine':
						permission_name = 'education_examine'
						break
					default:
						permission_name = name
						break
				}
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				flag = PermissionSubtableDeal(flag, name, row, this.person_id, role_max)
				return flag
			},
			getHideColist() {

			},
			setSelectRows() {

			},
			tableSortChange() {

			},
			EditPersonelEducation(row) {
				this.$refs['personnelEducation'].showEdit(row)
			},
			examineEducation(row) {
				this.$refs['educationExamine'].showEdit(row)
			},
			handleDeletemodify1(row) {
				let that = this
				that.delete_from_fob(that, row, 77, {
					//"selectRows": "selectRows", //复选框选中数据
					"fetchData": "fetchData", //加载数据
					"main_key": "edu_id", //主键
					"file": {
						cert_image: 14,
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
				that.search_fob(select_list, that, 75, {
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

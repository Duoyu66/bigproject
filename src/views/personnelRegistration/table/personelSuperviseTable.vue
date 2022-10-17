<template>
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange">
			<el-table-column show-overflow-tooltip prop="approve" label="状态" align="center" width="100px">
				<template slot-scope="scope">
					<span v-if="scope.row.reward_status === '0'" style="margin-left: 10px">
						<el-tag type="danger">待整改</el-tag>
					</span>
					<span v-else-if="scope.row.reward_status === '1'" style="margin-left: 10px">
						<el-tag type="warning">待重新整改</el-tag>
					</span>
					<span v-else-if="scope.row.reward_status === '10'" style="margin-left: 10px">
						<el-tag color="#ff007f">待验证</el-tag>
					</span>
					<span v-else-if="scope.row.reward_status === '11'" style="margin-left: 10px">
						<el-tag color="#ff03d1">待重新验证</el-tag>
					</span>
					<span v-else-if="scope.row.reward_status === '20'" style="margin-left: 10px">
						<el-tag type="success">整改完成</el-tag>
					</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="supervisee_name" label="被督察人" align="center" width="80px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="supervision_date" label="监督时间" align="center" width="170px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="supervision_content" label="监督内容" min-width="200px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="supervision_results" label="监督结果" align="center"
				min-width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="supervision_isPass" label="监督是否通过" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="supervision_name" label="监督人" align="center" width="80px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="corrective_action" label="纠正措施" min-width="120px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="verification" label="验证情况" min-width="120px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="verifier_name" label="验证人" align="center" width="80px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="verification_isPass" label="验证是否通过" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start" :hide-on-click="true">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown" class="more" style="min-width: 115px">
							<el-button @click="SuperviseView(row)">
								查看监督记录
							</el-button>
							<el-button v-show="ishasPermission('supervise', row)&&row.reward_status=='0'"
								@click="SuperviseChecking(row)">
								修改监督记录
							</el-button>
							<el-button
								v-show="ishasPermission('correction', row)&&(row.reward_status=='0' ||row.reward_status=='1')"
								@click="EditSuperviseSupervisee(row)">
								添加改正记录
							</el-button>
							<el-button
								v-show="ishasPermission('correction', row)&&(row.reward_status=='10'||row.reward_status=='11')"
								@click="EditSuperviseSupervisee(row)">
								修改改正记录
							</el-button>
							<el-button
								v-show="ishasPermission('check', row) && (row.reward_status=='10'|| row.reward_status=='11')"
								@click="EditVerification(row)">
								添加验证记录
							</el-button>
							<el-button v-show="ishasPermission('check', row) && row.reward_status=='1'"
								@click="EditVerification(row)">
								修改验证记录
							</el-button>

							<el-button v-show="ishasPermission('delete', row)" @click="handleDeletemodify(row)">
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
		<SuperviseCheckingDialog ref="SuperviseCheckingDialog" :is-up-data.sync="main_dialog"></SuperviseCheckingDialog>
		<SuperviseSuperviseeDialog ref="SuperviseSuperviseeDialog" :is-up-data.sync="main_dialog">
		</SuperviseSuperviseeDialog>
		<SuperviseVerificationDialog ref="SuperviseVerificationDialog" :is-up-data.sync="main_dialog">
		</SuperviseVerificationDialog>
		<SuperviseViewDialog ref="SuperviseViewDialog">
		</SuperviseViewDialog>


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
	import SuperviseCheckingDialog from '../components/SuperviseCheckingDialog'
	import SuperviseSuperviseeDialog from '../components/SuperviseSuperviseeDialog'
	import SuperviseVerificationDialog from '../components/SuperviseVerificationDialog'
	import SuperviseViewDialog from '../components/SuperviseViewDialog'

	export default {
		name: 'EducationalExperienceTable',
		components: {
			SuperviseViewDialog,
			SuperviseVerificationDialog,
			SuperviseSuperviseeDialog,
			SuperviseCheckingDialog,
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
			async init() {
				switch (this.type) {
					case 0:
						this.height = 'calc(80%)';
						break;
					case 1:
						this.height = 'calc(100%)';
						break;
				}
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
					case 'supervise':
						permission_name = 'person_supervise_add'
						if (row.supervisee == this.person_id) {
							return false
						}
						break
					case 'check':
						if (row.supervisee == this.person_id) {
							return false
						}
						permission_name = 'person_supervise_check'
						break
					case 'delete':
						permission_name = 'person_supervise_delete'
						break
					case 'correction':
						if (row.supervisee == this.person_id) {
							return true
						} else {
							return false
						}
						break
					default:
						permission_name = name
						break
				}
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max

				return flag
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},
			Examine(row) {

			},
			SuperviseChecking(row) {
				this.$refs['SuperviseCheckingDialog'].showEdit(row)
			},
			EditSuperviseSupervisee(row) {
				this.$refs['SuperviseSuperviseeDialog'].showEdit(row)
			},
			EditVerification(row) {
				this.$refs['SuperviseVerificationDialog'].showEdit(row)
			},
			SuperviseView(row) {
				this.$refs['SuperviseViewDialog'].showEdit(row)
			},
			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 306, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'reward_id', //主键
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
						that.fetchData1()
						break
					case 1:
						that.fetchDataMain()
						break
				}
			},
			//从表加载数据
			async fetchDataMain() {
				let that = this
				let select_list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'supervisee_name',
						type: 2,
						level: 2,
					}, {
						field: 'supervision_name',
						type: 2,
						level: 3,
					}, {
						field: 'verifier_name',
						type: 2,
						level: 4,
					}, {
						field: 'supervision_date',
						type: 5,
						level: 5,
						split: '~',
					}, {
						field: 'verification_date',
						type: 5,
						level: 6,
						split: '~',
					}, {
						field: 'supervisee_date',
						type: 5,
						level: 7,
						split: '~',
					}, {
						field: 'reward_status',
						type: 3,
						level: 8,
					},
					{
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
				that.queryForm.person_id = that.primary_key
				that.search_fob(select_list, that, 302, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
			//从表加载数据
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
				that.search_fob(select_list, that, 307, {
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

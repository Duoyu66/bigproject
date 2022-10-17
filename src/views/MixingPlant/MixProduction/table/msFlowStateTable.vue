<template>
	<!-- 机构类型定义 -->
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick" class="roleRTabHigh">
			<el-table-column v-if="hideColFob('task_no')" show-overflow-tooltip label="任务单号" prop="task_no" width="120px"
				align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="工作流号" prop="flow_id" width="80px"></el-table-column>
			<el-table-column v-if="hideColFob('action_id')" show-overflow-tooltip label="步骤号" prop="action_id"
				width="80px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('flow_name')" show-overflow-tooltip label="流程内容" prop="flow_name"
				min-width="130px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('action_name')" show-overflow-tooltip label="步骤内容" prop="action_name"
				min-width="130px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('action_time')" show-overflow-tooltip label="时间" prop="action_time"
				width="140px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('state')" show-overflow-tooltip label="状态" prop="state" align="center" width="90px">
				<template #default="{ row }">
					<el-tag v-if="row.state=='1'" type="success">操作成功
					</el-tag>
					<el-tag v-else-if="row.state=='2'" type="danger">操作失败
					</el-tag>
					<el-tag v-else-if="row.state=='3'" color="info">发车成功
					</el-tag>
					<el-tag v-else-if="row.state=='-1'" type="warning">未完成
					</el-tag>
					</el-tag>
					<el-tag v-else-if="row.state">{{row.state}}
					</el-tag>
					<el-tag v-else>未知状态
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column v-if="hideColFob('alert_message')" show-overflow-tooltip label="失败原因及后续处理"
				prop="alert_message" min-width="130px" align="center">
				<template #default="{ row }">
					<span>{{row.alert_message}}</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="90px" fixed="right"  align="center">
				<template #default="{ row }">
					<span v-if="row.state=='1'||row.turn_url==''" type="primary" class="normal">
					</span>
					<el-button v-else-if="row.turn_url=='/Tasks/Stockbin'" type="primary" class="normal"
						@click="Action(row)">
					</el-button>
					<!-- 添加方量 -->
					<el-button v-else-if="row.turn_url.indexOf('AddVolum') > 0" type="primary" class="normal"
						@click="Action(row)">操作
					</el-button>
					<!-- 分配方量 -->
					<el-button v-else-if="row.turn_url.indexOf('AssignVolum?type=1') > 0" type="primary" class="normal"
						@click="Action(row)">操作
					</el-button>
					<el-button v-else type="primary" class="normal" @click="Action(row)">操作
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<!-- <productCarDialog ref="productCarDialog" :is-up-data.sync="main_dialog"></productCarDialog> -->

	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'

	//import productCarDialog from '../dialog/productCarDialog'

	export default {
		name: 'msFlowStateTable',
		components: {
			//productCarDialog,
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
			isOnlyShowQualified: {
				type: Boolean,
				default: false,
			},
			isOnlyShowError: {
				type: Boolean,
				default: false,
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				mixDeviceId: 'org/mixDeviceId',
				currentTab: 'org/currentTab',
				projectPrimaryId: 'projectInfo/primaryId',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
				person_id: 'user/person_id',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				switch (this.type) {
					case 2:
						this.fetchData({
							reload: 1,
						})
						break
				}

			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			projectPrimaryId(newVal, oldVal) {
				this.fetchData()
			},
			current_and_chrilren_org(newVal, oldVal) {
				this.fetchData()
			},
			tablelist(newVal, oldVal) {

			},
			selectedRow(newVal, oldVal) {
				let primaryKey = -1
				if (newVal && newVal.car_id) {
					primaryKey = newVal.car_id
				} else {
					primaryKey = -1
				}
				switch (this.type) {
					case 1:
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
						this.height = 'calc(80%)'
						this.columnHideList = ['user_name']
						this.layout = 'total, sizes, prev, pager, next, jumper'
						break
					case 1:
						this.height = 'calc(86.7%)'
						this.layout = 'total, sizes, prev, pager, next, jumper';
						//this.fetchData()
						break
					case 2:
						this.height = 'calc(94%)'
						this.columnHideList = ['role_id', 'desc', 'enable', 'builtIn']
						this.layout = 'total, prev, next,jumper';
						if (this.primary_key > 0) {
							this.fetchData();
						}
						break
				}
			},
			Action(row) {
				let url = row.turn_url;
				let action_id = row.action_id;
				action_id = parseInt(action_id);

				if (action_id == 2) {
					//分配方量
				} else if (action_id == 14 && turn_url.indexOf('/Tasks/PrintList') >= 0) {
					//打印发车单
				} else if (action_id == 14 && turn_url.indexOf('/Tasks/Print') >= 0) {
					//打印发车单
				} else if (action_id == 6) {
					//查看料仓二维码
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
						permission_name = 'roleDefinitionAdd'
						break
					case 'edit':
						permission_name = 'roleDefinitionEdit'
						break
					case 'delete':
						permission_name = 'roleDefinitionDelete'
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
				this.$refs['productCarDialog'].showEdit()
			},
			getHideColist() {},
			setSelectRows(row) {
				console.log('setSelectRows', row)
				//this.selectRows = row
			},
			rowClick(row) {
				this.selectedRow = row
				this.$emit('fatherMethod', row);
				if (this.radioRow) {
					this.radioRow(row)
				}
			},
			tableSortChange() {},

			EditInfo(row) {
				this.$refs['productCarDialog'].showEdit(row)
			},
			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 320, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'role_id', //主键

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

						break
					case 2:
						that.fetchData1()
						break;
					case 1:
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
						field: 'strength',
						type: 2,
						level: 5,
					}, {
						field: 'mileage',
						type: 2,
						level: 6,
					}, {
						field: 'truck_id',
						type: 2,
						level: 7,
					}, {
						field: 'pour_place',
						type: 2,
						level: 8,
					}, {
						field: 'device_id',
						type: 3,
						level: 9,
					}, {
						field: 'deviation',
						type: 3,
						level: 10,
					}, {
						field: 'warning_type',
						type: 3,
						level: 11,
					}, {
						field: 'mixtime_type',
						type: 3,
						level: 12,
					}, {
						field: 'collectime_type',
						type: 3,
						level: 13,
					}, {
						field: 'showErrorData',
						type: 3,
						level: 14,
					}, {
						field: 'showNormalData',
						type: 3,
						level: 15,
					},
					{
						field: 'start_start_time',
						type: 3,
						level: 16,
					},
					{
						field: 'end_start_time',
						type: 3,
						level: 17,
					},
					{
						field: 'start_end_time',
						type: 3,
						level: 18,
					},
					{
						field: 'end_end_time',
						type: 3,
						level: 19,
					},
					{
						field: 'mixDeviceId',
						type: 3,
						level: 20,
					},
					{
						field: 'project_id',
						type: 3,
						level: 21,
					},
				]
				that.queryFormTemp = JSON.parse(JSON.stringify(that.queryForm))
				//that.queryFormTemp.org_id = that.current_org_id
				console.log('this.currentTab', this.currentTab)
				let org_id, project_id, mixDeviceId;
				switch (this.currentTab) {
					case 'org':
						org_id = this.current_and_chrilren_org;
						mixDeviceId = this.mixDeviceId;
						break;
					case 'project':
						project_id = this.projectPrimaryId;
						break;
				}
				this.queryFormTemp.org_id = org_id;
				this.queryFormTemp.mixDeviceId = mixDeviceId;
				this.queryFormTemp.project_id = project_id;
				if (this.isOnlyShowQualified) {
					that.queryFormTemp.showNormalData = 1;
				} else {
					that.queryFormTemp.showNormalData = undefined;
				}
				if (this.isOnlyShowError) {
					that.queryFormTemp.showErrorData = 1;
				} else {
					that.queryFormTemp.showErrorData = undefined;
				}
				await this.search_fob(select_list, that, 973, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryFormTemp', //查询数据表单，请将分页条件也放置在其中
				})
				console.log(this.tablelist)
			},

			//子表从表加载数据
			async fetchData1() {
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
						field: 'task_id',
						type: 3,
						level: 3,
					},
				]
				this.queryForm.task_id = this.primary_key
				this.search_fob(select_list, this, 1051, {
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

<template>
	<!-- 机构类型定义 -->
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick" class="roleRTabHigh">

			<el-table-column v-if="hideColFob('registration_number')" show-overflow-tooltip label="车牌号"
				prop="registration_number" width="120px" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="内部编号" prop="org_in_number" align="center"></el-table-column>
			<el-table-column v-if="hideColFob('status')" show-overflow-tooltip label="状态" prop="status" width="80px"
				align="center">
				<template #default="{ row }">
					<el-tag v-if="row.status=='100'" type="success">使用
					</el-tag>
					<el-tag v-else-if="row.status=='91'" type="info">返程中
					</el-tag>
					<el-tag v-else-if="row.status=='90'" color="#3a9513">空闲
					</el-tag>
					<el-tag v-else-if="row.status=='20'" type="danger">维修
					</el-tag>
					<el-tag v-else-if="row.status=='10'" color="warning">停用
					</el-tag>
					<el-tag v-else-if="row.status=='0'" color="#ead548">报废
					</el-tag>
					<el-tag v-else>{{row.status}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="司机" prop="driver"></el-table-column>
			<el-table-column show-overflow-tooltip label="司机电话" prop="phone"></el-table-column>
			<el-table-column show-overflow-tooltip label="型号" prop="model"></el-table-column>
			<el-table-column show-overflow-tooltip label="规格" prop="spec"></el-table-column>
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
		<TruckDialog ref="TruckDialog" :is-up-data.sync="main_dialog"></TruckDialog>

	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'

	import TruckDialog from '../dialog/TruckDialog'

	export default {
		name: 'TruckTable',
		components: {
			TruckDialog,
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
			current_org_id(newVal, oldVal) {
				//this.fetchData()
			},
			current_and_chrilren_org(newVal, oldVal) {
				this.fetchData()
			},
			tablelist(newVal, oldVal) {

			},
			selectedRow(newVal, oldVal) {
				let primaryKey = -1
				if (newVal && newVal.type_id) {
					primaryKey = newVal.type_id
				} else {
					primaryKey = -1
				}
				switch (this.type) {
					case 2:
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
						permission_name = 'TruckMangeAdd'
						break
					case 'edit':
						permission_name = 'TruckMangeDelete'
						break
					case 'delete':
						permission_name = 'TruckMangeEdit'
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
				this.$refs['TruckDialog'].showEdit()
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
				this.$refs['TruckDialog'].showEdit(row)
			},
			handleDeletemodify(row) {
				let that = this
				that.delete_from_fob(that, row, 1014, {
					//"selectRows": "selectRows", //复选框选中数据
					fetchData: 'fetchData', //加载数据
					main_key: 'truck_id', //主键

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
					case 2:
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
						field: 'gps_device_id',
						type: 3,
						level: 4,
					},
					{
						field: 'driver',
						type: 2,
						level: 5,
					}, {
						field: 'registration_number',
						type: 2,
						level: 6,
					}, {
						field: 'phone',
						type: 2,
						level: 7,
					}, {
						field: 'model',
						type: 2,
						level: 8,
					}, {
						field: 'spec',
						type: 2,
						level: 9,
					}, {
						field: 'status',
						type: 3,
						level: 10,
					},
				]
				that.queryFormTemp = JSON.parse(JSON.stringify(that.queryForm))
				that.queryFormTemp.org_id = that.current_and_chrilren_org
				//that.queryFormTemp.org_id =  that.current_org_id;
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
				that.search_fob(select_list, that, 954, {
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

<template>
	<!-- 机构类型定义 -->
	<div>
		<el-table ref="personel" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick" class="roleRTabHigh">
			<el-table-column v-if="hideColFob('material_name')" show-overflow-tooltip label="物料名称" prop="material_name"
				width="80px" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip label="物料规格" prop="material_spec" width="80px"></el-table-column>
		<!-- 	<el-table-column v-if="hideColFob('task_id')" show-overflow-tooltip label="任务号" prop="task_id"
				min-width="80px" align="center">
			</el-table-column> -->

			<el-table-column v-if="hideColFob('material_type')" show-overflow-tooltip label="物料类型" prop="material_type"
				width="80px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('theory_dosage')" show-overflow-tooltip label="理论用量" prop="theory_dosage"
				align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('actual_dosage')" show-overflow-tooltip label="实际用量" prop="actual_dosage"
				align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('deviation')" show-overflow-tooltip label="超差" prop="deviation"
				width="80px" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.theory_dosage&&row.actual_dosage&&parseFloat(row.theory_dosage)>0" type="info">
						{{((parseFloat(row.actual_dosage)-parseFloat(row.theory_dosage))/parseFloat(row.theory_dosage)*100).toFixed(2)}}%
					</el-tag>
					<el-tag v-else-if="row.theory_dosage&&row.actual_dosage&&parseFloat(row.theory_dosage)==0"
						type="info">0
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="120px" fixed="right" v-if="false">
				<template #default="{ row }">
					<el-button type="primary" class="normal" @click="EditInfo(row)">详情
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<productMateriaCarDialog ref="productMateriaCarDialog" :is-up-data.sync="main_dialog"></productMateriaCarDialog>

	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'

	import productMateriaCarDialog from '../dialog/productMateriaCarDialog'

	export default {
		name: 'ProductMaterialCarTable',
		components: {
			productMateriaCarDialog,
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
					case 1:
					case 10:
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
					case 10:
						this.height = 'calc(61%)';
						this.columnHideList = ['user_name']
						this.layout = 'total, sizes, prev, pager, next, jumper'
						if (this.primary_key > 0) {
							this.fetchData();
						}
						break
					case 1:

						this.height = 'calc(90%)'
						this.layout = 'total, sizes, prev, pager, next, jumper';
						if (this.primary_key > 0) {
							this.fetchData();
						}
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
				this.$refs['productMateriaCarDialog'].showEdit()
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
				this.$refs['productMateriaCarDialog'].showEdit(row)
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
						that.fetchData1()
						break
					case 2:
					case 1:
						that.fetchDataMain()
						break
					case 10:
						that.fetchDataReel()
						break;
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
						field: 'car_id',
						type: 3,
						level: 3,
					}
				]
				that.queryFormTemp = JSON.parse(JSON.stringify(that.queryForm))
				that.queryForm.car_id = that.primary_key
				that.search_fob(select_list, that, 975, {
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
						field: 'car_id',
						type: 3,
						level: 3,
					}
				]
				that.queryForm.car_id = that.primary_key
				that.search_fob(select_list, that, 975, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
			//子表从表加载数据 每盘
			async fetchDataReel() {
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
						field: 'product_id',
						type: 3,
						level: 3,
					}
				]
				that.queryForm.product_id = that.primary_key
				that.search_fob(select_list, that, 1007, {
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

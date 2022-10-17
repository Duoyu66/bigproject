<template>
	<div class="draftPageHigh">
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column v-if="hideColFob('org_name')" show-overflow-tooltip label="拌合站名称" prop="org_name"
				width="150px" align="center"></el-table-column>
			<el-table-column v-if="hideColFob('device_name')" show-overflow-tooltip label="拌合机" prop="device_name">
			</el-table-column>
			<el-table-column v-if="hideColFob('task_id')" show-overflow-tooltip label="任务号" prop="task_id" width="100px"
				align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="盘号" prop="reel_id" width="80px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="搅拌时间" prop="duration" min-width="80px"></el-table-column>
			<el-table-column show-overflow-tooltip label="方量" prop="production" width="70px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="出料时间" prop="output_time" width="150px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="配合比id" prop="mix_ratio_id" width="120px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作者" prop="operator" width="120px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="强度等级" prop="strength" width="100px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="项目名称" prop="project_name" width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="里程" prop="mileage" width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip label="施工部位" prop="pour_place" min-width="150px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="保存时间" prop="save_time" width="150px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="采集时间" prop="sample_time" width="150px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="车辆" prop="truck_id" width="100px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="总盘数" prop="total_reel" width="80px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('deviation')" show-overflow-tooltip label="超标等级" prop="deviation"
				width="80px" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.deviation=='0'" type="success">未超标
					</el-tag>
					<el-tag v-else-if="row.deviation=='1'" type="info">低超标
					</el-tag>
					<el-tag v-else-if="row.deviation=='2'" color="warning">中超标
					</el-tag>
					<el-tag v-else-if="row.deviation=='3'" type="danger">高超标
					</el-tag>
					</el-tag>
					<el-tag v-else>{{row.deviation}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column v-if="hideColFob('warning_type')" show-overflow-tooltip label="材料超差报警" prop="warning_type"
				width="80px" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.warning_type&&parseInt(row.warning_type)>0" type="danger">√
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column v-if="hideColFob('mixtime_type')" show-overflow-tooltip label="拌和时间报警" prop="mixtime_type"
				width="80px" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.mixtime_type&&parseInt(row.mixtime_type)>0" type="danger">√
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column v-if="hideColFob('collectime_type')" show-overflow-tooltip label="采集时间报警"
				prop="collectime_type" width="80px" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.collectime_type&&parseInt(row.collectime_type)>0" type="danger">√
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="handleCommand('view', scope.$index, scope.row)">详情
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
	</div>
</template>

<script>
	import {
		treePaging
	} from '@/global/form.helper'
	import {
		QueryExec
	} from '@/api/table'
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'
	import productReelDialog from '../dialog/productReelDialog'
	export default {
		name: 'productReelTable',
		components: {
			productReelDialog,
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
			group_id: {
				type: Number,
				default: 0
			},
			tablename: {
				type: String,
				default: ''
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
		provide() {
			return {
				reload: this.fetchData,
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
					case 0:
					case 2:
					case 3:
					case 10:
						this.fetchData({
							reload: 1,
						})
						break;
				}

			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			projectPrimaryId(newVal, oldVal){
				this.fetchData()
			},
			current_and_chrilren_org(newVal, oldVal) {
				this.fetchData()
			},
			rowClickData(newVal) {
				if (newVal && newVal.product_id) {
					switch (this.type) {
						case 1:
							this.$emit('update:primary_key', Number(newVal.product_id));
							break;
					}
				}
			},
		},
		data() {
			return {
				height: 'calc(70%)',
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				elementLoadingText: '加载数据中',
				queryForm: {
					group_id: 0,
					pageSize: 10,
					pageNo: 1,
				},
				tabledata: [],
				layout: 'total, sizes, prev, next, jumper',
				total: 0,
				columnHideList: [],
				rowClickData: {}
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
						this.height = 'calc(85%)'
						break
						//每盘主表
					case 1:
						this.height = 'calc(86.7%)';
						//this.fetchData();
						break
					case 3:
						this.height = 'calc(85%)'
						break
					case 10:
						this.height = 'calc(90%)'
						if (this.primary_key > 0) {
							this.fetchData();
						}
						break;
				}
			},
			setSelectRows(row) {
				console.log('setSelectRows', row)
				//this.selectRows = row
			},
			tableSortChange() {},
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
			rowClick(row, col, event) {
				this.rowClickData = row
			},
			clearChildren() {
				this.rowClickData = {
					product_id: -1,
				}
			},
			fencthRelod(row) {
				if (!row) {
					row = JSON.parse(JSON.stringify(this.rowClickData))
				}
				this.clearChildren()
				let that = this
				setTimeout(() => {
					that.rowClickData = row
				}, 500)
				this.fetchData({
					pageNo: this.queryForm.pageNo
				})
			},
			handleCommand(command, row) {
				switch (command) {
					case 'edit':
						this.EditInfo(row)
						break
					case 'addChildren':
						this.handleAddChild(row)
						break
					case 'delete':
						this.handleDeletemodify(row)
						break
				}
			},
			ishasPermission(name, row) {
				if (!name) {
					if (this.dropdown.count[row.item_id]) {
						this.dropdown.count[row.item_id]++
					} else {
						this.dropdown.count[row.item_id] = 1
					}
					return true
				}
				let permissionRegister = {
					main_table: {
						edit: 'sysDataGroupEdit',
						delete: 'sysDataGroupDelete',
						addChildren: 'sysDataGroupAdd',
					}
				}
				let permission_name = ''
				switch (name) {
					default:
						if (permissionRegister[this.type] && permissionRegister[this.type][name]) {
							permission_name = permissionRegister[this.type][name]
						} else {
							permission_name = name
						}
						break
				}
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (name == 'empty') {
					if (!this.dropdown.count[row.item_id]) {
						flag = true;
					}
				}
				if (role_max == 'super_admin') {}
				let dropdowMenu = {
					main_table: ['all'],
				}
				if (dropdowMenu[this.type]) {
					let menu_list = dropdowMenu[this.type];
					if (menu_list.indexOf('all') >= 0) {} else if (menu_list.indexOf(name) < 0) {
						flag = false
					}
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'addChildren':
						if (row.nDeep > 0) {
							flag = false
						}
						break
					default:
						flag = flag
						break;
				}
				if (flag) {
					switch (name) {
						case 'empty':
							break
						default:
							if (this.dropdown.count[row.item_id]) {
								this.dropdown.count[row.item_id]++
							} else {
								this.dropdown.count[row.item_id] = 1
							}
							break
					}
				}
				return flag
			},
			EditInfo(row) {
				this.handleAdd(row, undefined, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['sysDataGroupDialog'].showEdit(row, parent_info, disable)
			},
			handleDeletemodify(row) {
				let that = this
				let tips = '确定删除' + product_id
				tips = tips + '?'
				that.delete_from_fobEx(that, row, 661, {
					'fetchData': 'fetchData', //加载数据 
					'main_key': 'item_id', //主键 
					'confirmMsg': tips,
					'successMsg': '删除成功',
				})
			},
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
				this.queryForm = Object.assign(data, this.queryForm);
				this.fetchData()
			},
			fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (this.type) {
					case 1:
						this.fetchDataMain(pageInfo, treeNode, resolve);
						break
					case 10:
						this.fetchDataByCar(pageInfo, treeNode, resolve);
						break;
				}
			},
			async fetchDataMain(pageInfo, treeNode, resolve) {
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
						field: 'start_output_time',
						type: 3,
						level: 16,
					}, {
						field: 'end_output_time',
						type: 3,
						level: 17,
					}, {
						field: 'project_id',
						type: 3,
						level: 18,
					}, {
						field: 'device_id',
						type: 3,
						level: 19,
					},
				]
				this.queryFormTemp = JSON.parse(JSON.stringify(this.queryForm))
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
					this.queryFormTemp.showNormalData = 1;
				} else {
					this.queryFormTemp.showNormalData = undefined;
				}
				if (this.isOnlyShowError) {
					this.queryFormTemp.showErrorData = 1;
				} else {
					this.queryFormTemp.showErrorData = undefined;
				}
				await this.search_fob(select_list, this, 1006, {
					loading: 'listLoading', //加载画面 
					data: 'tablelist', //数据存放位置 
					total: 'total', //数据数量，根据该数量分页 
					queryForm: 'queryFormTemp', //查询数据表单，请将分页条件也放置在其中 
				})
				this.clearChildren()
			},
			async fetchDataByCar() {
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
						field: 'car_id',
						type: 3,
						level: 4,
					}
				]
				that.queryForm.car_id = that.primary_key
				await that.search_fob(select_list, that, 974, {
					loading: 'listLoading', //加载画面 
					data: 'tablelist', //数据存放位置 
					total: 'total', //数据数量，根据该数量分页 
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中 
				})
				this.clearChildren()
			}
		},
	}
</script>

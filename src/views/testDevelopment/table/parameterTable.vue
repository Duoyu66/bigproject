<template>
  <!-- 参数化学品消耗定义左侧表格相关class ="parameterLtableHigh"-->
	<div>
		<el-table ref="tableSort" v-if="emptyJudge" v-loading="listLoading" :data="tableData" border
			:element-loading-text="elementLoadingText" :height="height" @sort-change="tableSortChange"
			row-key="param_id" highlight-current-row :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			lazy :load="fetchData" :header-cell-style="{ background: '#e8f0ff' }" :header-cell-class-name="cellClass"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" @row-click="rowClick"
			@select-all="selectAll" class="parameterLtableHigh">
			<el-table-column v-if="hideColFob('selection')" type="selection" label="常用" width="100" fixed="left">
			</el-table-column>
			<el-table-column v-if="hideColFob('param_id')" show-overflow-tooltip label="参数标识" prop="param_id"
				width="100px" align="center">
			</el-table-column>

			<el-table-column v-if="hideColFob('param')" show-overflow-tooltip prop="param" label="参数名称" align="left"
				min-width="200px">
			</el-table-column>
			<el-table-column v-if="hideColFob('class_name')" show-overflow-tooltip label="参数分类" prop="class_name"
				width="150px" align="left">
			</el-table-column>
<!-- 			<el-table-column v-if="hideColFob('param_version')" show-overflow-tooltip label="参数版本" prop="param_version"
				width="100px" align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('age')" show-overflow-tooltip prop="age" label="龄期" width="100px"
				align="center">
			</el-table-column>
			<el-table-column v-if="hideColFob('enabled')" show-overflow-tooltip label="是否启用" prop="enabled"
				width="100px" align="center">
				<template slot-scope="scope">
					<span style="margin-left: 10px" v-if="scope.row.enabled =='0'">禁用</span>
					<span style="margin-left: 10px" v-else-if="scope.row.enabled =='1'">启用</span>
				</template>
			</el-table-column>
			<el-table-column v-if="hideColFob('enable_time')" show-overflow-tooltip label="启用时间" prop="enable_time"
				width="150px" align="center">
			</el-table-column> -->
			<el-table-column v-if="hideColFob('tpl_name')" show-overflow-tooltip prop="tpl_name" label="行业"
				align="center" min-width="200px">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="60px" align="center" fixed="right"
				v-if="hideColFob('operation')">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown" class="more">
							<el-button @click="handleDeleteMap(row)" v-if="ishasPermission('deletemap')">取消参数映射
							</el-button>
							<el-button @click="handleDeleteCommonMap(row)" v-if="ishasPermission('deleteCommonmap')">
								取消常用参数映射
							</el-button>
							<el-button @click="handleEdit(row)" v-if="ishasPermission('editparam')">修改参数</el-button>
							<el-button @click="handleDelete(row)"
								v-if="!row.hasChildren&&ishasPermission('deleteParam')">
								删除参数
							</el-button>
							<el-button @click="handleChildren(row)" v-if="ishasPermission('addChildrenParam')">添加子参数
							</el-button>
							<el-button @click="equipmentAdd(row)" v-if="ishasPermission('equipmentUsage')">设备使用定义
							</el-button>
							<el-button @click="chemicalAdd(row)" v-if="ishasPermission('chemicalUsage')">化学品消耗定义
							</el-button>
							<el-button @click="substanceAdd(row)" v-if="ishasPermission('materialUsage')">标准物质消耗定义
							</el-button>
							<el-button @click="parameterAdd(row)" v-if="ishasPermission('standardUsage')">添加参数试验标准
							</el-button>
							<el-button @click="paramTemplateAdd(row)" v-if="ishasPermission('paramTemplateAdd')">
								添加参数模板映射
							</el-button>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination ref="pagination" v-if="tableData.length>0&&!load.pagination.isDestory" :background="background"
			:current-page="onrenewalForm.pageNo" :layout="layout" :page-size="onrenewalForm.pageSize" :total="total"
			@current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
		<el-empty v-else :description="emptyConfigDescript"></el-empty>
		<parameterManagement ref="parameterManagement"></parameterManagement>

		<paramStandardDialog ref="paramStandardDialog" @reloadChildren="reloadChildren"></paramStandardDialog>
		<paramDeviceDialog ref="paramDeviceDialog" @reloadChildren="reloadChildren"></paramDeviceDialog>
		<paramChemicalDialog ref="paramChemicalDialog" @reloadChildren="reloadChildren"></paramChemicalDialog>
		<paramRmDialog ref="paramRmDialog" @reloadChildren="reloadChildren"></paramRmDialog>
		<paramTemplateMappingDialig ref="paramTemplateMappingDialig" @reloadChildren="reloadChildren">
		</paramTemplateMappingDialig>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'
	import parameterManagement from '../components/parameterManagement'

	import paramStandardDialog from '../component/paramStandardDialog'
	import paramDeviceDialog from '../component/paramDeviceDialog'
	import paramChemicalDialog from '../component/paramChemicalDialog'
	import paramRmDialog from '../component/paramRmDialog'
	import paramTemplateMappingDialig from '../component/paramTemplateMappingDialig'
	import {
		TreeDataDealExGetData,
		TreeDataDealEx,
		TreeDataSecondary
	} from '@/global/tree_deal'
	import {
		pageDeal
	} from '@/global/form.helper'

	export default {
		name: 'parameterTable',
		components: {
			parameterManagement,
			paramStandardDialog,
			paramDeviceDialog,
			paramChemicalDialog,
			paramRmDialog,
			paramTemplateMappingDialig
		},
		provide() {
			return {
				paramReload: this.fetchData,
				reload: this.fetchData,
			}
		},
		props: {
			type: {
				type: Number,
				default: 0,
			},
			//选中行主键
			primary_key: {
				type: Number,
				default: -1,
			},
			//选中行事件
			singleClick: {
				type: Object,
				default: function() {
					return {}
				}
			},
			//选中行数据
			radioRow: {
				type: Function,
				default: undefined
			},
			//查询表单
			selectForm: {
				type: Object,
				default: function() {
					return {}
				}
			},
			//权限
			permission: {
				type: Object,
				default: function() {
					return {}
				}
			},
			tableHeight: {
				type: String,
				default: ''
			},
			//传入该值后将优先使用该机构id
			select_org_id: {
				type: String,
				default: ''
			}
		},
		computed: {
			emptyJudge() {
				let flag = false
				if (this.tableData.length > 0) {
					flag = true
				}
				switch (this.type) {
					case 10:
					case 11:
						flag = true
						break
				}
				return flag
			},
			emptyConfigDescript() {
				switch (this.type) {
					case 10:
					case 20:
					case 21:
						if (this.primary_key <= 0) {
							this.emptyConfig.description = '请先选择左侧项目';
						} else if (this.listLoading) {
							this.emptyConfig.description = '数据加载中请耐心等候，如时间较长请刷新重试';
						} else if (this.tableData.length == 0) {
							this.emptyConfig.description = '无数据请刷新重试';
						}
						break
					case 0:
					default:
						if (this.listLoading) {
							this.emptyConfig.description = '数据加载中，如果长时间未显示数据请刷新重试';
						} else {
							this.emptyConfig.description = '无数据请刷新重试';
						}
						break
				}
				return this.emptyConfig.description
			},
			...mapGetters({
				org_id: 'user/org_id',
				org_pid: 'user/org_pid',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id'
			}),
		},
		/* 监听table数据对象 */
		watch: {

			tableData(val) {
				this.doLayout();
			},
			selectForm(newVal, oldVal) {
				if (newVal) {
					this.onrenewalForm = Object.assign(this.onrenewalForm, newVal)
				}
			},
			onrenewalForm(newVal, oldVal) {
				if (newVal) {
					//this.$emit('update:pageForm', Object.assign(this.pageForm, newVal));
				}
			},
			//监听主表弹窗属性变化
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			children_dialog(newVal, oldVal) {
				if (this.radioRow && this.radioRow.param_id) {
					let that = this
					that.$emit('update:primary_key', -1);
					setTimeout(function() {
						that.$emit('update:primary_key', Number(that.selectedRow.param_id));
					}, 600)

				}

			},
			selectedRow(newVal, oldVal) {
				if (newVal && newVal.param_id) {
					switch (this.type) {
						case 0:
						case 30:
							this.$emit('update:primary_key', Number(newVal.param_id))
							break
					}

				}

			},
			primary_key(newVal, oldVal) {
				if (newVal) {
					switch (this.type) {
						case 10:
						case 20:
						case 11:
            case 21:
							this.fetchData()
							break;
					}
				}
			},
			screenWidth(newVal, oldVal) {
				// 为了避免频繁触发resize函数导致页面卡顿，使用定时器
				if (!this.timer) {
					// 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
					let that = this
					that.timer = true
					setTimeout(function() {
						// 打印screenWidth变化的值
						that.scrollAbout()
						that.timer = false
					}, 500)
				}
			},
			select_org_id(newVal, oldVal) {
				console.log('select_org_id', newVal)
				if (newVal) {
					switch (this.type) {
						case 10:
						case 20:
						case 11:

							this.fetchData()
							break;
						default:
							if (this.type != 0) {
								this.fetchData()
							}
							break
					}
				}
			},
		},
		data() {
			return {
				selectedRow: {},
				checkedSelection: [],
				screenWidth: document.body.clientWidth,
				height: 'calc(80%)',
				tableData: [],
				tableDataCurrent: [],
				selectionRows: [],
				listLoading: false,
				elementLoadingText: '正在加载。。',
				background: true,
				layout: '',
				total: 0,
				main_dialog: false,
				children_dialog: false,
				onrenewalForm: {
					pageNo: 1,
					pageSize: 10
				},
				columnHideList: [],
				emptyConfig: {
					description: '无数据,请刷新重试'
				},
				getDataRelation: {
					sqlcodePading: 250,
					sqlcodeNoPading: 251,
					select_list: [{
							field: 'parent_id',
							type: 3,
							level: 1,
						},
						{
							field: 'title',
							type: 2,
							level: 2,
						},
					]
				},
				getDataRelationConfig: {
					main: {
						sqlcodePading: 721,
						sqlcodeNoPading: 722,
						select_list: [{
								field: 'parent_id',
								type: 3,
								level: 1,
							},
							{
								field: 'param',
								type: 2,
								level: 2,
							}, {
								field: 'enabled',
								type: 3,
								level: 3,
							}, {
								field: 'enable_time_start',
								type: 3,
								level: 4,
							}, {
								field: 'enable_time_end',
								type: 3,
								level: 5,
							}, {
								field: 'class_name',
								type: 2,
								level: 6,
							}
						]
					},
					objectSelect: {
						sqlcodePading: 505,
						sqlcodeNoPading: 506,
						select_list: [{
							field: 'object_id',
							type: 3,
							level: 1,
						}]
					},
					objectRelation: {
						role_id: -1,
						sqlcodePading: 408,
						sqlcodeNoPading: 409,
						select_list: [{
								field: 'object_id',
								type: 3,
								level: 1,
							}, {
								field: 'parent_id',
								type: 3,
								level: 2,
							},
							{
								field: 'param',
								type: 2,
								level: 3,
							}, {
								field: 'enabled',
								type: 3,
								level: 4,
							}, {
								field: 'enable_time_start',
								type: 3,
								level: 5,
							}, {
								field: 'enable_time_end',
								type: 3,
								level: 6,
							}, {
								field: 'class_name',
								type: 3,
								level: 7,
							}, {
								field: 'hasNum',
								type: 3,
								level: 8,
							}
						]
					},
					orgCommonSelected: {
						sqlcodePading: 510,
						sqlcodeNoPading: 418,
						select_list: [{
							field: 'object_id',
							type: 3,
							level: 1,
						}, {
							field: 'org_id',
							type: 3,
							level: 2,
						}]
					},
					orgCommon: {
						sqlcodePading: 417,
						sqlcodeNoPading: 418,
						select_list: [{
								field: 'object_id',
								type: 3,
								level: 1,
							}, {
								field: 'org_id',
								type: 3,
								level: 2,
							}, {
								field: 'parent_id',
								type: 3,
								level: 3,
							},
							{
								field: 'param',
								type: 2,
								level: 4,
							}, {
								field: 'enabled',
								type: 3,
								level: 5,
							}, {
								field: 'enable_time_start',
								type: 3,
								level: 6,
							}, {
								field: 'enable_time_end',
								type: 3,
								level: 7,
							}, {
								field: 'hasNum',
								type: 3,
								level: 8,
							}
						]
					},


				},
				load: {
					status: {
						allComplete: false
					},
					pagination: {
						isDestory: false
					}
				},
			}
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {
			const that = this
			window.onresize = () => {
				return (() => {
					window.screenWidth = document.body.clientWidth
					that.screenWidth = window.screenWidth
				})()
			}
		},
		methods: {
			selectAll(selection) {
				if (selection.length == 0 && this.selectionRows.length > 0) {

					this.checkedSelection = this.selectionRows;
				} else {
					//this.checkedSelection = [];
				}
				this.selectionRows = selection;

				let list = [{
						field: 'object_id',
						type: 3,
						level: 1,
					}, {
						field: 'param_id',
						type: 3,
						level: 2,
					},
					{
						field: 'opertion_type',
						type: 3,
						level: 3,
					},
				]
				this.saveChecked(681, list);
			},
      cellClass(row){
        if (row.columnIndex === 0) {
          return 'addAllChecked'
        }
      },
			async saveChecked(sqlcode, list, data) {
				let opertion_type = 1;
				let selectList = []
				if (this.selectionRows.length > 0) {
					opertion_type = 0;
					selectList = this.selectionRows;
				} else {
					opertion_type = 1;
					selectList = this.checkedSelection;
				}
				let that = this;
				let param_id_list = [];
				let deep = 0;

				for (let i = 0; i < selectList.length; i++) {
					let item = selectList[i]
					if (item.nDeep && deep < Number(item.nDeep)) {
						deep = Number(item.nDeep)
					}
					param_id_list.push(item.param_id)
				}
				let param_id = param_id_list.join(',');
				let form = {
					object_id: this.primary_key,
					opertion_type: opertion_type,
					deep: deep,
					param_id: param_id,
					pageNo: this.onrenewalForm.pageNo,
					pageSize: this.onrenewalForm.pageSize,
					org_id: await this.getOrgId(),
				}
				if (data) {
					form = Object.assign(form, data)
				}
				form = pageDeal(form)
				let info = await this.objectRelationChange(sqlcode, list, form)
				this.SelectionChangeNotify(info[0], info[1]);
			},
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
			},
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
				let height = ''
				switch (this.type) {
					case 0: //参数主表
						this.columnHideList = ['selection'];
						this.height = 'calc(90%)'
						this.layout = 'total, sizes, prev, pager, next, jumper'
						this.fetchData()
						break
					case 30: //参数化学品消耗
						this.columnHideList = ['selection', 'class_name', 'param_version', 'age', 'enabled',
							'enable_time', 'tpl_name', 'operation'
						];
						// this.height = 'calc(93.7%)'
            //标准物质消耗定义表格高度优化 原来的93.7%注释 王玲慧 2022-01-14
            this.height = 'calc(89.7%)'
						this.layout = 'total, prev, next, jumper'
						this.fetchData()
						break

					case 11: //试验 常用试验参数
					case 10: //试验 参数子表
						this.columnHideList = ['selection'];
						this.height = 'calc(73%)'
						this.layout = 'total, sizes, prev, pager, next, jumper'
						if (this.primary_key && this.primary_key > 0) {
							this.fetchData()
						}
						break

					case 20: //参数映射
					case 21: //常用参数映射
						this.height = 'calc(83%)'
						this.columnHideList = ['operation'];
						this.layout = 'total, sizes, prev,pager, next, jumper'
						break
				}
				if (this.tableHeight) {
					this.height = this.tableHeight
				}
				this.scrollAbout()
			},
			reloadChildren(row) {
				if (!row) {
					row = JSON.parse(JSON.stringify(this.selectedRow))
				}
				this.selectedRow = {
					param_id: -1
				}
				let that = this
				setTimeout(() => {
					that.selectedRow = row
				}, 500)
			},
			scrollAbout() {
				try {
					switch (this.type) {
						case 11: //试验 常用试验参数
						case 10: //试验 参数子表
						case 20: //参数映射
						case 21: //常用参数映射
							this.$nextTick(() => {
								let scrollWidth = this.$el.scrollWidth;
								let offsetWidth = this.$el.offsetWidth;
								if (offsetWidth >= scrollWidth) {
									this.$set(this, 'layout', 'total, sizes, prev,pager, next, jumper')
									this.reloadAssembly('pagination', 'isDestory');
									return;
								}
								this.$set(this, 'layout', 'total, sizes, prev, next, jumper')
								this.reloadAssembly('pagination', 'isDestory');
							})
							break
					}


				} catch (e) {
					console.log(e)
				}
			},
			reloadAssembly(assemblyName, key) {
				try {
					this.$nextTick(() => {
						this.$set(this.load[assemblyName], 'key', !this.load[assemblyName][key])

						this.$nextTick(() => {
							this.$set(this.load[assemblyName], 'key', !this.load[assemblyName][key])
						})
					})
				} catch (e) {
					console.log(e)
				}
			},


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
			ishasPermission(name) {
				try {
					let commponentType = this.type
					let status = true
					let permission_name = ''
					switch (name) {
						case 'deletemap':
							permission_name = 'testObejctParamManage'
							break
						case 'deleteCommonmap':
							permission_name = 'routineTestparameters'
							break
						default:
							permission_name = name
							break
					}
					//console.log(this.permission, permission_name);
					let flag = hasPermission(this.permission, permission_name)
					let role_max = this.role_max
					if (!flag) {
						//return flag
					}
					switch (name) {
						//试验参数

						case 'deletemap':
							switch (commponentType) {
								case 20:
								case 21:
								case 0:
								case 11:
									status = false;
									break
								case 10:
									status = true;
									break
							}
							break
						case 'deleteCommonmap':
							switch (commponentType) {
								case 20:
								case 21:
								case 0:
								case 10:
									status = false;
									break
								case 11:
									status = true;
									break
							}
							break
						case 'paramTemplateAdd':
						case 'editparam':
						case 'deleteParam':
						case 'addChildrenParam':
							switch (commponentType) {
								case 20:
								case 21:
								case 0:
									status = true;
									break
								case 11:
								case 10:
									status = false;
									break
							}
							break
						case 'equipmentUsage':
						case 'chemicalUsage':
						case 'materialUsage':
						case 'standardUsage':
							switch (commponentType) {
								case 0:
									status = true;
									break
								case 20:
								case 21:
								case 11:
								case 10:
									status = false;
									break
							}
							break
					}
					return status
				} catch (e) {
					console.log(e)
				}
			},
			search(data) {
				if (data) {
					this.onrenewalForm = Object.assign(data, this.onrenewalForm)
				}

				this.onrenewalForm.pageNo = 1
				this.fetchData()
			},
			tableSortChange() {

			},
			setSelectRows(row) {

			},
			radioRow_update(row) {
				this.$emit('update:radioRow', row)
				if (row) {
					this.primary_key_update(row.param_id)
				}
			},
			primary_key_update(key) {
				this.$emit('update:primary_key', Number(key));
			},
			doLayout() {

			},
			handleCurrentChange(val) {
				this.onrenewalForm.pageNo = val
				this.fetchData()
			},
			handleSizeChange(val) {
				this.onrenewalForm.pageSize = val
				this.fetchData()
			},
			handleEdit(row) {
				this.Main_add(row)
			},
			handleChildren(row) {
				this.Main_add(undefined, {
					parent_id: row.param_id,
					double_parent_id: Object.assign({}, row).parent_id
				})
			},
			Main_add(row, info) {
				this.$refs['parameterManagement'].showEdit(row, info)
			},
			handleDelete(row) {
				let that = this
				that.delete_from_fob(that, row, 252, {
					///fetchData: 'fetchData', //加载数据
					main_key: 'id', //主键
				}, function() {
					that.fetchData({
						param_id: row.parent_id,
						type: '重载'
					})
				})
			},
			paramTemplateAdd(row) {
				let info = {
					param_id: row.param_id,
					param: row.param
				}
				this.$refs['paramTemplateMappingDialig'].showEdit(undefined, info)
			},
			equipmentAdd(row) {
				let info = {
					param_id: row.param_id,
					param: row.param
				}
				this.$refs['paramDeviceDialog'].showEdit(undefined, info)
			},
			chemicalAdd(row) {
				let info = {
					param_id: row.param_id,
					param: row.param
				}
				this.$refs['paramChemicalDialog'].showEdit(undefined, info)
			},
			substanceAdd(row) {
				let info = {
					param_id: row.param_id,
					param: row.param
				}

				this.$refs['paramRmDialog'].showEdit(undefined, info)
			},
			parameterAdd(row) {
				let info = {
					param_id: row.param_id,
					param: row.param
				}
				this.$refs['paramStandardDialog'].showEdit(undefined, info)
			},
			toggleSelection(rows) {
				if (!rows) {
					return;
				}
				let that = this
				rows.forEach(row => {
					that.$nextTick(() => {
						if (that.$refs.tableSort) {
							that.$refs.tableSort.toggleRowSelection(row)
						} else {
							let index = setInterval(() => {
								if (that.$refs.tableSort) {
									clearInterval(index)
									that.$refs.tableSort.toggleRowSelection(row)
								}
							})
						}

					})
				});
			},
			objectRelationSelect() {
				let data = this.tableDataCurrent
				let length = data.length
				let selectList = []
				for (let i = 0; i < length; i++) {
					try {
						let item = data[i]
						if (!item.hasNum) {
							continue
						}
						let hasNum = Number(item.hasNum)
						if (hasNum <= 0) {
							continue
						}
						selectList.push(item)
					} catch (e) {
						console.log(e)
					}

				}
				this.selectionRows = selectList;

				this.toggleSelection(selectList);
			},
			async fetchData(row, treeNode, resolve) {
				switch (this.type) {
					case 20: //勾选试验参数
						this.updateDataRelation('objectRelation')
						this.onrenewalForm.object_id = this.primary_key
						await this.fetchData_part1(row, treeNode, resolve)
						this.objectRelationSelect()
						break
					case 21: //勾选机构常用
						this.updateDataRelation('orgCommon')
						this.onrenewalForm.object_id = this.primary_key
						this.onrenewalForm.org_id = await this.getOrgId()
						await this.fetchData_part1(row, treeNode, resolve)
						this.objectRelationSelect()
						break
					case 10: //显示试验参数
						this.updateDataRelation('objectSelect')
						this.onrenewalForm.object_id = this.primary_key
						await this.fetchData_part1(row, treeNode, resolve)
						break
					case 11: //显示常用参数
						this.updateDataRelation('orgCommonSelected')
						this.onrenewalForm.object_id = this.primary_key
						this.onrenewalForm.org_id = await this.getOrgId()
						await this.fetchData_part1(row, treeNode, resolve)
						break
					case 0:
						this.updateDataRelation('main')
						await this.fetchData_part1(row, treeNode, resolve)
						break
					default:
						this.updateDataRelation('main')
						await this.fetchData_part1(row, treeNode, resolve)
						break
				}
				// setInterval(() => {
				// 	console.log(new Date(), this.current_org_id, this.$store.getters[
				// 		'org/current_org'], mapGetters.toString())
				// })
				this.scrollAbout()
				this.load.status.allComplete = true
			},
			updateDataRelation(key) {
				if (!this.getDataRelationConfig[key]) {
					return -1
				}
				let config = this.getDataRelationConfig[key]
				for (let key in config) {
					if (!config[key]) {
						continue
					}
					let type = typeof config[key]
					switch (type.toLowerCase()) {
						case 'object':
							this.getDataRelation[key] = JSON.parse(JSON.stringify(config[key]))
							break
						default:
							this.getDataRelation[key] = config[key]
							break
					}

				}
			},
			async fetchData_part1(row, treeNode, resolve) {
				//console.log(row, treeNode, resolve)
				this.listLoading = true
				try {
					let form = Object.assign({}, this.selectForm)
					let sqlcode = 0;
					if (row) {
						form.parent_id = row.param_id
					} else {
						form.parent_id = 0
					}
					if (resolve && (!this.resolve || !this.resolve[form.parent_id])) {
						if (!this.resolve) {
							this.resolve = {}
						}
						this.resolve[form.parent_id] = resolve
					}
					//person_info
					if (resolve) {} else if (this.resolve && this.resolve[form.parent_id]) {} else if (row && row
						.info &&
						row.info.double_parent_id) {
						form.parent_id = row.info.double_parent_id

					}
					let select_list = JSON.parse(JSON.stringify(this.getDataRelation.select_list))
					//
					form = Object.assign(form, this.onrenewalForm)
					//form = Object.assign(form, this.selectForm)
					//根节点带分页，非根节点不带分页
					if (!form.parent_id || form.parent_id == 0 || form.parent_id == '0') {
						form.parent_id = 0;
						sqlcode = this.getDataRelation.sqlcodePading
						select_list.push({
							field: 'pageNo',
							type: 3,
							level: select_list.length,
						})
						select_list.push({
							field: 'pageSize',
							type: 3,
							level: select_list.length + 1,
						})
						form = this.pageDeal(form)
					} else {
						sqlcode = this.getDataRelation.sqlcodeNoPading
					}
          console.log(sqlcode)
					if (row) {
						const {
							data
						} = await this.QueryExec_fob(sqlcode, select_list, form, )
						for (let i = 0; i < data.length; i++) {
							if (Number(data[i].hasChildren) > 0) {
								data[i].hasChildren = true
							} else {
								data[i].hasChildren = false
							}
						}

						this.$set(this, 'tableDataCurrent', data)
						if (resolve) {
							//console.log('resolve')
							resolve(data)
						} else if (this.resolve && this.resolve[form.parent_id]) {
							//console.log('this.resolve')
							this.$set(this.$refs.tableSort.store.states.lazyTreeNodeMap, form.parent_id, []);
							this.resolve[form.parent_id](data)
						} else if (form.parent_id == 0) {
							this.$set(this, 'tableData', data)
							this.resolve = {}
							this.SetCount(data);
							//this.tableDataTemp = JSON.parse(JSON.stringify(data))
							//console.log('this.list')

						}

					} else {
						const data = await TreeDataDealExGetData(
							sqlcode,
							select_list,
							form,
							0,
							'param_id',
							'parent_id',
							'hasChildren'
						)
						this.resolve = {}
						//this.tableData = data
						this.$set(this, 'tableData', data)
						this.$set(this, 'tableDataCurrent', data)
						this.SetCount(data);
					}
				} catch (e) {
					console.log(e)
				}
				this.listLoading = false
			},
			SetCount(data) {
				if (!data) {
					return
				}
				if (data.length == 0) {
					return
				}
				if (!data[0].hasOwnProperty('Total')) {
					return
				}
				this.total = Number(data[0]['Total'])
			},
			async ManualSaveSelection(data) {
				console.log(this)
				console.log(this.$refs['tableSort'])
				console.log(this.$refs['pagination'])
				let that = this

				async function exec() {
					let deep = 0;
					let length = that.selectionRows.length
					let param_id_list = []
					for (let i = 0; i < length; i++) {
						let item = that.selectionRows[i]
						if (item.nDeep && deep < Number(item.nDeep)) {
							deep = Number(item.nDeep)
						}
						param_id_list.push(item.param_id)
					}
					let param_id = param_id_list.join(',')
					let sqlcode = 411
					let list = [{
							field: 'object_id',
							type: 3,
							level: 1,
						}, {
							field: 'param_id',
							type: 3,
							level: 2,
						},
						{
							field: 'deep',
							type: 3,
							level: 3,
						},
						{
							field: 'param',
							type: 2,
							level: 4,
						},
						{
							field: 'enabled',
							type: 3,
							level: 5,
						},
						{
							field: 'enable_time_strart',
							type: 3,
							level: 6,
						},
						{
							field: 'enable_time_end',
							type: 3,
							level: 7,
						},
						{
							field: 'pageNo',
							type: 3,
							level: 7,
						},
						{
							field: 'pageSize',
							type: 3,
							level: 7,
						}
					]
					switch (that.type) {
						case 20:

							// sqlcode = 411
							list = [{
									field: 'object_id',
									type: 3,
									level: 1,
								}, {
									field: 'param_id',
									type: 3,
									level: 2,
								},
								{
									field: 'opertion_type',
									type: 3,
									level: 3,
								},
							]
							that.saveChecked(681, list);
							return
							// break
						case 21:
							sqlcode = 420
							list = [{
									field: 'org_id',
									type: 3,
									level: 1,
								}, {
									field: 'object_id',
									type: 3,
									level: 2,
								}, {
									field: 'param_id',
									type: 3,
									level: 3,
								},
								{
									field: 'deep',
									type: 3,
									level: 4,
								},
								{
									field: 'param',
									type: 2,
									level: 5,
								},
								{
									field: 'enabled',
									type: 3,
									level: 6,
								},
								{
									field: 'enable_time_strart',
									type: 3,
									level: 7,
								},
								{
									field: 'enable_time_end',
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
								}
							]
							break
					}
					let form = {
						object_id: that.primary_key,
						deep: deep,
						param_id: param_id,
						pageNo: that.onrenewalForm.pageNo,
						pageSize: that.onrenewalForm.pageSize,
						org_id: await that.getOrgId(),
					}
					form = Object.assign(form, data)
					form = pageDeal(form)
					let info = await that.objectRelationChange(sqlcode, list, form)
					that.SelectionChangeNotify(info[0], info[1]);
				}
				exec()

			},
			async getOrgId() {
				let org_id = ''

				if (this.select_org_id) {
					return this.select_org_id
				}
				if (!this.role_max) {
					this.role_max = await this.$store.dispatch('user/getRoleMax')
				}
				switch (this.role_max) {
					case 'super_admin':
						org_id = this.$store.getters['org/current_org']
						break;
					default:
						org_id = this.$store.getters['user/org_pid']
						break
				}
				return org_id;
			},
			async getObjectName(object_id) {
				if (!object_id) {
					object_id = this.primary_key
				}
				let object_name = await this.$store.dispatch('testObject/GetOjectNameById', object_id)
				return object_name;
			},
			async getOrgName(org_id) {
				if (!org_id) {
					org_id = this.getOrgId()
				}
				let orgName = await this.$store.dispatch('org/GetOrgNameByOrgId', org_id)
				return orgName;
			},
			async handleDeleteMap(row) {
				let object_name = await this.getObjectName()
				let msg = '确定从' + object_name + '试验参数映射中删除' + row.param + '吗？'
				this.$baseConfirm(msg, null, async () => {
					this.load.status.allComplete = true
					await this.handleSelectionChange([], row)
					this.load.status.allComplete = false
					this.fetchData()
				})
			},
			async handleDeleteCommonMap(row) {
				let object_name = await this.getObjectName()
				let org_name = await this.getOrgName()
				let msg = '确定给' + org_name + '从' + object_name + '的常用参数映射中删除' + row.param + '吗？'
				this.$baseConfirm(msg, null, async () => {
					this.load.status.allComplete = true
					await this.handleSelectionChange([], row)
					this.load.status.allComplete = false
					this.fetchData()
				})
			},
			async handleSelectionChange(val, row) {
				if (val.length == 0 && this.selectionRows.length > 0) {
					this.checkedSelection = this.selectionRows;
				} else {
					//this.checkedSelection = [];
				}
				if (val) {
					this.selectionRows = val
				} else {
					val = []
				}
				if (row && this.load.status.allComplete) {
					let selected = val.length && val.indexOf(row) !== -1
					// true就是选中，0或者false是取消选中
					let flag = false
					if (selected == true) {
						flag = true
					} else if (selected == false || selected == 0) {
						flag = false
					} else {
						flag = false
					}
					let opertion_type = 0;
					if (flag) {
						opertion_type = 0
					} else {
						opertion_type = 1
					}
					await this.SelectionChangeDataBase(row, opertion_type)
				}
			},
			async SelectionChangeDataBase(row, opertion_type) {
				//opertion_type 0 选中【添加】 1 取消选中【删除】
				let sqlcode = 410

				let list = [{
						field: 'opertion_type',
						type: 3,
						level: 1,
					}, {
						field: 'object_id',
						type: 3,
						level: 2,
					},
					{
						field: 'param_id',
						type: 3,
						level: 3,
					}
				]
				switch (this.type) {
					case 10: //子表显示勾选的试验参数
					case 20: //勾选试验参数
						sqlcode = 410
						list = [{
								field: 'opertion_type',
								type: 3,
								level: 1,
							}, {
								field: 'object_id',
								type: 3,
								level: 2,
							},
							{
								field: 'param_id',
								type: 3,
								level: 3,
							}
						]
						break
					case 11: //子表显示机构勾选的常用试验参数
					case 21: //勾选机构常用
						sqlcode = 419
						list = [{
								field: 'opertion_type',
								type: 3,
								level: 1,
							}, {
								field: 'org_id',
								type: 3,
								level: 2,
							}, {
								field: 'object_id',
								type: 3,
								level: 3,
							},
							{
								field: 'param_id',
								type: 3,
								level: 4,
							}
						]
						break
				}
				let form = {
					object_id: this.primary_key,
					opertion_type: opertion_type,
					org_id: await this.getOrgId(),
					param_id: row.param_id
				}
				let info = await this.objectRelationChange(sqlcode, list, form)
				this.SelectionChangeNotify(info[0], info[1]);
			},
			async objectRelationChange(sqlcode, list, form) {
				let msg = '更新';
				const {
					code,
					influence,
					data
				} = await this.QueryExec_fob(sqlcode, list, form)
				console.log(sqlcode,code, influence, data);
				if (code != 200) {
					falg = false
				}
				if (!data || data.length == 0) {
					return [false, msg + '失败']
				}
				let json = JSON.parse(data[0].info)

				if (json.code > 0) {
					switch (json.code) {
						case 1:
							return [true, json.msg]
							break
						case 2:
							msg = json.msg
							break
						default:
							msg = json.msg
							break
					}
					return [false, msg]
				} else {
					msg = json.msg
					return [false, msg]
				}
			},
			SelectionChangeNotify(isSuccess, msg) {
				if (!msg) {
					if (isSuccess) {
						msg = '更新成功'
					} else {
						msg = '更新失败,请刷新重试'
					}
				}

				if (isSuccess) {
					this.$notify({
						title: '成功',
						message: msg,
						type: 'success'
					});
				} else {
					this.$notify.error({
						title: '错误',
						message: msg
					});
				}
			},
		},
	}
</script>

<style>
  .el-table .addAllChecked .cell .el-checkbox__inner{
      /* display: none !important;  */
      margin-left: -90px;
  }
  .el-table .addAllChecked .cell::before{
      content: '全选';
      text-align: center;
      margin-left: 20px;
  }
</style>

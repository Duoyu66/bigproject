<template>
	<div >
		<el-table ref="Entrustdata" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column show-overflow-tooltip prop="accepted" label="委托状态" width="100px" align="center"
				fixed="left">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.accepted=='1'">已受理
					</el-tag>
					<el-tag type="warning" v-else-if="scope.row.accepted=='0'">待受理
					</el-tag>
					<el-tag type="danger" v-else-if="scope.row.accepted=='-1'">退回
					</el-tag>
          <el-tag type="info" v-else-if="scope.row.accepted=='-2'">未委托
          </el-tag>
					<el-tag v-else>未知状态{{ scope.row.accepted }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column v-if="hideColFob('accepted')" show-overflow-tooltip prop="accepted" label="试验状态"
				width="100px" align="center" fixed="left">
				<template slot-scope="scope">
					<el-tag type="danger" v-if="scope.row.stage=='0'">待收样
					</el-tag>
					<el-tag type="warning" v-else-if="scope.row.stage=='1'">待试验
					</el-tag>
					<el-tag type="warning" v-else-if="scope.row.stage=='2'">待复核
					</el-tag>
					<el-tag type="warning" v-else-if="scope.row.stage=='3'">待批准
					</el-tag>
					<el-tag type="warning" v-else-if="scope.row.stage=='4'">批准中
					</el-tag>
					<el-tag type="success" v-else-if="scope.row.stage=='5'">试验完毕
					</el-tag>
          <el-tag type="danger" v-else-if="scope.row.stage=='-2'">复核失败
          </el-tag>
					<el-tag v-else>未知状态{{ scope.row.stage }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column v-if="hideColFob('conclusion')" show-overflow-tooltip prop="conclusion" label="判断结果"
				width="100px" align="center" fixed="left">
				<template slot-scope="scope">
					<el-tag type="warning" v-if="scope.row.conclusion=='0'">尚未评定
					</el-tag>
					<el-tag type="success" v-else-if="scope.row.conclusion=='1'">合格
					</el-tag>
					<el-tag type="danger" v-else-if="scope.row.conclusion=='2'">不合格
					</el-tag>
					<el-tag type="danger" v-else-if="scope.row.conclusion=='3'">待复检
					</el-tag>
					<el-tag v-else>未知状态{{ scope.row.conclusion }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="order_id" label="委托编号" min-width="150px" align="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="order_date" label="委托日期" width="120px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="object_name" label="试验名称" min-width="120px" align="left">
<!-- 				<template slot-scope="scope">
					<el-tag
						v-show="ObjectName.hasOwnProperty(scope.row.object_id)&&ObjectName[scope.row.object_id].hasOwnProperty('object_name')">
						{{GetObjectNameForTable(scope.row.object_id)}}
					</el-tag>
				</template> -->
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="test_class" label="试验类别" width="80px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="test_category" label="初检/复检" width="90px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="company" label="委托单位" min-width="200px" align="left">

			</el-table-column>
			<!-- 			<el-table-column show-overflow-tooltip prop="org_id" label="委托单位" width="100px" align="center">
				<template slot-scope="scope">
					{{GetOrgNameCall(scope.row.org_id)}}
					{{tableTemplateShow[scope.row.org_id]}}
				</template>
			</el-table-column> -->
			<el-table-column show-overflow-tooltip prop="order_person" label="委托人" width="100px" align="left">
			</el-table-column>
			<!-- spec -->
			<el-table-column show-overflow-tooltip prop="sample_spec" label="样品规格" width="100px" align="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="sample_size" label="样品尺寸" width="100px" align="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="batch_id" label="批次号" width="100px" align="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="quantity" label="代表数量" width="100px" align="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="strength" label="强度等级" width="100px" align="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="age" label="龄期" width="100px" align="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="back_reason" label="退回理由" width="100px" align="left">
			</el-table-column>
<!-- 			<el-table-column show-overflow-tooltip prop="entrust_id" label="委托标识号" width="100px" align="center">
			</el-table-column> -->
			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item icon="el-icon-s-order"
								@click.native="handleCommand('view', scope.$index, scope.row)">
								详情
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('edit', scope.$index, scope.row)"
								v-show="ishasPermission('edit',scope.row)">
								编辑
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-folder-checked"
								@click.native="handleCommand('accept', scope.$index, scope.row)"
								v-show="ishasPermission('accept',scope.row)">
								受理
							</el-dropdown-item>
              <el-dropdown-item icon="el-icon-folder-checked"
              	@click.native="handleCommand('achieve', scope.$index, scope.row)"
              	v-show="ishasPermission('achieve',scope.row)">
              	收样
              </el-dropdown-item>
							<el-dropdown-item icon="el-icon-delete" divided
								@click.native="handleCommand('delete', scope.$index, scope.row)"
								v-show="ishasPermission('delete',scope.row)">
								删除
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<preview ref="preview"></preview>
		<flatpickrDialog ref='flatpickrDialog'></flatpickrDialog>
		<luckysheetDilaog ref='luckysheetDilaog'></luckysheetDilaog>
    <sampleAchieve ref='sampleAchieve'></sampleAchieve>
		<!-- <entrustAdd ref="entrustAdd"></entrustAdd> -->
	</div>
</template>

<script>
	//import entrustAdd from '../components/entrustAdd.vue'
	import {
		Notify,
		dealRespond,
	} from '@/utils/respondDeal'
	import {
		treePaging
	} from '@/global/form.helper'
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'
	import {
		setCurrentRowSelectTopOne,
		toggleSelectionList,
		toggleSelection,
		setCurrentRowSelectTopFirstPageFirst
	} from '@/utils/tableHelper'

	import flatpickrDialog from '../components/flatpickrDialog'
	import luckysheetDilaog from '../luckysheet/dilaog'
	// import {
	// 	FileDownLoad,
	// 	fileDetail
	// } from '../js/file.js'
	import entrustAdd from '../components/entrustAdd'
  import sampleAchieve from '../components/sampleAchieve'
	import preview from '@/components/fileAbout/preview'
	export default {
		name: 'entrustTable',
		components: {
			luckysheetDilaog,
			flatpickrDialog,
			preview,
			entrustAdd,
      sampleAchieve
			// paramRmDialog
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
			object_id: {
				type: String,
				default: '',
			},
			permission: {
				type: Object,
				default: function() {
					return {}
				},
			},
			accepted: {
				type: String,
				default: ''
			},
			stage: {
				type: String,
				default: ''
			},
		},
		provide() {
			return {
				enTrustReload: this.fetchData,
			}
		},
		computed: {
			...mapGetters({
				org_pid: 'user/org_pid',
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
				person_id: 'user/person_id',
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				if (this.type == 0) {
					this.fetchData({
						reload: 1,
					})
				}

			},
			object_id(newVal, oldVal) {
				this.fetchData({
					reload: 1,
				})
			},
			tableReload(newVal, oldVal) {
				this.fetchData({

				})
			},
			main_dialog(newVal, oldVal) {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					seal_id: -1
				}
				this.fetchData()
				setTimeout(function() {
					console.log('main_dialog setTimeout selectedRow', selectedRow)
					this.selectedRow = selectedRow
				}, 500)

			},
			current_org_id() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {
				console.log('selectedRow', newVal)
				if (newVal && newVal.entrust_id) {
					switch (this.type) {
						case 1:
							this.$emit('update:primary_key', Number(newVal.entrust_id));
							break
					}

				}

			},
		},
		data() {
			return {
				pdf_file_type: 12,
				tableReload: false,
				tableTemplateShow: {

				},
				ObjectName: {

				},
				height: 'calc(80%)',
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				selectedRow: {},
				elementLoadingText: '加载数据中',
				queryForm: {
					table_type: 0,

					pageSize: 10,
					pageNo: 1,
				},
				demotableexpand: {
					mainTable: [{
						field: 'doc_id',
						label: '收文编号',
						isShow: true,
					}, ]
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
				this.role_max = await this.$store.dispatch('user/getRoleMax')

				switch (this.type) {
					case 0:
						this.height = 'calc(80%)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 1:
						this.height = 'calc(90%)'
						break
				}
				if (!(!this.accepted || this.accepted > 0)) {
					this.columnHideList.push('conclusion')
					this.columnHideList.push('accepted')
				}
				await this.GetObjectName()
			},
			GetOrgNameCall(org_id) {
				let that = this
				that.GetOrgName(org_id).then(orgName => {
					that.$set(that.tableTemplateShow, org_id, orgName)
				})
				return ''
			},
			GetObjectNameForTable(object_id) {
				if (!this.ObjectName) {
					return ''
				}
				if (!this.ObjectName[object_id]) {
					return ''
				}
				if (!this.ObjectName[object_id].object_name) {
					return ''
				}
				return this.ObjectName[object_id].object_name
			},
			async GetObjectName() {
				if (JSON.stringify(this.ObjectName) != '{}') {
					return -1
				}
				let data = await this.$store.dispatch('testObject/GetJsonKeyObejctIdAll')
				this.$set(this, 'ObjectName', data)
				return 1;
			},
			async GetOrgName(org_id) {
				//let  orgName = await this.$store.dispatch('org/GetOrgNameByOrgIdSync', org_id)
				let orgName = await this.$store.dispatch('org/GetOrgNameByOrgId', org_id)

				return orgName
			},

			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
			},
			deleteMap(row) {
				let tips = '是否从该参数[' + row.param + ']';
				if (row.std_id) {
					tips = tips + '的[' + row.standard_id + ' ' + row.doc_name + ']标准'
				}
				tips = tips + '中删除该标准物质[' + row.name + '';
				if (row.model && row.model != '/') {
					tips = tips + '  规格:' + row.model + '';
				}
				if (row.unit && row.unit != '/') {
					tips = tips + '  单位:' + row.unit + '';
				}
				tips = tips + ']';
				this.$baseConfirm(tips, null, async () => {
					//opertion_type 0 选中【添加】 1 取消选中【删除】
					let sqlcode = 446

					let list = [{
							field: "opertion_type",
							level: 1
						},
						{
							field: "param_id",
							level: 2
						}, {
							field: "chemical_id",
							level: 3
						},
						{
							field: "std_id",
							level: 4
						},
						{
							field: "tpl_id",
							level: 5
						}, {
							field: "quantity",
							level: 6
						},
						{
							field: "map_id",
							level: 7
						}
					]

					let form = {
						map_id: row.map_id,
						param_id: row.param_id,
						opertion_type: 2,
					}
					console.log(form)
					let info = await dealRespond(sqlcode, list, form)
					Notify(this, info[0], info[1]);
					this.fetchData()
				})
			},
			GetHeight() {},
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
						permission_name = 'sealLedgerAdd'
						break
					case 'edit':
						permission_name = 'sealLedgerEdit'
						break
					case 'delete':
						permission_name = 'sealLedgerDelete'
						break
					case 'accept':
						permission_name = 'entrustAcceptMenu'
						break
          case 'achieve':
          	permission_name = 'sampleAcceptMenu'
          	break
					default:
						permission_name = name
						break
				}
				// console.log(this.permission, permission_name);
        // console.log(this.permission)
				let flag = hasPermission(this.permission, permission_name)
        // console.log(flag,permission_name)
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					flag = true
					//return flag
				}
				if (row.org_id != this.org_pid) {
					flag = false
					return flag
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'accept':
						if (row.accepted == '0') {
							flag = true
						} else {
							flag = false
						}
						break
					case 'edit':
						if (row.accepted == '-1' || row.accepted == '-2') {
							flag = true
						} else {
							flag = false
						}
						break
          case 'achieve':
          	if (row.accepted == '1' && row.stage == '0') {
          		flag = true
          	} else {
          		flag = false
          	}
          	break
					default:
						flag = flag
						break;
				}
				return flag
			},
			editDialog(row) {
				this.$refs['paramRmDialog'].showEdit(row)
			},
			handleCommand(command, index, row) {
				let that = this
        console.log(command)
				switch (command) {
					//查看
					case 'view':
						that.handleView(row)
						break
						//编辑
					case 'edit':
						that.EditInfo(row)
						break


					case 'apply':
						that.sealApply(row)
						break
						//删除
					case 'delete':
						that.handleDeletemodify(row)
						break
					case 'accept':
						that.acceptEntrust(row)
						break
          case 'achieve':
          	that.achieveSample(row)
          	break

				}
			},
      achieveSample(row) {
        console.log(1)
        this.$refs['sampleAchieve'].showEdit(row,'2')
      },
			acceptEntrust(row) {
				this.$layer.iframe({
					content: {
						content: entrustAdd,
						parent: this,
						data: {
							iframeData: this.iframeData,
							pageType: 20,
							object_id: row.object_id,
							entrustInfo: row
						}
					},
					btn: '确定',
					area: ['60%', '80%'],
					title: row.order_id + '-' + this.ObjectName[row.object_id].object_name,
					maxmin: true,
					shade: false,
					shadeClose: false,
					cancel: () => { //关闭弹窗事件
						console.log('关闭iframe')
					}
				});
			},
			sealApply(row) {
				let form_info = {
					seal_id: row.seal_id
				}

			},
			handleView(row) {
				this.$layer.iframe({
					content: {
						content: entrustAdd,
						parent: this,
						data: {
							iframeData: this.iframeData,
							pageType: 30,
							object_id: row.object_id,
							entrustInfo: row
						}
					},
					btn: '确定',
					area: ['60%', '80%'],
					title: row.order_id + '-' + this.ObjectName[row.object_id].object_name,
					maxmin: true,
					shade: false,
					shadeClose: false,
					cancel: () => { //关闭弹窗事件
						console.log('关闭iframe')
					}
				});
			},
			Examine(row) {

			},
			EditInfo(row) {
				this.$layer.iframe({
					content: {
						content: entrustAdd,
						parent: this,
						data: {
							iframeData: this.iframeData,
							pageType: 40,
							object_id: row.object_id,
							entrustInfo: row
						}
					},
					btn: '确定',
					area: ['60%', '80%'],
					title: row.order_id + '-' + this.ObjectName[row.object_id].object_name,
					maxmin: true,
					shade: false,
					shadeClose: false,
					cancel: () => { //关闭弹窗事件
						console.log('关闭iframe')
					}
				});
			},
			handleAdd(row, parent_info, disable) {
				t
			},
			handleAddLevel(row) {
				let json = {
					parent_id: Object.assign({}, row).parent_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(undefined, json, undefined)
			},
			handleAddChild(row) {
				let json = {
					parent_id: Object.assign({}, row).org_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(undefined, json, undefined)
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},

			handleDeletemodify(row) {
				let that = this
				that.$confirm('此操作会清空所有相关信息，是否继续？', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '取消',
						cancelButtonText: '确定删除'
					})
					.then(() => {

					})
					.catch(action => {
						that.delete_from_fob(that, row, 364, {
							//"selectRows": "selectRows", //复选框选中数据
							fetchData: 'fetchData', //加载数据
							main_key: 'seal_id', //主键
							file: {
								seal_image: 12,
							}
						})
					});

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
				console.log('search', data)
				this.queryForm = Object.assign(data, this.queryForm)
				this.fetchData()
			},
			GetCurrentOrg() {
				if (this.current_org_id > 0) {
					return this.current_and_chrilren_org
				}
				return this.org_id
			},

			fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 0:
						this.columnHideList = ['user_name']
						that.fetchData1(pageInfo, treeNode, resolve)
						break
					case 1:
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async fetchDataMain(row, treeNode, resolve) {
				let that = this
				let select_list = [{
						field: 'object_id',
						type: 3,
						level: 1,
					}, {
						field: 'order_id',
						type: 2,
						level: 2,
					}, {
						field: 'order_date_start',
						type: 3,
						level: 3,
					}, {
						field: 'order_date_end',
						type: 3,
						level: 4,
					}, {
						field: 'accepted', //接受状态
						type: 3,
						level: 5,
					}, {
						field: 'org_id', //接受状态
						type: 3,
						level: 6,
					}, {
						field: 'stage', //试验状态
						type: 3,
						level: 7,
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
				let sqlcode = 454
				that.queryForm.org_id = that.GetCurrentOrg()
				that.queryForm.accepted = that.accepted
				that.queryForm.stage = that.stage
				that.queryForm.stage = that.status
				if (that.object_id) {
					that.queryForm.object_id = that.object_id + '%'
				}

				await that.search_fob(select_list, that, sqlcode, {
					'loading': 'listLoading', //加载画面
					'data': 'tablelist', //数据存放位置
					'total': 'total', //数据数量，根据该数量分页
					'queryForm': 'queryForm' //查询数据表单，请将分页条件也放置在其中
				});
				this.rowClick(setCurrentRowSelectTopFirstPageFirst(that, 'Entrustdata', that.tablelist, that.queryForm,
					'pageNo'))

			},

			//子表从表加载数据
			async fetchData1() {
				let that = this
				let select_list = [{
						field: 'param_id',
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
				that.queryForm.param_id = that.primary_key
				that.search_fob(select_list, that, -1, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
			},
		},
	}
</script>

<style>
	.demo-table-expand {
		font-size: 0;
	}

	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}

	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}

	.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
	.el-table__body tr.current-row>td {
		background-color: #0000FF;
	}

	.el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #6495ED;
	}

	.el-table .extra-urgent-row {
		background: #CD5C5C;
	}

	.el-table .urgent-row {
		background: #FFFF00;
	}

	.el-table .commonly-row {
		background: #FFFFFF;
	}
</style>

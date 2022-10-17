<template>
	<div id="CommonTestObjectDiv" >
		<el-table ref="CommonTestObject" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick" :tree-props="{ children: 'children' }"
			row-key="object_id" @row-contextmenu="rowContextmenu" :row-class-name="tableRowClassName" v-if="!isHide">
			<el-table-column show-overflow-tooltip prop="item_name" min-width="150px" align="left"
				:render-header="renderHeader">
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right" v-if="false">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item icon="el-icon-s-order"
								@click.native="handleCommand('view', scope.$index, scope.row)">
								添加委托
							</el-dropdown-item>

						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange" v-if="!isHide"></el-pagination>

		<div v-else width="10px" style="padding: 0px 10px 0px 0px;">
			<el-tooltip content="显示试验" placement="right">
				<el-button class="showObjectTreeBtn" type="primary" icon="el-icon-s-unfold" circle size="mini"
					@click="handlHide">
				</el-button>
			</el-tooltip>

		</div>

		<preview ref="preview" v-if="!isHide">></preview>
		<div id="contextmenu" v-show="menu.visible" class="menu" ref="rightClickMenu" v-if="!isHide">
			<!-- <div class="contextmenu__item" v-show="rightClickRow.object_name"></div> -->
			<!-- <div class="contextmenu__item" @click="rightClickMenuEvent({name:'addEntrust'})" v-show="rightClickRow.object_name">添加{{rightClickRow.object_name}}委托</div>
			<div class="contextmenu__item" @click="rightClickMenuEvent({name:'addEntrust'})" v-show="!rightClickRow.object_name">添加委托</div> -->
			<div class="contextmenu__item" @click="rightClickMenuEvent({name:'addEntrust'})">添加委托</div>
			<!-- <div class="contextmenu__item" @click="rightClickMenuEvent({name:'view'})">查看</div>
				<div class="contextmenu__item" @click="rightClickMenuEvent({name:'edit'})">修改</div> -->
		</div>
		<!-- <paramRmDialog ref="paramRmDialog" :isUpData.sync="tableReload"></paramRmDialog> -->

	</div>
</template>

<script>
	//import paramRmDialog from '../component/paramRmDialog'
	import entrustAdd from '../components/entrustAdd'
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
		TreeDataDealExGetData,
		TreeDataDealEx,
		TreeDataSecondary
	} from '@/global/tree_deal'
	// import {
	// 	FileDownLoad,
	// 	fileDetail
	// } from '../js/file.js'

	import preview from '@/components/fileAbout/preview'

	export default {
		name: 'CommonTestObjectTable',
		components: {
			preview,
			entrustAdd
			// paramRmDialog
		},
		props: {
			type: {
				type: Number,
				default: 0,
			},
			primary_key: {
				type: String,
				default: '',
			},
			permission: {
				type: Object,
				default: function() {
					return {}
				},
			},
			isShowZeroRow: {
				type: Boolean,
				default: true
			},
			option: {
				type: Object,
				default: function() {
					return {}
				},
			},
			testCountType: {
				type: Number,
				default: 10,
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
					// this.fetchData({
					// 	reload: 1,
					// })
				}

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
			current_and_chrilren_org() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {
				if (newVal && newVal.object_id) {
					this.$emit('update:primary_key', newVal.object_id);
				}

			},
		},
		data() {
			return {
				isHide: false,
				pdf_file_type: 12,
				tableReload: false,
				menu: {
					visible: false,
					left: 0,
					top: 0,
				},
				tableTemplateShow: {

				},
				ObjectName: {

				},
				rightClickRow: {

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
					}]
				},
				layout: 'total, sizes, prev, pager, next',
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
						this.height = 'calc(90%)'
						this.columnHideList = []
						if (this.primary_key > 0) {

						}
						break
					case 1:
						this.height = 'calc(90%)'
						break
				}
				await this.fetchData()
				await this.GetObjectName()
			},

			renderHeader(h, {
				column,
				$index
			}) {
				let that = this
				return h("div", [
					h("span", ['试验']),
					h('el-tooltip', {
							props: {
								content: "隐藏试验",
								placement: "top",
								effect: "dark",
							},
						},
						[
							h("el-button", {
								attrs: {
									'icon': 'el-icon-s-fold',
									'type': 'primary',
									'circle': true,
									size: "mini",
									"style": "margin-left:10px"
								},
								on: {
									click: that.handlHide
								}
							}),

						],
					),

				])
			},
			handlHide() {
				console.log('handlHide')
				this.$set(this, 'isHide', !this.isHide)
			},
			rightClickMenuEvent(event, row) {
				if (!row) {
					row = this.rightClickRow
				}
				let eventName = event.name
				switch (eventName) {
					case 'addEntrust':
						this.addEntrust(row)
						break
					case 'edit':
						break
				}
			},
			addEntrust(row) {
				let id = this.$layer.open({
					type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
					content: {
						content: entrustAdd,
						parent: this,
						data: {
							iframeData: this.iframeData,
							pageType: 10,
							object_id: row.object_id,
              object_name: row.object_name
						}
					},
					//content: this.$('#entrustAdd'),
					btn: '确定',
					area: ['60%', '80%'],
					title: '委托' + row.object_name + "试验",
					maxmin: true,
					shade: false,
					resize: true,
					shadeClose: false,
					cancel: () => { //关闭弹窗事件
						console.log('关闭iframe')
					}
				});
				console.log('addEntrust', id)
				window.entrustAdd = this.$parent
				window.entrustAdd = this.$parent
			},
			rowContextmenu(row, column, event) {
				this.menu.visible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
				event.preventDefault() //关闭浏览器右键默认事件
				if (this.accepted && this.accepted > 0) {
					return
				}
				if (this.stage) {
					return
				}
				if (row.group_id == 0 || (row.children && row.children.length > 0)) {
					this.$notify.info({
						title: '提示',
						message: '当前位置无右键菜单'
					});
					return
				}
				this.$set(this, 'rightClickRow', row)
				this.menu.visible = true // 显示模态窗口，跳出自定义菜单栏
				let menu = this.$refs['rightClickMenu']
				//let menu = document.querySelector('.menu')
				this.styleMenu(menu, event)

			},
			foo() {
				// 取消鼠标监听事件 菜单栏
				this.menu.visible = false;
				document.removeEventListener('click', this
					.foo); // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
				//document.removeEventListener('scroll', this.foo);
			},
			styleMenu(menu, event) {
				function getMousePos(event) {
					let e = event || window.event;
					let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
					let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
					let x = e.pageX || e.clientX + scrollX;
					let y = e.pageY || e.clientY + scrollY;
					return {
						'x': x,
						'y': y
					};
				}
				let position = getMousePos(event)
				let top = position.y
				let left = position.x

				if (left > 1800) {
					menu.style.left = left - 100 + 'px'
				} else {
					//menu.style.left = left + 1 + 'px'
					menu.style.left = left + 'px'
				}
				document.addEventListener('click', this.foo) // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
				//document.addEventListener('scroll', this.foo) // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
				if (top > 700) {
					menu.style.top = top - 30 + 'px'
				} else {
					//menu.style.top = top - 10 + 'px'
					menu.style.top = top + 'px'
				}
				menu.style.position = 'fixed'
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
			handleCommand(command, index, row) {
				let that = this
				switch (command) {
					//查看
					case 'view':
						//that.handleView(row)
						break
						//编辑
					case 'edit':
						//that.EditInfo(row)
						break


					case 'apply':
						//that.sealApply(row)
						break
						//删除
					case 'delete':
						//that.handleDeletemodify(row)
						break
				}
			},
			rowClick(row) {
				this.selectedRow = row
				if (this.radioRow) {
					this.radioRow(row)
				}
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
					case 'sealApplyAdd':
						permission_name = 'sealApplyAdd'
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
				if (row.org_id != this.org_pid) {
					flag = false
					return flag
				}
				if (!flag) {
					return flag
				}
				switch (name) {
					case 'sealApplyAdd':
						if (row.enabled == '1') {
							flag = true
						} else {
							flag = false
						}
						break
					case 'edit':
						flag = flag
						break
					default:
						flag = flag
						break;
				}
				return flag
			},


			handleAddChild(row) {
				let json = {
					parent_id: Object.assign({}, row).org_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(undefined, json, undefined)

			},
			setSelectRows() {},
			tableSortChange() {},
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
			tableRowClassName({
				row,
				rowIndex
			}) {

				if (!row.testCount) {
					return ''
				}

				if (row.testCount <= 0) {
					return ''
				}
				let className = ''
				let nDeep = parseFloat(row.nDeep)
				switch (nDeep) {
					case 0:
						className = 'success-row'
						break
					case 1:
						className = 'warning-row'
						break
				}
				return className
			},

			async testCountGet() {
				try {
					let type = this.testCountType
					let data = []
					switch (type) {
						//委托
						case 10:
							data = await this.entrustDataCount()
							break
						case 20:
							data = await this.TestDataCount()
							break
					}
					if (!data) {
						data = []
					}
					this.mergeDataCount(data)
				} catch (e) {
					console.log(e)
				}

			},
			findObjectRow(data, searchValue, key, ndeep) {
				try {
					if (!ndeep) {
						ndeep = 0
					}
					if (ndeep > 1000) {
						return undefined
					}
					if (!data || data.length == 0) {
						return undefined
					}
					if (!searchValue) {
						return undefined
					}
					if (!key) {
						key = 'object_id'
					}
					let length = data.length
					let item = undefined
					let temp = undefined
					for (let i = 0; i < length; i++) {
						item = data[i]
						if (item[key] == searchValue) {
							return item
						}
						if (item.children && item.children.length > 0) {
							temp = this.findObjectRow(item.children, searchValue, key, ndeep + 1)
							if (temp) {
								return temp
							}
						}
					}
					return undefined
				} catch (e) {
					console.log(e)
					return undefined
				}
			},
			rootTestCount(data, nDeep) {
				if (!nDeep) {
					nDeep = 0
				}
				if (nDeep > 1000) {
					return 0
				}
				if (!data) {
					return data
				}
				let length = data.length
				let item = undefined
				let count = 0
				let temp = 0;
				for (let i = 0; i < length; i++) {
					item = data[i]

					if (item.children && item.children.length > 0) {
						temp = this.rootTestCount(item.children, nDeep + 1)
						item.testCount = temp
						count = count + temp
					} else {

					}
					if (item.testCount && item.testCount > 0) {
						item.item_name = item.object_name + "  (" + item.testCount + ")"
						count = count + item.testCount
						continue
					}
				}
				return count
			},
			filterRow(data, nDeep) {
				try {
					if (!nDeep) {
						nDeep = 0
					}
					if (nDeep > 1000) {
						return data
					}
					if (!data) {
						return data
					}
					if (this.isShowZeroRow) {
						return data
					}
					let length = data.length
					let item = undefined
					let tempArray = []
					for (let i = 0; i < length; i++) {
						item = data[i]
						if (item.children && item.children.length > 0) {
							item.children = this.filterRow(item.children, nDeep + 1)
						}
						if ((item.children && item.children.length > 0) || (item.testCount && item.testCount > 0)) {
							tempArray.push(item)
						}
					}
					return tempArray
				} catch (e) {
					console.log(e)
				}
				return data

			},
			mergeDataCount(data) {
				try {

					if (!this.tablelistTemp) {
						return -1
					}
					if (!data) {
						return -1
					}
					//获取当前显示的副本数据
					let tablelistTemp = JSON.parse(JSON.stringify(this.tablelistTemp))
					let length = data.length
					let item = undefined
					let object_id = 0
					let temp = undefined
					let testCount = undefined
					for (let i = 0; i < length; i++) {

						item = data[i]
						object_id = item.object_id
						temp = this.findObjectRow(tablelistTemp, object_id, 'object_id')
						if (!temp) {
							continue
						}
						if (!item.testCount) {
							continue
						}
						testCount = parseFloat(item.testCount)
						temp.testCount = testCount

					}
					this.rootTestCount(tablelistTemp)

					temp = this.filterRow(tablelistTemp)
					this.tablelist = temp
				} catch (e) {
					console.log(e)
				}

			},
			async entrustDataCount() {
				try {
					let that = this
					let select_list = [{
							field: 'accepted',
							type: 3,
							level: 1,
						}, {
							field: 'stage',
							type: 3,
							level: 2,
						},
						{
							field: 'org_id',
							type: 3,
							level: 3,
						},
					]
					let form = {}
					if (that.option) {
						form = Object.assign(that.option, form)
					}
					let temp = {
						accepted: that.accepted,
						stage: that.stage,
						org_id: that.GetCurrentOrg()
					}
					form = Object.assign(temp, form)
					let {
						data
					} = await that.QueryExec_fob(469, select_list, form)
					return data
				} catch (e) {
					console.log(e)
				}


			},
			async TestDataCount() {
				try {
					let that = this
					let select_list = [{
							field: 'stage',
							type: 3,
							level: 2,
						},
						{
							field: 'org_id',
							type: 3,
							level: 3,
						},
					]
					let form = {}
					if (that.option) {
						form = Object.assign(that.option, form)
					}
					let temp = {
						accepted: that.accepted,
						stage: that.stage,
						org_id: that.GetCurrentOrg()
					}
					form = Object.assign(temp, form)
					let {
						data
					} = await that.QueryExec_fob(470, select_list, form)
					return data
				} catch (e) {
					console.log(e)
				}
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
						break
					case 1:
						break
				}
				that.fetchDataMain(pageInfo, treeNode, resolve)
			},

			async fetchDataMain(row, treeNode, resolve) {
				let that = this
				let select_list = []
				let sqlcode = 930
				that.queryForm.org_id = that.GetCurrentOrg()
				const data = await TreeDataDealExGetData(
					sqlcode,
					select_list,
					that.queryForm,
					0,
					'object_id',
					'group_id',
					'hasChildren'
				)
				this.tablelist = data
				this.tablelistTemp = JSON.parse(JSON.stringify(data))
				// await this.testCountGet()
        console.log(data)

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
				that.search_fob(select_list, that, 447, {
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
	#CommonTestObjectDiv .demo-table-expand {
		font-size: 0;
	}

	#CommonTestObjectDiv .demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}

	#CommonTestObjectDiv .demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}

	/* 	#CommonTestObjectDiv .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
	#CommonTestObjectDiv .el-table__body tr.current-row>td {
		background-color: #0000FF;
	}

	#CommonTestObjectDiv .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #6495ED;
	}

	#CommonTestObjectDiv .el-table .extra-urgent-row {
		background: #CD5C5C;
	}

	#CommonTestObjectDiv .el-table .urgent-row {
		background: #FFFF00;
	}

	#CommonTestObjectDiv .el-table .commonly-row {
		background: #FFFFFF;
	} */






	#CommonTestObjectDiv .contextmenu__item {
		display: block;
		line-height: 34px;
		text-align: center;
	}

	.contextmenu__item:not(:last-child) {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.menu {
		position: absolute;
		background-color: #fff;
		width: 100px;
		/*height: 106px;*/
		font-size: 12px;
		color: #444040;
		border-radius: 4px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		border-radius: 3px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
		white-space: nowrap;
		z-index: 1000;
	}

	.contextmenu__item:hover {
		cursor: pointer;
		background: #66b1ff;
		border-color: #66b1ff;
		color: #fff;
	}

	#CommonTestObjectDiv .showObjectTreeBtn {
		/* width: 40px; */
		/* height: 45px; */
		/* background: url('../../../assets/images/showTreeBar.png') no-repeat; */
		position: absolute;
		border: none;
		top: 10px;
		left: -7px;
	}

	#CommonTestObjectDiv .el-table .warning-row {
		background: #e8f0ff;
	}

	#CommonTestObjectDiv .el-table .success-row {
		background: #f5f7fa;
	}
</style>

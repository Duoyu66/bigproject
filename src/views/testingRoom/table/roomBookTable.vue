<template>
	<div>
		<el-table ref="tableSort" v-loading="listLoading" highlight-current-row :data="tablelist" border
			:element-loading-text="elementLoadingText" :height="table.tableHeight"
			:header-cell-style="{ background: '#e8f0ff' }" @sort-change="tableSortChange"
			@selection-change="handleSelectionChange" @select="handleSelectionChange" @select-all="selectall"
			v-if="table.isShow" @row-click="rowClick">
			<el-table-column type="selection" width="40" fixed="left" v-if="hideColFob('selection')">
			</el-table-column>
			<!-- <el-table-column show-overflow-tooltip prop="room_no" label="管理编码" width="100px"></el-table-column> -->
			<el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
			<el-table-column show-overflow-tooltip prop="charger" label="负责人" width="120px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="area" label="面积" min-width="150px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="explain" label="检测室说明" min-width="150px"></el-table-column>
			<!-- <el-table-column show-overflow-tooltip prop="description" label="介绍" min-width="150px"></el-table-column> -->
			<el-table-column show-overflow-tooltip label="操作" width="60px" fixed="right" v-if="hideColFob('operation')">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown" class="more">
							<template v-for="item in dropdown.menu">
								<el-dropdown-item @click.native="handleCommand(item.command, row)"
									v-if="ishasPermission(item.permission_name,row) ">{{ item.label }}
								</el-dropdown-item>
							</template>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination>
		<table-edit ref="edit" @reload="searchTable"></table-edit>
		<roomVideoDialog ref="roomVideoDialog" @reload="reloadChildren"></roomVideoDialog>
		<roomAllocDeviceDialog ref="roomAllocDeviceDialog" @reload="reloadChildren"></roomAllocDeviceDialog>
	</div>
</template>

<script>
	import {
		Notify,
		dealRespond,
	} from '@/utils/respondDeal'
	import {
		mapGetters
	} from 'vuex'
	import {
		hasPermission
	} from '@/utils/permission'
	import {
		handleSelectionChange,
		toggleSelectionList
	} from '@/utils/tableHelper'
	import {
		GetOrgId,
		GetPersonRoleMax,
	} from '../commonjs/common.testingRoom'
	import TableEdit from '../component/testBookDialog'
	import roomVideoDialog from '../component/roomVideoDialog'
	import roomAllocDeviceDialog from '../component/roomAllocDeviceDialog'
	export default {
		name: 'roomBookTable',
		components: {
			TableEdit,
			roomVideoDialog,
			roomAllocDeviceDialog
		},
		props: {
			type: {
				type: String,
				default: 'room_book',
			},
			primary_key: {
				type: Number,
				default: 0,
			},
			primary_org_id: {
				type: String,
				default: '',
			},
			permission: {
				type: Object,
				default: function() {
					return {}
				},
			},
			select_org_id: {
				type: String,
				default: '',
			}
		},
		provide() {
			return {
				reload: this.fetchData,
			}
		},
		computed: {
			...mapGetters({
				org_pid: 'user/org_pid',
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
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
			tableReload(newVal, oldVal) {
				this.fetchData({

				})
			},
			main_dialog(newVal, oldVal) {
				let selectedRow = JSON.parse(JSON.stringify(this.selectedRow))
				this.selectedRow = {
					room_no: -1,
					org_id: -1,
				}
				this.fetchData()
				setTimeout(function() {
					this.selectedRow = selectedRow
				}, 500)

			},
			current_org_id() {
				this.fetchData()
			},
			selectedRow(newVal, oldVal) {
				switch (this.type) {
					case 'room_book':
						if (newVal && newVal.room_no) {
							this.$emit('update:primary_key', Number(newVal.room_no));
							this.$emit('update:primary_org_id', newVal.org_id);
						}
						break
				}

			},
			tablelist(newVal, oldVal) {
				if (newVal && newVal.length > 0) {
					this.$set(this.table, 'isShow', false)
					this.$nextTick(() => {
						this.$set(this.table, 'isShow', true)
					})
				}
			},
		},
		data() {
			return {
				dropdown: {
					menu: [{
							command: 'edit',
							permission_name: 'edit',
							label: '修改'
						},
						{
							command: 'addvideo',
							permission_name: 'addvideo',
							label: '添加摄像头'
						},
						{
							command: 'addDevice',
							permission_name: 'addDevice',
							label: '分配设备'
						},
						{
							command: 'delete',
							permission_name: 'delete',
							label: '删除'
						},

						{
							command: '',
							permission_name: 'empty',
							label: '无权限操作此行数据'
						}
					],
					count: {

					}
				},


				tableReload: false,
				main_dialog: false,
				background: false,
				listLoading: false,
				tablelist: [],
				selectedRow: {},
				selectedRowList: {},
				elementLoadingText: '加载数据中',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
				},
				demotableexpand: {
					mainTable: [{
						field: 'doc_id',
						label: '收文编号',
						isShow: true,
					}]
				},
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				columnHideList: ['selection'],

				table: {
					tableHeight: 'calc(80%)',
					isShow: true,
				},

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
						this.table.tableHeight = 'calc(80%)'
						this.columnHideList = []
						if (this.primary_key > 0) {
							this.fetchData()
						}
						break
					case 'room_book':
						this.columnHideList = ['selection']
						this.table.tableHeight = 'calc(80%)'
						this.fetchData()
						break
					case 'room_alloc':
						this.columnHideList = ['operation']
						this.table.tableHeight = 'calc(95%)'
						this.fetchData()
						break
				}
			},
			reloadChildren(row) {
				if (!row) {
					row = JSON.parse(JSON.stringify(this.selectedRow))
				}
				this.selectedRow = {
					org_id: '-1',
					room_no: -1,
				}
				let that = this
				setTimeout(() => {
					that.selectedRow = row
				}, 500)
			},
			async selectall(val) {
				this.selectedRowList = val
				let length = val.length
				let opertion_type = 1;
				let sqlcode = -1;
				let list = [];
				let form = {}
				if (length == 0) {
					opertion_type = 0
					val = this.tablelist
					length = val.length
				}
				let room_no_list = []
				for (let i = 0; i < length; i++) {
					let item = val[i]
					if (item.room_no) {
						room_no_list.push(item.room_no)
					}
				}
				switch (this.type) {
					case 'room_alloc': //子表显示勾选的试验参数
						sqlcode = 629
						list = [{
								field: 'opertion_type',
								type: 3,
								level: 1,
							}, {
								field: 'room_no',
								type: 3,
								level: 2,
							},
							{
								field: 'org_id',
								type: 3,
								level: 3,
							}
						]
						form = {
							opertion_type: opertion_type,
							org_id: await this.getOrgId(),
							room_no: room_no_list.join(',')
						}
						break
				}
				if (sqlcode < 0) {
					return
				}
				let info = await dealRespond(sqlcode, list, form)
				Notify(this, info[0], info[1]);
			},
			handleSelectionChange(val, row) {
				if (!val || val.length == 0) {
					val = []
				}
				this.selectedRowList = val
				if (!row) {
					return false
				}

				if (this.listLoading) {
					return false
				}
				let select_stauts = handleSelectionChange(val, row)
				if (select_stauts.code != 200) {
					return false
				}
				let opertion_type = 0;
				if (select_stauts.data) {
					opertion_type = 0
				} else {
					opertion_type = 1
				}
				this.SelectionChangeDataBase(row, opertion_type)
			},
			handleCommand(command, row) {
				switch (command) {
					case 'edit':
						this.handleEdit(row)
						break
					case 'addvideo':
						this.handleAddVideo(row)
						break
					case 'delete':
						this.handleDelete(row)
						break
					case 'addDevice':
						this.handleAddDecice(row)
						break
				}
			},
			handleAddVideo(row) {
				let info = {
					room_name: row.name,
					room_no: row.room_no,
					org_id: row.org_id,
				}
				this.$refs['roomVideoDialog'].showEdit(undefined, info)
			},
			handleAddDecice(row) {
				let info = {
					room_no: row.room_no,
					org_id: row.org_id,
				}
				let option = {
					readonly: {
						room_no: true
					}
				}
				this.$refs['roomAllocDeviceDialog'].showEdit(undefined, info, option)
			},
			async SelectionChangeDataBase(row, opertion_type) {
				//opertion_type 0 选中【添加】 1 取消选中【删除】
				let sqlcode = 628

				let list = [{
						field: 'opertion_type',
						type: 3,
						level: 1,
					}, {
						field: 'room_no',
						type: 3,
						level: 2,
					},
					{
						field: 'org_id',
						type: 3,
						level: 3,
					}
				]
				switch (this.type) {
					case 'room_alloc': //子表显示勾选的试验参数
						sqlcode = 628
						list = [{
								field: 'opertion_type',
								type: 3,
								level: 1,
							}, {
								field: 'room_no',
								type: 3,
								level: 2,
							},
							{
								field: 'org_id',
								type: 3,
								level: 3,
							}
						]
						break
				}
				let form = {
					opertion_type: opertion_type,
					org_id: await this.getOrgId(),
					room_no: row.room_no
				}
				let info = await dealRespond(sqlcode, list, form)
				Notify(this, info[0], info[1]);
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
				let primery_id = row.room_id
				if (!name) {
					if (this.dropdown.count[primery_id]) {
						this.dropdown.count[primery_id]++
					} else {
						this.dropdown.count[primery_id] = 1
					}
					return true
				}
				let permission_name = ''
				let permissionRegister = {
					room_book: {
						//add: 'RoomdefinitionAdd',
						edit: 'testRoomledgerEdit',
						delete: 'testRoomledgerDelete',
						addvideo: 'testRoomVideoAdd',
						addDevice: 'testRoomDeviceAdd'
					},
				}
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
				if (name == 'empty') {
					if (!this.dropdown.count[primery_id]) {
						flag = true;
					}
				}
				let role_max = this.role_max
				if (role_max == 'super_admin') {
					//flag = true
					//return flag
				}
				// case 'chemical_consumption':
				// case 'chemical_check':
				// case 'chemicalNullify':
				let dropdowMenu = {
					RmStoreTable: ['all'],
				}
				if (dropdowMenu[this.type]) {
					let menu_list = dropdowMenu[this.type];
					if (menu_list.indexOf('all') >= 0) {

					} else if (menu_list.indexOf(name) < 0) {
						flag = false
					}
				}
				if (row.org_id != this.org_pid) {
					switch (name) {
						case 'empty':
							break
						default:
							flag = false
							break
					}

				}
				if (!flag) {
					return flag
				}
				switch (name) {
					default:
						flag = flag
						break;
				}
				if (flag) {
					switch (name) {
						case 'empty':
							break
						default:
							if (this.dropdown.count[primery_id]) {
								this.dropdown.count[primery_id]++
							} else {
								this.dropdown.count[primery_id] = 1
							}
							break
					}
				}
				return flag
			},
			// ishasPermission(name, row) {
			// 	let permission_name = ''
			// 	let permissionRegister = {
			// 		room_book: {
			// 			//add: 'RoomdefinitionAdd',
			// 			edit: 'testRoomledgerEdit',
			// 			delete: 'testRoomledgerDelete',
			// 		},
			// 	}
			// 	switch (name) {

			// 		default:
			// 			if (permissionRegister[this.type] && permissionRegister[this.type][name]) {
			// 				permission_name = permissionRegister[this.type][name]
			// 			} else {
			// 				permission_name = name
			// 			}
			// 			break
			// 	}
			// 	let flag = hasPermission(this.permission, permission_name)
			// 	let role_max = this.role_max
			// 	if (role_max == 'super_admin') {
			// 		//flag = true
			// 		//return flag
			// 	}
			// 	if (!flag) {
			// 		return flag
			// 	}
			// 	switch (name) {

			// 		default:
			// 			flag = flag
			// 			break;
			// 	}
			// 	return flag
			// },
			getHideColist() {},
			tableSortChange() {},
			handleEdit(row) {
				this.$refs['edit'].showEdit(row)
			},
			handleDelete(row) {
				const vue = this
				let tips = '此操作将永久删除管理编号[' + row.room_no + '],名称[' + row.name + ']的检测室，包括分配检测室、检测室下面的子表, 是否继续?'
				let sqlcode = 650
				row.temp = row.org_id + '-' + row.room_no
				this.$confirm(tips, '提示', {
						confirmButtonText: '取消',
						cancelButtonText: '确定',
						type: 'warning',
					})
					.then(async () => {

					})
					.catch(() => {
						this.delete_from_fob(vue, row, sqlcode, {
							//"selectRows": "selectRows", //复选框选中数据
							"fetchData": "fetchData", //加载数据
							"main_key": "temp", //主键
							'confirmMsg': tips,
							'successMsg': '删除成功',
						});
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
			searchTable() {
				this.fetchData({
					pageNo: this.queryForm.pageNo
				})
			},
			search(data) {
				if (data) {
					this.queryForm = Object.assign(data, this.queryForm)
				}
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			GetCurrentOrg() {
				if (this.current_org_id > 0) {
					return this.current_org_id
				}
				return this.org_id
			},
			toggleSelection() {
				let data = this.tablelist
				let length = data.length
				let selectList = []
				for (let i = 0; i < length; i++) {
					try {
						let item = data[i]

						if (!item.alloc_num) {
							continue
						}

						let hasNum = Number(item.alloc_num)
						if (hasNum <= 0) {
							continue
						}
						selectList.push(item)
					} catch (e) {
						console.log(e)
					}
				}
				toggleSelectionList(this, 'tableSort', selectList)
			},
			async fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 'room_book':
						await that.fetchDataRoomBook(pageInfo, treeNode, resolve)

						break
					case 'room_alloc':
						await that.fetchDataRoomAlloc(pageInfo, treeNode, resolve)
						this.toggleSelection()
						break
					case 1:
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async getOrgId() {
				let org_id = ''
				if (this.select_org_id) {
					return this.select_org_id
				}
				org_id = await GetOrgId()
				return org_id;
			},
			async fetchDataRoomBook(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'name',
						type: 2,
						level: 1,
					},
					{
						field: 'description',
						type: 2,
						level: 2,
					},
					{
						field: 'explain',
						type: 2,
						level: 3,
					},
					{
						field: 'charger',
						type: 2,
						level: 4,
					}, {
						field: 'org_id',
						type: 3,
						level: 5,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 6,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 7,
					},
				]
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 644, key_json)
				//console.log(this.tablelist)
			},
			async fetchDataRoomAlloc(pageInfo, treeNode, resolve) {
				let alist = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'name',
						type: 2,
						level: 2,
					},
					{
						field: 'alloc_num',
						type: 3,
						level: 3,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 4,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 5,
					},
				]
				this.queryForm.org_id = await this.getOrgId()
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 627, key_json)
			}
		},
	}
</script>

<style>

</style>

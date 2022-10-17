<template>
	<div class="draftPageHigh">
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" @row-click="rowClick">
			<el-table-column show-overflow-tooltip label="强度" prop="name" >
			</el-table-column>
			<el-table-column show-overflow-tooltip label="数量" prop="value" >
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
	export default {
		name: 'SmsTable',
		components: {

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
		},
		provide() {
			return {
				reload: this.fetchData,
			}
		},
		computed: {
			...mapGetters({
				current_org: 'org/current_org',
				org_type: 'org/org_type',
				org_id: 'user/org_id',
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
					case 10:
					case 11:
						this.fetchData({
							reload: 1,
						})
						break;
          case 12:
          	this.fetchData({
          		reload: 1,
          	})
          	break;
				}
				if (this.type == 0 || this.type == 2 || this.type == 3) {
					this.fetchData({
						reload: 1,
					})
				}
			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
      projectPrimaryId(newVal, oldVal){
      	this.fetchData()
      },
			current_org_id() {
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
				rowClickData: {},
        datestart: (Number(new Date().getFullYear())-1).toString()+'-'+new Date().getMonth()+'-'+new Date().getDay(),
        dateend: new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDay(),
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
					case 1:
						this.height = 'calc(85%)'
						break
					case 3:
						this.height = 'calc(85%)'
						break
					case 10:
					case 11:
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
			rowClick(row, col, event) {
				this.rowClickData = row
			},
			clearChildren() {
				this.rowClickData = {}
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
				let tips = '确定删除';
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
				this.queryForm = Object.assign(data, this.queryForm)
				this.fetchData()
			},
			fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 10:
					case 11:
						that.fetchData1()
						break
          case 12:
          	that.fetchData2()
          	break
          case 13:
          	that.fetchData3()
          	break
				}
			},
      async fetchData1() {
        let that=this
        let sData = ""
        console.log(that.org_type)
        switch (this.currentTab) {
        	case 'org':
        		sData = "[Q]1025{"+this.current_and_chrilren_org+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"
        		break;
        	case 'project':
        		sData = "[Q]1048{"+this.projectPrimaryId+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"
        		break;
        }
        let res = await QueryExec(sData)
        console.log(sData,res)
        this.tablelist = res.data
      },
      async fetchData2() {
        let that=this
        let sData;

          sData = "[Q]1024{"+this.current_and_chrilren_org+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"

        let res = await QueryExec(sData)
        console.log(sData,res)
        this.tablelist = res.data
      },
      async fetchData3() {
        let that=this
        let sData;

        sData = "[Q]1026{"+this.current_and_chrilren_org+"$`"+this.datestart+"$`"+this.dateend+"}|^SYS"

        let res = await QueryExec(sData)
        console.log(sData,res)
        this.tablelist = res.data
      },
      async setDay(datestart,dateend) {
        this.datestart=datestart
        this.dateend=dateend
        await this.fetchData()
      },
			async fetchDataMain(pageInfo, treeNode, resolve) {
				let that = this
				let select_list = [{
						field: 'pageNo',
						type: 3,
						level: 1
					},
					{
						field: 'pageSize',
						type: 3,
						level: 2
					},
					{
						field: 'car_id',
						type: 3,
						level: 3
					},

					{
						field: 'product_id',
						type: 3,
						level: 4
					},
          {
          	field: 'task_id',
          	type: 3,
          	level: 5
          },
				]
				switch (this.type) {
					//每车
					case 10:
						that.queryForm.car_id = that.primary_key
						break;
						//每盘
					case 11:
						that.queryForm.product_id = that.primary_key
						break;
            //任务
          case 12:
          	that.queryForm.task_id = that.primary_key
          	break;
				}


				await that.search_fob(select_list, that, 1009, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
				this.clearChildren()
			},
		},
	}
</script>

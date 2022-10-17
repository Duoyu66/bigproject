<template>
	<div>
		<el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
			:element-loading-text="elementLoadingText" highlight-current-row :height="height"
			:header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
			@sort-change="tableSortChange" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy
			:load="fetchData" row-key="item_id" @row-click="rowClick">
			<el-table-column show-overflow-tooltip label="序号" prop="num" min-width="60" align="left" fixed
				fixed="left"></el-table-column>
			<el-table-column show-overflow-tooltip label="列名" prop="field" min-width="120" fixed></el-table-column>
			<el-table-column show-overflow-tooltip label="类型" prop="fieldtype" align="center" fixed min-width="100">
			</el-table-column>
      <el-table-column show-overflow-tooltip label="长度" prop="fieldlen" align="center" fixed min-width="100">
      </el-table-column>
      <el-table-column prop="isAdd" label="添加字段" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isAdd" placeholder="请选择" style="width: 100%;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="isEdit" label="编辑字段" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isEdit" placeholder="请选择" style="width: 100%;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="isDisplay" label="显示字段" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isDisplay" placeholder="请选择" style="width: 100%;">
            <el-option label="显示" value="1"></el-option>
            <el-option label="获取" value="2"></el-option>
            <el-option label="不获取" value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="fieldname" label="字段名称" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fieldname"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="align" label="对齐" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.align" placeholder="请选择" style="width: 100%;">
            <el-option label="左" value="0"></el-option>
            <el-option label="中" value="1"></el-option>
            <el-option label="右" value="2"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="widthnum" label="宽度值" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.widthnum"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="formfieldtype" label="表单字段类型" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.formfieldtype" placeholder="请选择" style="width: 100%;">
            <el-option label="输入" value="1"></el-option>
            <el-option label="选择" value="2"></el-option>
            <el-option label="文件" value="3"></el-option>
            <el-option label="日期" value="4"></el-option>
            <el-option label="日期时间" value="5"></el-option>
            <el-option label="月" value="6"></el-option>
            <el-option label="年" value="7"></el-option>
            <el-option label="时间" value="8"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="group_id" label="分组id" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.group_id"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="templatecolumn" label="自定义显示模板列" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.templatecolumn"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="displayIsFromTable" label="显示是否来字其他表" width="180">
        <template slot-scope="scope">
          <el-select v-model="scope.row.displayIsFromTable" placeholder="请选择" @change="displaychange(scope.row)" style="width: 100%;">
            <el-option
              v-for="item in tabledata"
              :key="item.qid"
              :label="item.qname"
              :value="item.qid">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="tablefieldid" label="其他表关联字段" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.tablefieldid" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in fielddatadisplay"
              :key="item.qid"
              :label="item.qname"
              :value="item.qid">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="tablefieldname" label="其他表显示字段" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.tablefieldname" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in fielddatadisplay"
              :key="item.qid"
              :label="item.qname"
              :value="item.qid">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="fileclass" label="表单上传文件类型" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fileclass"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="customfieldname" label="自定义显示字段" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.customfieldname"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="formisfromtable" label="表单显示是否来字其他表" width="180">
        <template slot-scope="scope">
          <el-select v-model="scope.row.formisfromtable" placeholder="请选择" @change="formchange(scope.row)" style="width: 100%;">
            <el-option
              v-for="item in tabledata"
              :key="item.qid"
              :label="item.qname"
              :value="item.qid">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="formfieldid" label="表单其他表关联字段" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.formfieldid" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in fielddataform"
              :key="item.qid"
              :label="item.qname"
              :value="item.qid">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="formfieldname" label="表单其他表显示字段" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.formfieldname" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in fielddataform"
              :key="item.qid"
              :label="item.qname"
              :value="item.qid">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="formfieldlabel" label="表单字段label" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.formfieldlabel"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="formmaxlen" label="表单输入长度限制" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.formmaxlen"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="isNoInput" label="是否非输入项添加" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isNoInput" placeholder="请选择" style="width: 100%;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="inputFrom" label="非输入项来源" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.inputFrom"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="formatway" label="格式化方式" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.formatway"></el-input>
        </template>
      </el-table-column>
<!--      <el-table-column prop="checkway" label="校验缺省方式" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.checkway" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in checkwaydata"
              :key="item.item_id"
              :label="item.item_name"
              :value="item.item_id">
            </el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column prop="checkcustom" label="校验字符串" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.checkcustom"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="issearch" label="是否是搜索项" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.issearch" placeholder="请选择" style="width: 100%;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
            <el-option label="模糊查询" value="2"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="searchtype" label="搜索项类型" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.searchtype" placeholder="请选择" style="width: 100%;">
            <el-option label="输入" value="1"></el-option>
            <el-option label="选择" value="2"></el-option>
            <el-option label="文件" value="3"></el-option>
            <el-option label="日期" value="4"></el-option>
            <el-option label="日期时间" value="5"></el-option>
            <el-option label="月" value="6"></el-option>
            <el-option label="年" value="7"></el-option>
            <el-option label="时间" value="8"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="searchlabel" label="搜索项标题" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.searchlabel"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="searchfrom" label="搜索项下拉来源" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.searchfrom"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="ismainid" label="来自主表" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.ismainid" placeholder="请选择" style="width: 100%;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
<!-- 			<el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
				<template #default="{ row }">
					<el-dropdown trigger="click" placement="left-start" :hide-on-click="true">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
						</el-button>
						<el-dropdown-menu slot="dropdown" class="more" style="min-width: 115px">
							<template v-for="item in dropdown.menu">
								<el-dropdown-item @click.native="handleCommand(item.command, row)"
									v-if="ishasPermission(item.permission_name,row) ">{{ item.label }}
								</el-dropdown-item>
							</template>

						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column> -->
		</el-table>
		<sysDataGroupDialog ref="sysDataGroupDialog" @fencthRelod="fencthRelod">
		</sysDataGroupDialog>

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

	import sysDataGroupDialog from '../component/sysDataGroupDialog'

	export default {
		name: 'sysDataGroupTable',
		components: {
			sysDataGroupDialog,
		},
		props: {
			type: {
				type: String,
				default: 'main_table',
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
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
			}),
		},
		watch: {
			group_id(newVal, oldVal) {
				switch (this.type) {
					case 'side_table':
						this.fetchData({
							reload: 1,
						})
						break
				}
			},
			primary_key(newVal, oldVal) {
				switch (this.type) {
					case 'side_table':
						this.fetchData({
							reload: 1,
						})
						break
				}
			},
			main_dialog(newVal, oldVal) {
				this.fetchData()
			},
			current_org_id() {
				this.fetchData()
			},
			rowClickData(newVal) {
				switch (this.type) {
					case 'main_table':
						if (newVal && newVal.item_id) {
							this.$emit('update:group_id', Number(newVal.item_id))
						}
						break
				}
			}
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
							command: 'addChildren',
							permission_name: 'addChildren',
							label: '添加子节点'
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
        fielddatadisplay: [],
        fielddataform: [],
        checkwaydata: [
          {
            item_id:"",
            item_name:""
          }
        ],
				layout: 'total, sizes, prev, next, jumper',
				total: 0,
				columnHideList: [],
				rowClickData: {

				}
			}
		},
		created() {
			this.init()
		},
		methods: {
			GetHeight() {},
			async init() {
				this.role_max = await this.$store.dispatch('user/getRoleMax')
        await this.getTableData()
				switch (this.type) {
					case 'main_table':
						this.height = 'calc(90%)'
						this.fetchData()
						break
					case 'side_table':
						this.height = 'calc(90%)'
						if (this.group_id > 0) {
							this.fetchData()
						}
						break

				}
			},
      async displaychange(row) {
        let that = this
        let sData = '[Q]894{'+row.displayIsFromTable+'}|^SYS'
        let res = await QueryExec(sData)
        console.log(sData,res)
        that.fielddatadisplay = res.data
      },
      async formchange(row) {
        let that = this
        let sData = '[Q]894{'+row.formfieldname+'}|^SYS'
        let res = await QueryExec(sData)
        console.log(sData,res)
        that.fielddataform = res.data
      },
			rowClick(row, col, event) {
				this.rowClickData = row
			},
      getTableDataInMain() {
        return this.tablelist;
      },
      async getTableData() {
        let that = this
        let sData = "[Q]893{}|^SYS"
        let res = await QueryExec(sData)
        console.log(sData,res)
        that.tabledata = res.data
      },
      async getFieldData(row) {

      },
			clearChildren() {
				this.rowClickData = {
					item_id: -1
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
					},
					side_table: {
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
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name)
				let role_max = this.role_max
				if (name == 'empty') {
					if (!this.dropdown.count[row.item_id]) {
						flag = true;
					}
				}
				if (role_max == 'super_admin') {
					//flag = true
					//return flag
				}
				let dropdowMenu = {
					main_table: ['all'],
				}
				if (dropdowMenu[this.type]) {
					let menu_list = dropdowMenu[this.type];
					if (menu_list.indexOf('all') >= 0) {

					} else if (menu_list.indexOf(name) < 0) {
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
				let json = {
					parent_id: Object.assign({}, row).parent_id,
					double_parent_id: Object.assign({}, row).parent_id,
				}
				this.handleAdd(row, json, undefined)
			},
			handleAdd(row, parent_info, disable) {
				this.$refs['sysDataGroupDialog'].showEdit(row, parent_info, disable)
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
					group_id: Object.assign({}, row).item_id,
					double_parent_id: Object.assign({}, row).group_id,
          item_id:0,
				}
				this.handleAdd(undefined, json, undefined)
			},
			getHideColist() {},
			setSelectRows() {},
			tableSortChange() {},

			handleDeletemodify(row) {
				let that = this
				let tips = '确定删除' + row.item_id + '-' + row.item_name
				if (row.nDeep == 0) {
					tips = tips + "以及其子节点"
				}
				tips = tips + "?"
				that.delete_from_fobEx(that, row, 661, {
					"fetchData": "fetchData", //加载数据
					"main_key": "item_id", //主键
					'confirmMsg': tips,
					'successMsg': '删除成功',
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
        console.log('search', console.log(this.tablelist))
			},
			fetchData(pageInfo, treeNode, resolve) {
				let that = this
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.queryForm.pageNo = pageInfo.pageNo
				} else if (pageInfo) {
					this.queryForm.pageNo = 1
				} else {}
				switch (that.type) {
					case 'side_table':
					case 'main_table':
						that.fetchDataMain(pageInfo, treeNode, resolve)
						break
				}
			},
			async fetchDataMain(pageInfo, treeNode, resolve) {
				let that = this
				let select_list = [{
						field: 'tablename',
						type: 3,
						level: 1,
					}
				]
				// switch (that.type) {
				// 	case 'side_table':
				// 		that.queryForm.group_id = that.group_id
				// 		break
				// }
				await that.search_fob(select_list, that, 895, {
					loading: 'listLoading', //加载画面
					data: 'tablelist', //数据存放位置
					total: 'total', //数据数量，根据该数量分页
					queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中
				})
        this.listLoading = true
        // this.tablelist.forEach((item,index) => {
        //   // item.isAdd='1'
        //   // item.isEdit='1'
        //   // item.isDisplay='1'
        //   item.formfieldlabel=item.fielddesc
        //   item.fieldname=item.fielddesc
        // })
        setTimeout(() => {
        	this.listLoading = false
        }, 500)
        console.log(this.tablelist)
				this.clearChildren()
			},
			async fetchDataLazy(row, treeNode, resolve) {
				let that = this
				let config = {
					"form": {
						"select": "queryForm",
						"page": "queryForm"
					},
					"key": {
						"parent_id": "group_id",
						"primary_id": "item_id",
						"double_parent_id_filed": "double_group_id",
						"parent_info": "info",
						"hasChildren": "hasChildren"
					},
					"resolve": "resolve",
					"listLoading": "listLoading",
					"data": {
						"table_ref": "branchInstitutions",
						"data": "tablelist",
						"total": "total"
					}
				}
				let options = {
					"select_list": {
						"main": [{
								field: 'item_id',
								type: 3,
								level: 1,
							},
							{
								field: 'group_id',
								type: 3,
								level: 2,
							}, {
								field: 'item_name',
								type: 2,
								level: 3,
							}, {
								field: 'nDeep',
								type: 3,
								level: 4,
							},
						],
						"supply": [{
							field: 'pageNo',
							type: 3,
							level: 5,
						}, {
							field: 'pageSize',
							type: 3,
							level: 6,
						}]
					},
					"sqlcode": {
						"zero": 658,
						"other": 659
					},
					"key": {
						"parent_id": 0,
					}
				}
				if (that.group_id > 0) {
					that.queryForm.group_id = that.group_id
					that.queryForm.nDeep = undefined
				} else {
					that.queryForm.group_id = 0
					that.queryForm.nDeep = 0
				}
				//console.log(config, options, row, treeNode, resolve)
				treePaging(this, config, options, row, treeNode, resolve)
			},

		},
	}
</script>

<style>
</style>

<template>
  <div class="draftPageHigh">
    <el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
      :element-loading-text="elementLoadingText" highlight-current-row :height="height"
      :header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
      @sort-change="tableSortChange" @row-click="rowClick">
<!--      <el-table-column show-overflow-tooltip label="任务标识" prop="task_id" min-width="100px"></el-table-column> -->
      <el-table-column show-overflow-tooltip label="状态" prop="state" min-width="120px">
        <template #default="{ row }">
        	<el-tag v-if="row.state=='0'" type="success">已完成
        	</el-tag>
        	<el-tag v-else-if="row.state=='1'" type="info">已申请
        	</el-tag>
        	<el-tag v-else-if="row.state=='2'" color="warning">已受理
        	</el-tag>
        	<el-tag v-else-if="row.state=='3'" type="danger">已生产
        	</el-tag>
        	</el-tag>
        	<el-tag v-else>{{row.state}}
        	</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="任务单号" prop="task_no" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="项目名称" prop="project_name" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="施工部位" prop="mileage" min-width="180px"></el-table-column>
      <el-table-column show-overflow-tooltip label="强度" prop="strength" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="方量" prop="volume" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="拌合站名称" prop="station_name" min-width="150px"></el-table-column>
      <el-table-column show-overflow-tooltip label="开始时间" prop="begin_time" min-width="120px"></el-table-column>

      <el-table-column show-overflow-tooltip label="申请人" prop="applicant" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="申请时间" prop="apply_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="受理时间" prop="accept_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="受理人" prop="accept_person" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="塌落度" prop="slump" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="目的地" prop="destination" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作员" prop="operator" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作时间" prop="operate_time" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="计划方量" prop="plan_volume" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="实际方量" prop="actual_volume" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="强度" prop="strength_memo" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="浇筑部位" prop="pour_place" min-width="150px"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
        <template #default="scope">
          <el-dropdown trigger="click" placement="left-start">
            <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleCommand('view', scope.$index, scope.row)">详情</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('add', scope.$index, scope.row)">添加</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('edit', scope.$index, scope.row)">修改</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('del', scope.$index, scope.row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"	:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"@size-change="handleSizeChange"></el-pagination>
  </div>
</template>

<script>
  import { treePaging	} from '@/global/form.helper'
  import { QueryExec } from '@/api/table'
  import { mapGetters	} from 'vuex'
  import { hasPermission } from '@/utils/permission'
  import taskLedgerDialog from '../component/taskLedgerDialog'
  export default {
    name: 'taskLedgerTable',
    components: { taskLedgerDialog, },
    props: {
      type: {	type: Number,	default: 0, },
      primary_key: { type: Number, default: 0, },
      permission: { type: Object, default: function() { return {} }, },
      group_id: { type: Number, default: 0 },
      tablename: { type: String, default: '' },
    },
    provide() {	return { reload: this.fetchData, } },
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
        if (this.type == 1 || this.type == 2 || this.type == 3) {
          this.fetchData({ reload: 1, })
        }
      },
      main_dialog(newVal, oldVal) {
        this.fetchData()
      },
      current_org_id() {
        this.fetchData()
      },
      rowClickData(newVal) {
        if (newVal && newVal.task_id) {
          this.$emit('update:primary_key', Number(newVal.task_id));
        }
      },
    },
    data() {
      return {
        height: 'calc(85%)',
        main_dialog: false,
        background: false,
        listLoading: false,
        tablelist: [],
        elementLoadingText: '加载数据中',
        queryForm: { group_id: 0, pageSize: 10, pageNo: 1, },
        tabledata: [],
        layout: 'total, sizes, prev, next, jumper',
        total: 0,
        columnHideList: [],
        rowClickData: {}
      }
    },
    created() { this.init() },
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
        }
      },
      rowClick(row, col, event) {
        this.rowClickData = row
      },
      clearChildren() {
        // this.rowClickData = { task_id:-1, }
      },
      // fencthRelod(row) {
      //   if (!row) {
      //     row = JSON.parse(JSON.stringify(this.rowClickData))
      //   }
      //   this.clearChildren()
      //   let that = this
      //   setTimeout(() => {
      //     that.rowClickData = row
      //   }, 500)
      //   this.fetchData({
      //     pageNo: this.queryForm.pageNo
      //   })
      // },
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
        if (role_max == 'super_admin') {
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
        this.handleAdd(row, undefined, undefined)
      },
      handleAdd(row, parent_info, disable) {
        this.$refs['sysDataGroupDialog'].showEdit(row, parent_info, disable)
      },
      handleDeletemodify(row) {
        let that = this
        let tips = '确定删除' + task_id
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
        this.fetchData({pageNo: val,})
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData({pageNo: this.queryForm.pageNo,})
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
          case 0:
            that.fetchDataMain(pageInfo, treeNode, resolve)
            break
        }
      },
      setSelectRows() {},
      tableSortChange() {},
      async fetchDataMain(pageInfo, treeNode, resolve) {
        let that = this
        let select_list = [
          { field: 'task_no',	type: 2,	level: 1	},
          { field: 'project_name',	type: 2,	level: 2	},
          { field: 'mileage',	type: 2,	level: 3	},
          { field: 'strength',	type: 3,	level: 4	},
          { field: 'state',	type: 3,	level: 5	},
          { field: 'pageNo',	type: 3,	level: 6	},
          { field: 'pageSize',	type: 3,	level: 7	},
          { field: 'org_id',	type: 3,	level: 8	},
        ]
        that.queryForm.org_id=that.current_and_chrilren_org
        await that.search_fob(select_list, that, 978, {
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

<template>
  <div class="draftPageHigh">
    <el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border
      :element-loading-text="elementLoadingText" highlight-current-row :height="height"
      :header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
      @sort-change="tableSortChange" @row-click="rowClick">
      <el-table-column show-overflow-tooltip label="试验标识" prop="object_id" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="批号" prop="batch_id" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="出厂日期" prop="output_date" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="代表数量" prop="quantity" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="强度" prop="strength" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="样品规格" prop="sample_spec" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="样品尺寸" prop="sample_size" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="生产厂家" prop="factory" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="产品名称" prop="product_name" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="进场日期" prop="entry_date" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="出厂报告编号" prop="report_id" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="是否受理" prop="accepted" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验室验收人" prop="lab_person" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验室验收意见" prop="lab_comment" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验室验收日期" prop="lab_check_date" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="监理验收人" prop="super_person" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="监理验收意见" prop="super_comment" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="监理验收日期" prop="super_check_date" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="是否见证" prop="is_witness" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="料仓" prop="stock_bin" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="收到数量" prop="receive_quantity" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="物料标识" prop="material_id" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="剩余数量" prop="remain_quantity" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
        <template #default="scope">
          <el-dropdown trigger="click" placement="left-start">
            <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleCommand('view', scope.$index, scope.row)">详情</el-dropdown-item>
              <el-dropdown-item @click.native="handleCommand('view', scope.$index, scope.row)">委托</el-dropdown-item>
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
  // import entryDataDialog from '../component/entryDataDialog'
  export default {
    name: 'entryDataTable',
    components: {  },
    props: {
      type: {	type: Number,	default: 0, },
      primary_key: { type: Number, default: 0, },
      permission: { type: Object, default: function() { return {} }, },
      group_id: { type: Number, default: 0 },
      tablename: { type: String, default: '' },
    },
    provide() {	return { reload: this.fetchData, } },
    computed: {
      ...mapGetters({ org_id: 'user/org_id',current_org_id: 'org/current_org',person_id: 'user/person_id',}),
    },
    watch: {
      primary_key(newVal, oldVal) {
        if (this.type == 0 || this.type == 2 || this.type == 3) {
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
        if (newVal && newVal.entry_id) {
          switch (this.type) {
            case 1:
              this.$emit('update:primary_key', Number(newVal.entry_id));
              break;
          }
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
        this.rowClickData = { entry_id:-1, }
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
        let tips = '确定删除' + entry_id
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
          { field: 'object_id',	type: 3,	level: 1	},
          { field: 'pageNo',	type: 3,	level: 2	},
          { field: 'pageSize',	type: 3,	level: 3	},
        ]
        await that.search_fob(select_list, that, 933, {
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

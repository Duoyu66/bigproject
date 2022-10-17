<template>
  <!--fenpei dialog-->
  <el-dialog :visible.sync="dialogFormVisible" width="50%">
    <div slot="title" class="dialog-title">
      <el-button type="primary" @click="tongyi_fenpei">统一分配</el-button>
      <el-button type="danger" @click="dialogFormVisible = false">
        关闭
      </el-button>
      <el-form
        ref="form"
        :model="queryForm"
        :inline="true"
        @submit.native.prevent
      >
        <!-- <el-input
          v-model="queryForm.title"
          style="border-radius: 30px"
          placeholder="按照化学品名称搜索"
          prefix-icon="el-icon-search"
          @change="fetchData"
        /> -->
      </el-form>
    </div>
    <el-table
      ref="yf_table"
      :data="list"
      class="distribution_table"
      :header-cell-style="{ background: '#e8f0ff' }"
      highlight-current-row
      @selection-change="onYFChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        property="chemical_id"
        label="化学品类别编号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        property="name"
        label="化学品名称"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        property="model"
        label="化学品规格型号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        property="unit"
        label="计量单位"
      ></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer"></div>
  </el-dialog>
</template>

<script>
function getMethod(vue_compoment, method_name) {
  let that = vue_compoment
  let i = 0
  let rtn = null
  while ((rtn = that[method_name]) === undefined && i < 100) {
    that = that.$parent
    i++
  }
  console.log('i=' + i)
  return { call: that, method: rtn }
}
let globe_this
let g_org_id
import { sql_helper } from '@/global/sql_helper'
import { ExecSql } from '@/api/table'
export default {
  name: 'ChemicalStock',
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    console.log('function data() called')
    const _this = this
    return {
      data: null,
      imgShow: true,
      list: [],
      imageList: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: [],
      elementLoadingText: '正在加载...',
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
        org_id: null,
      },
      tabPosition: 'left',
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
    }
  },
  created() {
    g_org_id = this.$store.getters['org/current_org']
    if (g_org_id == -1 || g_org_id === undefined)
      g_org_id = this.$store.getters['user/org_id']
    globe_this = this
    this.queryForm.org_id = g_org_id
    this.fetchData()
  },
  methods: {
    onYFChange(val) {
      this.selectRows = val
    },
    tongyi_fenpei() {
      let vue = this
      let arr = [].slice.call(this.selectRows, 0)
      arr = arr.map((it) => {
        return it.chemical_id
      })
      let list = arr.toString()
      let c = sql_helper.splicing_fob(
        3,
        65,
        [
          { field: 'list', level: 1, type: 3 },
          { field: 'org_id', level: 2, type: 3 },
        ],
        { list: arr, org_id: g_org_id }
      )
      console.log(c.sql)
      ExecSql(c.sql)
        .then((resp) => {
          console.log(resp)
          window.vue_vm.$message({ message: '分配成功', type: 'success' })
          let method = getMethod(vue.$parent, 'fetchData')
          method.method.call(method.call)
        })
        .catch((e) => {
          console.log(e)
          window.vue_vm.$message({ message: e.toString(), type: 'error' })
        })
      this.dialogFormVisible = false
    },
    show() {
      this.fetchData()
      this.dialogFormVisible = true
    },
    showEdit(row) {
      console.log(row)
      this.dialogFormVisible = true
    },
    async fetchData() {
      let vue_ = this
      let totalCount = 0
      this.listLoading = true
      let yfdc = {
        total: null,
        data: null,
        var_1: {},
      }
      let var_a = [
        { field: 'chemical_id', type: 4, level: 1 },
        { field: 'name', type: 4, level: 2 },
        { field: 'model', type: 4, level: 3 },
        { field: 'unit', type: 4, level: 4 },
        { field: 'org_id', type: 4, level: 1 },
      ]
      this.search_fob(var_a, vue_, 64, {
        loading: '',
        total: 'total',
        data: 'data',
        queryForm: 'queryForm',
      })
        .then((resp) => {
          this.list = this.data
          let obj = false
          console.log(globe_this)
        })
        .catch(function (err) {
          console.log(err)
        })
      this.imageList = []
      this.total = totalCount
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
  },
}
</script>

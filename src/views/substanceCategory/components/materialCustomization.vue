<template>
  <el-dialog :visible.sync="dialogFormVisible">
    <div slot="title" class="dialog-title">
      <el-button type="primary">统一分配</el-button>
      <el-form
        ref="form"
        :model="queryForm"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item>
          <el-input
            style="border-radius: 30px"
            v-model="queryForm.title"
            placeholder="按设备名称搜索"
            prefix-icon="el-icon-search"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="list"
      class="distribution_table"
      :header-cell-style="{ background: '#e8f0ff' }"
      highlight-current-row
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        property="code"
        label="品种管理编号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        property="name"
        label="化学品名称"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        property="norms"
        label="化学品规格型号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        property="unit"
        label="计量单位"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        property="boolean"
        label="是否分配"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <el-button class="normal">分配</el-button>
        <el-button class="danger">取消</el-button>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">显示未分配的标准物质</div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {

  },
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
    return {
      imgShow: true,
      list: [],
      imageList: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      elementLoadingText: '正在加载...',
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
      },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: ''
      },
      formLabelWidth: '120px',
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      this.dialogFormVisible = true
    },

    async fetchData() {
      this.listLoading = true
      const {
        data,
        totalCount
      } = await (this.queryForm)
      this.list = [{ "code": "10001", "name": "水泥", "norms": "袋", "unit": "kg", "boolean": "是" },
      { "code": "10002", "name": "水泥沙", "norms": "箱", "unit": "kg", "boolean": "是" },
      { "code": "10003", "name": "石膏", "norms": "无", "unit": "kg", "boolean": "否" },
      { "code": "10004", "name": "试验用砂", "norms": "袋", "unit": "kg", "boolean": "是" },
      { "code": "10005", "name": "标准砂", "norms": "袋", "unit": "kg", "boolean": "否" },
      { "code": "10006", "name": "水泥", "norms": "袋", "unit": "kg", "boolean": "是" }]

      const imageList = []
      data.forEach((item, index) => {
        imageList.push(item.img)
      })
      this.imageList = imageList
      this.total = totalCount
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },

  },
}
</script>


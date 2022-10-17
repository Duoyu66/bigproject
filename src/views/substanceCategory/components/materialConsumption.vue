<template>
  <el-dialog
    title="添加标准物质消耗"
    :visible.sync="dialogFormVisible"
    width="700px"
  >
    <el-table
      :data="list"
      class="distribution_table device_tab"
      :header-cell-style="{ background: '#e8f0ff' }"
      highlight-current-row
    >
      <el-table-column
        show-overflow-tooltip
        label="标准物质管理编码"
        prop="code"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="标准物质名称"
        prop="name"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="标准物质规格"
        prop="norms"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="计量单位"
        prop="unit"
      ></el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-pagination
        class="devices"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      ></el-pagination>
      <div class="devides_btn">
        <el-button type="primary" @click="dialogFormVisible = false">
          确 定
        </el-button>
        <el-button
          @click="dialogFormVisible = false"
          style="margin-left: 280px"
        >
          取 消
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
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
    return {
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
      },
      dialogFormVisible: false,
      form: {
        code: '密度',
        name: 'xst',
        norms: 'rygz',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        unit: 'kg',
        number: '',
      },
      currentPage4: 1,
      list: [
        {
          code: '10001',
          name: '水泥',
          norms: '袋',
          unit: 'kg',
          criterion: 'GSB 07-1257-2000',
          batch: '100505',
          guarantee: '1000 ± 10',
        },
        {
          code: '10002',
          name: '水泥沙',
          norms: '箱',
          unit: 'kg',
          criterion: 'GSB 05-1117-8500',
          batch: '100506',
          guarantee: '500 ± 10',
        },
        {
          code: '10003',
          name: '石膏',
          norms: '无',
          unit: 'kg',
          criterion: 'GSB 07-7454-1450',
          batch: '100507',
          guarantee: '500 ± 10',
        },
        {
          code: '10004',
          name: '试验用砂',
          norms: '袋',
          unit: 'kg',
          criterion: 'GSB 08-4278-7212',
          batch: '100508',
          guarantee: '1000 ± 10',
        },
        {
          code: '10005',
          name: '标准砂',
          norms: '袋',
          unit: 'kg',
          criterion: 'GSB 04-3132-7512',
          batch: '100509',
          guarantee: '500 ± 10',
        },
        {
          code: '10006',
          name: '水泥',
          norms: '袋',
          unit: 'kg',
          criterion: 'GSB 07-0147-4015',
          batch: '100510',
          guarantee: '1000 ± 10',
        },
      ],
      formLabelWidth: '130px',
    }
  },

  methods: {
    handleSizeChange(val) {
      this.queryForm.pageSize = val
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
    },
    handleQuery() {
      this.queryForm.pageNo = 1
    },
    showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      this.dialogFormVisible = true
    },
  },
}
</script>

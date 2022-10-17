<template>
  <!-- 个人扣分定义 -->
  <div class="table-container definition baseBox" style="margin-right:10px;overflow: auto;">
    <vab-query-form style="margin-bottom:10px;">
      <vab-query-form-left-panel style="width:auto;">
        <el-button type="primary" @click="handleAdd">添加扣分记录</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel style="width:auto;float: right;">
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
              placeholder="按实验项目名称查询"
              prefix-icon="el-icon-search"
            />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      border
      :element-loading-text="elementLoadingText"
      highlight-current-row
      :height="table.tableHeight"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
      :header-cell-style="{ background: '#e8f0ff' }"
    >
      <el-table-column
        show-overflow-tooltip
        label="扣分名称"
        prop="name"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="describe"
        label="扣分描述"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="扣除积分"
        prop="integral"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="180px">
        <template #default="{ row }">
          <el-button type="primary" class="normal" @click="handleEdit(row)">
            修改
          </el-button>
          <el-button @click="handleDelete(row)" class="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <table-edit ref="edit"></table-edit>
  </div>
</template>

<script>
import {
  getList,
  doDelete
} from '@/api/table'
import TableEdit from '../components/points.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    TableEdit,
    treeData,
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

      table: {
        tableHeight: this.$(window).height()
      }
    }
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    this.fetchData()
  },
  beforeDestroy() { },
  mounted: function () {
    this.$nextTick(function () {
      let exceptHeight = 205;
      // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
      //tableSort为table中ref的值
      if (this.$refs.tableSort.$el) {
        this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
      }

      // 监听窗口大小变化
      let that = this;
      window.onresize = function () {
        if (that.$refs.tableSort.$el) {
          that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight;
        }
      }
    });
  },
  methods: {
    tableSortChange() {
      const imageList = []
      this.$refs.tableSort.tableData.forEach((item, index) => {
        imageList.push(item.img)
      })
      this.imageList = imageList
    },
    setSelectRows(val) {
      this.selectRows = val
    },
    handleAdd() {
      this.$refs['edit'].showEdit()
    },
    handleEdit(row) {
      this.$refs['edit'].showEdit(row)
    },
    handleDelete(row) {
      if (row.id) {
        this.$baseConfirm('你确定要删除采购日期为()的记录吗', null, async () => {
          const {
            msg
          } = await doDelete({
            ids: row.id
          })
          this.$baseMessage(msg, 'success')
          this.fetchData()
        })
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    handleQuery() {
      this.queryForm.pageNo = 1
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      const {
        data,
        totalCount
      } = await getList(this.queryForm)
      this.list = [{ "name": "扣分名称一", "describe": "测试扣分描述11", "integral": "1" },
      { "name": "扣分名称二", "describe": "测试扣分描述22", "integral": "2" },
      { "name": "扣分名称三", "describe": "测试扣分描述033", "integral": "0.5" },
      { "name": "扣分名称四", "describe": "测试扣分描述44", "integral": "1.5" }]
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
    testMessage() {
      this.$baseMessage('test1', 'success')
    },
    testALert() {
      this.$baseAlert('11')
      this.$baseAlert('11', '自定义标题', () => {
        /* 可以写回调; */
      })
      this.$baseAlert('11', null, () => {
        /* 可以写回调; */
      })
    },
    testConfirm() {
      this.$baseConfirm(
        '你确定要执行该操作?',
        null,
        () => {
          /* 可以写回调; */
        },
        () => {
          /* 可以写回调; */
        }
      )
    },
    testNotify() {
      this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
    },
  },
}
</script>


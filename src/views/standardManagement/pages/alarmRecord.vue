<template>
  <!-- 报警记录 -->
  <div class="table-container definition purchase equipment baseBox">
    <vab-query-form style="width: calc(100%)">
      <vab-query-form-left-panel style="width: 225px">
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
              placeholder="按检测室名称搜索"
              prefix-icon="el-icon-search"
            />
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel style="width: calc(100% - 235px); padding: 0 0 0 0;float: right;" >
        <span class="block">
          <span class="demonstration">开始时间</span>
          <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </span>
        <span class="block">
          <span class="demonstration">结束时间</span>
          <el-date-picker
            v-model="value2"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </span>

        <el-button type="primary" style="margin-left: 10px">搜索</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-container>
      <el-aside width="225px">
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :data="list1"
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
            label="检测室名称"
            prop="author"
            min-width="100%"
          ></el-table-column>
        </el-table>
      </el-aside>
      <el-main>
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
            label="报警时间"
            prop="alarmDate1"
            min-width="30%"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="alarmContent1"
            label="报警内容"
            min-width="35%"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="alarmClass"
            label="报警分类"
            min-width="35%"
          ></el-table-column>
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getList, doDelete } from '@/api/table'
import TableEdit from './../components/defaultEdit'
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
      value1: '',
      value2: '',
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
        number: '',
      },
      formLabelWidth: '120px',
      table: {
        tableHeight: this.$(window).height(),
      },
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
  beforeDestroy() {},
  mounted: function () {
    this.$nextTick(function () {
      let exceptHeight = 205
      // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
      //tableSort为table中ref的值
      if (this.$refs.tableSort.$el) {
        this.table.tableHeight =
          window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight
      }

      // 监听窗口大小变化
      let that = this
      window.onresize = function () {
        if (that.$refs.tableSort.$el) {
          that.table.tableHeight =
            window.innerHeight -
            that.$refs.tableSort.$el.offsetTop -
            exceptHeight
        }
      }
    })
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

    handleDelete(row) {
      if (row.id) {
        this.$baseConfirm(
          '你确定要删除标准物质名称为()的记录吗',
          null,
          async () => {
            const { msg } = await doDelete({
              ids: row.id,
            })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          }
        )
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
      const { data, totalCount } = await getList(this.queryForm)
      this.list = [
        {
          alarmDate1: '2021-1-19 09:00:00',
          alarmContent1: '检测室发生故障',
          alarmClass: '温度超标',
        },
        {
          alarmDate1: '2021-1-18 09:00:00',
          alarmContent1: '检测室发生故障',
          alarmClass: '湿度超标',
        },
        {
          alarmDate1: '2021-1-17 09:00:00',
          alarmContent1: '检测室发生故障',
          alarmClass: '温度预警',
        },
        {
          alarmDate1: '2021-1-16 09:00:00',
          alarmContent1: '检测室发生故障',
          alarmClass: '湿度预警',
        },
        {
          alarmDate1: '2021-1-15 09:00:00',
          alarmContent1: '检测室发生故障',
          alarmClass: '温度超标',
        },
      ]
      this.list1 = [
        { author: '温湿度检测室' },
        { author: '力学检测室' },
        { author: '光学检测室' },
        { author: '耐压性检测室' },
        { author: '耐久性检测室' },
      ]
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

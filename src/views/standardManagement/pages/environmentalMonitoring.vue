<template>
  <div class="table-container definition purchase equipment">
    <vab-query-form style="width: calc(100%)">
      <vab-query-form-left-panel style="width: calc(40%)">
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
      <vab-query-form-right-panel style="width: calc(60%)">
        <el-row style="width: calc(100%)">
          <el-col :span="20">
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
          </el-col>
          <el-col :span="4">
            <el-button type="primary">搜索</el-button>
          </el-col>
        </el-row>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-container>
      <el-aside width="12%">
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
            label="检测室名称"
            prop="author"
            min-width="100%"
          ></el-table-column>
        </el-table>
      </el-aside>
      <el-main style="width: 80%">
        <template>
          温度曲线：
          <div class="line-wrap" id="chartLine1"></div>
        </template>
        <template>
          <div class="line-wrap" id="chartLine2">湿度曲线：</div>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getList, doDelete } from '@/api/table'
import TableEdit from './../components/defaultEdit'
import treeData from './../../vab/tree/index'
import * as echarts from 'echarts'
require('echarts/theme/shine')
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
      chartLine1: null,
      chartLine2: null,
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
      let exceptHeight = 160
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
    this.$nextTick(() => {
      this.drawLineChart()
    })
  },
  methods: {
    drawLineChart() {
      let chartLine1 = document.getElementById('chartLine1')
      chartLine1.style.height = 20 + 'px'
      this.chartLine1 = echarts.init(chartLine1)
      let option1 = {
        tooltip: {
          trigger: 'axis',
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisTick: {
              show: false,
            },
            data: [
              '2021-1-19',
              '2021-1-18',
              '2021-1-17',
              '2021-1-16',
              '2021-1-15',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            data: [-10, 0, 10, 20, 30, 40, 50],
            name: '（温度）',
          },
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            stack: '温度',
            data: [-1, 35.5, 36.6, 34.8, 36.2, 41.7],
          },
        ],
      }
      this.chartLine2 = echarts.init(this.$el, 'shine')
      let option2 = {
        tooltip: {
          trigger: 'axis',
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisTick: {
              show: false,
            },
            data: [
              '2021-1-19',
              '2021-1-18',
              '2021-1-17',
              '2021-1-16',
              '2021-1-15',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            data: [-10, 0, 10, 20, 30, 40, 50],
            name: '（湿度）',
          },
        ],
        series: [
          {
            name: '湿度',
            type: 'line',
            stack: '湿度',
            data: [-1, 35.5, 36.6, 34.8, 36.2, 41.7],
          },
        ],
      }
      this.chartLine1.setOption(option1)
      this.chartLine2.setOption(option2)
    },
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
        { author: '温湿度检测室' },
        { author: '力学检测室' },
        { author: '光学检测室' },
        { author: '耐压性检测室' },
        { author: '耐久性测室' },
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
<style lang='scss' scope>
.line-wrap {
  width: 100px;
  height: 200px;
}
</style>
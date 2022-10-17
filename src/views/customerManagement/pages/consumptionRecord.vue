<template>
  <div class="definition purchase equipment_btn calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="添加消费" class="buy center">
        <div class="usage">
          <ConsumeForm ref="ConsumeForm"></ConsumeForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="ConsumeFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="消费记录">
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
            label="消费单位"
            prop="pay_org"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="消费时间"
            prop="recharge_date"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="委托试验"
            prop="test_name"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="消费金额"
            prop="amount"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="经手人"
            prop="operator"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="180px">
            <template #default="{ row }">
              <el-button
                type="primary"
                class="normal"
                @click="handleAdd4(row, '0')"
              >
                修改
              </el-button>
              <el-button @click="handleDelete(row)" class="danger">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <table-edit4 ref="edit4"></table-edit4>
  </div>
</template>

<script>
import {
  getList,
  doDelete
} from '@/api/table'
import TableEdit4 from '../components/consumptionRecord1.vue'
import ConsumeForm from '../form/ConsumeForm.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    TableEdit4,
    ConsumeForm,
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
  provide() {
    return {
      reload: this.reload,
      // reload2: this.reload2,
    }
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
      value1: new Date(),
      value2: new Date(),
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
        customer_id: '',
      },
      dialogFormVisible: false,
      form: {
        name: 'a',
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
      table: {
        tableHeight: this.$(window).height(),
        tableHeight1: this.$(window).height()
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
      let exceptHeight = 230;
      let exceptHeight1 = 200;
      // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
      //tableSort为table中ref的值
      if (this.$refs.tableSort.$el) {
        this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
        this.table.tableHeight1 = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight1;
      }

      // 监听窗口大小变化
      let that = this;
      window.onresize = function () {
        if (that.$refs.tableSort.$el) {
          that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight;
          that.table.tableHeight1 = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight1;
        }
      }
    });
  },
  methods: {
    ConsumeFormAdd() {
      this.$refs['ConsumeForm'].save()
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleAdd4(row, row1) {
      this.$refs['edit4'].showEdit(row, row1)
    },
    handleDelete(row) {
      let that = this
      that.delete_from_fob(that, row, 21, {
        "selectRows": "selectRows",//复选框选中数据
        "fetchData": "fetchData",//加载数据
        "main_key": "recharge_id"//主键
      });
      // if (row.id) {
      //   this.$baseConfirm('你确定要删除采购日期为()的记录吗', null, async () => {
      //     const {
      //       msg
      //     } = await doDelete({
      //       ids: row.id
      //     })
      //     this.$baseMessage(msg, 'success')
      //     this.fetchData()
      //   })
      // }
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
    reload() {
      this.fetchData()
    },
    async fetchData() {

      let that = this
      //根据sql自行编写
      let select_list = [{
        field: 'customer_id',
        type: 2,
        level: 1,
      },
      {
        field: 'pageNo',
        type: 3,
        level: 2,
      },
      {
        field: 'pageSize',
        type: 3,
        level: 3,
      },
      ]

      that.search_fob(select_list, that, 30, {
        'loading': 'listLoading',//加载画面
        'data': 'list',//数据存放位置
        'total': 'total',//数据数量，根据该数量分页
        'queryForm': 'queryForm'//查询数据，请将分页条件也放置在其中
      });

      // this.listLoading = true
      // const {
      //   data,
      //   totalCount
      // } = await getList(this.queryForm)
      // this.list = [{ "name": "胡元吉", "number": "二工区-二工区试验室", "price1": "160000", "date": "减水剂试验" },
      // { "name": "贺君天", "number": "三工区-三工区试验室", "price1": "152300", "date": "混凝土抗压试验" },
      // { "name": "闫旭阳", "number": "二工区-二工区试验室", "price1": "164300", "date": "水泥试验" },
      // { "name": "张子凡", "number": "三工区-三工区试验室", "price1": "460000", "date": "液体速凝剂试验" }]
      // const imageList = []
      // data.forEach((item, index) => {
      //   imageList.push(item.img)
      // })
      // this.imageList = imageList
      // this.total = totalCount
      // setTimeout(() => {
      //   this.listLoading = false
      // }, 500)
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

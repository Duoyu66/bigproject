<template>
  <div class="table-container definition equipment_btn">
    <vab-query-form style="margin-bottom: 6px">
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleAdd">添加设备类别</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              style="border-radius: 30px"
              v-model="queryForm.name"
              placeholder="按设备名称查询"
              prefix-icon="el-icon-search"
            >
              <template #append>
                <el-button icon="el-icon-search" @click="searchbutton"></el-button>
              </template>
            </el-input>
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
        label="设备名称"
        prop="device_name"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="设备规格"
        prop="device_span"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="range"
        label="测量范围"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="accuracy"
        label="精度"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="设备类型描述"
        prop="describable"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="116px">
        <template #default="{ row }">
          <el-button type="primary" class="normal" @click="handleAdd1(row)">
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
    <!-- 父组件要对子组件触发的事件进行监听 -->
    <table-edit @fetch-data='fetchData' ref="edit"></table-edit>
    <!-- <table-edit1 ref="edit1"></table-edit1> -->
  </div>
</template>

<script>
import {
  QueryExec,
  getList,
  ExecSql
} from '@/api/table'
import TableEdit from '../components/deviceClass.vue'
// import TableEdit1 from '../components/deviceClass1.vue'
import ClassFrom from '../form/ClassFrom.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',//便于调试，有名字的组件有更好的警示信息
  components: {
    // TableEdit1,
    TableEdit,
    ClassFrom,
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
        name: '',
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
    ClassFromAdd() {
      console.log(this.$refs['ClassFrom'].form);
    },
    searchbutton() {
      this.fetchData()
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
    handleAdd1(row) {
      this.$refs['edit'].showEdit(row)
    },
    handleAdd() {
      this.$refs['edit'].showEdit()
    },
    handleDelete(row) {
      if (row.device_id) {
        this.$baseConfirm('你确定要删除为'+row.device_name+'的设备类型吗?', null, async () => {
          let sData = '[Q]92{'+row.device_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if (res > 0) {
          	this.$baseMessage('删除成功', 'success')
            this.fetchData()
          } else {
          	this.$baseMessage('删除失败', 'error')
          }
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
      let sData = '[Q]91{%'+this.queryForm.name+'%$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.list = res.data
      this.total = res.totalCount
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

<style>
  .table-container{
  background:#fff;
  border-radius:5px;
  border: 1px solid #dbe0e6;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  padding: 10px;
  box-sizing: border-box;
  }
</style>

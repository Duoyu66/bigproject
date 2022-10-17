<template>
  <div
    class="table-container definition2 purchase equipment equipment_btn parameterdictionary"
  >
    <vab-query-form class="template dictionary" style="margin-bottom: 6px">
      <vab-query-form-left-panel style="width: 270px; margin-top: 6px">
        <el-select v-model="value1" style="width: 130px; margin-right: 10px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value1"
          ></el-option>
        </el-select>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
          style="width: 130px"
        >
          <el-input
            style="border-radius: 30px"
            v-model="queryForm.title"
            placeholder="按试验名称搜索"
            prefix-icon="el-icon-search"
          />
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel
        style="
          width: calc(100% - 280px);
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
        "
      >
        <div>
          <el-button type="primary" @click="handleAdd">
            复制旧版本指标
          </el-button>
          <el-button type="primary" @click="handleAdd1">添加试验指标</el-button>
        </div>

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
              placeholder="按指标名称搜索"
              prefix-icon="el-icon-search"
            />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-container class="colors">
      <el-aside width="270px">
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :data="list1"
          border
          :element-loading-text="elementLoadingText"
          :height="table.tableHeight"
          @selection-change="setSelectRows"
          @sort-change="tableSortChange"
          row-key="id"
          :header-cell-style="{ background: '#e8f0ff', 'text-align': 'left' }"
          highlight-current-row
          :cell-style="{ 'text-align': 'left' }"
        >
          <el-table-column
            min-width="70%"
            align="left"
            show-overflow-tooltip
            label="试验"
            prop="date"
          ></el-table-column>
          <el-table-column min-width="30%">
            <template slot-scope="scope">
              <el-dropdown trigger="click" placement="left-start">
                <el-button
                  icon="el-icon-s-fold"
                  class="el-dropdown-link"
                  type="primary"
                ></el-button>
                <el-dropdown-menu slot="dropdown" class="more">
                  <el-button>添加同级试验项目</el-button>
                  <el-button>添加子试验项目</el-button>
                  <el-button>修改试验项目</el-button>
                  <el-button>删除试验项目</el-button>
                  <el-button>试验项目详情</el-button>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main>
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :data="list"
          row-key="id"
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
            prop="title"
            label="指标名称"
            min-width="140px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="指标标识"
            prop="author"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="指标描述"
            prop="author2"
            min-width="100px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="title2"
            label="所属组"
            width="100px"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="数据类型"
            prop="author3"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="title3"
            label="是否自动计算"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="是否是指标项"
            prop="author4"
            width="60px"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="title4"
            label="实际样本数"
            width="60px"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="最大样本数"
            prop="author5"
            width="60px"
            align="center"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="120px">
            <template #default="{ row }">
              <el-button
                type="primary"
                class="normal"
                @click="handleEdit1(row)"
              >
                修改
              </el-button>
              <el-button @click="handleDelete(row)" class="danger">
                删除
              </el-button>
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
        <table-edit1 ref="edit1"></table-edit1>
        <!-- <table-edit2 ref="edit2"></table-edit2> -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getList,
  doDelete
} from '@/api/table'
import TableEdit from '../components/testDictionary.vue'
import TableEdit1 from '../components/testDictionary1.vue'
// import TableEdit2 from '../components/testDictionary2.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    TableEdit,
    // TableEdit2,
    TableEdit1,
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
      list1: [{
        id: 1,
        date: '钢材类',
        children: [{
          id: 31,
          date: '钢筋原材v1',
        }, {
          id: 32,
          date: '钢筋焊接v1',
        }],
      }],
      list: [{ "id": "11", "author": "11002504", "title": "屈服力试样4", "author2": "屈服力试样", "title2": "屈服强度", "author3": "数值", "title3": "自动计算", "author4": "是", "title4": "1", "author5": "1" },
      { "id": "12", "author": "11002503", "title": "拉断最大力试样3", "author2": "拉断最大力试样", "title2": "抗拉强度", "author3": "数值", "title3": "自动计算", "author4": "是", "title4": "1", "author5": "1" },
      { "id": "13", "author": "11002502", "title": "拉断最大力试样2", "author2": "拉断最大力试样", "title2": "抗拉强度", "author3": "数值", "title3": "自动计算", "author4": "是", "title4": "1", "author5": "1" },
      { "id": "14", "author": "11002501", "title": "弯曲外表面描述试样4", "author2": "弯曲外表面描述试样", "title2": "弯曲试验", "author3": "文本", "title3": "自动计算", "author4": "是", "title4": "1", "author5": "1" },
      { "id": "15", "author": "11002704", "title": "弯曲角度试样2", "author2": "弯曲角度试样", "title2": "弯曲试验", "author3": "数值", "title3": "自动计算", "author4": "是", "title4": "1", "author5": "1" },],
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
        region: 'beijing',
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
        tableHeight: this.$(window).height()
      },
      options: [{
        value1: '选项1',
        label: '请选择行业'
      }, {
        value1: '选项2',
        label: '铁路'
      }, {
        value1: '选项3',
        label: '公路'
      }, {
        value1: '选项4',
        label: '水利'
      }],
      value1: '选项1'
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
      let exceptHeight = 210;
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
    handleAdd1() {
      this.$refs['edit1'].showEdit()
    },
    handleEdit1(row) {
      this.$refs['edit1'].showEdit(row)
    },
    handleDelete(row) {
      if (row.id) {
        this.$baseConfirm('你确定要删除标准物质名称为()的记录吗', null, async () => {
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
      // this.list = data
      this.list1 = [{
        id: 1,
        date: '钢材类',
        children: [{
          id: 31,
          date: '钢筋原材v1',
        }, {
          id: 32,
          date: '钢筋焊接v1',
        }],
      }]
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

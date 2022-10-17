<template>

  <div class="table-container definition entru">
    <vab-query-form class="baseBox">
      <vab-query-form-right-panel style="width: 100%;">
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按照试验名称查询" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <div class="baseBox">
      <el-tabs tab-position="top" style="height: calc(65vh);">
        <el-tab-pane label="所有报告">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
            :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff','text-align':'left'}">
            <el-table-column show-overflow-tooltip label="委托编号" prop="order_id" min-width="21%"></el-table-column>
            <el-table-column show-overflow-tooltip label="报告编号" prop="report_id" min-width="21%"></el-table-column>
            <el-table-column show-overflow-tooltip label="试验名称" prop="object_name" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="test_class" label="试验类别" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="order_agent" label="委托单位" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip label="参数" prop="test_params" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="tester" label="试验员" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip label="报告日期" prop="date" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip label="寄发情况" prop="situation" min-width="9%">
              <template slot-scope="scope">
                <el-tag size="medium">{{ scope.row.situation }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="150px">
              <template #default="{ row }">

                    <el-button @click="handleSend(row)">寄发</el-button>
                    <el-button>详情</el-button>

              </template>

            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未寄发报告">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
            :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff','text-align':'left'}">
            <el-table-column show-overflow-tooltip label="委托编号" prop="id" min-width="21%"></el-table-column>
            <el-table-column show-overflow-tooltip label="报告编号" prop="id" min-width="21%"></el-table-column>
            <el-table-column show-overflow-tooltip label="试验名称" prop="name" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="type" label="试验类别" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="unit" label="委托单位" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip label="参数" prop="type1" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="peo" label="试验员" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip label="完成时间" prop="date" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="150px">
              <template #default="{ row }">

                    <el-button @click="handleSend(row)">寄发</el-button>
                    <el-button>详情</el-button>

              </template>

            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已寄发报告">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
            :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff','text-align':'left'}">
            <el-table-column show-overflow-tooltip label="委托编号" prop="id" min-width="21%"></el-table-column>
            <el-table-column show-overflow-tooltip label="报告编号" prop="id" min-width="21%"></el-table-column>
            <el-table-column show-overflow-tooltip label="试验名称" prop="name" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="type" label="试验类别" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="unit" label="委托单位" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip label="参数" prop="type1" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="peo" label="试验员" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip label="完成时间" prop="date" min-width="9%"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="150px">
              <template #default="{ row }">

                    <el-button @click="handleSend(row)">寄发</el-button>
                    <el-button>详情</el-button>

              </template>

            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        :background="background"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <excel-edit ref="edit"></excel-edit>
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/table'
  import excelEdit from './../components/reportSeal'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {
      excelEdit,
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
        table: {
        	tableHeight: this.$baseTableHeight()
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
    beforeDestroy() {},
    mounted() {},
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
      handleSend(row) {
        if (row.id) {
          this.$baseConfirm('你确定已寄发报告，更新寄发状态？', null, async () => {

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
        let sData = '[Q]457{$`$`$`$`$`$`$`6$`$`'+ ((Number(this.queryForm.pageNo) - 1) * Number(this.queryForm.pageSize)).toString() +
        	'$`' + this.queryForm.pageSize + '}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData,res)
        this.list = res.data
        this.total = res.total
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
  /* .el-dialog {
    margin-top: 100px!important;
  }
  .el-dialog__body {
    padding: 10px;
  } */
  .el-tabs__header{margin-bottom:10px;}
</style>

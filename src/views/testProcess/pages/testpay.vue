<template>
  <div class="table-container definition entru">
    <vab-query-form class="baseBox">
      <vab-query-form-right-panel style="width: 100%;" class="">
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按照试验名称查询" prefix-icon="el-icon-search" />
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <div class="baseBox">
      <el-tabs tab-position="top">
        <el-tab-pane label="所有报告">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
            :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff','text-align':'left' }">
            <el-table-column show-overflow-tooltip label="报告编号" prop="num2" min-width="18%"></el-table-column>
            <el-table-column show-overflow-tooltip label="委托编号" prop="num" min-width="18%"></el-table-column>
            <el-table-column show-overflow-tooltip label="试验名称" prop="id" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="type" label="试验类别" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="付费方式" prop="day" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="合同名称" prop="material" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="应收金额(元)" prop="batch" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="收费情况" prop="num1" min-width="8%">
              <template slot-scope="scope">
                <el-tag size="medium">{{ scope.row.num1 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="付款时间" prop="type1" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="180px">
              <template #default="{ row }">
                <el-button @click="handleDelete(row)" class="normal">收费</el-button>
                <el-button  @click="handleEdit(row)" class="danger">费用详情</el-button>
              </template>

            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未付费委托">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
            :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff','text-align':'left' }">
            <el-table-column show-overflow-tooltip label="报告编号" prop="num2" min-width="18%"></el-table-column>
            <el-table-column show-overflow-tooltip label="委托编号" prop="num" min-width="18%"></el-table-column>
            <el-table-column show-overflow-tooltip label="试验名称" prop="id" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="type" label="试验类别" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="付费方式" prop="day" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="合同名称" prop="material" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="应收金额(元)" prop="batch" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="付款时间" prop="type1" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="180px">
              <template #default="{ row }">
                <el-button @click="handleDelete(row)" class="normal">收费</el-button>
                <el-button  @click="handleEdit(row)" class="danger">费用详情</el-button>
              </template>

            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已付费委托">
          <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
            :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff','text-align':'left' }">
            <el-table-column show-overflow-tooltip label="报告编号" prop="num2" min-width="18%"></el-table-column>
            <el-table-column show-overflow-tooltip label="委托编号" prop="num" min-width="18%"></el-table-column>
            <el-table-column show-overflow-tooltip label="试验名称" prop="id" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="type" label="试验类别" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="付费方式" prop="day" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="合同名称" prop="material" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="应收金额(元)" prop="batch" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="付款时间" prop="type1" min-width="8%"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="180px">
              <template #default="{ row }">
                <el-button @click="handleDelete(row)" class="normal">收费</el-button>
                <el-button  @click="handleEdit(row)" class="danger">费用详情</el-button>
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
    <test-Report ref="report"></test-Report>
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/table'
  import excelEdit from './../components/taskRefuse'
  import testReport from './../components/testReport'
  export default {
    name: 'ComprehensiveTable',
    components: {
      excelEdit,
      testReport,
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
      handleReport(row) {
        this.$refs['report'].showEdit(row)
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定已收费吗？\n(温馨提示：若非预付款收费，请确认已实际收到费用)', null, async () => {

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
        const { data, totalCount } = await getList(this.queryForm)
        this.list = [{num:'S60-JR-201712-007',id:'钢筋原材试验',type:'拉伸试验',material:'甲乙买卖合同',
        material1:'无',day:'预付款',num1:'已付费',type1:'2020-12-31',batch:'15000',num2:'RW-235'},
        {num:'S60-JR-201802-001',id:'粗骨料',type:'碎石',material:'甲丙买卖合同',
        material1:'无',day:'预付款',num1:'已付费',type1:'2020-12-31',batch:'13000',num2:'RW-025'},
        {num:'S60-JR-201111-111',id:'水泥试验',type:'火山灰硅酸',material:'甲丁买卖合同',
        material1:'无',day:'预付款',num1:'已付费',type1:'2020-12-31',batch:'12000',num2:'RW-033'},
        {num:'S60-JR-200505-005',id:'引气剂试验',type:'引气剂',material:'甲戊买卖合同',
        material1:'无',day:'预付款',num1:'已付费',type1:'2020-12-31',batch:'12000',num2:'RW-068'}]
        const imageList = []
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

<style>
  /* .el-dialog {
    margin-top: 100px!important;
  }
  .el-dialog__body {
    padding: 10px;
  }
  .luckysheet-input-box {
    z-index: 100000000!important;
  } */
  .el-tabs__header{margin-bottom:10px;}
</style>

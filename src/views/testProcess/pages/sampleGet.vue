<template>

  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>


      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按照试验名称查询" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
      :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
      <el-table-column show-overflow-tooltip label="委托编号" prop="id"></el-table-column>
      <el-table-column show-overflow-tooltip label="试验" prop="id"></el-table-column>
      <el-table-column show-overflow-tooltip prop="type" label="试验类别"></el-table-column>
      <el-table-column show-overflow-tooltip label="委托单位" prop="describe"></el-table-column>
      <el-table-column show-overflow-tooltip label="取样见证人" prop="id"></el-table-column>
      <el-table-column show-overflow-tooltip label="原材料位置" prop="id"></el-table-column>
      <el-table-column show-overflow-tooltip prop="type" label="联系电话"></el-table-column>
      <el-table-column show-overflow-tooltip prop="type" label="取样时间"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="150px">
        <template #default="{ row }">
          <el-button type="primary" class="normal" @click="handleEdit(row)">打印标签</el-button>
          <el-button @click="handleDelete(row)" class="danger">详情</el-button>
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
    <excel-edit ref="edit"></excel-edit>
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/table'
  import excelEdit from './../components/entrustAssign'
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
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
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
        this.list = data
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

<style>
/*  .el-dialog {
    margin-top: 100px!important;
  }
  .el-dialog__body {
    padding: 10px;
  } */
</style>

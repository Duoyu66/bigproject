<template>

  <div class="table-container definition">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="dialogFormVisible = true">
          添加验收记录
        </el-button>
        <el-dialog title="添加验收记录" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <!-- <el-form-item label="设备名称" :label-width="formLabelWidth">
              <el-select v-model="form.name" style="width: 250px;">
                <el-option label="123" value="xst"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规格型号" :label-width="formLabelWidth">
              <el-select v-model="form.norms" style="width: 250px;">
                <el-option label="c-952" value="rygz"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出产厂家" :label-width="formLabelWidth">
              <el-select v-model="form.norms" style="width: 250px;">
                <el-option label="c-952" value="rygz"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作废数量" :label-width="formLabelWidth">
              <el-input v-model="form.number" style="width: 230px; margin-right: 3px;"></el-input>ml
            </el-form-item> -->

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </el-dialog>

      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按照化学品名称查询" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
      <el-table-column show-overflow-tooltip label="设备名称" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip prop="title" label="规格型号"></el-table-column>
      <el-table-column show-overflow-tooltip label="生产厂家" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="出厂编号" prop="datetime"></el-table-column>
      <el-table-column show-overflow-tooltip prop="title" label="验收单位"></el-table-column>
      <el-table-column show-overflow-tooltip label="验收情况" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="验收结论" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="验收人员" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="审核人" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="116px">
        <template #default="{ row }">
          <el-button type="primary" class="normal" @click="dialogFormVisible = true">修改</el-button>
          <el-button @click="handleDelete(row)" class="danger">删除</el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
      :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
    <table-edit ref="edit"></table-edit>
  </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
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
          number:''
        },
        formLabelWidth: '120px'
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

      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除作废时间为()的记录吗', null, async () => {
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

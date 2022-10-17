<template>

  <div class="table-container definition">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-row style="width: calc(50%); margin-right: 10px;">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col style="align-items: center; line-height: 32px" :span="2">——</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-row>
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
            <el-form-item>
              <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按计划内容搜索" prefix-icon="el-icon-search" />
            </el-form-item>
          </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按设备名称搜索" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-row :gutter="10">
      <el-col :span="10" style="padding: 8px 5px;">
        <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list" border :header-cell-style="{background:'#e8f0ff' }"
          :element-loading-text="elementLoadingText" :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange">
          <el-table-column show-overflow-tooltip label="计划日期" prop="datetime" min-width="35%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="title" label="计划内容" min-width="65%"></el-table-column>
        </el-table>
        <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
          :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" style="width: calc(100%); overflow: hidden;" ></el-pagination>
      </el-col>
      <el-col :span="14">
        <fieldset style="border: 0.01px solid #ddd; min-width: inherit;">
          <legend>详细计划</legend>
          <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list" border :header-cell-style="{background:'#e8f0ff' }"
            :element-loading-text="elementLoadingText" :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange">
            <el-table-column show-overflow-tooltip label="设备" prop="author" min-width="35%"></el-table-column>
            <el-table-column show-overflow-tooltip label="核查方式" prop="author" min-width="35%"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" min-width="30%">
              <template #default="{ row }">
                <el-button type="primary" @click="dialogFormVisible = true">
                  执行核查
                </el-button>
                <el-dialog title="执行核查" :visible.sync="dialogFormVisible">
                  <el-form :model="form">
                    <el-form-item label="是否合格" :label-width="formLabelWidth">
                      <el-select v-model="form.region"  style="width: 250px;">
                        <el-option label="合格" value="qualified"></el-option>
                        <el-option label="不合格" value="unqualified"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                  </div>
                </el-dialog>
              </template>

            </el-table-column>
          </el-table>
        </fieldset>
        <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
          :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
      </el-col>
    </el-row>

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
          region:'qualified'

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
          this.$baseConfirm('你确定要删除作废时间为（）的项吗', null, async () => {
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

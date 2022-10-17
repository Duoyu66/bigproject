<template>

  <div class="table-container definition purchase">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="dialogFormVisible = true">
          添加调拨记录
        </el-button>
        <el-dialog title="添加调拨记录" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <!-- <el-form-item label="管理编号" :label-width="formLabelWidth">
              <el-input v-model="form.number" style="width: 250px;" ></el-input>
            </el-form-item>
            <el-form-item label="设备名称" :label-width="formLabelWidth">
              <el-input v-model="form.number" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item label="核查方式" :label-width="formLabelWidth">
              <el-input v-model="form.number" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item label="核查人员" :label-width="formLabelWidth">
              <el-input v-model="form.number" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item label="核查结果" :label-width="formLabelWidth">
              <el-input v-model="form.number" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item label="核查时间" :label-width="formLabelWidth">
              <el-input v-model="form.number" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <textarea name="" id="" cols="30" rows="10" style="width: 243px;" >

              </textarea>
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
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按设备名称搜索" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
      <el-table-column show-overflow-tooltip label="管理编号" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip prop="title" label="设备名称"></el-table-column>
      <el-table-column show-overflow-tooltip label="规格型号" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip prop="title" label="起始机构"></el-table-column>
      <el-table-column show-overflow-tooltip label="起始经手人" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="目标机构" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="目标经手人" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="调拨原因" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="100px">
        <template #default="{ row }">
              <el-dropdown trigger="click" placement="left-start">
                <!-- <span class="el-dropdown-link">
                  下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span> -->
                <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                <el-dropdown-menu slot="dropdown" class="more" >
                  <el-button >修改记录</el-button>
                  <el-button @click="handleDelete(row)">删除记录</el-button>
                  <el-button >调拨详情</el-button>
                </el-dropdown-menu>
              </el-dropdown>

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
          this.$baseConfirm('你确定要删除采购日期为()的记录吗', null, async () => {
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

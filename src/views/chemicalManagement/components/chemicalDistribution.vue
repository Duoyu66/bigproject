<template>
  <el-dialog title="a" :visible.sync="dialogFormVisible">
    <div slot="title" class="dialog-title">
      <el-button class="normal">统一分配</el-button>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按照化学品名称搜索" prefix-icon="el-icon-search" />
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list1" class="distribution_table" :header-cell-style="{background:'#e8f0ff' }"  highlight-current-row>
      <el-table-column
            type="selection"
            width="55">
          </el-table-column>
      <el-table-column show-overflow-tooltip property="number" label="品种管理编号" ></el-table-column>
          <el-table-column show-overflow-tooltip property="name" label="化学品名称" ></el-table-column>
          <el-table-column show-overflow-tooltip property="type" label="化学品规格型号"></el-table-column>
          <el-table-column show-overflow-tooltip property="unit" label="计量单位" ></el-table-column>
              <el-table-column show-overflow-tooltip property="boolean" label="是否分配" ></el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <el-button class="normal">分配</el-button>
            <el-button class="danger">取消</el-button>
          </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {

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
        list1:[],
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
      }
    },
    created() {
      this.fetchData()
    },

    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },

      async fetchData() {
        this.listLoading = true
        const {
          data,
          totalCount
        } = await (this.queryForm)
        this.list1 = [{"number":"10010","name":"盐酸","type":"无","unit":"ml","boolean":"是"},
        {"number":"10011","name":"硫酸","type":"无","unit":"ml","boolean":"否"},
        {"number":"10012","name":"铝","type":"无","unit":"g","boolean":"否"},
        {"number":"10013","name":"钠","type":"无","unit":"g","boolean":"是"},
        {"number":"10014","name":"铜","type":"无","unit":"g","boolean":"否"},
        {"number":"10015","name":"氯化钠溶液","type":"无","unit":"ml","boolean":"是"}]

        const imageList = []

        this.imageList = imageList
        this.total = totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },

    },
  }
</script>

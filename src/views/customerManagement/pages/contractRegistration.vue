<template>
  <div class=" definition purchase contract equipment_btn">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="合同登记" name="first">
        <div class="usage">
          <MangementForm ref="MangementForm"></MangementForm>
          <div>
            <el-button class="purchase_btn" type="primary" @click="MangementFormAdd()">确 定</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同台账" name="second">
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%; display: flex; justify-content: flex-end;">
            <div class="block">
              <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="以开始日期"
                end-placeholder="结束日期搜索">
              </el-date-picker>
            </div>
            <div class="block">
              <el-date-picker v-model="value2" type="date" placeholder="以签订日期搜索">
              </el-date-picker>
            </div>
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item style=" margin: 0;">
                <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="以合同名称搜索" prefix-icon="el-icon-search" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
          highlight-current-row :height=table.tableHeight @selection-change="setSelectRows" @sort-change="tableSortChange"
          :header-cell-style="{background:'#e8f0ff' }">
          <el-table-column show-overflow-tooltip label="合同编号" prop="number"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="合同名称"></el-table-column>
          <el-table-column show-overflow-tooltip label="合同类型" prop="type"></el-table-column>
          <el-table-column show-overflow-tooltip label="签订日期" prop="date1"></el-table-column>
          <el-table-column show-overflow-tooltip prop="date2" label="有效开始"></el-table-column>
          <el-table-column show-overflow-tooltip label="有效结束" prop="date3"></el-table-column>
          <el-table-column show-overflow-tooltip label="关键词" prop="limit"></el-table-column>
          <el-table-column show-overflow-tooltip label="支付方式" prop="rebate"></el-table-column>
          <el-table-column show-overflow-tooltip label="合同扫描件" prop="money"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="100px">
            <template #default="{ row }">
              <el-dropdown trigger="click" placement="left-start">
                <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                <el-dropdown-menu slot="dropdown" class="more">
                  <el-button @click="handleAdd">修改</el-button>
                  <el-button @click="dialogFormVisible = true">详情</el-button>
                  <el-button @click="handleDelete(row)">删除</el-button>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
          :total="total"></el-pagination>
        <table-edit5 ref="edit5"></table-edit5>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
  import TableEdit5 from '../components/contractManagement.vue'
  import MangementForm from '../form/MangementForm.vue'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit5,
      MangementForm,
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
        activeName: 'first',
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
        value1: '',
        value2: '',
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
    beforeDestroy() {},
    mounted: function() {
      this.$nextTick(function() {
        let exceptHeight = 245;
        // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
        //tableSort为table中ref的值
        if (this.$refs.tableSort.$el) {
          this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
        }

        // 监听窗口大小变化
        let that = this;
        window.onresize = function() {
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
      handleAdd5() {
        this.$refs['edit5'].showEdit5()
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
        this.list = [{
            "number": "1001",
            "name": "甲乙买卖合同",
            "type": "买卖合同",
            "date1": "2020-01-2",
            "limit": "/",
            "date2": "2020-02-06",
            "date3": "2020-06-06",
            "rebate": "现付",
            money: "甲乙合同扫描件"
          },
          {
            "number": "1005",
            "name": "丙丁运输合同",
            "type": "运输合同",
            "date1": "2020-01-2",
            "limit": "/",
            "date2": "2020-02-06",
            "date3": "2020-03-06",
            "rebate": "预付",
            money: "丙丁合同扫描件"
          },
          {
            "number": "1086",
            "name": "甲乙劳务合同",
            "type": "劳务合同",
            "date1": "2020-01-2",
            "limit": "/",
            "date2": "2020-08-06",
            "date3": "2020-10-08",
            "rebate": "年结",
            money: "甲乙合同扫描件"
          },
          {
            "number": "1023",
            "name": "丙丁技术合同",
            "type": "技术合同",
            "date1": "2020-01-2",
            "limit": "/",
            "date2": "2020-12-26",
            "date3": "2021-06-06",
            "rebate": "月结",
            money: "丙丁合同扫描件"
          }
        ]
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

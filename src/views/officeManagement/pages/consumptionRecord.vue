<template>

  <div class="table-container definition purchase equipment">

    <vab-query-form style="margin-bottom: 15px;">
      <vab-query-form-left-panel style="width: 215px;" class="consumption">
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item style="margin: 0;">
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="以客户名称搜索" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel class="record" style="padding-left: 20px; width: calc(100% - 230px);">
        <span style="margin-right: 10px;">日期</span>
         <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-container>
      <el-aside  style="width: 215px;">
        <el-table ref="tableSort" v-loading="listLoading" :data="list1" border :element-loading-text="elementLoadingText" highlight-current-row
          :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
          <el-table-column show-overflow-tooltip label="客户名称" prop="author" ></el-table-column>
        </el-table>
      </el-aside>
      <el-main >
        <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText" highlight-current-row
          :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
          <el-table-column show-overflow-tooltip label="委托编号" prop="number" ></el-table-column>
          <el-table-column show-overflow-tooltip label="报告编号" prop="number1" ></el-table-column>
          <el-table-column show-overflow-tooltip prop="center" label="应付金额"></el-table-column>
          <el-table-column show-overflow-tooltip prop="center1" label="折扣金额"></el-table-column>
          <el-table-column show-overflow-tooltip prop="center2" label="实付金额"></el-table-column>
          <el-table-column show-overflow-tooltip label="消费时间" prop="date" ></el-table-column>
          <el-table-column show-overflow-tooltip prop="center3" label="付款方式"></el-table-column>
        </el-table>
        <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
          :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
        <table-edit ref="edit"></table-edit>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
  import TableEdit from '../components/consumptionRecord.vue'
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
        value1: '',
        value2: '',
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
        formLabelWidth: '120px',
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
    		let exceptHeight = 195;
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
      handleAdd() {
        this.$refs['edit'].showEdit()
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
        this.list = [{"date":"2020-11-12","center":"580","number":"10001","number1":"20001","center1":"100",
        "center2":"480","center3":"银行卡转账"},
        {"date":"2020-10-18","center":"1700","number":"10002","number1":"20002","center1":"2000",
        "center2":"1500","center3":"现金"},
        {"date":"2020-11-28","center":"2800","number":"10003","number1":"20003","center1":"1000",
        "center2":"1800","center3":"银行卡转账"},
        {"date":"2020-01-15","center":"12000","number":"10004","number1":"20004","center1":"2000",
        "center2":"10000","center3":"银行卡转账"}]
        this.list1=[{"author":"李星云","money":"15698"},
        {"author":"张子凡","money":"685"},
        {"author":"胡雨佳","money":"1230"},
        {"author":"贺君天","money":"680"}]
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

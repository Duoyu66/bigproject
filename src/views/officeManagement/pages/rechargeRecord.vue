<template>
  <div class="table-container definition purchase equipment">

    <vab-query-form style="margin-bottom: 15px;">
      <vab-query-form-left-panel style="width: 300px;" class="consumption">
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item style="margin: 0;">
            <el-input style="border-radius: 30px; width: 300px;" v-model="queryForm.title" placeholder="以客户名称搜索" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>

    </vab-query-form>

    <el-container>
      <el-aside  style="width: 300px;">
        <el-table ref="tableSort" v-loading="listLoading" :data="list1" border :element-loading-text="elementLoadingText" highlight-current-row
          :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
          <el-table-column show-overflow-tooltip label="客户名称" prop="author" ></el-table-column>
          <el-table-column show-overflow-tooltip label="账户余额" prop="money"></el-table-column>
        </el-table>
      </el-aside>
      <el-main >
        <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText" highlight-current-row
          :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">

          <el-table-column show-overflow-tooltip label="充值时间" prop="date" min-width="30%"></el-table-column>
          <el-table-column show-overflow-tooltip label="充值方式" prop="center" min-width="20%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="center" label="充值金额" min-width="20%"></el-table-column>
                    <el-table-column show-overflow-tooltip label="登记人员" prop="number" min-width="20%"></el-table-column>
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
  import TableEdit from '../components/rechargeRecord.vue'
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

        this.list = [{"date":"2020-11-12","center":"580","number":"王名扬","center":"微信收款"},
        {"date":"2020-11-13","center":"770","number":"王兰乐","center":"银行卡转账"},
        {"date":"2020-11-14","center":"1250","number":"张华斌","center":"现金交易"},
        {"date":"2020-11-15","center":"686","number":"闫旭阳","center":"支付宝收款"}]
        this.list1=[{"author":"李星云","money":"15698"},
        {"author":"张子凡","money":"685"},
        {"author":"胡雨佳","money":"1230"},
        {"author":"贺君天","money":"888"}]
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

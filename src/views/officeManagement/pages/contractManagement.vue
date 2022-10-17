<template>

  <div class="table-container definition purchase contract">
    <vab-query-form>
      <vab-query-form-left-panel style="width: 10%;">
        <el-button type="primary" @click="handleAdd">
          添加合同
        </el-button>

      </vab-query-form-left-panel>
      <vab-query-form-right-panel style="width: 90%; display: flex; justify-content: flex-end;">
        <div class="block">
            <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="以开始日期"
              end-placeholder="结束日期搜索">
            </el-date-picker>
          </div>
          <div class="block">
              <el-date-picker
                v-model="value2"
                type="date"
                placeholder="以签订日期搜索">
              </el-date-picker>
            </div>
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item style=" margin: 0;">
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="以合同名称搜索" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
<el-container style="height: calc(100vh - 46px - 164px);">
      <el-main style="height: calc(55%); min-height: 275px;" class="box1">
    <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText" highlight-current-row
      height="calc(80%)" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
      <el-table-column show-overflow-tooltip label="合同编号" prop="number"></el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="合同名称"></el-table-column>
      <el-table-column show-overflow-tooltip label="合同类型" prop="type"></el-table-column>
      <el-table-column show-overflow-tooltip label="签订日期" prop="date1"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date2" label="开始日期"></el-table-column>
      <el-table-column show-overflow-tooltip label="结束日期" prop="date3"></el-table-column>
      <el-table-column show-overflow-tooltip label="合同状态" prop="state"></el-table-column>
      <el-table-column show-overflow-tooltip label="服务项目" prop="project"></el-table-column>
      <el-table-column show-overflow-tooltip label="信用额度" prop="limit"></el-table-column>
      <el-table-column show-overflow-tooltip label="支付方式" prop="rebate"></el-table-column>
      <el-table-column show-overflow-tooltip label="账户余额" prop="money"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="100px">
        <template #default="{ row }">
              <el-dropdown trigger="click" placement="left-start">
                <!-- <span class="el-dropdown-link">
                  下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span> -->
                <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                <el-dropdown-menu slot="dropdown" class="more" >
                  <el-button @click="dialogFormVisible = true">修改</el-button>
                  <el-button @click="dialogFormVisible = true">详情</el-button>
                  <el-button @click="handleDelete(row)">删除</el-button>
                </el-dropdown-menu>
              </el-dropdown>

        </template>

      </el-table-column>
    </el-table>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
      :total="total"></el-pagination>
    <table-edit ref="edit"></table-edit>
    </el-main>
      <el-footer style="height: calc(44%); min-height: 218px;" class="sealedger" >
        <div>
        <div style="border-bottom: 1px solid; height: 5px;"></div>
        <div style="position: relative; top: -9px; left: 35px;">折扣明细</div></div>
              <el-table ref="tableSort" v-loading="listLoading" :data="list1" border :element-loading-text="elementLoadingText" highlight-current-row
                style="height: calc(100% - 30px);"  @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
                <el-table-column show-overflow-tooltip label="试验" prop="test"></el-table-column>
                <el-table-column show-overflow-tooltip prop="parameter" label="参数"></el-table-column>
                <el-table-column show-overflow-tooltip label="价格" prop="price"></el-table-column>
                <el-table-column show-overflow-tooltip label="折扣" prop="discount"></el-table-column>
              </el-table>

      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
  import TableEdit from '../components/contractManagement.vue'
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
        value1:'',
        value2:'',
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
        this.list = [{"number":"1001","name":"合同1","type":"普通合同","date1":"2020-01-2","limit":"5000",
        "date2":"2020-02-06","date3":"2020-06-06","state":"有效","project":"项目a","rebate":"银行卡转账","money":"120000"},
        {"number":"1005","name":"合同2","type":"普通合同","date1":"2020-01-2","limit":"50000",
        "date2":"2020-02-06","date3":"2020-03-06","state":"过期","project":"项目a","rebate":"现金支付","money":"88800"},
        {"number":"1086","name":"合同3","type":"普通合同","date1":"2020-01-2","limit":"76000",
        "date2":"2020-08-06","date3":"2020-10-08","state":"有效","project":"项目a","rebate":"微信收款","money":"65800"},
        {"number":"1023","name":"合同4","type":"普通合同","date1":"2020-01-2","limit":"85000",
        "date2":"2020-12-26","date3":"2021-06-06","state":"有效","project":"项目a","rebate":"支付宝收款","money":"230000"}]
        this.list1= [{"test":"测试试验1","parameter":"测试输出","price":"15000","discount":"0.8"},
        {"test":"测试试验2","parameter":"测试输出","price":"18000","discount":"0.5"},
        {"test":"测试试验3","parameter":"测试输出","price":"26000","discount":"0.95"},
        {"test":"测试试验4","parameter":"测试输出","price":"75360","discount":"0.7"}]
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

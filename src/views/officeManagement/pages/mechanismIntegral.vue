<template>
  <div class="table-container definition purchase equipment baseBox">
    <vab-query-form class="personallntegral" >
      <vab-query-form-right-panel style="width: 100%;">
        <span class="definition_txt">开始时间</span> <el-date-picker
            v-model="value1"
            type="date"
            :picker-options="{
              selectableRange: ''
            }"
            placeholder="任意时间点"
            >
          </el-date-picker>
          <span class="definition_txt">结束时间</span> <el-date-picker
            arrow-control
            type="date"
            v-model="value2"
            :picker-options="{
              selectableRange: ''
            }"
            placeholder="任意时间点">
          </el-date-picker>

        <el-button type="primary" style="margin-left: 10px;" >搜索</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-container style="height: calc(100vh - 204px);" >
      <el-header class="integral">
        <el-row>
          <el-col :span="12">机构积分</el-col>
          <el-col :span="12">30</el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText" highlight-current-row
           :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
          <el-table-column show-overflow-tooltip label="积分日期" prop="date"></el-table-column>
          <el-table-column show-overflow-tooltip prop="center" label="积分增减内容"></el-table-column>
          <el-table-column show-overflow-tooltip label="积分增减数量" prop="number"></el-table-column>
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
        activeIndex: '1',
        value1:'',
        value2:'',
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
    		let exceptHeight = 205;
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
       handleSelect(key, keyPath) {
              console.log(key, keyPath);
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
        this.list =[{"date":"2020-08-02","center":"积分增减内容1","number":"积分增减数量1"},
        {"date":"2020-06-12","center":"积分增减内容2","number":"积分增减数量2"},
        {"date":"2020-08-22","center":"积分增减内容3","number":"积分增减数量3"},
        {"date":"2020-08-15","center":"积分增减内容4","number":"积分增减数量4"}]
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
<style type="text/css">
  .el-header {padding: 0!important;height:40px!important;}
</style>

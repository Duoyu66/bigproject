<template>
  <div class="table-container definition purchase ">
    <el-tabs v-model="activeName" class="register customer" @tab-click="handleClick">
          <el-tab-pane label="客户登记" name="first">
            <el-button type="primary" class="btn">添加</el-button>
              <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText" highlight-current-row
                :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
                <el-table-column show-overflow-tooltip label="客户名称" prop="name"></el-table-column>
                <el-table-column show-overflow-tooltip prop="address" label="地址"></el-table-column>
                <el-table-column show-overflow-tooltip label="邮编" prop="number"></el-table-column>
                <el-table-column show-overflow-tooltip label="开户行" prop="bank"></el-table-column>
                <el-table-column show-overflow-tooltip prop="number1" label="账号"></el-table-column>
                <el-table-column show-overflow-tooltip label="税号" prop="number2"></el-table-column>
                <el-table-column show-overflow-tooltip label="联系人" prop="name1"></el-table-column>
                <el-table-column show-overflow-tooltip label="联系电话" prop="number3"></el-table-column>
                <el-table-column show-overflow-tooltip label="营业执照复印件" prop="paper"></el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="180px">
                  <template #default="{ row }">
                    <el-button type="primary" class="normal" @click="handleAdd">修改</el-button>
                    <el-button @click="handleDelete(row)" class="danger" >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
                :total="total"></el-pagination>
              <table-edit ref="edit"></table-edit>
          </el-tab-pane>
          <el-tab-pane label="购入台账" name="second">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-table ref="tableSort" v-loading="listLoading" :data="list1" border :element-loading-text="elementLoadingText" highlight-current-row
                  :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
                  <el-table-column show-overflow-tooltip label="客户" prop="name"></el-table-column>
                </el-table>
              </el-col>
              <el-col :span="16">
                <el-table ref="tableSort" v-loading="listLoading" :data="list2" border :element-loading-text="elementLoadingText" highlight-current-row
                  :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
                  <el-table-column show-overflow-tooltip label="合同" prop="contract"></el-table-column>
                  <el-table-column show-overflow-tooltip label="充值记录" prop="topup"></el-table-column>
                  <el-table-column show-overflow-tooltip label="消费记录" prop="consume"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
        </el-tab-pane>
      </el-tabs>
      <table-edit1 ref="edit1"></table-edit1>
      <table-edit ref="edit"></table-edit>
    </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
  import TableEdit from '../components/clientManagement.vue'
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
        activeName: 'second',
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
        form: {
          value1: '',
          norms:'cj',
          name: 'rygz',
          region: 'g',
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
    		let exceptHeight = 280;
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
      handleClick(tab, event) {
        console.log(tab, event);
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
        this.list = [{name:"张子凡",address:"天津武清区",number:"074400",bank:"中国建设银行",number1:"0000 0000 0000 032",
        number2:"320500123456789",name1:"李星云",number3:"12345678999",paper:"复印件一"},
        {name:"闫旭阳",address:"江苏南昌",number:"074450",bank:"中国银行",number1:"0660 0000 0000 032",
        number2:"123450123456789",name1:"贺君天",number3:"12666678999",paper:"复印件二"},
        {name:"胡雨佳",address:"河南洛阳",number:"174460",bank:"中国民生银行",number1:"0000 8800 0000 032",
        number2:"320500123466666",name1:"郭宏建",number3:"12388878999",paper:"复印件三"}]
        this.list1 = [{name:"王名扬"},{name:"张华斌"},{name:"杨万"},{name:"刘爽"}]
        this.list2 = [{contract:"合同一",topup:"6000",consume:"700"},
        {contract:"合同二",topup:"8000",consume:"2000"},
        {contract:"合同三",topup:"5000",consume:"1000"},
        {contract:"合同四",topup:"300",consume:"100"}]
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

<template>

  <div class="table-container definition">
    <vab-query-form style="margin-bottom: 11px;" class="personallntegral">
      <vab-query-form-left-panel style="width: 100%;" >
        <el-button type="primary" @click="handleAdd">添加</el-button>

           <span class="definition_txt">客户名称</span> <el-input v-model="form.name" style="width: 150px;" ></el-input>
            <span class="definition_txt">收款开始时间</span> <el-date-picker
                v-model="value1"
                type="date"
                :picker-options="{
                  selectableRange: ''
                }"
                placeholder="任意时间点"
                >
              </el-date-picker>
              <span class="definition_txt">收款结束时间</span> <el-date-picker
                arrow-control
                type="date"
                v-model="value2"
                :picker-options="{
                  selectableRange: ''
                }"
                placeholder="任意时间点">
              </el-date-picker>
      </vab-query-form-left-panel>


    </vab-query-form>

          <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list" border :header-cell-style="{background:'#e8f0ff' }"
            :element-loading-text="elementLoadingText" :height="table.tableHeight1" @selection-change="setSelectRows" @sort-change="tableSortChange">
            <el-table-column show-overflow-tooltip label="客户名称" prop="name" ></el-table-column>
            <el-table-column show-overflow-tooltip label="合同编号" prop="number" ></el-table-column>
            <el-table-column show-overflow-tooltip label="收款金额" prop="price1" ></el-table-column>
            <el-table-column show-overflow-tooltip label="收款时间" prop="date" ></el-table-column>
            <el-table-column show-overflow-tooltip label="剩余尾款" prop="price2" ></el-table-column>
            <el-table-column show-overflow-tooltip label="收款类型" prop="type" ></el-table-column>
            <el-table-column show-overflow-tooltip label="收款方式" prop="mode" ></el-table-column>
            <el-table-column show-overflow-tooltip label="操作">
              <el-button class="normal" @click="dialogFormVisible = true">修改</el-button>
              <el-button class="danger">取消</el-button>
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
  import TableEdit from '../components/collectionRecord.vue'
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
        value1: new Date(),
        value2: new Date(),
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
        	tableHeight: this.$(window).height(),
          tableHeight1: this.$(window).height()
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
    		let exceptHeight = 210;
        let exceptHeight1 = 200;
    		// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
    		//tableSort为table中ref的值
    		if (this.$refs.tableSort.$el) {
    			this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
          this.table.tableHeight1 = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight1;
    		}

    		// 监听窗口大小变化
    		let that = this;
    		window.onresize = function() {
    			if (that.$refs.tableSort.$el) {
    				that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight;
            that.table.tableHeight1 = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight1;
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
        this.list = [{"name":"胡元吉","number":"120001","price1":"160000","date":"2020-01-02","price2":"80000","type":"公司汇款","mode":"银行卡转账"},
        {"name":"贺君天","number":"120002","price1":"152300","date":"2020-05-02","price2":"863300","type":"个人汇款","mode":"银行卡转账"},
        {"name":"闫旭阳","number":"120003","price1":"164300","date":"2020-07-02","price2":"85400","type":"公司汇款","mode":"现金"},
        {"name":"张子凡","number":"120004","price1":"460000","date":"2020-01-25","price2":"800000","type":"公司汇款","mode":"银行卡转账"}]
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

<template>

 <div class=" definition purchase equipment_btn">
   <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" class="box_center">
          <el-tab-pane label="添加消费" name="first" class="buy center">
              <div class="usage">
                <ConsumeForm ref="ConsumeForm"></ConsumeForm>
                <div>
                  <el-button class="purchase_btn" type="primary">确 定</el-button>
                </div>
              </div>
          </el-tab-pane>
          <el-tab-pane label="消费记录" name="second">
            <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText" highlight-current-row
            :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
            <el-table-column show-overflow-tooltip label="消费单位" prop="number" ></el-table-column>
            <el-table-column show-overflow-tooltip label="选择试验" prop="date" ></el-table-column>
            <el-table-column show-overflow-tooltip label="消费金额" prop="price1" ></el-table-column>
            <el-table-column show-overflow-tooltip label="显示经手人" prop="name" ></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="180px">
            <template #default="{ row }">
                <el-button type="primary" class="normal" @click="handleAdd4">修改</el-button>
                <el-button @click="handleDelete(row)" class="danger" >删除</el-button>
            </template>
          </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <table-edit4 ref="edit4"></table-edit4>
  </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
  import TableEdit4 from '../components/consumptionRecord1.vue'
  import ConsumeForm from '../form/ConsumeForm.vue'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit4,
      ConsumeForm,
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
        value1: new Date(),
        value2: new Date(),
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
        },
        dialogFormVisible: false,
        form: {
          name: 'a',
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
    		let exceptHeight = 230;
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
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleAdd4() {
        this.$refs['edit4'].showEdit4()
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
        this.list = [{"name":"胡元吉","number":"二工区-二工区试验室","price1":"160000","date":"减水剂试验"},
        {"name":"贺君天","number":"三工区-三工区试验室","price1":"152300","date":"混凝土抗压试验"},
        {"name":"闫旭阳","number":"二工区-二工区试验室","price1":"164300","date":"水泥试验"},
        {"name":"张子凡","number":"三工区-三工区试验室","price1":"460000","date":"液体速凝剂试验"}]
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

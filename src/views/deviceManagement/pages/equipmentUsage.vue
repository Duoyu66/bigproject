<template>
  <div class="table-container definition purchase period equipment calc cailbration">
    <!-- <el-tabs type="border-card" class="box_center"> -->
      <!-- <el-tab-pane label="添加设备使用映射" class="center">
        <div  class="usage">
          <UsageFrom  ref="UsageFrom"></UsageFrom>
        	<div >
        		<el-button class="purchase_btn" type="primary" @click="UsageFromAdd()">确 定</el-button>
        	</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备使用映射"> -->
        <vab-query-form style="margin-bottom: 6px;">
          <vab-query-form-left-panel style="width: 230px;">
            <el-button type="primary">添加参数</el-button>
            <el-input prefix-icon="el-icon-search" style="width: 139px;" placeholder="按参数名称搜索"></el-input>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel class="around" style="padding: 0px 20px; width: calc(100% - 230px);">
            <el-button type="primary" @click="handleAdd1">添加设备</el-button>
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item>
                <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按设备类型名称搜索" prefix-icon="el-icon-search" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-container>
          <el-aside width="230px" >
            <el-table  ref="tableSort" v-loading="listLoading" :data="list1" border :element-loading-text="elementLoadingText"
                      :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" row-key="id"
                    :header-cell-style="{background:'#e8f0ff','text-align':'left'}" highlight-current-row :cell-style="{'text-align':'left'}" >
              <el-table-column show-overflow-tooltip label="参数类型名称" prop="date"></el-table-column>

            </el-table>
          </el-aside>
          <el-main>
            <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
              :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
              <el-table-column show-overflow-tooltip label="管理编号" prop="number"></el-table-column>
              <el-table-column show-overflow-tooltip label="设备名称" prop="name"></el-table-column>
              <el-table-column show-overflow-tooltip prop="describe" label="使用规范"></el-table-column>
              <el-table-column show-overflow-tooltip prop="num1" label="测量范围"></el-table-column>
              <el-table-column show-overflow-tooltip prop="num2" label="精度"></el-table-column>
              <el-table-column show-overflow-tooltip prop="boolean" label="是否使用"></el-table-column>
              <el-table-column show-overflow-tooltip label="操作" width="116px">
                <template #default="{ row }">
                  <el-button type="primary" class="normal" @click="handleAdd">修改</el-button>
                  <el-button @click="handleDelete(row)" class="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
              :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            <table-edit ref="edit"></table-edit>
            <table-edit1 ref="edit1"></table-edit1>
          </el-main>
        </el-container>
      <!-- </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
  import TableEdit from '../components/equipmentUsage.vue'
  import TableEdit1 from '../components/usageadd.vue'
  import UsageFrom from '../form/equipmentUsage.vue'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
      TableEdit1,
      UsageFrom,
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
    		let exceptHeight = 320;
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
      UsageFromAdd(){
      	console.log(this.$refs['UsageFrom'].form);
      },
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
      handleAdd1() {
        this.$refs['edit1'].showEdit1()
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
        this.list = [{"name":"路面材料强度试验仪","describe":"无",boolean:"是",number:"GX-16",num1:"/",num2:'0.01'},
        {"name":"震击式标准振筛机","describe":"无",boolean:"否",number:"GX-36",num1:"/",num2:'0.001'},
        {"name":"电子天平","describe":"左物右码",boolean:"否",number:"GX-86",num1:"质量",num2:'0.001'},
        {"name":"全自动控温控湿设备","describe":"无",boolean:"是",number:"GX-05",num1:"温度和湿度",num2:'0.1'}]
        this.list1 = [{
        id: 1,
       date: '原材料',
      children: [{
       id: 31,
       date: '水泥试验',
     }, {
      id: 32,
      date: '粗骨科',
    }],
    }]
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

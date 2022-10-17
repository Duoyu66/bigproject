<template>
  <!-- 监管机构 -->
  <div class="table-container definition purchase baseBox" style="margin-right:10px;overflow: auto;">
    <vab-query-form>
      <vab-query-form-left-panel style="float:left;width:200px;">
        <el-button type="primary" style="margin-right:10px!important;">展开全部</el-button>
        <el-button type="primary">折叠全部</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel style="width:215px;float:right;">
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按试验项目名称搜索" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"
     @selection-change="setSelectRows" @sort-change="tableSortChange" row-key="id" style="height: calc(64vh);"
    :header-cell-style="{background:'#e8f0ff','text-align':'left'}" highlight-current-row :cell-style="{'text-align':'left'}" >
      <el-table-column show-overflow-tooltip label="机构名称" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip prop="number1" label="机构编号"></el-table-column>
      <el-table-column show-overflow-tooltip label="父机构标编号" prop="number2"></el-table-column>
      <el-table-column show-overflow-tooltip label="机构类型" prop="type"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="100px">
        <template #default="{ row }">
              <el-dropdown trigger="click" placement="left-start">
                <!-- <span class="el-dropdown-link">
                  下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span> -->
                <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                <el-dropdown-menu slot="dropdown" class="more" >
                  <el-button @click="handleAdd">添加同级机构</el-button>
                  <el-button @click="handleAdd">添加子机构</el-button>
                  <el-button>修改机构</el-button>
                  <el-button>删除机构</el-button>
                  <el-button>机构详情</el-button>
                </el-dropdown-menu>
              </el-dropdown>

        </template>

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
  import TableEdit from '../components/regulatoryBody.vue'
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
        this.list = [{id:1,"name":"试验机构一分部","number1":"100001","number2":"0001","type":"工程局",
        children:[{id:11,name:"监管机构1",number1:"20001",number2:"201",type:"工程局"}], },
        {id:2,"name":"试验机构物资部","number1":"100002","number2":"0001","type":"工程局"},
        {id:3,"name":"试验机构总部","number1":"100005","number2":"0006","type":"线路"},
        {id:4,"name":"试验机构二分部","number1":"100008","number2":"0009","type":"物资部"}]
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

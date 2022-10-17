<template>
  <div class="definition">
   <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
     <el-tab-pane label="添加维护保养记录" name='first'>
        <div  class="usage" >
          <MaintenanceForm  ref="MaintenanceForm"></MaintenanceForm>
        	<div >
        		<el-button class="purchase_btn" type="primary" @click="MaintenanceFormAdd()">确 定</el-button>
        	</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="维护保养记录" name='second'>
    <vab-query-form>
      <vab-query-form-right-panel style="width: 100%;">
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按设备名称查询" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText" highlight-current-row
      :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
      <el-table-column show-overflow-tooltip label="管理编号" prop="number"></el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="设备名称"></el-table-column>
      <el-table-column show-overflow-tooltip label="规格型号" prop="type"></el-table-column>
      <el-table-column show-overflow-tooltip label="维护日期" prop="date"></el-table-column>
      <el-table-column show-overflow-tooltip prop="step" label="维护措施"></el-table-column>
      <el-table-column show-overflow-tooltip label="维护效果" prop="effect"></el-table-column>
      <el-table-column show-overflow-tooltip label="维护人" prop="people1"></el-table-column>
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
    </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
  import TableEdit from '../components/Maintenance.vue'
  import treeData from './../../vab/tree/index'
  import MaintenanceForm from '../form/MaintenanceForm.vue'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
      MaintenanceForm,
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
    		let exceptHeight = 300;
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
      handleClick(tab, event) {
        console.log(tab, event);
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
       this.list = [{"number":"GX-10","name":"电子天平","type":"无","date":"2020-11-20",
       "people1":"贺君天","effect":"维护失败","step":"正常维护"},
       {"number":"GX-25","name":"千分尺","type":"无","date":"2020-10-20",
       "people1":"王名扬","effect":"维护成功","step":"正常维护"},
       {"number":"GX-08","name":"温湿度检测仪","type":"无","date":"2020-08-20",
       "people1":"王兰乐","effect":"维护成功","step":"正常维护"},
       {"number":"GX-66","name":"显微镜","type":"无","date":"2020-11-28",
       "people1":"张子凡","effect":"维护成功","step":"正常维护"}]
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

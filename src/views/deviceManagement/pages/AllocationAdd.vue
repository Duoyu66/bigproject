<template>
  <div class="definition equipment_btn">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="添加设备调拨记录" name='first'>
        <div class="usage">
          <AllocationForm ref="AllocationForm"></AllocationForm>
          <div>
            <el-button class="purchase_btn" type="primary" @click="AllocationFormAdd()">确 定</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备调拨记录" name='second'>
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%;">
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item>
                <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按设备名称搜索" prefix-icon="el-icon-search" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText" highlight-current-row
      :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
          <el-table-column show-overflow-tooltip label="管理编号" prop="number"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="设备名称"></el-table-column>
          <el-table-column show-overflow-tooltip label="规格型号" prop="type"></el-table-column>
          <el-table-column show-overflow-tooltip prop="institution1" label="起始机构"></el-table-column>
          <el-table-column show-overflow-tooltip label="起始经手人" prop="people1"></el-table-column>
          <el-table-column show-overflow-tooltip label="目标机构" prop="institution2"></el-table-column>
          <el-table-column show-overflow-tooltip label="目标经手人" prop="people2"></el-table-column>
          <el-table-column show-overflow-tooltip label="调拨原因" prop="reason"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="100px">
            <template #default="{ row }">
              <el-dropdown trigger="click" placement="left-start">
                <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                <el-dropdown-menu slot="dropdown" class="more">
                  <el-button @click="handleAdd">修改记录</el-button>
                  <el-button >删除记录</el-button>
                  <el-button>调拨详情</el-button>
                </el-dropdown-menu>
              </el-dropdown>
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
  import TableEdit from '../components/equipmentAllocation.vue'
  import AllocationForm from '../form/AllocationForm.vue'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
      AllocationForm,
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
          number: ''
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
        this.list = [{
            "number": "GX-05",
            "name": "显微镜",
            "type": "无",
            "institution1": "中铁十一局集团-第四工程有限公司-母体试验室",
            "people1": "张子凡",
            "institution2": "广汕铁路-GSSG6标项目经理部-1#站检测组",
            "people2": "李星云",
            "reason": "调拨测试"
          },
          {
            "number": "GX-18",
            "name": "温湿度检测仪",
            "type": "无",
            "institution1": "中铁十一局集团-第四工程有限公司-母体试验室",
            "people1": "贺君天",
            "institution2": "广汕铁路-二工区-二工区试验室",
            "people2": "王名扬",
            "reason": "调拨测试"
          },
          {
            "number": "GX-33",
            "name": "电子天平",
            "type": "无",
            "institution1": "中铁十一局集团-第四工程有限公司-母体试验室",
            "people1": "胡雨佳",
            "institution2": "广汕铁路-三工区-三工区试验室",
            "people2": "闫旭阳",
            "reason": "调拨测试"
          },
          {
            "number": "GX-13",
            "name": "电子天平",
            "type": "无",
            "institution1": "中铁十一局集团-第四工程有限公司-母体试验室",
            "people1": "张华斌",
            "institution2": "广汕铁路-四工区-四工区试验室",
            "people2": "王兰乐",
            "reason": "调拨测试"
          }
        ]
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

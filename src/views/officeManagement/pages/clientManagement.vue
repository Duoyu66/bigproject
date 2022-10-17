<template>

  <div class="table-container definition purchase">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleAdd">
          添加客户
        </el-button>

      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按客户名称品名称搜索" prefix-icon="el-icon-search" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText" highlight-current-row
      :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
      <el-table-column show-overflow-tooltip label="客户名称" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip prop="address" label="客户地址"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="tel"></el-table-column>
      <el-table-column show-overflow-tooltip label="邮编" prop="zipcode"></el-table-column>
      <el-table-column show-overflow-tooltip prop="code" label="社会统一信用代号"></el-table-column>
      <el-table-column show-overflow-tooltip label="开户行" prop="bank"></el-table-column>
      <el-table-column show-overflow-tooltip label="银行账号" prop="accounts"></el-table-column>
      <el-table-column show-overflow-tooltip label="客户级别" prop="level"></el-table-column>
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
      :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
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
        this.list = [{"name":"李星云","address":"河北保定","tel":"15032277658","zipcode":"0001",
        "code":"023","bank":"中国建设银行","accounts":"**** **** **** **** 287","level":"二级用户"},
        {"name":"张子凡","address":"天津","tel":"15066666666","zipcode":"0001",
        "code":"077","bank":"中国民生银行","accounts":"**** **** **** **** 024","level":"五级用户"},
        {"name":"闫旭阳","address":"河北邢台","tel":"15088888888","zipcode":"0001",
        "code":"088","bank":"中国交通银行","accounts":"**** **** **** **** 663","level":"一级用户"},
        {"name":"王名扬","address":"河北承德","tel":"15000000000","zipcode":"0001",
        "code":"026","bank":"中国邮政银行","accounts":"**** **** **** **** 455","level":"二级用户"},]
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

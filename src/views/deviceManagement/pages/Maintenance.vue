<template>
  <div class="definition equipment_btn calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="添加维护保养记录" class="center">
        <div class="usage">
          <MaintenanceForm ref="MaintenanceForm" @transferTable="transferTable"></MaintenanceForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="MaintenanceFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="维护保养记录">
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%">
            <el-form
              ref="form"
              :model="queryForm"
              :inline="true"
              @submit.native.prevent
            >
              <el-form-item style="padding-right: 10px;">
                <el-input
                  style="border-radius: 30px"
                  v-model="queryForm.device_name"
                  placeholder="按设备名称搜索"
                >
                </el-input>
              </el-form-item>
              <el-form-item style="padding-right: 10px;">
                <el-input
                  style="border-radius: 30px"
                  v-model="queryForm.manage_pid"
                  placeholder="按管理编号搜索"
                >
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchbutton"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :data="list"
          border
          :element-loading-text="elementLoadingText"
          highlight-current-row
          :height="table.tableHeight"
          @selection-change="setSelectRows"
          @sort-change="tableSortChange"
          :header-cell-style="{ background: '#e8f0ff' }"
        >
          <el-table-column
            show-overflow-tooltip
            label="管理编号"
            prop="manage_pid"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="device_name"
            label="设备名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="规格型号"
            prop="model"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="scope"
            label="测量范围"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="precision"
            label="精度"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="维护日期"
            prop="maintain_date"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="maintain_content"
            label="维护措施"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="维护效果"
            prop="result"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="维护人"
            prop="charge_person"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="116px">
            <template #default="{ row }">
              <el-button
                type="primary"
                class="normal"
                @click="handleEdit(row)"
              >
                修改
              </el-button>
              <el-button @click="handleDelete(row)" class="danger">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :background="background"
          :current-page="queryForm.pageNo"
          :layout="layout"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
        <MaintenanceEdit ref="MaintenanceEdit" @fetchData="fetchData"></MaintenanceEdit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
	import {
		doEdit,
    ExecSql,
    QueryExec
	} from '@/api/table'
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
import MaintenanceEdit from '../components/Maintenance.vue'
import treeData from './../../vab/tree/index'
import MaintenanceForm from '../form/MaintenanceForm.vue'
export default {
  name: 'ComprehensiveTable',
  components: {
    MaintenanceEdit,
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
        device_name: '',
        manage_pid: ''
      },
      dialogFormVisible: false,

      table: {
        tableHeight: this.$(window).height()
      }
    }
  },
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
    	}),
    },
  created() {
    this.fetchData()
  },
  beforeDestroy() { },
  mounted: function () {
    this.$nextTick(function () {
      let exceptHeight = 300;
      // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
      //tableSort为table中ref的值
      if (this.$refs.tableSort.$el) {
        this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
      }

      // 监听窗口大小变化
      let that = this;
      window.onresize = function () {
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
    handleEdit(row) {
      this.$refs['MaintenanceEdit'].showEdit(row)
    },
    searchbutton() {
      this.fetchData()
    },
    handleDelete(row) {
      if (row.id) {
        this.$baseConfirm('你确定要删除管理编号为'+row.manage_pid+'的设备的维护保养记录吗?', null, async () => {
          let sData = '[Q]169{'+row.id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            this.$baseMessage("删除成功", 'success')
            this.fetchData()
          }
          else{
            this.$baseMessage("删除失败", 'error')
          }
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
    MaintenanceFormAdd() {
      this.$refs['MaintenanceForm'].save()
    },
    transferTable() {
      this.$baseConfirm('是否跳转到维护保养记录?如果要继续添加请点击取消。', null, async () => {
        this.$router.push('/device/Maintenance?tabs=1')
        this.fetchData()
      })
    },
    async fetchData() {
      this.listLoading = true
      let sData = '[Q]165{'+this.current_org+'$`%'+this.queryForm.manage_pid+'%$`%'+this.queryForm.device_name+'%$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.list = res.data
      this.total = res.totalCount
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

<template>
  <div class="definition purchase equipment_btn calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="添加验收记录" class="center">
        <div class="usage">
          <AcceptanceFrom ref="AcceptanceFrom" @transferTable="transferTable"></AcceptanceFrom>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="AcceptanceFromAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备验收记录">
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%">
            <el-form
              ref="form"
              :model="queryForm"
              :inline="true"
              @submit.native.prevent
              class="demo-form-inline"
            >
              <el-form-item style="padding-right: 10px;">
                <el-input
                  style="border-radius: 30px "
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
            prop="manage_id"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="设备名称"
            prop="devicename"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="model"
            label="规格型号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="生产厂家"
            prop="factory"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="出厂编号"
            prop="serial_no"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="accept_org"
            label="验收单位"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="验收结论"
            prop="accept_conclusion"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="验收人员"
            prop="acceptance_member"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="116px">
            <template #default="{ row }">
              <el-button
                type="primary"
                class="normal"
                @click="handleAdd21(row)"
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
      </el-tab-pane>
    </el-tabs>
    <table-edit21 ref="edit21" @fetchData="fetchData"></table-edit21>
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
import TableEdit21 from '../components/equipmentAcceptanceEdit.vue'
import AcceptanceFrom from '../form/equipmentAcceptance.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    TableEdit21,
    AcceptanceFrom,
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
    ...mapGetters({
    	current_org: 'org/current_org',
    }),
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    this.fetchData()
  },
  beforeDestroy() { },
  mounted: function () {
    this.$nextTick(function () {
      let exceptHeight = 320;
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
    searchbutton() {
      this.fetchData()
    },
    AcceptanceFromAdd() {
      this.$refs['AcceptanceFrom'].save();
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
    handleAdd21(row) {
      this.$refs['edit21'].showEdit(row)
    },
    transferTable() {
      this.$baseConfirm('是否跳转到验收记录?如果要继续添加请点击取消。', null, async () => {
        this.$router.push('/device/equipmentAcceptance?tabs=1')
      })
    },
    handleDelete(row) {
      if (row.accept_id) {
        this.$baseConfirm('你确定要删除管理编号为'+row.manage_id+'的'+row.devicename+'的验收记录吗?(备注：请谨慎执行此操作，删除验收记录会导致此设备在您的机构记录出现不完整的情况！)', null, async () => {
          let sData = '[Q]100{'+row.accept_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if (res > 0) {
          	this.$baseMessage('删除成功', 'success')
            this.fetchData()
          } else {
          	this.$baseMessage('删除失败', 'error')
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
    async fetchData() {
      this.listLoading = true
      let sData = '[Q]99{'+this.current_org+'$`%'+this.queryForm.device_name+'%$`%'+this.queryForm.manage_pid+'%$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.list = res.data
      this.total = res.totalCount
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },

  },
}
</script>

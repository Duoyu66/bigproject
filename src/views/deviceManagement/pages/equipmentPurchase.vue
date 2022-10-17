<template>
  <div class="definition purchase equipment_btn calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="购入登记" class="buy center">
        <div class="usage">
          <PurchaseFrom ref="PurchaseFrom" @fetchData="fetchData"></PurchaseFrom>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="PurchaseFromAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="购入记录">
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
            prop="manage_id"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="device_name"
            label="设备名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="规格型号"
            prop="device_span"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="range"
            label="测量范围"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="accuracy"
            label="精度"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="factory"
            label="生产厂家"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="生产日期"
            prop="product_date"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="购置费用"
            prop="purchase_cost"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="是否验收"
            prop="isAccept"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.is_accept==='0'">否</span>
              <span v-else-if="scope.row.is_accept==='1'">是</span>
              <span v-else>无验收记录</span>
            </template>
          </el-table-column>
          <el-table-column width="100px" show-overflow-tooltip label="发票扫描件">
             <template #default="{ row }">
              <el-button type="primary" size="mini" @click="pdfdetail1(row)">
                查看文件
              </el-button>
            </template>
          </el-table-column>
          <el-table-column width="100px" show-overflow-tooltip label="合同扫描件">
             <template #default="{ row }">
              <el-button type="primary" size="mini" @click="pdfdetail(row)">
                查看文件
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="操作"
            fixed="right"
            width="80px"
          >
            <template #default="{ row }">
              <el-dropdown trigger="click" placement="left-start">
                <el-button
                  icon="el-icon-s-fold"
                  class="el-dropdown-link"
                  type="primary"
                ></el-button>
                <el-dropdown-menu slot="dropdown" class="more">
                  <el-button @click="handleAdd11(row)">修改</el-button>
                  <el-button @click="handleDelete(row)">删除</el-button>
                  <el-button v-if="row.is_accept === '0'" @click="handleAccept(row)">验收设备</el-button>
                </el-dropdown-menu>
              </el-dropdown>
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
        <table-edit11 ref="edit11" @fetchData="fetchData"></table-edit11>
        <table-edit21 ref="edit21"></table-edit21>
        <preview ref="preview"></preview>
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
  import {
  	ViewfileUrl,
  	UploadFileNameUrl
  } from '@/utils/servicefile'
import TableEdit11 from '../components/equipmentPurchase.vue'
import treeData from './../../vab/tree/index'
import TableEdit21 from '../components/equipmentAcceptance.vue'
import PurchaseFrom from '../form/equipmentPurchaseFrom.vue'
import preview from '@/components/fileAbout/preview'
export default {
  name: 'ComprehensiveTable',
  components: {
    TableEdit11,
    PurchaseFrom,
    TableEdit21,
    treeData,
    preview
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
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    //this.$refs['add'].showEdit()
    if (this.$route.query.tabs && this.$route.query.tabs == '0') {

    }

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
  computed: {
  	...mapGetters({
  		current_org: 'org/current_org',
  	}),
  },
  methods: {
    PurchaseFromAdd() {
      this.$refs['PurchaseFrom'].save();
    },
    transferTable() {
      this.$baseConfirm('是否跳转到购入记录?如果要继续添加请点击取消。', null, async () => {
        this.$router.push('/device/equipmentPurchase?tabs=1')
        this.fetchData()
      })
    },
    pdfdetail(row) {
      let that = this
      console.log(row)
      if (row.contract_table.name != '') {
      	this.$refs['preview'].handleEdit(row.contract_table)
      } else {
      	this.$message.error(
      		"服务器无可预览文件"
      	)
      }
    },
    pdfdetail1(row) {
      let that = this
      console.log(row)
      if (row.receipt_table.name != '') {
      	this.$refs['preview'].handleEdit(row.receipt_table)
      } else {
      	this.$message.error(
      		"服务器无可预览文件"
      	)
      }
    },
    searchbutton() {
      this.fetchData()
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
    handleAdd11(row) {
      row.invoice_id=row.receipt
      this.$refs['edit11'].showEdit(row)
    },
    handleAccept(row) {
      this.$refs['edit21'].showEdit(row)
    },
    handleDelete(row) {
      if (row.detail_id) {
        this.$baseConfirm('你确定要删除管理编号为'+row.manage_id+'的设备的采购记录吗?', null, async () => {
          let sData = '[Q]637{' + row.device_id +'$`'+row.detail_id+ '$`'+row.accept_id+ '}|^1|^SYS'
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
    async fetchData() {
      this.listLoading = true
      let sData = '[Q]96{'+this.current_org+'$`%'+this.queryForm.device_name+'%$`%'+this.queryForm.manage_pid+'%$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.list = res.data
      res.data.forEach((item, index) => {
        const prefix = ViewfileUrl(18)
        item.receipt_table = {
        	name: item.invoice_file,
        	src: prefix + item.invoice_file
        }
        const prefix1 = ViewfileUrl(12)
        item.contract_table = {
        	name: item.contract_filename,
        	src: prefix1 + item.contract_filename
        }
      })
      this.total = res.totalCount
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
  },
}
</script>

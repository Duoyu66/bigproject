<template>
  <div class="definition equipment_btn calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="添加收款记录" class="center">
        <div class="usage">
          <ReceivedForm ref="ReceivedForm" @transferTable="transferTable"></ReceivedForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="ReceivedFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收款记录">
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%">
            <el-form
              ref="form"
              :model="queryForm"
              :inline="true"
              @submit.native.prevent
            >
              <el-form-item  style="padding-right: 10px;">
                <el-input
                  style="border-radius: 30px"
                  v-model="queryForm.title"
                  placeholder="按试验名称查询"
                  prefix-icon="el-icon-search"
                >
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  native-type="submit"
                  @click="handleQuery"
                >
                  查询
                </el-button>
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
          :height="height"
          @selection-change="setSelectRows"
          @sort-change="tableSortChange"
          :header-cell-style="{ background: '#e8f0ff' }"
        >
              <el-table-column
                show-overflow-tooltip
                label="委托编号"
                prop="order_id"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.order_id===''">无</span>
                  <span v-else>{{scope.row.order_id}}</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="试验"
                prop="object_name"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="收款时间"
                prop="pay_time"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="收款人"
                prop="payee"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="amount"
                label="金额"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="收款方式"
                prop="channel"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="事由"
                prop="memo"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="操作"
                width="120px"
              >
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    class="normal"
                    @click="handleReceivedEdit(row)"
                  >
                    修改
                  </el-button>
                  <el-button @click="handleReceivedDelete(row)" class="danger">
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
        <collectMoney ref="collectMoney" @fetchData="fetchData"></collectMoney>
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
  } from '@/utils/servicefile'
import receipt from '../components/receipt.vue'
import treeData from './../../vab/tree/index'
import preview from '@/components/fileAbout/preview'
import collectMoney from '../components/collectMoney.vue'
import ReceivedForm from '../form/CollectForm.vue'
export default {
  name: 'ComprehensiveTable',
  components: {
    receipt,
    treeData,
    preview,
    collectMoney,
    ReceivedForm
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
      isViewPdf20: false,
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
      src: 'http://42.193.118.98:5005/ReceiptImagePath/20210717/910102415651651.pdf', //pdf地址,这里我用的是我本地的文件,你也可以使用后台的文件
      dialogVisible: false,
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
    searchbutton() {
      this.fetchData()
    },
    pdfdetail(row) {
      let that = this
      console.log(row)
      if (row.invoice_file_table.name != '') {
      	this.$refs['preview'].handleEdit(row.invoice_file_table)
      } else {
      	this.$message.error(
      		"服务器无可预览文件"
      	)
      }
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
    handleReceiptEdit(row) {
      this.$refs['receipt'].showEdit(row, '1')
    },
    handleReceivedEdit(row) {
      console.log(row)
      this.$refs['collectMoney'].showEdit(row,'2')
    },
    handleReceivedDelete(row) {
      if (row.receive_id) {
        this.$baseConfirm('你确定要删除此条收款记录吗?', null, async () => {
          if(row.receivable_id !== '0')
          {
            let sData = '[Q]229{'+row.receive_id+'}|^1|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {
              let sData2 = '[Q]228{'+row.amount+'$`0$`'+row.receivable_id+'}|^1|^SYS'
              const res2 = await ExecSql(sData2)
              if(res2>0)
              {
                this.$baseMessage("删除成功", 'success')
                this.fetchData()
              }
            }
            else{
              this.$baseMessage("删除失败", 'error')
            }
          }
          else{
            let sData = '[Q]229{'+row.receive_id+'}|^1|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {
              this.$baseMessage("删除成功", 'success')
              this.fetchData()
            }
            else{
              this.$baseMessage("删除失败", 'error')
            }
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
    ReceivedFormAdd() {
      this.$refs['ReceivedForm'].addsave()

    },
    transferTable() {
      this.$baseConfirm('是否跳转到收款记录?如果要继续添加请点击取消。', null, async () => {
        this.$router.push('/Received?tabs=1')
        this.fetchData()
      })
    },
    async fetchData() {
      this.listLoading = true
      let sDataReceipt = '[Q]352{'+this.current_org+'$`%'+this.queryForm.title+'%$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
      const resReceipt = await QueryExec(sDataReceipt)
      console.log(resReceipt)
      // if(resReceipt.data.length!=0)
      // {
      //   resReceipt.data.forEach((item, index) => {
      //     const prefix = ViewfileUrl(18)
      //     item.invoice_file_table = {
      //     	name: item.invoice_file,
      //     	src: prefix + item.invoice_file
      //     }
      //   })
      // }
      this.list = resReceipt.data
      this.total = resReceipt.totalCount
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

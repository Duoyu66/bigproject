<template>
  <div class="definition equipment_btn calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="添加联系人记录" class="center">
        <div class="usage">
          <ContactForm ref="ContactForm" @transferTable="transferTable"></ContactForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="ContactFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="联系人记录">
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%">
            <el-form
              ref="form"
              :model="queryForm"
              :inline="true"
              @submit.native.prevent
            >
              <el-form-item>
                <el-input
                  style="border-radius: 30px"
                  v-model="queryForm.title"
                  placeholder="按联系人名查询"
                  prefix-icon="el-icon-search"
                >
                  <template #append>
                    <el-button icon="el-icon-search" @click="searchbutton"></el-button>
                  </template>
                </el-input>
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
          label="客户名称"
          prop="customer_name"
        ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="联系人姓名"
            prop="name"
          ></el-table-column>


          <el-table-column
            show-overflow-tooltip
            prop="mobile"
            label="联系电话"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="联系人职务"
            prop="duty"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="QQ"
            prop="QQ"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="微信"
            prop="WeChat"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="电子邮箱"
            prop="email"
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
                @click="handleContactEdit(row)"
              >
                修改
              </el-button>
              <el-button @click="handleContactDelete(row)" class="danger">
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
        <ContactAdd ref="ContactAdd" @fetchData="fetchData"></ContactAdd>
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
import ContactAdd from '../components/ContactAdd.vue'
import ContactForm from '../form/ContactForm.vue'
export default {
  name: 'ComprehensiveTable',
  components: {
    receipt,
    treeData,
    preview,
    ContactAdd,
    ContactForm
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
      src: '', //pdf地址,这里我用的是我本地的文件,你也可以使用后台的文件
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
    handleContactEdit(row) {
      console.log(row)
      this.$refs['ContactAdd'].showEdit(row,'0')
    },
    handleContactDelete(row) {
      if(row.contact_id)
      {
        this.$baseConfirm('你确定要删除此联系人吗?', null, async () => {
          let sData = '[Q]340{'+row.contact_id+'}|^1|^SYS'
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
    ContactFormAdd() {
      this.$refs['ContactForm'].save()

    },
    transferTable() {
      
      this.$baseConfirm('是否跳转到联系人记录?如果要继续添加请点击取消。', null, () => {
        this.$router.push({path:'/contacts',query:{tab:1}})
        this.fetchData()
      })
    },
    async fetchData() {
      this.listLoading = true
      let sDataReceipt = '[Q]338{'+this.current_org+'$`%'+this.queryForm.title+'%$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
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

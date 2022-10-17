<template>
  <div class="definition purchase equipment_btn calc client">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="客户登记" class="center">
        <div class="usage">
          <!-- <CustomerFrom ref="CustomerFrom"></CustomerFrom> -->
          <customer-from ref="edit7" @transferTable="transferTable"></customer-from>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="CustomerFromAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="客户台账">
        <!-- <vab-query-form style="padding: 0 15px;">
          <vab-query-form-right-panel style="width: 100%;">
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item>
                <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按客户名称搜索" prefix-icon="el-icon-search" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form> -->

        <vab-query-form>
          <vab-query-form-left-panel style="padding: 0 15px;width: 20%">
            <el-select v-model="customer_type" style="width: 100%" @change="type_change" filterable placeholder="请选择客户类型">
              <el-option
                v-for="item in customer_type_options"
                :key="item.item_id"
                :label="item.item_name"
                :value="item.item_id">
              </el-option>
            </el-select>
<!--            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
              添加
            </el-button> -->
            <!-- <el-button icon="el-icon-upload2" type="primary" @click="upload2">
					上传
				</el-button> -->
          </vab-query-form-left-panel>
          <vab-query-form-right-panel style="padding: 0 15px;width: 80%">
            <el-form
              ref="form"
              :model="queryForm"
              :inline="true"
              @submit.native.prevent
            >
              <el-form-item>
                <el-input
                  style="border-radius: 30px"
                  v-model="name"
                  placeholder="按客户名称搜索"
                  prefix-icon="el-icon-search"
                />
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

        <el-container>
          <el-main style="" class="box1">
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
              @row-click="tableRowClick"
              :header-cell-style="{ background: '#e8f0ff' }"
            >
              <el-table-column
                show-overflow-tooltip
                label="客户名称"
                prop="customer_name"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="address"
                label="客户住址"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="客户邮编"
                prop="post_code"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="bank"
                label="开户银行"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="银行账号"
                prop="account"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="信用代号"
                prop="license_id"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="联系人"
                prop="liaison"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="telphone"
                label="联系电话"
              ></el-table-column>
              <!-- <el-table-column
                show-overflow-tooltip
                prop="number4"
                label="预付账户金额"
              ></el-table-column> -->
              <el-table-column
                show-overflow-tooltip
                prop="status"
                label="客户状态"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.status==0">在线</span>
                  <span v-else-if="scope.row.status==1">不在线</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="sign_evel"
                label="客户级别"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="customer_type"
                label="客户类型"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.customer_type==='1'">第三方检测业主单位</span>
                  <span v-else-if="scope.row.customer_type==='2'">设备供应商</span>
                  <span v-else-if="scope.row.customer_type==='3'">校检机构</span>
                  <span v-else-if="scope.row.customer_type==='4'">消耗品供应商</span>
                  <span v-else-if="scope.row.customer_type==='5'">委外客户</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="操作" width="120px">
                <template #default="{ row }">
                  <el-dropdown trigger="click" placement="left-start">
                    <el-button
                      icon="el-icon-s-fold"
                      class="el-dropdown-link"
                      type="primary"
                    ></el-button>
                    <el-dropdown-menu slot="dropdown" class="more">
                      <el-button @click="handleMainEdit(row)">修改</el-button>
                      <el-button @click="handleContractAdd(row)">添加合同</el-button>
                      <el-button @click="handleContactAdd(row)">添加联系人</el-button>
<!--                      <el-button @click="handleRechargeAdd(row)">充值</el-button>
                      <el-button @click="handleEdit4('0', row)">消费</el-button> -->
                      <el-button @click="handleMainDelete(row)">删除</el-button>
                      <el-button @click="handleMainUpload(row)">上传附件</el-button>
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
          </el-main>
          <el-footer class="table_auto">
            <el-tabs>
              <el-tab-pane label="合同台账">
                <el-table
                  ref="tableSort"
                  v-loading="listChildLoading"
                  :data="listContract"
                  border
                  :element-loading-text="elementLoadingText"
                  :height="table.tableHeightChild"
                  highlight-current-row
                  :header-cell-style="{ background: '#e8f0ff' }"
                >
                  <!-- @selection-change="setSelectRows" -->
                  <!-- @sort-change="tableSortChange" -->
                  <el-table-column
                     show-overflow-tooltip
                     label="所属部门"
                     prop="org_name"
                     width="150px"
                   ></el-table-column>
                   <el-table-column
                     show-overflow-tooltip
                     label="合同编号"
                     prop="contract_no"
                     width="150px"
                   ></el-table-column>
                   <el-table-column
                     show-overflow-tooltip
                     prop="contract_name"
                     label="合同名称"
                     width="150px"
                   ></el-table-column>
                   <el-table-column
                     show-overflow-tooltip
                     label="客户名称"
                     prop="customer_name"
                     width="100px"
                   ></el-table-column>
                  <el-table-column
                     show-overflow-tooltip
                     prop="contract_signdate"
                     label="签订日期"
                     width="200px"
                   ></el-table-column>
                   <el-table-column
                     show-overflow-tooltip
                     label="合同额"
                     prop="contract_money"
                     width="100px"
                   ></el-table-column>
                  <el-table-column width="100px" show-overflow-tooltip label="合同扫描件">
                     <template #default="{ row }">
                       <el-button type="primary" @click="pdfdetail(row)">
                         查看文件
                       </el-button>
                     </template>
                   </el-table-column>
                   <el-table-column
                     show-overflow-tooltip
                     prop="sum1"
                     label="应收金额"
                     width="100px"
                   ></el-table-column>
                   <el-table-column
                     show-overflow-tooltip
                     label="已收金额"
                     prop="sum2"
                     width="100px"
                   ></el-table-column>
                   <el-table-column
                     show-overflow-tooltip
                     label="剩余应收"
                     prop="sum5"
                     width="100px"
                   ></el-table-column>
                   <el-table-column
                     show-overflow-tooltip
                     label="发票已开"
                     prop="sum3"
                     width="100px"
                   ></el-table-column>
                   <el-table-column
                     show-overflow-tooltip
                     label="未开发票金额"
                     prop="sum4"
                     width="120px"
                   ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="操作"
                    width="100px"
                  >
                    <template #default="{ row }">
                      <el-dropdown trigger="click" placement="left-start">
                        <el-button
                          icon="el-icon-s-fold"
                          class="el-dropdown-link"
                          type="primary"
                        ></el-button>
                        <el-dropdown-menu slot="dropdown" class="more">
                          <el-button @click="handleContractEdit(row)">修改</el-button>
                          <el-button @click="handleContractDetail(row)">
                            详情
                          </el-button>
                          <el-button @click="handleContractDelete(row)">
                            删除
                          </el-button>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  :background="background"
                  :current-page="queryFormContract.pageNo"
                  :layout="layoutContract"
                  :page-size="queryFormContract.pageSize"
                  :total="totalContract"
                  @current-change="handleCurrentChangeContract"
                  @size-change="handleSizeChangeContract"
                ></el-pagination>
              </el-tab-pane>
<!--              <el-tab-pane label="客户充值记录">
                <el-table
                  ref="tableSort"
                  v-loading="listLoading"
                  :data="list3"
                  border
                  :element-loading-text="elementLoadingText"
                  highlight-current-row
                  :height="table.tableHeight1"
                  @selection-change="setSelectRows"
                  @sort-change="tableSortChange"
                  :header-cell-style="{ background: '#e8f0ff' }"
                >
                  <el-table-column
                    show-overflow-tooltip
                    label="充值金额"
                    prop="amount"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="充值时间"
                    prop="recharge_date"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="充值方式"
                    prop="recharge_way"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="支票号"
                    prop="cheque_num"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="转入银行"
                    prop="recharge_bank"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="转入账号"
                    prop="recharge_account"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="操作"
                    width="180px"
                  >
                    <template #default="{ row }">
                      <el-button
                        type="primary"
                        @click="handleEdit3(row, '0')"
                        class="normal"
                      >
                        修改
                      </el-button>
                      <el-button @click="handleDelete3(row)" class="danger">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="客户消费记录">
                <el-table
                  ref="tableSort"
                  v-loading="listLoading"
                  :data="list4"
                  border
                  :element-loading-text="elementLoadingText"
                  highlight-current-row
                  :height="table.tableHeight1"
                  @selection-change="setSelectRows"
                  @sort-change="tableSortChange"
                  :header-cell-style="{ background: '#e8f0ff' }"
                >
                  <el-table-column
                    show-overflow-tooltip
                    label="消费时间"
                    prop="recharge_date"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="委托试验"
                    prop="test_name"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="消费金额"
                    prop="amount"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="经手人"
                    prop="operator"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="操作"
                    width="180px"
                  >
                    <template #default="{ row }">
                      <el-button
                        type="primary"
                        @click="handleEdit4(row, '0')"
                        class="normal"
                      >
                        修改
                      </el-button>
                      <el-button @click="handleDelete4(row)" class="danger">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane> -->
              <el-tab-pane label="联系人列表">
                <el-table
                  ref="tableSort"
                  v-loading="listChildLoading"
                  :data="listContacts"
                  border
                  :element-loading-text="elementLoadingText"
                  highlight-current-row
                  :height="table.tableHeightChild"
                  @selection-change="setSelectRows"
                  @sort-change="tableSortChange"
                  :header-cell-style="{ background: '#e8f0ff' }"
                >
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
                  :current-page="queryFormContacts.pageNo"
                  :layout="layoutContacts"
                  :page-size="queryFormContacts.pageSize"
                  :total="totalContacts"
                  @current-change="handleCurrentChangeContacts"
                  @size-change="handleSizeChangeContacts"
                ></el-pagination>
              </el-tab-pane>
              <el-tab-pane label="附件列表">
                <el-table
                  ref="tableSort"
                  v-loading="listChildLoading"
                  :data="listEnclosure"
                  border
                  :element-loading-text="elementLoadingText"
                  highlight-current-row
                  :height="table.tableHeightChild"
                  @selection-change="setSelectRows"
                  @sort-change="tableSortChange"
                  :header-cell-style="{ background: '#e8f0ff' }"
                >
                  <el-table-column
                    show-overflow-tooltip
                    label="文件名称"
                    prop="enclosure_name"
                  ></el-table-column>

                  <el-table-column width="100px" show-overflow-tooltip label="文件扫描件">
                     <template #default="{ row }">
                      <el-button type="primary" @click="pdfdetail(row)">
                        查看文件
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="操作"
                    width="120px"
                  >
                    <template #default="{ row }">
                      <el-button @click="handleFileDelete(row)" class="danger">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  :background="background"
                  :current-page="queryFormEnclosure.pageNo"
                  :layout="layoutEnclosure"
                  :page-size="queryFormEnclosure.pageSize"
                  :total="totalEnclosure"
                  @current-change="handleCurrentChangeEnclosure"
                  @size-change="handleSizeChangeEnclosure"
                ></el-pagination>
              </el-tab-pane>
            </el-tabs>
          </el-footer>
        </el-container>
      </el-tab-pane>
    </el-tabs>

    <clientManagement ref="clientManagement" @fetchData="fetchData"></clientManagement>
    <table-edit1 ref="edit1"></table-edit1>
    <ContactAdd ref="ContactAdd" @fetchDataChild="fetchDataChild"></ContactAdd>
    <!-- <customer-from ref="edit7"></customer-from> -->
    <table-edit2 ref="edit2"></table-edit2>
    <rechargeRecord ref="rechargeRecord" @fetchDataChild="fetchDataChild"></rechargeRecord>
    <table-edit4 ref="edit4"></table-edit4>
    <contractManagement ref="contractManagement" @fetchDataChild="fetchDataChild"></contractManagement>
    <enclosure ref="enclosure" @fetchDataChild="fetchDataChild"></enclosure>
    <preview ref="preview"></preview>
  </div>
</template>

<script>
import clientManagement from '../components/clientManagement.vue'
import CustomerFrom from '../form/CustomerForm.vue'
import TableEdit1 from '../components/rechargeRecord.vue'
import ContactAdd from '../components/ContactAdd.vue'
import TableEdit2 from '../components/consumptionRecord.vue'
import rechargeRecord from '../components/rechargeRecord.vue'
import TableEdit4 from '../components/consumptionRecord1.vue'
import contractManagement from '../components/contractManagement.vue'
import enclosure from '../components/enclosure.vue'
import treeData from './../../vab/tree/index'
import preview from '@/components/fileAbout/preview'
import {
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
export default {
  name: 'ComprehensiveTable',
  components: {
    clientManagement,
    ContactAdd,
    TableEdit1,
    TableEdit2,
    rechargeRecord,
    TableEdit4,
    contractManagement,
    enclosure,
    CustomerFrom,
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
  provide() {
    return {
      reload: this.reload,
      reload2: this.reload2,
    }
  },
  data() {
    return {
      imgShow: true,
      name: '',
      list: [],
      listContract: [],
      listEnclosure: [],
      list3: [],
      list4: [],
      listrow: [],
      imageList: [],
      listContacts: [],
      customer_type_options: [],
      customer_type: '',
      listChildLoading: true,
      layoutContacts: 'total, sizes, prev, pager, next, jumper',
      layoutContract: 'total, sizes, prev, pager, next, jumper',
      layoutEnclosure: 'total, sizes, prev, pager, next, jumper',
      totalContacts: 0,
      totalContract: 0,
      totalEnclosure: 0,
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      customer_name: '',
      elementLoadingText: '正在加载...',
      queryForm: {
        pageNo: 1,
        pageSize: 10,
      },
      queryFormContacts: {
        pageNo: 1,
        pageSize: 10,
      },
      queryFormContract: {
        pageNo: 1,
        pageSize: 10,
      },
      queryFormEnclosure: {
        pageNo: 1,
        pageSize: 10,
      },
      formLabelWidth: '120px',
      table: {
        tableHeight: this.$baseTableHeight()*0.5,
        tableHeightChild: this.$baseTableHeight()*0.4
      }
    }
  },
  computed: {
    tabHeight() {
      return this.$baseTableHeight()
    },
    height() {
      return this.$baseTableHeight()*0.5
    },
    ...mapGetters({
    	current_org: 'org/current_org',
    }),
  },
  created() {
    this.fetchData()
    this.fetchDataChild()
  },
  beforeDestroy() { },
  methods: {
    CustomerFromAdd() {
      this.$refs['edit7'].save()
    },
    tableSortChange() {
      const imageList = []
      this.$refs.tableSort.tableData.forEach((item, index) => {
        imageList.push(item.img)
      })
      this.imageList = imageList
    },
    type_change() {
      this.fetchData()
      this.fetchDataChild()
    },
	transferTable() {
	  this.$baseConfirm('是否跳转到客户台账?如果要继续添加请点击取消。', null, async () => {
	    this.$router.push('/clientManagement?tabs=1')
	  })
	},
    tableRowClick(row) {
      console.log(1)
      this.listrow=row
      this.fetchDataChild(row)
    },
    handleContactAdd(row) {
      this.$refs['ContactAdd'].showEdit(row)
    },
    handleContactEdit(row) {
      row.customer_name=this.customer_name
      console.log(this.customer_name)
      this.$refs['ContactAdd'].showEdit(row,'0')
    },

    setSelectRows(val) {
      this.selectRows = val
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleAdd() {
      this.$refs['edit'].showEdit()
    },
    handleDelete(row) {

    },
    handleFileDelete(row) {
      if(row.enclosure_id)
      {
        this.$baseConfirm('你确定要删除此附件吗?', null, async () => {
          let sData = '[Q]313{'+row.enclosure_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            this.$baseMessage("删除成功", 'success')
            this.fetchDataChild(this.listrow)
          }
          else{
            this.$baseMessage("删除失败", 'error')
          }
        })
      }
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
            this.fetchDataChild(this.listrow)
          }
          else{
            this.$baseMessage("删除失败", 'error')
          }
        })
      }
    },
    handleContractDelete(row) {
      if(row.contract_id)
      {
        this.$baseConfirm('你确定要删除此合同吗?', null, async () => {
          let sData = '[Q]276{'+row.contract_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            this.$baseMessage("删除成功", 'success')
            this.fetchDataChild(this.listrow)
          }
          else{
            this.$baseMessage("删除失败", 'error')
          }
        })
      }
    },
    handleMainEdit(row) {
      this.$refs['clientManagement'].showEdit(row)
    },
    handleMainUpload(row) {
      this.$refs['enclosure'].showEdit(row)
    },
    handleMainDelete(row) {
      if(row.customer_id)
      {
        this.$baseConfirm('你确定要删除此客户吗?', null, async () => {
          let sData = '[Q]312{'+row.customer_id+'}|^1|^SYS'
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
    pdfdetail(row) {
      let that = this
      console.log(row)
      if (row.file_table.name != '') {
      	this.$refs['preview'].handleEdit(row.file_table)
      } else {
      	this.$message.error(
      		"服务器无可预览文件"
      	)
      }
    },
    handleRechargeAdd(row) {
      this.$refs['rechargeRecord'].showEdit(row, row1)
    },
    handleEdit3(row) {
      this.$refs['rechargeRecord'].showEdit(row, row1)
    },
    handleEdit4(row, row1) {
      this.$refs['edit4'].showEdit(row, row1)
    },
    handleAdd1() {
      this.$refs['edit1'].showEdit1()
    },
    handleAdd2() {
      this.$refs['edit2'].showEdit2()
    },
    handleAdd3() {
      this.$refs['rechargeRecord'].showEdit3()
    },

    handleAdd4() {
      this.$refs['edit4'].showEdit4()
    },
    handleContractAdd(row) {
      this.$refs['contractManagement'].showEdit(row)
    },
    handleContractEdit(row) {
      row.customer_name=this.customer_name
      this.$refs['contractManagement'].showEdit(row,'1')
    },
    handleContractDetail(row) {
      row.customer_name=this.customer_name
      console.log(row)
      this.$refs['contractManagement'].showEdit(row,'2')
    },

    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    handleSizeChangeContacts(val) {
      this.queryForm.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeContacts(val) {
      this.queryForm.pageNo = val
      this.fetchDataChild()
    },
    handleSizeChangeContract(val) {
      this.queryForm.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeContract(val) {
      this.queryForm.pageNo = val
      this.fetchDataChild()
    },
    handleSizeChangeEnclosure(val) {
      this.queryForm.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeEnclosure(val) {
      this.queryForm.pageNo = val
      this.fetchDataChild()
    },
    handleQuery() {
      this.queryForm.pageNo = 1
      this.fetchData()
    },
    async fetchDataChild(val) {
    	let that = this
      this.listChildLoading = true
      if(val && val.customer_id)
      {
        this.customer_name = val.customer_name
        //根据sql自行编写
        let sDataContacts = '[Q]216{'+val.customer_id+'$`'+((Number(this.queryFormContacts.pageNo)-1)*Number(this.queryFormContacts.pageSize)).toString()+'$`'+this.queryFormContacts.pageSize+'}|^SYS'
        const resContacts = await QueryExec(sDataContacts)
        console.log(val)
        this.listContacts = resContacts.data
        this.totalContacts = resContacts.totalCount

        //根据sql自行编写
        let sDataContract = '[Q]218{'+val.customer_id+'$`'+((Number(this.queryFormContract.pageNo)-1)*Number(this.queryFormContract.pageSize)).toString()+'$`'+this.queryFormContract.pageSize+'}|^SYS'
        const resContract = await QueryExec(sDataContract)
        console.log(val)
        this.listContract = resContract.data
        const imageList = []
        if(resContract.data.length!=0)
        {
          resContract.data.forEach((item, index) => {
            const prefix = ViewfileUrl(12)
            item.file_table = {
            	name: item.contract_filename,
            	src: prefix + item.contract_filename
            }
            item.sum4 = Number(item.sum3)-Number(item.sum2)
            item.sum5 = Number(item.sum1)-Number(item.sum2)
          })
        }
        this.imageContractList = imageList
        this.totalContract = resContract.totalCount

        let sDataEnclosure = '[Q]311{'+val.customer_id+'$`1$`'+((Number(this.queryFormEnclosure.pageNo)-1)*Number(this.queryFormEnclosure.pageSize)).toString()+'$`'+this.queryFormEnclosure.pageSize+'}|^SYS'
        const resEnclosure = await QueryExec(sDataEnclosure)
        console.log(sDataEnclosure)
        this.listEnclosure = resEnclosure.data
        if(resEnclosure.data.length!=0)
        {
          resEnclosure.data.forEach((item, index) => {
            const prefix = ViewfileUrl(20)
            item.file_table = {
            	name: item.enclosure_file,
            	src: prefix + item.enclosure_file
            }
          })
        }
        this.totalEnclosure = resEnclosure.totalCount
      }
      setTimeout(() => {
        this.listChildLoading = false
      }, 500)
    },
    async fetchData() {
    	let that = this
      this.listLoading = true
      let sData1 = '[Q]676{客户类型}|^SYS'
      const res1 = await QueryExec(sData1)
      res1.data.forEach((item, index) => {
        item.item_id=(index+1)
      })
      that.customer_type_options = res1.data
    	//根据sql自行编写
      let sData = '[Q]9{'+this.current_org+'$`%'+this.name+'%$`'+this.customer_type+'$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.list = res.data
      this.total = res.totalCount
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    reload() {
      this.fetchData()
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

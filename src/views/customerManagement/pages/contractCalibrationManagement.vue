<template>
  <div class="definition purchase contract equipment_btn calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="合同登记" class="center">
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
      <el-tab-pane label="合同台账">

        <vab-query-form>
<!--          <vab-query-form-left-panel
            style="width: 20%"
          >
            <el-select v-model="form.contract_type" style="width: 100%" @change="type_change" filterable placeholder="请选择合同类型">
              <el-option
                v-for="item in contract_type_options"
                :key="item.item_id"
                :label="item.item_name"
                :value="item.item_id">
              </el-option>
            </el-select>
          </vab-query-form-left-panel> -->
          <vab-query-form-right-panel
            style="width: 100%; display: flex; justify-content: flex-end"
          >
            <div class="block">
              <el-input
                style="border-radius: 30px"
                v-model="search.contract_no"
                placeholder="以合同编号搜索"
                prefix-icon="el-icon-search"
              />
            </div>
            <div class="block">
              <el-input
                style="border-radius: 30px"
                v-model="search.contract_name"
                placeholder="以合同名称搜索"
                prefix-icon="el-icon-search"
              />
            </div>
            <div class="block">
              <el-select v-model="search.sponsor_org" style="width: 100%" filterable placeholder="请选择">
                <el-option
                  v-for="item in sponsor_org_options"
                  :key="item.item_name"
                  :label="item.item_name"
                  :value="item.item_name">
                </el-option>
              </el-select>
            </div>
            <!-- <el-form-item> -->
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
            >
              查询
            </el-button>
            <!-- </el-form-item> -->
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :data="listContract"
          border
          :element-loading-text="elementLoadingText"
          highlight-current-row
          :height="table.tableHeightMain"
          @selection-change="setSelectRows"
          @sort-change="tableSortChange"
          :header-cell-style="{ background: '#e8f0ff' }"
          @row-click="handleSetRows"
        >
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
              <el-button type="primary" size="mini" @click="pdfdetail(row)">
                查看文件
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sum1"
            label="应付金额"
            width="100px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="已付金额"
            prop="sum2"
            width="100px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="剩余应付"
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
            label="发票未收金额"
            prop="sum4"
            width="120px"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" fixed="right" width="100px">
            <template #default="{ row }">
              <el-dropdown trigger="click" placement="left-start">
                <el-button
                  icon="el-icon-s-fold"
                  class="el-dropdown-link"
                  type="primary"
                ></el-button>
                <el-dropdown-menu slot="dropdown" class="more">
                  <el-button @click="handleEdit(row)">修改</el-button>
                  <el-button @click="handleDeleteContract(row)">删除</el-button>
                  <el-button @click="handleReceiptAdd(row)">添加发票</el-button>
                  <el-button @click="handleReceivedAdd(row)">添加收款历史</el-button>
                  <el-button @click="handlePostAdd(row)">添加快递</el-button>
                  <el-button @click="handleContactAdd(row)">添加联系人</el-button>
                  <el-button @click="handleCHAdd(row)">添加联系记录</el-button>
                  <el-button @click="handleDeviceAdd(row)">添加设备</el-button>
<!--                  <el-button @click="handleUploadvaluation(row)">验工计价上传</el-button> -->
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :background="background"
          :current-page="queryFormMain.pageNo"
          :layout="layoutMain"
          :page-size="queryFormMain.pageSize"
          :total="totalMain"
          @current-change="handleCurrentChangeMain"
          @size-change="handleSizeChangeMain"
        ></el-pagination>
        <el-tabs style="margin-top: 15px">
          <el-tab-pane label="发票">
            <el-form ref="form" :model="form">
              <el-form-item label="发票额合计:" prop="">
              	<span>{{form.suminvoice}}</span>
              </el-form-item>
            </el-form>
            <el-table
              ref="tableSort"
              v-loading="listChildLoading"
              :data="listReceipt"
              border
              :element-loading-text="elementLoadingText"
              highlight-current-row
              :height="table.tableHeightChild1"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
              :header-cell-style="{ background: '#e8f0ff' }"
            >
              <el-table-column
                show-overflow-tooltip
                label="发票号"
                prop="invoice_no"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="amount"
                label="金额(万)"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="税率"
                prop="tax_ratio"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="开票日期"
                prop="invoice_date"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="operator"
                label="开票人"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="发票类型"
                prop="type"
              ></el-table-column>
              <el-table-column width="100px" show-overflow-tooltip label="文件扫描件">
                 <template #default="{ row }">
                  <el-button type="primary" size="mini" @click="pdfdetail(row)">
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
                  <el-button
                    type="primary"
                    class="normal"
                    @click="handleReceiptEdit(row)"
                  >
                    修改
                  </el-button>
                  <el-button @click="handleReceiptDelete(row)" class="danger">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :background="background"
              :current-page="queryFormReceipt.pageNo"
              :layout="layoutReceipt"
              :page-size="queryFormReceipt.pageSize"
              :total="totalReceipt"
              @current-change="handleCurrentChangeReceipt"
              @size-change="handleSizeChangeReceipt"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="校检台账">
<!--            <el-form ref="form" :model="form">
              <el-form-item label="应收款合计:" prop="">
              	<span>{{form.sumneedmoney}}</span>
              </el-form-item>
            </el-form> -->
            <el-table
              ref="tableSort"
              v-loading="listChildLoading"
              :data="listReceivable"
              border
              :element-loading-text="elementLoadingText"
              highlight-current-row
              :height="table.tableHeightChild1"
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
                label="设备名称"
                prop="device_name"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="model"
                label="规格型号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="校检单位"
                prop="verify_org"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="scope"
                label="测量范围"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="精度"
                prop="precision"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="校检日期"
                prop="verify_date"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="校检结果"
                prop="verify_result"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="证书确认"
                prop="cert_situation"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="证书编号"
                prop="cert_id"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="证书扫描件"
                prop="certificate_image"
                width="95px"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="送检人"
                prop="sender"
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
                    @click="handleReceivableAdd(row)"
                  >
                    收款
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :background="background"
              :current-page="queryFormReceivable.pageNo"
              :layout="layoutReceivable"
              :page-size="queryFormReceivable.pageSize"
              :total="totalReceivable"
              @current-change="handleCurrentChangeReceivable"
              @size-change="handleSizeChangeReceivable"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="已收款历史">
            <el-form ref="form" :model="form">
              <el-form-item label="收款合计:" prop="">
              	<span>{{form.summoney}}</span>
              </el-form-item>
            </el-form>
            <el-table
              ref="tableSort"
              v-loading="listChildLoading"
              :data="listReceived"
              border
              :element-loading-text="elementLoadingText"
              highlight-current-row
              :height="table.tableHeightChild1"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
              :header-cell-style="{ background: '#e8f0ff' }"
            >
              <el-table-column
                show-overflow-tooltip
                label="委托编号"
                prop="data_id"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.data_id===''">无</span>
                  <span v-else>{{scope.row.data_id}}</span>
                </template>
              </el-table-column>
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
              :current-page="queryFormReceived.pageNo"
              :layout="layoutReceived"
              :page-size="queryFormReceived.pageSize"
              :total="totalReceived"
              @current-change="handleCurrentChangeReceived"
              @size-change="handleSizeChangeReceived"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="快递">
            <el-table
              ref="tableSort"
              v-loading="listChildLoading"
              :data="listPost"
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
                label="快递公司"
                prop="express_company"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="快递单号"
                prop="track_id"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="type"
                label="类型"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="发件人"
                prop="sender"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="收件人"
                prop="receiver"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="telephone"
                label="收件电话"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="收件地址"
                prop="address"
              ></el-table-column>
<!--              <el-table-column
                show-overflow-tooltip
                label="客户名称"
                prop="customer_id"
              ></el-table-column> -->
              <el-table-column
                show-overflow-tooltip
                label="金额"
                prop="money"
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
                    @click="handlePostEdit(row)"
                  >
                    修改
                  </el-button>
                  <el-button @click="handlePostDelete(row)" class="danger">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :background="background"
              :current-page="queryFormPost.pageNo"
              :layout="layoutPost"
              :page-size="queryFormPost.pageSize"
              :total="totalPost"
              @current-change="handleCurrentChangePost"
              @size-change="handleSizeChangePost"
            ></el-pagination>
          </el-tab-pane>
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
                    @click="handleContactEdit(row,'0')"
                  >
                    修改
                  </el-button>
                  <el-button @click="handleDeleteContact(row)" class="danger">
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
          <el-tab-pane label="联系记录">
            <el-table
              ref="tableSort"
              v-loading="listChildLoading"
              :data="listContactRecord"
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
                label="联系原因"
                prop="reason"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="联系人"
                prop="name"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="联系日期"
                prop="create_time1"
              ></el-table-column>
<!--              <el-table-column
                show-overflow-tooltip
                label="下次联系日期"
                prop="next_time1"
              ></el-table-column> -->
              <el-table-column
                show-overflow-tooltip
                label="实施人"
                prop="user_name"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="备注"
                prop="remarks"
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
                    @click="handleCHEdit(row)"
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
              :current-page="queryFormContactRecord.pageNo"
              :layout="layoutContactRecord"
              :page-size="queryFormContactRecord.pageSize"
              :total="totalContactRecord"
              @current-change="handleCurrentChangeContactRecord"
              @size-change="handleSizeChangeContactRecord"
            ></el-pagination>
          </el-tab-pane>
<!--          <el-tab-pane label="委外合同">
            <el-table
              ref="tableSort"
              v-loading="listChildLoading"
              :data="listValuation"
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
            label="所属部门"
            prop="sponsor_org"
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
              <el-button type="primary" size="mini" @click="pdfdetail(row)">
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
            label="发票未开金额"
            prop="sum4"
            width="100px"
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
                    @click="handleAdd9(row,'0')"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :background="background"
              :current-page="queryFormContractRecord.pageNo"
              :layout="layoutContactRecord"
              :page-size="queryFormContractRecord.pageSize"
              :total="totalContractRecord"
              @current-change="handleCurrentChangeContractRecord"
              @size-change="handleSizeChangeContractRecord"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="验工计价">
            <el-table
              ref="tableSort"
              v-loading="listChildLoading"
              :data="listFile"
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
                label="验工计价扫描件日期"
                prop="enclosure_date"
              ></el-table-column>
              <el-table-column width="100px" show-overflow-tooltip label="文件扫描件">
                 <template #default="{ row }">
                  <el-button type="primary" size="mini" @click="pdfdetail(row)">
                    查看文件
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="操作"
                width="80px"
              >
                <template #default="{ row }">
                  <el-button @click="handleValuationDelete(row)" class="danger">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :background="background"
              :current-page="queryFormFile.pageNo"
              :layout="layoutFile"
              :page-size="queryFormFile.pageSize"
              :total="totalFile"
              @current-change="handleCurrentChangeFile"
              @size-change="handleSizeChangeFile"
            ></el-pagination>
          </el-tab-pane> -->
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <receipt ref="receipt" @fetchDataChild="fetchDataChild"></receipt>
    <Contact ref="Contact" @fetchDataChild="fetchDataChild"></Contact>
    <collectMoney ref="collectMoney" @fetchDataChild="fetchDataChild"></collectMoney>
    <ContactAdd ref="ContactAdd" @fetchDataChild="fetchDataChild"></ContactAdd>
    <table-edit5 ref="edit5" @fetchData="fetchData"></table-edit5>
    <express ref="express" @fetchDataChild="fetchDataChild"></express>
    <valuation ref="valuation" @fetchDataChild="fetchDataChild"></valuation>
    <table-edit7 ref="edit7"></table-edit7>
    <table-edit9 ref="edit9"></table-edit9>
    <preview ref="preview"></preview>
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
import receipt from '../components/receipt.vue'
import Contact from '../components/Contact.vue'
import collectMoney from '../components/collectMoney.vue'
import ContactAdd from '../components/ContactAdd.vue'
import express from '../components/express.vue'
import TableEdit7 from '../components/express1.vue'
import TableEdit5 from '../components/contractCalibrationManagement.vue'
import TableEdit9 from '../components/Contact1.vue'
import ContactForm from '../form/ContractCalibrationForm.vue'
import preview from '@/components/fileAbout/preview'
import valuation from '../components/valuation.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    receipt,
    Contact,
    collectMoney,
    ContactAdd,
    express,
    TableEdit7,
    TableEdit9,
    ContactForm,
    treeData,
    valuation,
    preview,
    TableEdit5
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
      sponsor_org_options: [],
      listContract: [],
      listReceipt: [],
      listReceivable: [],
      listContacts: [],
      listReceived: [],
      listPost: [],
      listValuation: [],
      listFile: [],
      listContactRecord: [],
      listrow:[],
      list3: [],
      list4: [],
      imageList: [],
      contract_type_options: [
        {item_name: '承揽合同',item_id: '1'},
        {item_name: '委外合同',item_id: '2'},
        {item_name: '设备采购合同',item_id: '0'},
        {item_name: '校检合同',item_id: '3'},
        {item_name: '消耗品合同',item_id: '4'}
      ],
      listLoading: true,
      listChildLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      layoutMain: 'total, sizes, prev, pager, next, jumper',
      layoutReceipt: 'total, sizes, prev, pager, next, jumper',
      layoutReceivable: 'total, sizes, prev, pager, next, jumper',
      layoutContacts: 'total, sizes, prev, pager, next, jumper',
      layoutContactRecord: 'total, sizes, prev, pager, next, jumper',
      layoutReceived: 'total, sizes, prev, pager, next, jumper',
      layoutPost: 'total, sizes, prev, pager, next, jumper',
      layoutFile: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      totalMain: 0,
      totalReceipt: 0,
      totalReceivable: 0,
      totalContacts: 0,
      totalReceived: 0,
      totalPost: 0,
      totalFile: 0,
      totalContactRecord: 0,
      totalContractRecord: 0,
      background: true,
      selectRows: '',

      elementLoadingText: '正在加载...',
      form: {
        sponsor_org: '',
        summoney: '0',
        suminvoice: '0',
        sumneedmoney: '0',
        contract_type: '3'
      },
      search: {
        contract_no: '',
        contract_name: '',
        contract_signdate: '',
        sponsor_org: ""

      },
      queryFormMain: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormReceipt: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormReceivable: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormContacts: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormReceived: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormPost: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormFile: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormContactRecord: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormContractRecord: {
        pageNo: 1,
        pageSize: 20,
      },
      value1: '',
      value2: '',
      table: {
        tableHeightMain: this.$baseTableHeight()*0.5,
        tableHeightChild: this.$baseTableHeight()*0.4,
        tableHeightChild1: this.$baseTableHeight()*0.3,
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
    this.fetchData(),
    this.fetchDataChild()
  },

  methods: {
    ContactFormAdd() {
      this.$refs['ContactForm'].save()

    },
    transferTable() {
      this.$baseConfirm('是否跳转到合同台账?如果要继续添加请点击取消。', null, async () => {
        this.$router.push('/contractCalibrationManage?tabs=1')
        this.fetchData()
      })
    },
    type_change() {
      this.fetchData()
      this.fetchDataChild()
    },
    handleSetRows(row) {
      this.fetchDataChild(row)
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
    handleValuationAdd(row) {
      this.$refs['edit5'].showEdit(row,'3')
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
    handleReceiptAdd(row) {
      this.$refs['receipt'].showEdit(row)
    },
    handleReceiptEdit(row) {
      this.$refs['receipt'].showEdit(row,'0')
    },
    handleUploadvaluation(row) {
      this.$refs['valuation'].showEdit(row)
    },
    handleReceiptDelete(row) {
      if (row.invoice_id) {
        this.$baseConfirm('你确定要删除发票号为'+row.invoice_no+'的发票记录吗?', null, async () => {
          let sData = '[Q]222{'+row.invoice_id+'}|^1|^SYS'
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
      if (row.history_id) {
        this.$baseConfirm('你确定要删除此条的联系记录吗?', null, async () => {
          let sData = '[Q]354{'+row.history_id+'}|^1|^SYS'
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
    handleReceivedAdd(row) {
      this.$refs['collectMoney'].showEdit(row)
    },
    handleReceivableAdd(row) {
      this.$refs['collectMoney'].showEdit(row, '1')
    },
    handleReceivedEdit(row) {
      if(row.data_id==='')
      {
        this.$refs['collectMoney'].showEdit(row, '2')
      }
      else{
        this.$refs['collectMoney'].showEdit(row, '3')
      }
    },
    handleReceivedDelete(row) {
      if (row.receive_id) {
        this.$baseConfirm('你确定要删除此条收款记录吗?', null, async () => {
          if(row.receivable_id)
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
                this.fetchDataChild(this.listrow)
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
              this.fetchDataChild(this.listrow)
            }
            else{
              this.$baseMessage("删除失败", 'error')
            }
          }

        })
      }
    },

    handleEdit(row) {
      this.$refs['edit5'].showEdit(row,'1')
    },
    handlePostAdd(row) {
      this.$refs['express'].showEdit(row)
    },
    handlePostEdit(row) {
      this.$refs['express'].showEdit(row, '0')
    },
    handlePostDelete(row) {
      if (row.express_id) {
        this.$baseConfirm('你确定要删除邮寄给'+row.receiver+'的'+row.post_name+'吗?', null, async () => {
          let sData = '[Q]343{'+row.express_id+'}|^1|^SYS'
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

    handleCHAdd(row) {
      this.$refs['Contact'].showEdit(row)
    },
    handleCHEdit(row) {
      this.$refs['Contact'].showEdit(row,'0')
    },
    handleContactEdit(row) {
      this.$refs['ContactAdd'].showEdit(row,'0')
    },
    handleAdd9(row, row1) {
      this.$refs['edit9'].showEdit(row, row1)
    },
    handleDeleteContract(row) {
      if (row.contract_id) {
        this.$baseConfirm('你确定要删除此条合同记录吗?', null, async () => {
          let sData = '[Q]276{'+row.contract_id+'}|^1|^SYS'
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
    handleContactAdd(row) {
      this.$refs['ContactAdd'].showEdit(row)
    },
    handleDeleteContact(row) {
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
    handleValuationDelete(row) {
      if(row.enclosure_id)
      {
        this.$baseConfirm('你确定要删除此验工计价扫描件吗?', null, async () => {
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
    // handlePostDelete(row) {
    //   if(row.express_id)
    //   {
    //     this.$baseConfirm('你确定要删除此快递记录吗?', null, async () => {
    //       let sData = '[Q]343{'+row.express_id+'}|^1|^SYS'
    //       const res = await ExecSql(sData)
    //       if(res>0)
    //       {
    //         this.$baseMessage("删除成功", 'success')
    //         this.fetchDataChild(this.listrow)
    //       }
    //       else{
    //         this.$baseMessage("删除失败", 'error')
    //       }
    //     })
    //   }
    // },
    handleSizeChange(val) {
      this.queryFormMain.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryFormMain.pageNo = val
      this.fetchData()
    },
    handleSizeChangeMain(val) {
      this.queryFormMain.pageSize = val
      this.fetchData()
    },
    handleCurrentChangeFile(val) {
      this.queryFormFile.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeMain(val) {
      this.queryFormMain.pageNo = val
      this.fetchData()
    },
    handleSizeChangeReceivable(val) {
      this.queryFormReceivablepageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeReceivable(val) {
      this.queryFormReceivable.pageNo = val
      this.fetchDataChild()
    },
    handleSizeChangeReceipt(val) {
      this.queryFormReceipt.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeReceipt(val) {
      this.queryFormReceipt.pageNo = val
      this.fetchDataChild()
    },
    handleSizeChangeContacts(val) {
      this.queryFormContacts.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeContacts(val) {
      this.queryFormContacts.pageNo = val
      this.fetchDataChild()
    },
    handleSizeChangeReceived(val) {
      this.queryFormReceived.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeReceived(val) {
      this.queryFormReceived.pageNo = val
      this.fetchDataChild()
    },
    handleSizeChangePost(val) {
      this.queryFormPost.pageSize = val
      this.fetchDataChild()
    },
    handleSizeChangeFile(val) {
      this.queryFormFile.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangePost(val) {
      this.queryFormPost.pageNo = val
      this.fetchDataChild()
    },
    handleSizeChangeContactRecord(val) {
      this.queryFormContactRecord.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeContactRecord(val) {
      this.queryFormContactRecord.pageNo = val
      this.fetchDataChild()
    },
    handleSizeChangeContractRecord(val) {
      this.queryFormContractRecord.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentChangeContractRecord(val) {
      this.queryFormContractRecord.pageNo = val
      this.fetchDataChild()
    },
    handleQuery() {
      this.queryFormMain.pageNo = 1
      this.fetchData()
    },
    async fetchDataChild(val)
    {
      this.listChildLoading=true
      if(val && val.customer_id)
      {
        this.listrow=val
        let sDataReceipt = '[Q]213{'+val.contract_id+'$`'+((Number(this.queryFormReceipt.pageNo)-1)*Number(this.queryFormReceipt.pageSize)).toString()+'$`'+this.queryFormReceipt.pageSize+'}|^SYS'
        const resReceipt = await QueryExec(sDataReceipt)
        console.log(this.listrow)
        if(resReceipt.data.length!=0)
        {
          resReceipt.data.forEach((item, index) => {
            const prefix = ViewfileUrl(18)
            item.file_table = {
            	name: item.invoice_file,
            	src: prefix + item.invoice_file
            }
            item.contract_no = val.contract_no
            item.contract_name = val.contract_name
            item.receipt = item.invoice_file
          })
        }
        this.listReceipt = resReceipt.data
        this.totalReceipt = resReceipt.totalCount

        let sDataReceivable = '[Q]374{'+this.contract_id+'$`'+((Number(this.queryFormReceivable.pageNo)-1)*Number(this.queryFormReceivable.pageSize)).toString()+'$`'+this.queryFormReceivable.pageSize+'}|^SYS'
        const resReceivable = await QueryExec(sDataReceivable)
        console.log(resReceivable)
        this.listReceivable = resReceivable.data
        this.totalReceivable = resReceivable.totalCount

        let sDataReceived = '[Q]226{'+val.contract_id+'$`'+((Number(this.queryFormReceived.pageNo)-1)*Number(this.queryFormReceived.pageSize)).toString()+'$`'+this.queryFormReceived.pageSize+'}|^SYS'
        const resReceived = await QueryExec(sDataReceived)
        console.log(resReceived)
        this.listReceived = resReceived.data
        this.totalReceived = resReceived.totalCount

        let sDatax = '[Q]254{'+val.contract_id+'}|^SYS'
        const resx = await QueryExec(sDatax)
        console.log(resx)
        if(resx.data.length>0)
        {
          this.form.summoney=resx.data[0].Total
        }
        else{
          this.form.summoney='0'
        }

        let sDatax1 = '[Q]277{'+val.contract_id+'}|^SYS'
        const resx1 = await QueryExec(sDatax1)
        console.log(resx1)
        if(resx1.data.length>0)
        {
          this.form.sumneedmoney=resx1.data[0].Total
        }
        else{
          this.form.sumneedmoney='0'
        }

        let sDatax2 = '[Q]278{'+val.contract_id+'}|^SYS'
        const resx2 = await QueryExec(sDatax2)
        console.log(resx2)
        if(resx2.data.length>0)
        {
          this.form.suminvoice=resx2.data[0].Total
        }
        else{
          this.form.suminvoice='0'
        }

        let sDataPost = '[Q]231{'+val.contract_id+'$`'+((Number(this.queryFormPost.pageNo)-1)*Number(this.queryFormPost.pageSize)).toString()+'$`'+this.queryFormPost.pageSize+'}|^SYS'
        const resPost = await QueryExec(sDataPost)
        console.log(sDataPost)
        if(resPost.data.length!=0)
        {
          resPost.data.forEach((item, index) => {
            item.contract_no = val.contract_no
            item.contract_name = val.contract_name
            item.customer_name = val.customer_name
          })
        }
        this.listPost = resPost.data
        this.totalPost = resPost.totalCount

        let sDataContacts = '[Q]214{'+val.customer_id+'$`'+((Number(this.queryFormContacts.pageNo)-1)*Number(this.queryFormContacts.pageSize)).toString()+'$`'+this.queryFormContacts.pageSize+'}|^SYS'
        const resContacts = await QueryExec(sDataContacts)
        console.log(resContacts)
        if(resContacts.data.length!=0)
        {
          resContacts.data.forEach((item, index) => {
            item.contract_id = val.contract_id
          })
        }
        this.listContacts = resContacts.data
        this.totalContacts = resContacts.totalCount

        let sDataContactRecord = '[Q]236{'+val.contract_id+'$`0$`'+((Number(this.queryFormContactRecord.pageNo)-1)*Number(this.queryFormContactRecord.pageSize)).toString()+'$`'+this.queryFormContactRecord.pageSize+'}|^SYS'
        const resContactRecord = await QueryExec(sDataContactRecord)
        console.log(resContactRecord)
        this.listContactRecord = resContactRecord.data
        this.totalContactRecord = resContactRecord.totalCount

        let sDataEntrustContract = '[Q]301{'+this.current_org+'$`'+val.contract_id+'$`'+((Number(this.queryFormContractRecord.pageNo)-1)*Number(this.queryFormContractRecord.pageSize)).toString()+'$`'+this.queryFormContractRecord.pageSize+'}|^SYS'
        const resEntrustContract = await QueryExec(sDataEntrustContract)
        console.log(sDataEntrustContract)
        resEntrustContract.data.forEach((item, index) => {
          const prefix = ViewfileUrl(20)
          item.contract_filename_table = {
          	name: item.contract_filename,
          	src: prefix + item.contract_filename
          }
          item.sum4 = Number(item.sum3)-Number(item.sum2)
          item.sum5 = Number(item.sum1)-Number(item.sum2)
        })
        this.listValuation = resEntrustContract.data
        this.totalContractRecord = resEntrustContract.totalCount

        let sDataFile = '[Q]311{'+val.contract_id+'$`0$`'+((Number(this.queryFormFile.pageNo)-1)*Number(this.queryFormFile.pageSize)).toString()+'$`'+this.queryFormContactRecord.pageSize+'}|^SYS'
        const resFile = await QueryExec(sDataFile)
        console.log(sDataFile)
        resFile.data.forEach((item, index) => {
          const prefix = ViewfileUrl(12)
          item.file_table = {
          	name: item.enclosure_file,
          	src: prefix + item.enclosure_file
          }
        })
        this.listFile = resFile.data
        this.totalFile = resFile.totalCount
      }

      setTimeout(() => {
        this.listChildLoading = false
      }, 500)
    },
    async fetchData() {
      this.listLoading=true
      let sDatax = '[Q]209{主办单位}|^SYS'
      const resx = await QueryExec(sDatax)
      console.log(resx)
      this.sponsor_org_options=resx.data



      let sData = '[Q]212{'+this.current_org+'$`%'+this.search.contract_no+'%$`%'+this.search.contract_name+'%$`'+this.search.sponsor_org+'$`'+this.form.contract_type+'$`'+((Number(this.queryFormMain.pageNo)-1)*Number(this.queryFormMain.pageSize)).toString()+'$`'+this.queryFormMain.pageSize+'$`}|^SYS'
      const res = await QueryExec(sData)
      console.log(sData)
      this.listContract = res.data
      const imageList = []
      if(res.data.length!=0)
      {
        res.data.forEach((item, index) => {
          const prefix = ViewfileUrl(12)
          item.file_table = {
          	name: item.contract_filename,
          	src: prefix + item.contract_filename
          }
          item.sum4 = Number(item.sum3)-Number(item.sum2)
          item.sum5 = Number(item.sum1)-Number(item.sum2)
        })
      }
      this.imageList = imageList
      this.totalMain = res.totalCount

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

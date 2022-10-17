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
              <el-date-picker
                v-model="search.year"
                type="year"
                format="yyyy 年"
                value-format="yyyy"
                placeholder="请选择合同年份">
              </el-date-picker>
            </div>
            <div class="block">
              <el-select v-model="search.contract_state" clearable filterable placeholder="请选择合同状态">
                <el-option
                  v-for="item in contract_state_options"
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
            label="合同状态"
            prop="contract_state"
            width="80"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.contract_state=='在建'" type="warning">在建
              </el-tag>
              <el-tag v-else-if="scope.row.contract_state=='已完成'" type="success">已完成
              </el-tag>
              <el-tag v-else-if="scope.row.contract_state=='废止'" type="danger">废止
              </el-tag>
              <el-tag v-else>{{scope.row.contract_state}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
             show-overflow-tooltip
             label="所属部门"
             prop="org_name"
             width="120px"
           ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属合同"
            prop="parent_name"
            width="300px"
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
             width="350px"
           ></el-table-column>
           <el-table-column
             show-overflow-tooltip
             label="客户名称"
             prop="customer_name"
             width="250px"
           ></el-table-column>
          <el-table-column
             show-overflow-tooltip
             prop="contract_signdate"
             label="签订日期"
             width="100px"
           ></el-table-column>
           <el-table-column
             show-overflow-tooltip
             label="合同额(万元)"
             prop="contract_money"
             width="110px"
           ></el-table-column>
          <el-table-column width="105px"   label="合同扫描件">
             <template #default="{ row }">
               <el-button type="primary" size="mini" @click="pdfdetail(row)">
                 查看文件
               </el-button>
             </template>
           </el-table-column>
           <el-table-column
             show-overflow-tooltip
             prop="sum1"
             label="应收金额(万元)"
             width="120px"
           ></el-table-column>
           <el-table-column
             show-overflow-tooltip
             label="已收金额(万元)"
             prop="sum2"
             width="120px"
           ></el-table-column>
           <el-table-column
             show-overflow-tooltip
             label="剩余应收(万元)"
             prop="sum5"
             width="120px"
           ></el-table-column>
           <el-table-column
             show-overflow-tooltip
             label="发票已开(万元)"
             prop="sum3"
             width="120px"
           ></el-table-column>
           <el-table-column
             show-overflow-tooltip
             label="发票未收(万元)"
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
                  <el-button @click="handleValuAdd(row)">添加验工计价</el-button>
                  <el-button @click="handleReceivedAdd(row)">添加收款历史</el-button>
                  <el-button @click="handlePostAdd(row)">添加快递</el-button>
                  <el-button @click="handleContactAdd(row)">添加联系人</el-button>
                  <el-button @click="handleCHAdd(row)">添加联系记录</el-button>
                  <el-button @click="handleUploadvaluation(row)">验工计价扫描件</el-button>
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
          <el-tab-pane label="验工计价">
            <el-row :gutter="10">
<!--              <el-col :span="16" style="text-align: right;">
                <el-form
                  ref="form"
                  :model="queryForm"
                  :inline="true"
                  @submit.native.prevent

                >
                  <el-form-item>
                    <el-input
                      style="border-radius: 30px"
                      v-model="queryFormChild.title"
                      placeholder="按检测项目名称查询"
                      prefix-icon="el-icon-search"
                    >
                      <template #append>
                        <el-button icon="el-icon-search" @click="handleQuery" ></el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-col> -->
              <el-col :span="8">
                <el-table
                  ref="tableSort"
                  v-loading="listChildLoading"
                  :data="listValu"
                  border
                  :element-loading-text="elementLoadingText"
                  highlight-current-row
                  :height="table.tableHeightChild"
                  @selection-change="setSelectRows"
                  @sort-change="tableSortChange"
                  @row-click="rowselectValu"
                  :header-cell-style="{ background: '#e8f0ff' }"
                >
                  <el-table-column
                    show-overflow-tooltip
                    label="合同编号"
                    prop="contract_no"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="计价日期"
                    prop="date1"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="计价金额(万元)"
                    prop="sumamount"
                  ></el-table-column>


                  <el-table-column
                    show-overflow-tooltip
                    label="操作"
                    width="60px"
                  >
                    <template #default="{ row }">
                      <el-dropdown trigger="click" placement="left-start">
                        <el-button
                          icon="el-icon-s-fold"
                          class="el-dropdown-link"
                          type="primary"
                        ></el-button>
                        <el-dropdown-menu slot="dropdown" class="more">
                          <el-button @click="handleValuEdit(row)">修改</el-button>
                          <el-button @click="handleValuDelete(row)">删除</el-button>
                          <el-button @click="handleEditDetail(row)">计价明细添加</el-button>
                          <el-button v-if="row.sumamount!==''" @click="handleEditDetailEdit(row)">已计价编辑</el-button>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  :background="background"
                  :current-page="queryFormValu.pageNo"
                  :layout="layoutValu"
                  :page-size="queryFormValu.pageSize"
                  :total="totalValu"
                  @current-change="handleCurrentValuChange"
                  @size-change="handleSizeValuChange"
                ></el-pagination>
              </el-col>
              <el-col :span="16">
                <el-table
                  ref="tableSort"
                  v-loading="listChildLoading"
                  :data="listReceivable"
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
                    label="验工项目"
                    prop="object_name"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="计价单价"
                    prop="unitprice"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="计价数量"
                    prop="count"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    label="计价金额(万元)"
                    prop="amount"
                  ></el-table-column>


                  <el-table-column
                    show-overflow-tooltip
                    label="操作"
                    width="120px"
                  >
                    <template #default="{ row }">
                      <el-button
                        type="primary"
                        class="danger"
                        @click="handleReceivableDelete(row)"
                      >
                        删除
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
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="已付款历史">
            <el-form ref="form" :model="form">
              <el-form-item label="付款合计:" prop="">
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
                label="金额(万元)"
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
                label="物品名称"
                prop="post_name"
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
              <el-table-column
                show-overflow-tooltip
                label="客户名称"
                prop="customer_id"
              ></el-table-column>
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
                label="联系情况"
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
                prop="create_time"
              ></el-table-column>
<!--              <el-table-column
                show-overflow-tooltip
                label="下次联系日期"
                prop="next_time"
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
          <el-tab-pane label="验工计价扫描件">
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
              :current-page="queryFormContactRecord.pageNo"
              :layout="layoutContactRecord"
              :page-size="queryFormContactRecord.pageSize"
              :total="totalContactRecord"
              @current-change="handleCurrentChangeContactRecord"
              @size-change="handleSizeChangeContactRecord"
            ></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <receipt ref="receipt" @fetchDataChild="fetchDataChild"></receipt>
    <Contact ref="Contact" @fetchDataChild="fetchDataChild"></Contact>
    <collectMoney ref="collectMoney" @fetchDataChild="fetchDataChild"></collectMoney>
    <table-edit5 ref="edit5" @fetchData="fetchData"></table-edit5>
    <express ref="express" @fetchDataChild="fetchDataChild"></express>
    <valuation ref="valuation" @fetchDataChild="fetchDataChild"></valuation>
    <contractValuation ref="contractValuation" @fetchDataChild="fetchDataChild"></contractValuation>
    <ContractReceivable ref="ContractReceivable" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></ContractReceivable>
    <ContactAdd ref="ContactAdd" @fetchDataChild="fetchDataChild"></ContactAdd>
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
import TableEdit5 from '../components/contractEntrustManagement.vue'
import express from '../components/express.vue'
import TableEdit7 from '../components/express1.vue'
import TableEdit9 from '../components/Contact1.vue'
import ContactForm from '../form/ContractEntrustForm.vue'
import preview from '@/components/fileAbout/preview'
import valuation from '../components/valuation.vue'
import treeData from './../../vab/tree/index'
import contractValuation from '../components/contractValuation.vue'
import ContractReceivable from '../components/contractReceivable.vue'
import ContactAdd from '../components/ContactAdd.vue'
export default {
  name: 'ComprehensiveTable',
  components: {
    receipt,
    Contact,
    collectMoney,
    TableEdit5,
    express,
    TableEdit7,
    TableEdit9,
    ContactForm,
    treeData,
    valuation,
    preview,
    contractValuation,
    ContractReceivable,
    ContactAdd
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
      listValu: [],
      listReceipt: [],
      listReceivable: [],
      listContacts: [],
      listReceived: [],
      listPost: [],
      listValuation: [],
      listContactRecord: [],
      listrow:[],
      list3: [],
      list4: [],
      imageList: [],
      listLoading: true,
      listChildLoading: true,
      listChildChildLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      layoutMain: 'total, sizes, prev, pager, next, jumper',
      layoutReceipt: 'total, sizes, prev, pager, next, jumper',
      layoutReceivable: 'total, sizes, prev, pager, next, jumper',
      layoutContacts: 'total, sizes, prev, pager, next, jumper',
      layoutContactRecord: 'total, sizes, prev, pager, next, jumper',
      layoutReceived: 'total, sizes, prev, pager, next, jumper',
      layoutPost: 'total, sizes, prev, pager, next, jumper',
      layoutValu: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      totalMain: 0,
      totalReceipt: 0,
      totalReceivable: 0,
      totalContacts: 0,
      totalReceived: 0,
      totalPost: 0,
      totalValu: 0,
      totalContactRecord: 0,
      background: true,
      selectRows: '',

      elementLoadingText: '正在加载...',
      form: {
        sponsor_org: '',
        summoney: '0',
        suminvoice: '0',
        sumneedmoney: '0',
        contract_type: '2'
      },
      search: {
        contract_no: '',
        contract_name: '',
        contract_signdate: '',
        sponsor_org: "",
        contract_state: "",
        year: "",
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
      queryFormContactRecord: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormFile: {
        pageNo: 1,
        pageSize: 20,
      },
      queryFormValu: {
        pageNo: 1,
        pageSize: 20,
      },
      value1: '',
      value2: '',
      table: {
        tableHeightMain: this.$baseTableHeight()*0.7,
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
        this.$router.push('/contractEntrustManagement?tabs=1')
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
    handleEntrustDetail(row) {
      this.$router.push('/contractEntrustManagement?tabs=1')
    },
    handleValuAdd(row) {
      this.$refs['contractValuation'].showEdit(row)
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
    handleValuEdit(row) {
      this.$refs['contractValuation'].showEdit(row,'2')
    },
    handleValuDelete(row) {
      if (row.valuation_id) {
        this.$baseConfirm('你确定要删除此条验工计价记录吗?', null, async () => {
          let sData = '[Q]756{'+row.valuation_id+'}|^1|^SYS'
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
    handleContactAdd(row) {
      this.$refs['ContactAdd'].showEdit(row)
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
    handleSizeValuChange(val) {
      this.queryFormValu.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentValuChange(val) {
      this.queryFormValu.pageNo = val
      this.fetchDataChild()
    },
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
    handleEditDetail(row) {
      this.$refs['ContractReceivable'].showEdit(row)
    },
    handleEditDetailEdit(row) {
      this.$refs['ContractReceivable'].showEdit(row,'1')
    },
    handleQuery() {
      this.queryFormMain.pageNo = 1
      this.fetchData()
    },
    async rowselectValu(row) {
      if(row)
      {
        let sData = '[Q]444{'+row.valuation_id+'$`$`'+((Number(this.queryFormReceivable.pageNo)-1)*Number(this.queryFormReceivable.pageSize)).toString()+'$`'+this.queryFormReceivable.pageSize+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData)
        this.listReceivable = res.data
        this.totalReceivable = res.totalCount
      }
    },
    async fetchDataChild(val)
    {
      this.listChildLoading=true
      if(!val)
      {
        val=this.listrow
      }
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

        let sDataValu = '[Q]654{'+val.contract_id+'$`'+((Number(this.queryFormValu.pageNo)-1)*Number(this.queryFormValu.pageSize)).toString()+'$`'+this.queryFormValu.pageSize+'}|^SYS'
        const resValu = await QueryExec(sDataValu)
        console.log(resValu)
        this.listValu = resValu.data
        this.totalValu = resValu.totalCount


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
        console.log(sDataContactRecord)
        this.listContactRecord = resContactRecord.data
        this.totalContactRecord = resContactRecord.totalCount

        // let sDataEntrustContract = '[Q]301{'+this.current_org+'$`'+val.contract_id+'$`'+((Number(this.queryFormContractRecord.pageNo)-1)*Number(this.queryFormContractRecord.pageSize)).toString()+'$`'+this.queryFormContractRecord.pageSize+'}|^SYS'
        // const resEntrustContract = await QueryExec(sDataEntrustContract)
        // console.log(sDataEntrustContract)
        // resEntrustContract.data.forEach((item, index) => {
        //   const prefix = ViewfileUrl(12)
        //   item.file_table = {
        //   	name: item.contract_filename,
        //   	src: prefix + item.contract_filename
        //   }
        //   item.sum4 = Number(item.sum3)-Number(item.sum2)
        //   item.sum5 = Number(item.sum1)-Number(item.sum2)
        // })
        // this.listValuation = resEntrustContract.data
        // this.totalContractRecord = resEntrustContract.totalCount

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
      }, 100)
    },
    async fetchData() {
      this.listLoading=true
      let sDatax = '[Q]209{主办单位}|^SYS'
      const resx = await QueryExec(sDatax)
      let sData1 = '[Q]676{合同状态}|^SYS'
      const res1 = await QueryExec(sData1)
      this.contract_state_options=res1.data
      this.sponsor_org_options=resx.data
      console.log(resx)
      this.sponsor_org_options=resx.data

      this.$refs['ContactForm'].displayEntrust()


      let sData = '[Q]212{'+this.current_org+'$`%'+this.search.contract_no+'%$`%'+this.search.contract_name+'%$`'+this.search.year+'$`'+this.search.contract_state+'$`'
      +this.search.sponsor_org+'$`'+this.form.contract_type+'$`'+((Number(this.queryFormMain.pageNo)-1)*Number(this.queryFormMain.pageSize)).toString()+'$`'+this.queryFormMain.pageSize+'}|^SYS'
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
  },
}
</script>

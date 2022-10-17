<template>
  <div class="definition purchase contract equipment_btn calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
      style="height: calc(100vh)"
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
<!--            <div class="block">
              <el-select v-model="search.sponsor_org" style="width: 100%" filterable placeholder="请选择">
                <el-option
                  v-for="item in sponsor_org_options"
                  :key="item.item_name"
                  :label="item.item_name"
                  :value="item.item_name">
                </el-option>
              </el-select>
            </div> -->
            <!-- <el-form-item> -->
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
            >
              查询
            </el-button>

							<el-button type="primary" @click="contractExport">导出台账</el-button>
              <el-button type="primary" @click="contractExportCollect">导出进款</el-button>

            <!-- </el-form-item> -->
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableMain"

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
            label="合同额(万元)"
            prop="contract_money"
            width="110px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sum1"
            label="验工计价合同(万元)"
            width="150px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="总进款(万元)"
            prop="sum2"
            width="120px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="2021年底前进款(万元)"
            prop="incomeHistory"
            width="180px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="发票已开(万元)"
            prop="sum3"
            width="120px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="已开发票未进款(万元)"
            prop="sum4"
            width="170px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="质保金(万元)"
            prop="sum4"
            width="120px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="2022年进款(万元)"
            prop="incomeNowYear"
            width="140px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="力争进款(万元)"
            prop="plan_amount"
            width="120px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="确保进款(万元)"
            prop="protect_amount"
            width="120px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="项目负责人"
            prop="person_name"
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
            label="发票未开(万元)"
            prop="sum6"
            width="120px"
          ></el-table-column>
         <el-table-column width="105px"   label="合同扫描件">
            <template #default="{ row }">
              <el-button type="primary" size="mini" @click="pdfdetail(row)">
                查看文件
              </el-button>
            </template>
          </el-table-column>
          
          


          <el-table-column   label="操作" fixed="right" width="100px">
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
                  <el-button @click="handleMemoAdd(row)">添加备忘录</el-button>
                  <el-button @click="handleValuationAdd(row)">添加委外合同</el-button>
                  <el-button @click="handleUploadvaluation(row)">上传扫描件</el-button>
                  <el-button @click="handleContractMove(row)">合同迁移</el-button>
                  <el-button @click="handleContractMove(row)">归档</el-button>
                  <el-button @click="handleProjectPerson(row)">关联项目负责人</el-button>
                  <el-button @click="handlePlanReceived(row)">力争进款</el-button>
                  <el-button @click="handleConfirmReceived(row)">确保进款</el-button>
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
              <el-table-column width="100px"   label="文件扫描件">
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
            <el-form ref="form" :model="form">
              <el-form-item label="验工计价合计:" prop="">
              	<span>{{form.sumneedmoney}}</span>
              </el-form-item>
            </el-form>
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
                  :height="table.tableHeightChild1"
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
                  :height="table.tableHeightChild1"
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
                prop="customer_name"
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
          <el-tab-pane label="委外合同">
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
            label="合同额(万元)"
            prop="contract_money"
            width="110px"
          ></el-table-column>
         <el-table-column width="100px"   label="合同扫描件">
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
              <el-table-column
                show-overflow-tooltip
                label="操作"
                width="120px"
              >
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    class="normal"
                    @click="handleEntrustDetail(row)"
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
          <el-tab-pane label="扫描件">
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
                label="扫描件名称"
                prop="enclosure_name"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="扫描件类型"
                prop="enclosure_type"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="扫描件日期"
                prop="enclosure_date"
              ></el-table-column>
              <el-table-column width="200px"   label="文件扫描件">
                 <template #default="{ row }">
                  <el-button type="primary" size="mini" @click="pdfdetail(row)">
                    查看文件
                  </el-button>
                  <el-button type="primary" size="mini" @click="downFile(row)">
                    下载文件
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
          </el-tab-pane>
          <el-tab-pane label="记录本">
            <el-table
              ref="tableSort"
              v-loading="listChildLoading"
              :data="listMemo"
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
                label="事项"
                prop="reason"
                min-width="200px"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="情况"
                min-width="300px"
                prop="result"
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
                    @click="handleMemoEdit(row)"
                  >
                    修改
                  </el-button>
                  <el-button @click="handleMemoDelete(row)" class="danger">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :background="background"
              :current-page="queryFormMemo.pageNo"
              :layout="layoutMemo"
              :page-size="queryFormMemo.pageSize"
              :total="totalMemo"
              @current-change="handleCurrentChangeMemo"
              @size-change="handleSizeChangeMemo"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="力争进款与确保进款">
            <el-table
              ref="tableSort"
              v-loading="listChildLoading"
              :data="listPlanReceive"
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
                label="年份"
                prop="year"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="力争进款"
                prop="plan_amount"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="确保进款"
                prop="protect_amount"
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
                    @click="handlePlanReceiveEdit(row)"
                  >
                    修改
                  </el-button>
                  <el-button @click="handlePlanReceiveDelete(row)" class="danger">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <receipt ref="receipt" @fetchDataChild="fetchDataChild" @fetchData="fetchData"></receipt>
    <Contact ref="Contact" @fetchDataChild="fetchDataChild"></Contact>
    <collectMoney ref="collectMoney" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></collectMoney>
    <Reveivable ref="Reveivable" @fetchDataChild="fetchDataChild"></Reveivable>
    <ContactAdd ref="ContactAdd" @fetchDataChild="fetchDataChild"></ContactAdd>
    <table-edit5 ref="edit5" @fetchData="fetchData"></table-edit5>
    <express ref="express" @fetchDataChild="fetchDataChild"></express>
    <valuation ref="valuation" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></valuation>
    <planReceived ref="planReceived" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></planReceived>
    <confirmReceived ref="confirmReceived" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></confirmReceived>
    <MemoComp ref="MemoComp" @fetchDataChild="fetchDataChild"></MemoComp>
    <contractValuation ref="contractValuation" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></contractValuation>
    <ContractReceivable ref="ContractReceivable" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></ContractReceivable>
    <contractAllot ref="contractAllot" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></contractAllot>
    <table-edit7 ref="edit7"></table-edit7>
    <table-edit9 ref="edit9"></table-edit9>
    <contractEntrustManagement ref="contractEntrustManagement" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></contractEntrustManagement>
    <preview ref="preview"></preview>
	<contractExport ref="contractExport"></contractExport>
    <setProjectResponsible ref="setProjectResponsible" @fetchData="fetchData"></setProjectResponsible>
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
  import {
  	openDownloadProxy,
  	GetHost
  } from '@/utils/downLoad'
import receipt from '../components/receipt.vue'
import Contact from '../components/Contact.vue'
import collectMoney from '../components/collectMoney.vue'
import Reveivable from '../components/Reveivable.vue'
import ContactAdd from '../components/ContactAdd.vue'
import express from '../components/express.vue'
import TableEdit7 from '../components/express1.vue'
import TableEdit5 from '../components/contractManagement.vue'
import contractEntrustManagement from '../components/contractEntrustManagement.vue'
import TableEdit9 from '../components/Contact1.vue'
import ContactForm from '../form/ContractForm.vue'
import preview from '@/components/fileAbout/preview'
import valuation from '../components/valuation.vue'
import MemoComp from '../components/Memo.vue'
import contractValuation from '../components/contractValuation.vue'
import ContractReceivable from '../components/contractReceivable.vue'
import contractAllot from '../components/contractAllot.vue'
import contractExport from '../components/contractExport.vue'
import planReceived from '../components/planReceived.vue'
import confirmReceived from '../components/confirmReceived.vue'
import setProjectResponsible from '../components/setProjectResponsible.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    receipt,
    Contact,
    collectMoney,
    Reveivable,
    ContactAdd,
    express,
    TableEdit7,
    TableEdit9,
    ContactForm,
    treeData,
    valuation,
    preview,
    TableEdit5,
    MemoComp,
    contractValuation,
    ContractReceivable,
    contractAllot,
    contractEntrustManagement,
    contractExport,
    planReceived,
    confirmReceived,
    setProjectResponsible
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
      listMemo: [],
      listContactRecord: [],
      listPlanReceive: [],
      listrow:[],
      listreceive:[],
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
      contract_state_options: [],
      listLoading: false,
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
      layoutMemo: 'total, sizes, prev, pager, next, jumper',
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
      totalMemo: 0,
      background: true,
      selectRows: '',
      listValu: [],
      layoutValu: 'total, sizes, prev, pager, next, jumper',
      totalValu: 0,
      queryFormValu: {
        pageNo: 1,
        pageSize: 20,
      },

      elementLoadingText: '正在加载...',
      form: {
        sponsor_org: '',
        summoney: '0',
        suminvoice: '0',
        sumneedmoney: '0',
        contract_type: '1'
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
      queryFormMemo: {
        pageNo: 1,
        pageSize: 20,
      },
      value1: '',
      value2: '',
      table: {
        tableHeightMain: this.$baseTableHeight()*0.7,
        tableHeightChild: this.$baseTableHeight()*0.4,
        tableHeightChild1: this.$baseTableHeight()*0.3,
      },
      selectData: {
        supervisee: [],
      },
      selectTable: {},
      selectQuery: {
        supervisee: {
          query: '',
          page: 0,
          set: new Set(),
        },
      },
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

		contractExport() {
			let row = {}
			row.template_id = 15
			row.param = '@org_id$`' + this.current_org + '|^@contract_state$`'+this.search.contract_state+'|^@contract_type$`1'
			console.log(row)
			this.$refs['contractExport'].showEdit(row)
		},
    contractExportCollect() {
			let row = {}
			row.template_id = 16
			row.param = '@org_id$`' + this.current_org+'|^@contract_type$`1'
			console.log(row)
			this.$refs['contractExport'].showEdit(row)
		},
    toggleSelection(row) {
      this.$refs.tableMain.toggleRowSelection(row)
    },
    transferTable() {
      this.$baseConfirm('是否跳转到合同台账?如果要继续添加请点击取消。', null, async () => {
        this.$router.push('/contractManagement?tabs=1')
        this.fetchData()
      })
    },
    type_change() {
      this.fetchData()
      this.fetchDataChild()
    },
    handleSetRows(row) {
      this.selectTable = row
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
    GetSuffix(src) {
    	try {
    		const list = src.split('.')
    		if (list.length > 0) {
    			return list[list.length - 1]
    		}
    		return ''
    	} catch (e) {
    		console.log(e)
    		return ''
    	}
    },
    downFile(row) {
    	let that = this
      const suffix = that.GetSuffix(row.file_table.src)
    	openDownloadProxy(
    		row.file_table.src, //.replace(baseURL, GetHost() + '/webapi'),
    		row.enclosure_name + '.' + suffix
    	)
    },
    handleValuationAdd(row) {
      this.$refs['contractEntrustManagement'].showEdit(row,'3')
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
    handleReceiptAdd(row) {
      this.$refs['receipt'].showEdit(row)
    },
    handleReceiptEdit(row) {
      this.$refs['receipt'].showEdit(row,'0')
    },
    handleUploadvaluation(row) {
      this.$refs['valuation'].showEdit(row)
    },
    handleContactAdd(row) {
      this.$refs['ContactAdd'].showEdit(row)
    },
    handleContractMove(row) {
      this.$refs['contractAllot'].showEdit(row)
    },
    handleProjectPerson(row) {
      this.$refs['setProjectResponsible'].showEdit(row,'2')
    },
    async handlePlanReceived(row) {
      let sData = '[Q]855{'+row.contract_id+'}|^SYS'
      const res = await QueryExec(sData)
      if(res.data.length>0) {
        this.$refs['planReceived'].showEdit(row,'2')
      }
      else {
        row.plan_amount=0
        row.protect_amount=0
        this.$refs['planReceived'].showEdit(row)
      }

    },
    async handleConfirmReceived(row) {
      let sData = '[Q]855{'+row.contract_id+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      if(res.data.length>0) {
        this.$refs['confirmReceived'].showEdit(row,'2')
      }
      else {
        row.plan_amount=0
        row.protect_amount=0
        this.$refs['confirmReceived'].showEdit(row)
      }

    },
    handlePlanReceiveEdit(row) {
      this.$refs['planReceived'].showEdit(row,'2')

    },
    handlePlanReceiveDelete(row) {
      if(row.planreceived_id)
      {
        this.$baseConfirm('你确定要删除预计收款吗?', null, async () => {
          let sData = '[Q]848{'+row.planreceived_id+'}|^1|^SYS'
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
    handleReceivableDelete(row) {
      console.log(row.receivable_id)
      if (row.receivable_id) {
        this.$baseConfirm('你确定要删除此条收款明细吗?', null, async () => {
          let sData = '[Q]655{'+row.receivable_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            this.$baseMessage("删除成功", 'success')
            this.fetchDataChild(this.listrow)
            this.rowselectValu(this.listreceive)
          }
          else{
            this.$baseMessage("删除失败", 'error')
          }
        })
      }
    },
    async handleReceiptDelete(row) {
      if (row.invoice_id) {
        this.$baseConfirm('你确定要删除发票号为'+row.invoice_no+'的发票记录吗?', null, async () => {
          let sData = '[Q]222{'+row.invoice_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            this.$baseMessage("删除成功", 'success')
            this.fetchDataChild(this.listrow)
            await this.fetchData()

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
    handleEditDetail(row) {
      this.$refs['ContractReceivable'].showEdit(row)
    },
    handleEditDetailEdit(row) {
      this.$refs['ContractReceivable'].showEdit(row,'1')
    },
    handleReceivedAdd(row) {
      this.$refs['collectMoney'].showEdit(row)
    },
    handleAddReceivable(row) {
      this.$refs['Reveivable'].showEdit(row)
    },
    handleEditReceivable(row) {
      this.$refs['Reveivable'].showEdit(row,'2')
    },
    handleDeleteReceivable(row) {
      if (row.receivable_id) {
        this.$baseConfirm('你确定要删除此条验工计价记录吗?', null, async () => {
          let sData = '[Q]405{'+row.receivable_id+'}|^1|^SYS'
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
    async rowselectValu(row) {
      if(row)
      {
        this.listreceive=row
        let sData = '[Q]444{'+row.valuation_id+'$`$`'+((Number(this.queryFormReceivable.pageNo)-1)*Number(this.queryFormReceivable.pageSize)).toString()+'$`'+this.queryFormReceivable.pageSize+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData)
        this.listReceivable = res.data
        this.totalReceivable = res.totalCount
      }
    },
    handleReceivableAdd(row) {
      this.$refs['collectMoney'].showEdit(row, '1')
    },
    handleReceivedEdit(row) {
      row.contract_no = this.listrow.contract_no
      if(row.data_id==='')
      {
        this.$refs['collectMoney'].showEdit(row, '2')
      }
      else{
        this.$refs['collectMoney'].showEdit(row, '3')
      }
    },
    handleReceivedDelete(row) {
      console.log(row)
      if (row.receive_id) {
        this.$baseConfirm('你确定要删除此条收款记录吗?', null, async () => {
          if(row.receivable_id && row.receivable_id !== '0')
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
              else{
                this.$baseMessage("删除成功，但应收款更新失败", 'error')
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
    handleMemoEdit(row) {
      this.$refs['MemoComp'].showEdit(row,'1')
    },
    handleMemoAdd(row) {
      this.$refs['MemoComp'].showEdit(row)
    },
    handleDeleteContract(row) {
      if (row.contract_id) {
        this.$baseConfirm('你确定要删除此条合同记录吗?', null, async () => {
          let sData = '[Q]779{'+row.contract_id+'}|^1|^SYS'
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
    handleMemoDelete(row) {
      if (row.history_id) {
        this.$baseConfirm('你确定要删除此条记录吗?', null, async () => {
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
    handleDelete(row) {
      if(row.express_id)
      {
        this.$baseConfirm('你确定要删除此快递记录吗?', null, async () => {
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
    handleSizeChange(val) {
      this.queryFormMain.pageSize = val
      this.fetchData()
    },
    handleValuEdit(row) {
      this.$refs['contractValuation'].showEdit(row,'2')

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
    handleSizeValuChange(val) {
      this.queryFormValu.pageSize = val
      this.fetchDataChild()
    },
    handleCurrentValuChange(val) {
      this.queryFormValu.pageNo = val
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
    handleCurrentChangeMemo(val) {
      this.queryFormMemo.pageNo = val
      this.fetchDataChild()
    },
    handleSizeChangeMemo(val) {
      this.queryFormMemo.pageSize = val
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
    handleValuAdd(row) {
      this.$refs['contractValuation'].showEdit(row)
    },
    async fetchDataChild(val)
    {
      console.log(val)
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
        console.log(resReceipt)
        this.listReceipt = resReceipt.data
        this.totalReceipt = resReceipt.totalCount

        let sDataValu = '[Q]654{'+val.contract_id+'$`'+((Number(this.queryFormValu.pageNo)-1)*Number(this.queryFormValu.pageSize)).toString()+'$`'+this.queryFormValu.pageSize+'}|^SYS'
        const resValu = await QueryExec(sDataValu)
        console.log(resValu)
        this.listValu = resValu.data
        this.totalValu = resValu.totalCount
        this.listReceivable = []

        let sDataReceived = '[Q]226{'+val.contract_id+'$`'+((Number(this.queryFormReceived.pageNo)-1)*Number(this.queryFormReceived.pageSize)).toString()+'$`'+this.queryFormReceived.pageSize+'}|^SYS'
        const resReceived = await QueryExec(sDataReceived)
        console.log(resReceived)
        this.listReceived = resReceived.data
        this.totalReceived = resReceived.totalCount

        this.form.summoney=val.sum2
        this.form.sumneedmoney=val.sum1
        this.form.suminvoice=val.sum3

        // let sDatax = '[Q]254{'+val.contract_id+'}|^SYS'
        // const resx = await QueryExec(sDatax)
        // console.log(resx)
        // if(resx.data.length>0)
        // {
        //   this.form.summoney=resx.data[0].Total
        // }
        // else{
        //   this.form.summoney='0'
        // }

        // let sDatax1 = '[Q]277{'+val.contract_id+'}|^SYS'
        // const resx1 = await QueryExec(sDatax1)
        // console.log(resx1)
        // if(resx1.data.length>0)
        // {
        //   this.form.sumneedmoney=resx1.data[0].Total
        // }
        // else{
        //   this.form.sumneedmoney='0'
        // }

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

        let sDataMemo = '[Q]236{'+val.contract_id+'$`1$`'+((Number(this.queryFormMemo.pageNo)-1)*Number(this.queryFormMemo.pageSize)).toString()+'$`'+this.queryFormMemo.pageSize+'}|^SYS'
        const resMemo = await QueryExec(sDataMemo)
        console.log(resMemo)
        this.listMemo = resMemo.data
        this.totalMemo = resMemo.totalCount

        let sDataEntrustContract = '[Q]301{'+this.current_org+'$`'+val.contract_id+'$`'+((Number(this.queryFormContractRecord.pageNo)-1)*Number(this.queryFormContractRecord.pageSize)).toString()+'$`'+this.queryFormContractRecord.pageSize+'}|^SYS'
        const resEntrustContract = await QueryExec(sDataEntrustContract)
        console.log(sDataEntrustContract)
        resEntrustContract.data.forEach((item, index) => {
          const prefix = ViewfileUrl(12)
          item.file_table = {
          	name: item.contract_filename,
          	src: prefix + item.contract_filename
          }
          item.sum4 = Number(item.sum3)-Number(item.sum2)
          item.sum5 = Number(item.sum1)-Number(item.sum2)
        })
        this.listValuation = resEntrustContract.data
        this.totalContractRecord = resEntrustContract.totalCount

        let sDataFile = '[Q]311{'+val.contract_id+'$`$`'+((Number(this.queryFormFile.pageNo)-1)*Number(this.queryFormFile.pageSize)).toString()+'$`'+this.queryFormContactRecord.pageSize+'}|^SYS'
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

        let sDataPlanReceive = '[Q]846{'+val.contract_id+'}|^SYS'
        const resPlanReceive = await QueryExec(sDataPlanReceive)
        console.log(sDataPlanReceive,resPlanReceive)
        this.listPlanReceive = resPlanReceive.data
      }

      setTimeout(() => {
        this.listChildLoading = false
      }, 100)
    },
    async fetchData() {
      // this.listLoading=false
      if(this.search.year===null)
      {
        this.search.year=""
      }
      if(this.search.contract_state===null)
      {
        this.search.contract_state=""
      }
      let sDatax = '[Q]209{主办单位}|^SYS'
      const resx = await QueryExec(sDatax)
      let sData1 = '[Q]676{合同状态}|^SYS'
      const res1 = await QueryExec(sData1)
      this.contract_state_options=res1.data
      this.sponsor_org_options=resx.data
      let sData = '[Q]212{'+this.current_org+'$`%'+this.search.contract_no+'%$`%'+this.search.contract_name+'%$`'+this.search.year+'$`'+this.search.contract_state+'$`'
      +this.search.sponsor_org+'$`'+this.form.contract_type+'$`'+((Number(this.queryFormMain.pageNo)-1)*Number(this.queryFormMain.pageSize)).toString()+'$`'+this.queryFormMain.pageSize+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(sData,res)
      if(res.data.length!=0)
      {
        res.data.forEach((item, index) => {
          const prefix = ViewfileUrl(12)
          // item.sum2 = parseFloat(item.sum2)
          item.file_table = {
          	name: item.contract_filename,
          	src: prefix + item.contract_filename
          }
          item.sum1 = parseFloat(item.sum1)
          item.sum2 = parseFloat(item.sum2)
          item.sum3 = parseFloat(item.sum3)
          item.sum4 = parseFloat(item.sum3)-parseFloat(item.sum2)
          item.sum5 = parseFloat(item.sum1)-parseFloat(item.sum2)
          item.sum6 = parseFloat(item.sum1)-parseFloat(item.sum3)
        })
      }
      this.listContract = res.data
      this.totalMain = res.totalCount
      console.log(this.listrow)
      if(this.listrow)
      {
        console.log(this.listrow)
        this.toggleSelection(this.listrow)
      }
    },

  },
}
</script>

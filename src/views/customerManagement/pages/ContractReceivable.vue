<template>
  <!-- 验工计价 -->
  <div class="definition equipment_btn calc cardStyle">
    <el-tabs value="0" class="box_center">
<!--      <el-tab-pane label="添加发票记录" class="center">
        <div class="usage">
          <ReceiptForm ref="ReceiptForm"></ReceiptForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="ReceiptFormAdd()"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane> -->
      <el-tab-pane label="验工计价">
        <el-row :gutter="24" style="margin:0px;">

          <!-- 左边部分 -->
          <el-col :span="8" class="baseBox" style="height: calc(100vh - 187px);">

            <el-col :span="8" style="padding:0!important; margin-bottom: 10px;">
              <el-button type="primary" @click="handleValuAdd" >添加</el-button>
            </el-col>
            <el-col :span="16" style="padding:0!important;float: right;">
              <el-select  v-model="contract_name" filterable remote placeholder="请输入合同编号关键词用于查询"
                :remote-method="getPersonList" v-loadmore="getPersonListMore"
                style="width:100%" >
                <el-option
                  v-for="item in selectData.supervisee"
                  :key="item.item_id"
                  :label="item.item_name"
                  :value="item.item_id+'^'+item.item_name">
                </el-option>
              </el-select>
            </el-col>

            <el-table
              ref="tableSort"
              v-loading="listLoading"
              :data="list"
              border
              :element-loading-text="elementLoadingText"
              highlight-current-row
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
              @row-click="rowselect"
              :header-cell-style="{ background: '#e8f0ff' }"
              style="height: calc(100vh - 300px);overflow-y: scroll;"
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
                label="计价金额"
                prop="sumamount">
              </el-table-column>
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
                      <el-button @click="handleEdit(row)">修改</el-button>
                      <el-button @click="handleDeleteContract(row)">删除</el-button>
                      <el-button @click="handleEditDetail(row)">计价明细添加</el-button>
                      <el-button v-if="row.sumamount!==''" @click="handleEditDetailEdit(row)">已计价编辑</el-button>
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
          </el-col>

          <!-- 右边部分 -->
          <el-col :span="16" style="padding-left:10px;padding-right:10px;">
            <div class="baseBox" style="height: calc(100vh - 187px);">
              <el-col :span="20" style="float: right;padding:0px!important;margin-bottom: 10px;">

                  <el-col :span="10" style="padding-left:0;">
                    <el-date-picker
                      v-model="queryForm.startdate"
                      style="width: 100%;"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="2" style="align-items: center; line-height: 32px;padding:0px;" >——</el-col>
                  <el-col :span="10">
                    <el-date-picker
                      v-model="queryForm.enddate"
                      style="width: 100%;"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-col>

                  <el-col :span="1" style="padding:0px; margin-right:0px;">
                    <el-button style="" type="primary" @click="handleValuAdd" icon="el-icon-search"></el-button>
                  </el-col>
              </el-col>

              <el-table
                ref="tableSort"
                v-loading="listChildLoading"
                :data="listChild"
                border
                :element-loading-text="elementLoadingText"
                highlight-current-row
                @selection-change="setSelectRows"
                @sort-change="tableSortChange"
                :header-cell-style="{ background: '#e8f0ff' }"style="height: calc(100vh - 300px);overflow-y: scroll;"
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
                  label="计价金额"
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
                :current-page="queryFormChild.pageNo"
                :layout="layoutChild"
                :page-size="queryFormChild.pageSize"
                :total="totalChild"
                @current-change="handleCurrentChildChange"
                @size-change="handleSizeChildChange"
              ></el-pagination>
            </div>
          </el-col>

        </el-row>
        <collectMoney ref="collectMoney" @fetchData="fetchData"></collectMoney>
        <contractValuation ref="contractValuation" @fetchData="fetchData"></contractValuation>
        <ContractReceivable ref="ContractReceivable" @fetchData="fetchData" @fetchDataChild="fetchDataChild"></ContractReceivable>
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
import ReceiptForm from '../form/ReceiptForm.vue'
import ContractReceivable from '../components/contractReceivable.vue'
import contractValuation from '../components/contractValuation.vue'
import collectMoney from '../components/collectMoney.vue'
import preview from '@/components/fileAbout/preview'
export default {
  name: 'ComprehensiveTable',
  components: {
    receipt,
    ReceiptForm,
    treeData,
    preview,
    collectMoney,
    ContractReceivable,
    contractValuation
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
      totalChild: 0,
      listChild: [],
      listChildLoading: true,
      layoutChild: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      elementLoadingText: '正在加载...',
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
      },
      contract_name:'',
      contract_options: [],
      queryFormChild: {
        pageNo: 1,
        pageSize: 20,
        startdate: '',
        enddate: '',
        title: '',
      },
      selectData: {
      	supervisee: [],
      },
      selectQuery: {
      	supervisee: {
      		query: '',
      		page: 0,
      		set: new Set(),
      	},
      },
      dialogFormVisible: false,
      src: '', //pdf地址,这里我用的是我本地的文件,你也可以使用后台的文件
      dialogVisible: false,
      table: {
        tableHeight: this.$(window).height()
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
    this.fetchData()
    this.fetchDataChild()
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
    rowselect(row) {
      this.listrow=row
      this.fetchDataChild(row)
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
    handleReceivableAdd(row) {
      this.$refs['collectMoney'].showEdit(row, '1')
    },
    handleValuAdd(row) {
      let addlist = {
          "contract_id":this.contract_name.split('^')[0],"contract_no":this.contract_name.split('^')[1]
        }
      if(addlist.contract_id==='')
      {
        this.$baseMessage("请选择合同", 'error')
      }
      else
      {
        this.$refs['contractValuation'].showEdit(addlist)
      }

    },
    handleEdit(row) {
      this.$refs['contractValuation'].showEdit(row,'2')
    
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
            this.fetchData()
          }
          else{
            this.$baseMessage("删除失败", 'error')
          }
        })
      }
    },
    getPersonListMore() {
    	this.getPersonList(
    		this.selectQuery.supervisee.query,
    		this.selectQuery.supervisee.page
    	)
    },
    //被监督人数组 ，搜索和懒加载
    async getPersonList(query, page) {
      let that=this
    	console.log(query, page)
    	if (typeof query == 'undefined') {
    		query = ''
    	} else {
        that.selectQuery.supervisee.query = query
      }
    	if (!page) {
    		that.selectQuery.supervisee.page = 0
    		page = 0
    	}
      let sData
      sData = '[Q]441{'+that.current_org+'$`%'+query+'%$`'+((Number(page))*10).toString()+'$`10}|^SYS'
      const res = await QueryExec(sData)
    	const data = res.data

      console.log(sData)
    	//if (typeof query != 'undefined') {
    	//	this.selectData.supervisee = data
    	//} else {
    	if (page === 0) {
    		that.selectData.supervisee = []
        that.selectQuery.supervisee.set = new Set()
        // console.log(that.selectQuery.supervisee)
    		for (let i = 0; i < data.length; i++) {
    			if (!that.selectQuery.supervisee.set.has(data[i].item_id)) {
    				that.selectData.supervisee.push(data[i])
    				that.selectQuery.supervisee.set.add(data[i].item_id)
    			}
    		}
        // console.log(that.selectData.supervisee)
    	} else {
        // console.log(data)
    		for (let i = 0; i < data.length; i++) {

    			if (!that.selectQuery.supervisee.set.has(data[i].item_id)) {
    				that.selectData.supervisee.push(data[i])
    				that.selectQuery.supervisee.set.add(data[i].item_id)
    			}
    		}
    	}

    	that.selectQuery.supervisee.page++
    	//}
    	console.log(that.selectQuery.supervisee)
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    handleSizeChildChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChildChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    handleQuery() {
      this.queryForm.pageNo = 1
      this.fetchData()
    },
    ReceiptFormAdd() {
      this.$refs['ReceiptForm'].save()
    },
    handleEditDetail(row) {
      this.$refs['ContractReceivable'].showEdit(row)
    },
    handleEditDetailEdit(row) {
      this.$refs['ContractReceivable'].showEdit(row,'1')
    },
    async fetchData() {
      this.listLoading = true
      let sDataReceipt = '[Q]421{'+this.current_org+'$`'+'$`'+'$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
      const resReceipt = await QueryExec(sDataReceipt)
      console.log(sDataReceipt)
      this.list = resReceipt.data
      this.total = resReceipt.totalCount
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    async fetchDataChild(row) {
      this.listChildLoading = true
      if(row)
      {
        let sData = '[Q]444{'+row.valuation_id+'$`%'+this.queryFormChild.title+'%$`'+((Number(this.queryFormChild.pageNo)-1)*Number(this.queryFormChild.pageSize)).toString()+'$`'+this.queryFormChild.pageSize+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData)
        this.listChild = res.data
        this.totalChild = res.totalCount
      }

      setTimeout(() => {
        this.listChildLoading = false
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
<style type="text/css">
.cardStyle .el-tabs__header:not(.el-footer .el-tabs__header ) {
    margin: 0 10px 10px 0;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #dbe0e6;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
</style>

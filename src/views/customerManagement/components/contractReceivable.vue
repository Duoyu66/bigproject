<template>
  <el-dialog :title='title' :visible.sync="dialogFormVisible" width="70%" style="margin-top: -50px;">
    <div class="tree-select-display ">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="num" width="100%" placeholder="请输入新加空白行数量"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleAddClick" >添加新的空白行</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right;">
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
                placeholder="按检测项目名称查询"
                prefix-icon="el-icon-search"
              >
                <template #append>
                  <el-button icon="el-icon-search" @click="handleQuery" ></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24" style="margin-top: 10px;">
          <el-table
            ref="tableSort"
            v-loading="listLoading"
            :data="list"
            border
            :element-loading-text="elementLoadingText"
            highlight-current-row
            :height="height"
            type="index"
            @row-click="rowselect"
            @selection-change="setSelectRows"
            @sort-change="tableSortChange"
            :row-class-name="tableRowClassName"
            :header-cell-style="{ background: '#e8f0ff' }"
          >
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
    <!--            <el-button type="text" size="small" @click="finishEditClick(scope)"  v-if="currentEdit === scope.$index">编辑</el-button>
                <el-button type="text" size="small" @click="EditClick(scope)" v-else>保存</el-button> -->
                <el-button @click="handleClick(scope.row)" type="primary" class="danger">删除</el-button>
              </template>
            </el-table-column>

            <div v-for="(item,index) in tableTitle" :key="index" >
              <el-table-column :prop="item.prop" :label="item.title" :min-width="item.width" align='center' >
                <template slot-scope="{row,$index}">
                  <span v-if="currentEdit === $index">{{row[item.prop]}}</span>
                  <tree-select :options="object_name_options" :multiple="false" :load-options="loadOptions" @select="handleSelect"
                  	:placeholder="isReadOnly('请选择验工项目')" :disabled="readonly" v-else-if="item.prop==='object_name'" style="color: #020202;" v-model="row[item.prop_id]" />
                  <el-input v-model="row[item.prop]" @change="inputchange" v-else></el-input>
                </template>
              </el-table-column>
            </div>

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
      </el-row>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="receivable-button" type="primary" @click="handleSubmit">确 定</el-button>
      <el-button class="receivable-button" type="primary" @click="handleSubmitNext">下一页</el-button>
      <el-button class="receivable-button" @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

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
  	TreeDataDeal,
    TreeDataDealEx
  } from '@/global/tree_deal'
  import {
  	ViewfileUrl,
  	UploadFileNameUrl
  } from '@/utils/servicefile'
  import TreeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
  import ReceiveableForm from '../form/ReceiveableForm.vue'
  const simulateAsyncOperation = fn => {
    setTimeout(fn, 2000)
  }
  export default {
    name: 'TableEdit8',
    components: {
      ReceiveableForm,
      TreeSelect
    },
    data() {
      return {
        currentEdit:-1,
        tableTitle: [
          {
            title: "验工项目",
            prop: "object_name",
            width: "300",
            index: 1,
            prop_id: "object_id"
          },
          {
            title: "计价单价",
            prop: "unitprice",
            width: "200",
            index: 2,
            prop_id: "unitprice"
          },
          {
            title: "计价数量",
            prop: "count",
            width: "200",
            index: 3,
            prop_id: "count"
          }
        ],
        form: {
          data_id: '',
          channel:'',
          payee: '',
          amount: '',
          pay_channel: '转账',
          memo: '',
          pay_time: '',
          customer_id: '',
          contract_id: '',
          contract_no: '',
          receivable_id: '',
          receive_id: '',
          object_id: '',
          order_id: '',
          count: '',
          unitprice: '',
          group_id: '0',
          discount: '1',
          charged_amt: '',
          object_id: '',
          valuation_id: ''
        },
        num: '0',
        dialogFormVisible: false,
        editoradd: true,
        formLabelWidth: '120px',
        title: '',
        Contact: [],
        symbol: '0',
        list: [],
        addlist: [
          {object_name: "",object_id: "",unitprice: "0",count: "0"},
          {object_name: "",object_id: "",unitprice: "0",count: "0"},
          {object_name: "",object_id: "",unitprice: "0",count: "0"},
          {object_name: "",object_id: "",unitprice: "0",count: "0"},
          {object_name: "",object_id: "",unitprice: "0",count: "0"},
          {object_name: "",object_id: "",unitprice: "0",count: "0"},
          {object_name: "",object_id: "",unitprice: "0",count: "0"},
          {object_name: "",object_id: "",unitprice: "0",count: "0"},
          {object_name: "",object_id: "",unitprice: "0",count: "0"},
          {object_name: "",object_id: "",unitprice: "0",count: "0"}
        ],
        readonly: false,
        imageList: [],
        listLoading: true,
        elementLoadingText: '正在加载...',
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          title: '',
        },
        selectData: {
        	supervisee: [],
        },
        currentRow: '',
        rowdisplay: [],
        listresult: [],
        object_name_options: [],
        addsymbol: false,
        addway: false,
        editway: false,
        addsituation: false,
        selectQuery: {
        	supervisee: {
        		query: '',
        		page: 0,
        		set: new Set(),
        	},
        },
      }
    },
    created() {

    },
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
    	}),
      height() {
        return this.$baseTableHeight()
      },
    },
    methods: {
      showEdit(row, symbol) {
        if (!row && !symbol) {
          this.title = '添加购入记录'
        }
        else if(!symbol){
          this.title = '验工计价录入'
          this.form = Object.assign({}, row)
          console.log(this.form)
          this.editway = false
          this.symbol='0'
          this.fetchData(this.form)
        }
        else {
          this.title = '验工计价修改'
          this.form = Object.assign({}, row)
          console.log(this.form)
          this.symbol='0'
          this.editway = true
          this.fetchData(this.form)
        }
        this.dialogFormVisible = true
      },
      handleQuery() {
        console.log(this.list)
        this.list[0].object_id = "1201"
      },
      async loadOptions({ action, parentNode, callback }) {
        // Typically, do the AJAX stuff here.
        // Once the server has responded,
        // assign children options to the parent node & call the callback.
        console.log(parentNode)
        if (action === LOAD_CHILDREN_OPTIONS) {
          console.log(parentNode)
          if(parentNode.hasChildren)
          {
            const data = await this.loadTree(parentNode.id,'id','p_id')
            console.log(data)
            parentNode.children = data
            callback()
          }
        }
      },
      async loadTree(group,id,parent_id) {
        let sData = '[Q]402{'+group+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(res)
        const data = TreeDataDealEx(res.data, Number(group),id,parent_id,'hasChildren')
        if(res.data!=undefined)
        {
          res.data.forEach((item, index) => {
            if(item.hasChildren)
            {
              item.children=null
            }
          })
        }
        return data
      },
      isReadOnly(text) {
      	if (this.readonly) {
      		return ''
      	}
      	return text
      },
      close_comp(){
        this.$emit('fetchDataChild',this.form)
        this.$emit('fetchData')
        this.dialogFormVisible = false
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        // this.fetchData()
      },
      handleAddClick() {
        this.queryForm.pageNo = (Number(this.total)+9)/Number(this.queryForm.pageSize)
        if(!this.editway)
        {
          for(let i=0;i<Number(this.num);i++)
          {
            this.list.push({object_name: "",object_id: "",unitprice: "0",count: "0"})
          }
        }
        else
        {
          this.$baseMessage('正在处于添加', 'error')
        }

      },
      pageNextInit() {
        this.addsymbol = true
        this.total=this.total+10
        this.fetchData()
      },
      async fetchData(row) {
        let that = this
        this.listLoading = true
        let listempty = [
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"},
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"},
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"},
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"},
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"},
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"},
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"},
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"},
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"},
          {object_name: "",object_id: "",unitprice: "0",count: "0",state:"I"}
        ]
        const data = await this.loadTree('0','id','p_id')
        console.log(data)
        this.object_name_options=data
        let sDataTotal = '[Q]424{'+row.contract_id+'}|^SYS'
        const restotal = await QueryExec(sDataTotal)
        console.log(restotal)
        let sDataTotal1 = '[Q]449{'+row.valuation_id+'}|^SYS'
        const restotal1 = await QueryExec(sDataTotal1)
        console.log(restotal1)
        if(restotal.total===0)
        {
          this.addway = false
          this.list = listempty
          this.total = 10
        }
        else if(this.addsymbol)
        {
          this.addway = false

          this.queryForm.pageNo = ((Number(this.queryForm.pageNo))+1).toString()
          this.list = listempty
          console.log(this.queryForm.pageNo)
        }
        else if(restotal1.total!==0 && this.editway) //编辑
        {
          let sDataReceipt = '[Q]444{'+this.form.valuation_id+'$`'+this.queryForm.title+'$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
          const resReceipt = await QueryExec(sDataReceipt)
          console.log(sDataReceipt)
          this.list = resReceipt.data
          this.total = resReceipt.totalCount
        }
        else {
          let sDataReceipt = '[Q]445{'+this.queryForm.title+'$`'+row.contract_id+'$`'+((Number(that.queryForm.pageNo)-1)*Number(that.queryForm.pageSize)).toString()+'$`'+that.queryForm.pageSize+'}|^SYS'
          const resReceipt = await QueryExec(sDataReceipt)
          console.log(resReceipt)
          this.list = resReceipt.data
          this.total = resReceipt.totalCount
        }

        console.log(this.addlist)
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      handleSubmitNext(row) {
        let that=this
        let sData = ''
        let amount = 0
        let charged_amt = 0
        let countsuccess = 1
        let counterror = 0
        that.listresult=[]
        that.listresultachieve()
        that.form.amount = parseFloat(that.form.count) * parseFloat(that.form.unitprice)
        that.form.charged_amt = parseFloat(that.form.count) * parseFloat(that.form.unitprice) * parseFloat(that.form.discount)
        console.log(that.listresult)
        let count=0
        that.$baseConfirm('你确定要提交您更改的验工计价数据，同时显示下一页的数据吗?', null, async () => {
          if(that.listresult.length===0)
          {
            that.$baseMessage('您没有进行任何完整更改', 'error')
          }
          else if(this.editway) //修改
          {
            that.listresult.forEach(async(item, index) => {
              amount = parseFloat(item.count) * parseFloat(item.unitprice)
              charged_amt = parseFloat(item.count) * parseFloat(item.unitprice) * 1
              sData = '[Q]656{'+that.current_org+'$`$`'+that.form.contract_id+'$`'
              +amount+'$`1$`'+charged_amt+'$`转账$`1$`'
              +item.object_id+'$`0$`'+item.count+'$`'+item.unitprice+'$`$`'+item.receivable_id+'}|^1|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if(res>0)
              {
                if(countsuccess===1)
                {
                  that.$baseMessage('验工计价修改成功', 'success')
                }
                countsuccess=0
              }
              else
              {
                if(counterror===0)
                {
                  that.$baseMessage('验工计价修改失败', 'error')
                }
                counterror=-1
              }
            })
          }
          else
          {
            that.listresult.forEach(async(item, index) => {
              amount = parseFloat(item.count) * parseFloat(item.unitprice)
              charged_amt = parseFloat(item.count) * parseFloat(item.unitprice) * 1
              sData = '[Q]403{'+that.current_org+'$`$`'+that.form.contract_id+'$`'
              +amount+'$`1$`'+charged_amt+'$`转账$`1$`'
              +item.object_id+'$`0$`'+item.count+'$`'+item.unitprice+'$`$`'+that.form.valuation_id+'}|^2|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if(res>0)
              {
                if(countsuccess===1)
                {
                  that.$baseMessage('验工计价添加成功', 'success')
                  that.pageNextInit()
                }
                countsuccess=0
              }
              else
              {
                if(counterror===0)
                {
                  that.$baseMessage('验工计价添加失败', 'error')
                  that.pageNextInit()
                }
                counterror=-1
              }
            })
          }
        })
      },
      handleSubmit(row) {
        let that=this
        let sData = ''
        let amount = 0
        let charged_amt = 0
        let countsuccess = 1
        let counterror = 0
        that.listresult=[]
        that.listresultachieve()
        that.form.amount = parseFloat(that.form.count) * parseFloat(that.form.unitprice)
        that.form.charged_amt = parseFloat(that.form.count) * parseFloat(that.form.unitprice) * parseFloat(that.form.discount)
        console.log(that.listresult)
        that.$baseConfirm('你确定要提交您更改的验工计价数据,同时完成数据更改吗吗?',null,
        async () => {
          if(that.listresult.length===0)
          {
            that.$baseMessage('您没有进行任何完整更改', 'error')
          }
          else if(this.editway) //修改
          {
            that.listresult.forEach(async(item, index) => {
              amount = parseFloat(item.count) * parseFloat(item.unitprice)
              charged_amt = parseFloat(item.count) * parseFloat(item.unitprice) * 1
              sData = '[Q]656{'+that.current_org+'$`$`'+that.form.contract_id+'$`'
              +amount+'$`1$`'+charged_amt+'$`转账$`1$`'
              +item.object_id+'$`0$`'+item.count+'$`'+item.unitprice+'$`$`'+item.receivable_id+'}|^1|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if(res>0)
              {
                if(countsuccess===1)
                {
                  that.$baseMessage('验工计价添加成功', 'success')
                  that.dialogFormVisible = false
                }
                countsuccess=0
              }
              else
              {
                if(counterror===0)
                {
                  that.$baseMessage('验工计价添加失败', 'error')
                }
                counterror=-1
              }
            })
          }
          else{
            that.listresult.forEach(async(item, index) => {
              amount = parseFloat(item.count) * parseFloat(item.unitprice)
              charged_amt = parseFloat(item.count) * parseFloat(item.unitprice) * 1
              sData = '[Q]403{'+that.current_org+'$`$`'+that.form.contract_id+'$`'
              +amount+'$`1$`'+charged_amt+'$`转账$`1$`'
              +item.object_id+'$`0$`'+item.count+'$`'+item.unitprice+'$`$`'+that.form.valuation_id+'}|^2|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if(res>0)
              {
                if(countsuccess===1)
                {
                  that.$baseMessage('验工计价添加成功', 'success')
                  that.dialogFormVisible = false
                  that.$emit('fetchData')
                  that.$emit('fetchDataChild',that.form)
                }
                countsuccess=0
              }
              else
              {
                if(counterror===0)
                {
                  that.$baseMessage('验工计价添加失败', 'error')
                }
                counterror=-1
              }
            })
          }
        })
      },
      handleClick(row) {
        row.delsymbol="1"
      },
      rowselect(row) {
        console.log(row)
        this.rowdisplay=row
      },
      tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      inputchange(value) {
        let numReg = /^((\-)?(([0-9]*)|(([0]\.\d{1,6}|[1-9][0-9]*\.\d{1,6}))))$/;
        if (!numReg.test(value)) {
          this.$message({
            type: 'error',
            message: '请输入数字',
            duration: 10000,
            showClose: true,
          })
        }
        else if(this.rowdisplay.unitprice==='0' || this.rowdisplay.count==='0' || this.rowdisplay.object_name==='')
        {
          this.$baseMessage('请选择数据选择项目或者输入单价或数量', 'error')
        }
        else {
          this
        }
        // else{
        //   this.listconclusion()
        // }
      },
      listconclusion() {
        let ju = 0
        console.log(this.rowdisplay)
        if(this.listresult.length!==0)
        {
          this.listresult.forEach((item, index) => {
            if(item.index === this.rowdisplay.index)
            {
              item.count=this.rowdisplay.count
              item.object_id=this.rowdisplay.object_id
              item.unitprice=this.rowdisplay.unitprice
              item.object_name=this.rowdisplay.object_name
              ju=1
            }
          })
          if(ju===0)
          {
            this.listresult.push(this.rowdisplay)
          }
        }
        else{
          this.listresult.push(this.rowdisplay)

        }
        console.log(this.listresult)
      },
      listresultachieve() {
        let that=this
        this.list.forEach((item, index) => {
          if(item.unitprice==='0' || item.count==='0' || item.object_id==='')
          {

          }
          else {
            let jsontemp = {
              "object_id" :item.object_id,
              "count" :item.count,
              "unitprice" :item.unitprice,
              "state" :item.state,
              "receivable_id":item.receivable_id
            }
            that.listresult.push(jsontemp)
          }
        })
      },
      handleSelect(node,instanceId) {
        if(this.rowdisplay.unitprice==='0' || this.rowdisplay.count==='0')
        {
          this.$baseMessage('请继续输入数据选择项目的单价或数量', 'error')
        }
        // else{
        //   this.listconclusion()
        // }
      },
      //编辑
      EditClick(scope) {
        // console.log(scope);
        this.currentEdit = scope.$index;
        scope.row.editsymbol="1"
        scope.row.object_id=scope.row.object_name.split('-')[0]
      },
      // 完成
      finishEditClick() {
        this.currentEdit = -1
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
    },
  }
</script>
<style lang="scss">
  .vue-treeselect__menu {z-index: 999999999999}
  .tree-select-display .el-table .cell{
    overflow: visible;
  }

  .receivable-button {
      width: 150px !important;
      margin-left: calc(25% - 100px) !important;

  }
</style>

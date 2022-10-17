<template>
  <el-dialog title="为XX参数添加设备" :visible.sync="dialogFormVisible">
    <el-table :data="list" class="distribution_table device_tab" :header-cell-style="{background:'#e8f0ff' }"  highlight-current-row>
      <el-table-column show-overflow-tooltip label="管理编号" prop="number"></el-table-column>
      <el-table-column show-overflow-tooltip label="设备名称" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip prop="type" label="设备类型"></el-table-column>
      <el-table-column show-overflow-tooltip prop="num1" label="测量范围"></el-table-column>
      <el-table-column show-overflow-tooltip prop="num2" label="精度"></el-table-column>
      <el-table-column show-overflow-tooltip label="设备类型描述" prop="describe"></el-table-column>
      <el-table-column
            type="selection"
            width="55">
          </el-table-column>
      </el-table>
    <div slot="footer" class="dialog-footer">
       <el-pagination
       class="devices"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
      <div class="devides_btn">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'TableEdit1',
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
         currentPage4: 4,
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        dialogFormVisible: false,
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
      form: {
        name: '',
        region: 'qualified',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number:''
      },
      formLabelWidth: '120px',
      }
    },
   created() {
     this.fetchData()
   },
     methods: {
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
       handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
       showEdit1(row) {
         if (!row) {
           this.title = '添加'
         } else {
           this.title = '编辑'
           this.form = Object.assign({}, row)
         }
         this.dialogFormVisible = true
       },
       async fetchData() {
         this.listLoading = true
         const {
           data,
           totalCount
         } = await (this.queryForm)
         this.list = [{"name":"电子天平","type":"无","describe":"/",number:"GX-16",num1:'质量',num2:'0.01'},
        {"name":"千分尺","type":"无","describe":"/",number:"GX-19",num1:'/',num2:'0.001'},
        {"name":"温湿度监测仪","type":"无","describe":"/",number:"GX-28",num1:'温度和湿度',num2:'0.01'},
        {"name":"显微镜","type":"无","describe":"/",number:"GX-05",num1:'/',num2:'0.01'}]
         const imageList = []
         this.imageList = imageList
         this.total = totalCount
         setTimeout(() => {
           this.listLoading = false
         }, 500)
       },
     },
   }
</script>

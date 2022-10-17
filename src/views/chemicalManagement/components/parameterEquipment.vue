<template>
  <el-dialog title="XX添加化学品" :visible.sync="dialogFormVisible">
    <el-table :data="list" class="distribution_table device_tab" :header-cell-style="{background:'#e8f0ff' }"  highlight-current-row>
      <el-table-column show-overflow-tooltip label="化学品管理编码" prop="chemicals_code"></el-table-column>
      <el-table-column show-overflow-tooltip prop="chemicals_name" label="化学品名称"></el-table-column>
      <el-table-column show-overflow-tooltip label="化学品规格" prop="chemicals_narms"></el-table-column>
      <el-table-column show-overflow-tooltip label="计量单位" prop="measuring_unit"></el-table-column>
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
    name: 'TableEdit',
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
       showEdit(row) {
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
         this.list = [{"chemicals_code":"10031","chemicals_name":"盐酸","chemicals_narms":"/","measuring_unit":"ml"},
        {"chemicals_code":"10031","chemicals_name":"亚甲蓝","chemicals_narms":"/","measuring_unit":"g"},
        {"chemicals_code":"10068","chemicals_name":"磷酸","chemicals_narms":"/","measuring_unit":"ml"},
        {"chemicals_code":"10067","chemicals_name":"蒸馏水","chemicals_narms":"/","measuring_unit":"L"},
        {"chemicals_code":"10066","chemicals_name":"EDTA二钠","chemicals_narms":"EDTA二钠","measuring_unit":"g"},
        {"chemicals_code":"10065","chemicals_name":"乙酸铵溶液","chemicals_narms":"/","measuring_unit":"ml"}]
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

<template>
  <el-dialog title="添加校检计划" width="60%" :visible.sync="dialogFormVisible">
    <el-row>
      <el-col :span="24">
        <div style="text-align: right;">
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent class="demo-form-inline" style="padding-right: 0px;">
          	<el-form-item>
          		<el-input style="border-radius: 30px" v-model="queryForm.device_name" placeholder="按设备名称搜索">
          		</el-input>
          	</el-form-item>
          	<el-form-item>
          		<el-input style="border-radius: 30px" v-model="queryForm.manage_pid" placeholder="按管理编号搜索">
          		</el-input>
          	</el-form-item>
          	<el-form-item style="text-align: right;">
          		<el-button type="primary" icon="el-icon-search" @click="searchbutton">查询</el-button>
          	</el-form-item>
          </el-form>
        </div>

      </el-col>
      <el-col :span="24">
        <el-table :data="list" ref="multipleTable" class="distribution_table device_tab" :header-cell-style="{background:'#e8f0ff' }"  highlight-current-row>
          <el-table-column show-overflow-tooltip label="设备名称" prop="device_name"></el-table-column>
          <el-table-column show-overflow-tooltip label="管理编号" prop="manage_pid"></el-table-column>
          <el-table-column show-overflow-tooltip label="规格型号" prop="model"></el-table-column>
          <el-table-column show-overflow-tooltip label="上次校检日期" width="120" prop="verify_date"></el-table-column>
          <el-table-column show-overflow-tooltip label="周期" prop="verify_cycle"></el-table-column>
          <el-table-column show-overflow-tooltip label="" width="400" prop="verify_cycle"></el-table-column>
          <el-table-column
              type="selection"
              width="55">
            </el-table-column>
        </el-table>
        <el-pagination
            class="devices"
            :background="background"
            :current-page="queryForm.pageNo"
            :layout="layout"
            :page-size="queryForm.pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange">
          </el-pagination>
      </el-col>
    </el-row>


    <div slot="footer" class="dialog-footer">

      <div class="devides_btn">
        <el-button type="primary" @click="deviceaddhandle()">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
	import {
		doEdit,
    ExecSql,
    QueryExec
	} from '@/api/table'
  export default {
    name: 'DeviceAdd',
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
        imgShow: true,
        list: [],
        imageList: [],
        transfer: [],
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
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        current_org: 'org/current_org',
      }),
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
      searchbutton() {

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
      deviceaddhandle() {
        this.transfer = this.$refs.multipleTable.selection
        console.log(this.transfer)
        this.$emit('fetchData1',this.transfer)
        this.dialogFormVisible = false
      },
      showEdit1(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
        }
        this.fetchData()
        this.dialogFormVisible = true
      },
      async fetchData() {
        this.listLoading = true
        let sData = '[Q]147{'+this.current_org+'$`0$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(res)
        for(let i=0;i<res.totalCount;i++)
        {
          res.data[i].verify_cycle=res.data[i].verify_cycle+'个月'
          if(res.data[i].verify_date=='')
          {
            res.data[i].verify_date=res.data[i].check_date
          }
          else {

          }
        }
        this.list = res.data
        this.total = res.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
    },
  }
</script>

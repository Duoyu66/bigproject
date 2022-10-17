<template>
  <el-dialog title="添加核查计划" :visible.sync="dialogFormVisible">
    <el-table :data="list" ref="multipleTable" class="distribution_table device_tab" :header-cell-style="{background:'#e8f0ff' }"  highlight-current-row>
      <el-table-column show-overflow-tooltip label="设备名称" prop="device_name"></el-table-column>
      <el-table-column show-overflow-tooltip label="管理编号" prop="manage_pid"></el-table-column>
      <el-table-column show-overflow-tooltip label="规格型号" prop="model"></el-table-column>
      <el-table-column show-overflow-tooltip label="上次核查日期" prop="check_date"></el-table-column>
      <el-table-column show-overflow-tooltip label="周期" prop="check_cycle"></el-table-column>
      <el-table-column
            type="selection"
            width="55">
          </el-table-column>
      </el-table>
    <div slot="footer" class="dialog-footer">
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
    computed: {
      ...mapGetters({
        current_org: 'org/current_org',
      }),
    },
	data() {
		return {
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
		showEdit(row) {
			if (!row) {
        this.title = '添加'
			} else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
        this.fetchData()
			}
			this.dialogFormVisible = true
		},
		deviceaddhandle() {
			this.transfer = this.$refs.multipleTable.selection
			console.log(this.transfer)
			this.$emit('fetchData1',this.transfer)
			this.dialogFormVisible = false
		},
		async fetchData() {
			this.listLoading = true
			let sData = '[Q]185{'+this.current_org+'$`'+((Number(this.queryForm.pageNo)-1)*Number(this.queryForm.pageSize)).toString()+'$`'+this.queryForm.pageSize+'}|^SYS'
			const res = await QueryExec(sData)
			console.log(res)
			for(let i=0;i<res.totalCount;i++)
			{
        res.data[i].check_cycle=res.data[i].check_cycle+'个月'
        if(res.data[i].check_date=='')
        {
          res.data[i].check_date=res.data[i].check_date_purchase
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

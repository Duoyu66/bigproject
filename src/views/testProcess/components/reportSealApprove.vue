<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="90%"
    @close="close"
  >
   <!-- <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column property="seal_no" label="印章编号" width="150"></el-table-column>
      <el-table-column property="seal_name" label="印章名" width="150"></el-table-column>
      <el-table-column property="usage" label="用途" width="200"></el-table-column>
      <el-table-column property="location" label="位置"></el-table-column>

    </el-table> -->
    <sealApplyTable style="height: calc(60vh)" ref="sealApplyTable" :type="3"
    	:primary_key.sync="primary_key" :permission="permission">
    </sealApplyTable>

  </el-dialog>
</template>

<script>
  import { QueryExec,ExecSql } from '@/api/table'
  import sealApplyTable from '../../officeManagement/table/sealApplyTable'
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
  export default {
    name: 'TableEdit',
    components: {
    	sealApplyTable,
    },
    data() {
      return {
        primary_key: -1,
        permission: {

        	person_role: false,
        	// person_role: {
        	// 	person_role_manage: false,
        	// },
        	self: false,
        },
        form: {
          title: '',
          author: '',
        },
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
          author: [{ required: true, trigger: 'blur', message: '请输入作者' }],
        },
        title: '',
        dialogVisible: false,
        options: [],
        tableData: [],
        seal_name: '',
        multipleSelection: []
      }
    },
    computed: {
      ...mapGetters({
      	current_org: 'org/current_org',
        person_id: 'user/person_id'
      }),
      height() {
        return this.$baseTableHeight()*1.1
      },
    },
    created() {
      this.fetchData()
    },
    methods: {
      async init() {
      	let permissionList = ['sealLedger'];
      	let permission = '';
      	for (let i = 0; i < permissionList.length; i++) {
      		permission = await this.$store.dispatch(
      			'permission/GetALLPermissionByModel',
      			permissionList[i]
      		)
      		if (permission) {
      			this.permission = Object.assign(this.permission, permission)
      		}
      	}
        this.primary_key = Number(this.form.data_id)
        await this.fetchDataTable()
      },
      async showEdit(row) {
        if (!row) {
          this.title = '申请报告用印'
        } else {
          this.title = '申请报告用印'
          this.form = Object.assign({}, row)

        }

        this.dialogVisible = true
        await this.init(this.form)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      async fetchDataTable() {
        console.log(this.$refs['sealApplyTable'])
      	this.$refs['sealApplyTable'].fetchData()
      },
      async fetchData() {
        let sData = '[Q]842{'+this.current_org + '}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData,res)
        this.tableData = res.data
      },
      close() {
        this.dialogVisible = false
        this.$emit('fetch-data')
      },
      Examine(row) {
      	this.$refs['sealApplyExamineDialog'].showEdit(row, undefined, undefined)
      },
      dateformat() {
      	let d = new Date();
      	let y = d.getFullYear()
      	let Mo = d.getMonth() //月份
      	let da = d.getDate() //日
      	let h = d.getHours() //小时
      	let mi = d.getMinutes() //分
      	let s = d.getSeconds() //秒
      	let datetime = y + '-' + Mo + '-' + da + ' ' + h + ':' + mi + ':' + s
      	return datetime
      },
      async save() {
        for(let i=0;i<this.multipleSelection.length;i++)
        {
          let sData = '[Q]375{'+this.multipleSelection[i].seal_id+'$`'+this.form.report_id+'报告用印$`'+this.person_id+'$`'+this.dateformat()+'$`$`2$`'
          +this.form.data_id+'$`}|^1|^SYS'
          const res = await ExecSql(sData)
          console.log(sData,res)
        }

        // this.options = res.data
        // this.$refs['form'].validate(async (valid) => {
        //   if (valid) {

        //   } else {
        //     return false
        //   }
        // })
      },
    },
  }
</script>
<style>
/*  .sealreport .el-dialog__footer button {
      margin-left: 110px;

  } */
</style>

<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="800px"
    @close="close"
  >
    <div>
      <el-table
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
      </el-table>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { QueryExec,ExecSql } from '@/api/table'
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {
          title: '',
          author: '',
        },
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
          author: [{ required: true, trigger: 'blur', message: '请输入作者' }],
        },
        title: '',
        dialogFormVisible: false,
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
      showEdit(row) {
        if (!row) {
          this.title = '申请报告用印'
        } else {
          this.title = '申请报告用印'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      async fetchData() {
        let sData = '[Q]842{'+this.current_org + '}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData,res)
        this.tableData = res.data
      },
      close() {
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      dateformat() {
      	let d = new Date();
      	let y = d.getFullYear()
      	let Mo = d.getMonth() //月份
      	let da = d.getDate() //日
      	let h = d.getHours() //小时
      	let mi = d.getMinutes() //分
      	let s = d.getSeconds() //秒
      	let datetime = y + '-' + Mo + '-' + da
      	return datetime
      },
      async save() {
        let count=0
        for(let i=0;i<this.multipleSelection.length;i++)
        {
          let sData = '[Q]375{'+this.multipleSelection[i].seal_id+'$`'+this.form.report_id+'报告用印$`'+this.person_id+'$`'+this.dateformat()+'$`$`2$`'
          +this.form.data_id+'$`}|^1|^SYS'
          const res = await ExecSql(sData)
          console.log(sData,res)
          count=count+res
        }
        if(count>0)
        {
          that.$baseMessage('印章申请成功', 'success')
          this.close()
        }
        else {
          that.$baseMessage('印章申请失败', 'success')
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

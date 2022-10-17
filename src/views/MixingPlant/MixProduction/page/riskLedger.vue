<template>
  <div class="definition purchase contract equipment_btn calc">
    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)-300px">
		   <el-tab-pane label="新增问题" class="center">
		     <div class="usage">
		       <riskLedgerForm ref="riskLedgerForm"></riskLedgerForm>
		       <div><el-button class="purchase_btn" type="primary" @click="riskLedgerFormAdd()">确 定</el-button></div>
		     </div>
		   </el-tab-pane>
		   <el-tab-pane label="问题库">
         <el-row>
          <el-col :span="24">
		     <el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
		       <el-form-item label="" >
		          <el-input style="border-radius: 30px" v-model="search.main.risks" placeholder="请输入问题" clearable></el-input>
		       </el-form-item>
		       <el-form-item label="">
		          <el-input style="border-radius: 30px" v-model="search.main.risk_source" placeholder="请输入问题来源" clearable></el-input>
		       </el-form-item>
		       <el-form-item label="">
		          <el-input style="border-radius: 30px" v-model="search.main.risk_level" placeholder="请输入问题等级" clearable></el-input>
		       </el-form-item>
          <el-form-item label="" >
            <el-button icon="el-icon-search" type="primary" @click="searchMain"></el-button>
          </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="24">
            <riskLedgerTable style="height: calc(35vh); min-height: 300px" ref="riskLedgerTable" :type="0" :primary_key.sync="primary_key" :permission="permission"></riskLedgerTable>
          </el-col>
          <el-col :span="24">
            <el-tabs type="border-card" style="height: calc(50%)">
		   <el-tab-pane label="消息日志">
         <el-row>
          <el-col :span="24">
            <smsLedgerTable style="height: calc(35vh); min-height: 300px" ref="smsLedgerTable" :type="1" :primary_key.sync="primary_key" :permission="permission"></smsLedgerTable>
          </el-col>
        </el-row>
		   </el-tab-pane>
		   <el-tab-pane label="处理">
         <el-row>
          <el-col :span="24">
            <riskFlowTable style="height: calc(35vh); min-height: 300px" ref="riskFlowTable" :type="1" :primary_key.sync="primary_key" :permission="permission"></riskFlowTable>
          </el-col>
        </el-row>
		   </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
		   </el-tab-pane>
		 </el-tabs>
  </div>
</template>


<script>
  import riskLedgerTable from '../table/riskLedgerTable.vue'
  import smsLedgerTable from '../table/smsLedgerTable.vue'
  import riskFlowTable from '../table/riskFlowTable.vue'
  import riskLedgerForm from '../form/riskLedgerForm.vue'
  export default {
    name: 'riskLedger',
    components: {
      riskLedgerTable,
      smsLedgerTable,
      riskFlowTable,
      riskLedgerForm
    },
    data() {
      return {
        primary_key: -1,
        search: {
          main: {
            risks: '',
            risk_source: '',
            risk_level: '',
          },
        },
        permission: {
          person_role: false,
          self: false,
        },
      }
    },
    created() {
      this.init()
    },
    beforeDestroy() {},
    mounted: function() {},
    methods: {
      async init() {
        let permissionList = ['riskLedger'];
        let permission = '';
        for (let i = 0; i < permissionList.length; i++) {
          permission = await this.$store.dispatch(
            'permission/GetALLPermissionByModel',
            permissionList[i],
          )
          if (permission) {
            this.permission = Object.assign(this.permission, permission)
          }
        }
        await this.fetchData()
        //await this.getTableData()
      },
      searchMain() {
        this.$refs['riskLedgerTable'].search(this.search.main)
      },
      async fetchData() {
        this.$refs['riskLedgerTable'].fetchData()
        this.$refs['smsLedgerTable'].fetchData()
        this.$refs['riskFlowTable'].fetchData()
      },
    },
  }
</script>

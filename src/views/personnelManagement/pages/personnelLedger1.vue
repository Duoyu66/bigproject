<template>
  <div class="definition purchase contract equipment_btn calc" >
    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)-300px">
		  <el-tab-pane label="添加人员" class="center">
		    <div class="usage">
		      <personnelLedgerForm ref="personnelLedgerForm"></personnelLedgerForm>
		      <div><el-button class="purchase_btn" type="primary" @click="personnelLedgerFormAdd()">确 定</el-button></div>
		    </div>
		  </el-tab-pane>
		  <el-tab-pane label="人员台账">
        <el-row>
          <el-col :span="24">
            <personnelLedgerTable style="height: calc(50vh - 111px); min-height: 300px" ref="personnelLedgerTable" type="main_table" :primary_key.sync="primary_key" :permission="permission"></personnelLedgerTable>
          </el-col>
          <el-col :span="24">
            <el-tabs type="border-card" style="height: calc(100%)">
            	<el-tab-pane label="教育经历">
            		<educationHistoryTable style="height: calc(50vh - 150px); min-height: 300px" ref="educationHistoryTable" type="side_table" :primary_key.sync="primary_key" :permission="permission"></educationHistoryTable>
            	</el-tab-pane>
              <el-tab-pane label="培训经历">
              	
              </el-tab-pane>
              <el-tab-pane label="专业证书">
              	
              </el-tab-pane>
              <el-tab-pane label="信用评价">
              	
              </el-tab-pane>

            </el-tabs>
          </el-col>
        </el-row>
      </el-tab-pane>
		 </el-tabs>
  </div>
</template>


<script>
  import personnelLedgerTable from '../table/personnelLedgerTable.vue'
  import personnelLedgerForm from '../form/personnelLedgerForm.vue'
  import educationHistoryTable from '../table/educationHistoryTable.vue'
  export default {
    name: 'personnelLedger',
    components: {
      personnelLedgerTable,
      personnelLedgerForm,
      educationHistoryTable
    },
    data() {
      return {
        primary_key: -1,
        search: {
          main: {
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
        let permissionList = ['personnelLedger'];
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
      async fetchData() {
        this.$refs['personnelLedgerTable'].fetchData()
      },
    },
  }
</script>

<template>
  <div class="definition purchase contract equipment_btn calc" >
    <el-tabs type="border-card" class="box_center" style="">
		   <el-tab-pane label="添加设备" class="center">
		     <div class="usage">
		       <deviceLedgerForm ref="deviceLedgerForm"></deviceLedgerForm>
		       <div><el-button class="purchase_btn" type="primary" @click="deviceLedgerFormAdd()">确 定</el-button></div>
		     </div>
		   </el-tab-pane>
		   <el-tab-pane label="设备台账">
         <el-row>
          <el-col :span="24">
            <deviceLedgerTable style="height: calc(40vh); min-height: 300px" ref="deviceLedgerTable" :type="0" :primary_key.sync="primary_key" :permission="permission"></deviceLedgerTable>
          </el-col>
          <el-col :span="24">
            <el-tabs type="border-card" style="">
              <el-tab-pane label="设备使用记录">
                <el-row>
                  <el-col :span="24">
                    <deviceUseHistoryTable style=" min-height: 300px" ref="deviceUseHistoryTable" :type="0" :primary_key.sync="primary_key" :permission="permission"></deviceUseHistoryTable>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="校检项目">
                <el-row>
                  <el-col :span="24">
                    <adjustItemTable style=" min-height: 300px" ref="adjustItemTable" :type="0" :primary_key.sync="primary_key" :permission="permission"></adjustItemTable>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="校检记录">
                <el-row>
                  <el-col :span="24">
                    <adjustHistoryTable style="min-height: 300px" ref="adjustHistoryTable" :type="0" :primary_key.sync="primary_key" :permission="permission"></adjustHistoryTable>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="维护记录">
                <el-row>
                  <el-col :span="24">
                    <maintainHistoryTable style="min-height: 300px" ref="maintainHistoryTable" :type="0" :primary_key.sync="primary_key" :permission="permission"></maintainHistoryTable>
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
  import deviceLedgerTable from '../table/deviceLedgerTable.vue'
  import deviceUseHistoryTable from '../table/deviceUseHistoryTable.vue'
  import adjustItemTable from '../table/adjustItemTable.vue'
  import adjustHistoryTable from '../table/adjustHistoryTable.vue'
  import maintainHistoryTable from '../table/maintainHistoryTable.vue'
  import deviceLedgerForm from '../form/deviceLedgerForm.vue'
  export default {
    name: 'deviceLedger',
    components: {
      deviceLedgerTable,
      deviceUseHistoryTable,
      adjustItemTable,
      adjustHistoryTable,
      maintainHistoryTable,
      deviceLedgerForm
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
        let permissionList = ['undefined'];
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
      deviceLedgerFormAdd() {
        this.$refs["deviceLedgerForm"].save()
      },
      async fetchData() {
        this.$refs['deviceLedgerTable'].fetchData()
        this.$refs['deviceUseHistoryTable'].fetchData()
        this.$refs['adjustItemTable'].fetchData()
        this.$refs['adjustHistoryTable'].fetchData()
        this.$refs['maintainHistoryTable'].fetchData()
      },
    },
  }
</script>

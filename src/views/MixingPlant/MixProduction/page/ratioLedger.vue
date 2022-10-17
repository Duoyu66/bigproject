<template>
  <div class="definition purchase contract equipment_btn calc">
    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)-300px">
		   <el-tab-pane label="配比通知单">
         <el-row>
          <el-col :span="24" style="text-align: right;">
		     <el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
		       <el-form-item label="">
		         <el-input style="border-radius: 30px" v-model="search.main.mix_ratio_id" placeholder="请输入配比编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="">
             <el-input style="border-radius: 30px" v-model="search.main.strength" placeholder="请输入强度等级" clearable></el-input>
          </el-form-item>
          <el-form-item label="" >
            <el-button icon="el-icon-search" type="primary" @click="searchMain"></el-button>
          </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="24">
            <ratioLedgerTable style="height: calc(35vh); min-height: 300px" ref="ratioLedgerTable" :type="0" :primary_key.sync="primary_key" :permission="permission"></ratioLedgerTable>
          </el-col>
          <el-col :span="24">
           <el-tabs type="border-card" style="height: calc(50%)">
              <el-tab-pane label="材料明细">
                <el-row>
                  <el-col :span="24">
                    <ratioDetailTable style="height: calc(35vh); min-height: 300px" ref="ratioDetailTable" :type="12" :primary_key.sync="primary_key" :permission="permission"></ratioDetailTable>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="进场验收">
                <el-row>
                  <el-col :span="24">
                    <entryDataSlaveTable style="height: calc(35vh); min-height: 300px" ref="entryDataSlaveTable" :type="1" :primary_key.sync="primary_key" :permission="permission"></entryDataSlaveTable>
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
  import ratioLedgerTable from '../table/ratioLedgerTable.vue'
  import ratioDetailTable from '../table/ratioDetailTable.vue'
  //import ratioDetailTable from '../table/RatioDetailTable.vue'
  import entryDataSlaveTable from '../table/entryDataSlaveTable.vue'
  import ratioLedgerForm from '../form/ratioLedgerForm.vue'
  export default {
    name: 'ratioLedger',
    components: {
      ratioLedgerTable,
      ratioDetailTable,
      entryDataSlaveTable,
      ratioLedgerForm
    },
    data() {
      return {
        primary_key: -1,
        search: {
          main: {
            mix_ratio_id: '',
            strength: '',
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
      searchMain() {
        this.$refs['ratioLedgerTable'].fetchData(this.search.main)
      },
      async fetchData() {
        this.$refs['ratioLedgerTable'].fetchData()
        this.$refs['ratioDetailTable'].fetchData()
        this.$refs['entryDataSlaveTable'].fetchData()
      },
    },
  }
</script>

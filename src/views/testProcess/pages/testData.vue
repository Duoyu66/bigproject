<template>
  <div class="definition purchase contract equipment_btn calc" style="overflow: auto;">
    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)-300px">
		   <el-tab-pane label="全部台账">
         <el-row :gutter="15">
          <el-col :span="24">
            <el-row>
              <el-col :span="24">
      		     <el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
              <el-form-item label="" >
                <el-input style="border-radius: 30px" v-model="search.main.order_id"
                	placeholder="按委托编号搜索" clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="" >
                <el-input style="border-radius: 30px" v-model="search.main.report_id"
                	placeholder="按报告编号搜索" clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="" >
                <el-input style="border-radius: 30px" v-model="search.main.batch_id"
                	placeholder="按批号搜索" clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="" >
                <el-date-picker
                  v-model="search.main.order_date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="" >
                <el-button icon="el-icon-search" type="primary" @click="searchMain"></el-button>

              </el-form-item>
              </el-form>
              </el-col>
              <el-col :span="24">
                <el-row>
                  <el-col :span="24">
                    <testDataTable style="height: calc(50vh - 80px); min-height: 300px" ref="testDataTable" :type="0" :primary_key.sync="primary_key" :permission="permission"></testDataTable>
                  </el-col>
                  <el-col :span="24">
                  	<el-tabs type="border-card" style="height: calc(50vh)">
                  		<el-tab-pane label="试验修改记录">
                        <el-row :gutter="10">
                          <el-col :span="12">
                            <entrustEditHistoryTable style="height: calc(50vh - 222px);" ref="entrustEditHistoryTable" :type="1" :primary_key.sync="primary_key"
                            :primary_key_main.sync="primary_key_main" :permission="permission"></entrustEditHistoryTable>
                          </el-col>
                          <el-col :span="12">
                            <entrustEditDetailTable style="height: calc(50vh - 222px);" ref="entrustEditDetailTable" :type="1"
                            :primary_key.sync="primary_key" :primary_key_main.sync="primary_key_main" :permission="permission"></entrustEditDetailTable>
                          </el-col>
                        </el-row>
                      </el-tab-pane>
                      <el-tab-pane label="试验任务">
                        <el-row :gutter="10">
                          <el-col :span="24">

                          </el-col>
                        </el-row>
                      </el-tab-pane>
                    </el-tabs>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
          </el-col>
         </el-row>

		   </el-tab-pane>
      <el-tab-pane label="待试验">
      </el-tab-pane>
      <el-tab-pane label="待复核">
      </el-tab-pane>
      <el-tab-pane label="待批准">
      </el-tab-pane>
      <el-tab-pane label="待确认">
      </el-tab-pane>
      <el-tab-pane label="已确认">
      </el-tab-pane>
		 </el-tabs>
  </div>
</template>


<script>
  import testDataTable from '../table/testDataTable.vue'
  import CommonTestObjectTable from '../table/CommonTestObjectTable'
  import entrustEditHistoryTable from '../table/entrustEditHistoryTable'
  import entrustEditDetailTable from '../table/entrustEditDetailTable'
  export default {
    name: 'testData',
    components: {
      testDataTable,
      CommonTestObjectTable,
      entrustEditHistoryTable,
      entrustEditDetailTable
    },
    data() {
      return {
        primary_key: -1,
        primary_key_main: -1,
        active: 0,
        object_id: '',
        accepted: '',
        stage: '',
        searchData: undefined,
        search: {
          main: {
            order_id: '',
            order_start_date: '',
            order_end_date: ''
          },
        },
        order_date: [],
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
        let permissionList = ['testData'];
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
        this.search.main.order_start_date = this.order_date[0]
        this.search.main.order_end_date = this.order_date[1]
        console.log(this.search.main)
        this.$refs['testDataTable'].search(this.search.main)
      },
      async fetchData() {
        this.$refs['testDataTable'].fetchData()
      },
    },
  }
</script>

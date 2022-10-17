<template>
  <div class="definition purchase contract equipment_btn calc" style="overflow: auto;">
    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)-300px">
		   <el-tab-pane label="全部台账">
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
                <el-table ref="testDataRef" v-loading="listLoading" :data="tablelist" border
                  :element-loading-text="elementLoadingText" highlight-current-row 
                  :header-cell-style="{ background: '#e8f0ff' }" @selection-change="setSelectRows"
                  @sort-change="tableSortChange">
                  <el-table-column show-overflow-tooltip label="委托编号" prop="order_id" min-width="150px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="试验项目" prop="object_name" min-width="140px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="委托日期" prop="order_date" min-width="120px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="试验类型" prop="test_class" min-width="120px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="委托单位" prop="order_agent" min-width="120px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="项目名称" prop="project_name" min-width="120px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="强度" prop="strength" min-width="80px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="样品规格" prop="sample_spec" min-width="120px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="样品尺寸" prop="sample_size" min-width="120px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="龄期" prop="age" min-width="80px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="代表数量" prop="quantity" min-width="80px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="批号" prop="batch_id" min-width="120px"></el-table-column>
                  <el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right">
                    <template #default="scope">
                      <el-button @click.native="handleCommand('test', scope.row)" type="primary">试验</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>


		   </el-tab-pane>
		 </el-tabs>
  </div>
</template>


<script>
  import {
    QueryExec
  } from '@/api/table'
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'testData',
    components: {

    },
    data() {
      return {
        primary_key: -1,
        active: 0,
        object_id: '',
        accepted: '',
        stage: '',
        searchData: undefined,
        elementLoadingText: '加载数据中',
        search: {
          main: {
            order_id: '',
            order_start_date: '',
            order_end_date: ''
          },
        },
        listLoading: false,
        tablelist: [],
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
    computed: {
      ...mapGetters({ org_id: 'user/org_id',current_org_id: 'org/current_org',person_id: 'user/person_id',}),
    },
    beforeDestroy() {},
    mounted: function() {},
    methods: {
      async init() {
        // this.height = 'calc(80%)'
        await this.fetchData()
      },
      setSelectRows() {},
      tableSortChange() {},
      searchMain() {
        this.search.main.order_start_date = this.order_date[0]
        this.search.main.order_end_date = this.order_date[1]
        console.log(this.search.main)
        this.$refs['testDataTable'].search(this.search.main)
      },
      async fetchData() {
        let sData = '[Q]1066{}|^SYS'
        const res = await QueryExec(sData)
        this.tablelist = res.data
      },
    },
  }
</script>

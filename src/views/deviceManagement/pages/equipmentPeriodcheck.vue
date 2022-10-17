<template>
  <div class="definition cailbration period calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="添加核查计划" class="center">
        <div class="usage" style="padding: 10px 30px">
          <div style="width: 100%; display: flex; justify-content: flex-end">
            <span style="width: 80px; line-height: 32px">计划内容</span>
            <el-input v-model="planname" style="width: 100%;"></el-input>
            <el-button
              type="primary"
              @click="DeviceAdd"
              style="margin-left: 10px"
            >
              添加设备
            </el-button>
          </div>
          <div style="width: 100%; margin: 20px 0">
            <el-table
              highlight-current-row
              ref="tableSort"
              v-loading="listLoading"
              :data="list"
              border
              :header-cell-style="{ background: '#e8f0ff' }"
              :element-loading-text="elementLoadingText"
              :height="table.tableHeight1"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
            >
              <el-table-column
                show-overflow-tooltip
                label="设备名称"
                prop="device_name"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="管理编号"
                prop="manage_pid"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="规格型号"
                prop="model"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="上次核查日期"
                prop="check_date"
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="操作" width="100px">
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    @click="DeviceDelete(row)"
                    style="padding: 5px 15px"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="width: 100%; display: flex; justify-content: space-around">
            <el-button class="purchase_btn" type="primary" @click="saveplan()">保 存</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备核查计划">
        <vab-query-form>
          <vab-query-form-left-panel
            class="consumption"
            style="width: 25%; padding-right: 10px"
          >
            <el-row style="width: calc(100% - 66px); margin-right: 10px">
              <el-col :span="11">
                <el-date-picker
                  v-model="form.startdate"
                  style="width: 100%;"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-col>
              <el-col style="align-items: center; line-height: 32px" :span="2">
                ——
              </el-col>
              <el-col :span="11">
                <el-date-picker
                  v-model="form.enddate"
                  style="width: 100%;"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-col>
            </el-row>
            <el-button type="primary" style="margin: 0">搜索</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel
            class="flex"
            style="width: 75%; padding-left: 5px"
          >
            <span class="headline">详细计划</span>
            <el-form
              ref="form"
              :model="queryForm"
              :inline="true"
              @submit.native.prevent
            >
              <el-form-item>
                <el-input
                  style="border-radius: 30px"
                  v-model="queryForm.title"
                  placeholder="按设备名称搜索"
                  prefix-icon="el-icon-search"
                />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-row :gutter="10">
          <el-col :span="6" style="overflow: hidden">
            <el-table
              highlight-current-row
              ref="tableSort"
              v-loading="listLoading"
              :data="listplan"
              border
              :header-cell-style="{ background: '#e8f0ff' }"
              :element-loading-text="elementLoadingText"
              :height="table.tableHeight1"
              @row-click="PlanChoose"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
              style="margin-bottom: 10px"
            >
              <el-table-column
                show-overflow-tooltip
                label="计划日期"
                prop="plan_date"
                min-width="35%"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="plan_name"
                label="计划名称"
                min-width="65%"
              ></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="18">
            <el-table
              highlight-current-row
              ref="tableSort"
              v-loading="listPlanDetailLoading"
              :data="listPlanDetail"
              border
              :header-cell-style="{ background: '#e8f0ff' }"
              :element-loading-text="elementLoadingText"
              :height="table.tableHeight1"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
            >
              <el-table-column
                show-overflow-tooltip
                prop="manage_pid"
                label="管理编号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="设备名称"
                prop="device_name"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="model"
                label="规格型号"
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="操作">
                <template #default="{ row }">
                  <el-button
                    v-if="row.check_id===''"
                    type="primary"
                    @click="handleExecute(row)"
                    style="padding: 4px 15px"
                  >
                    执行核查
                  </el-button>
                  <el-button
                    v-else
                    type="primary"
                    style="padding: 4px 15px"
                    disabled
                  >
                    执行核查
                  </el-button>
                </template>
              </el-table-column>

            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="设备核查记录">
        <vab-query-form>
          <vab-query-form-left-panel
            class="consumption"
            style="width: 25%; padding-right: 10px"
          >
            <el-row style="width: calc(100% - 66px); margin-right: 10px">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.date1"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
              <el-col style="align-items: center; line-height: 32px" :span="2">
                ——
              </el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.date2"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
            </el-row>
            <el-button type="primary" style="margin: 0">搜索</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel
            class="flex"
            style="width: 75%; padding-left: 5px"
          >
<!--            <span class="headline">详细计划</span>
            <el-form
              ref="form"
              :model="queryForm"
              :inline="true"
              @submit.native.prevent
            >
              <el-form-item>
                <el-input
                  style="border-radius: 30px"
                  v-model="queryForm.title"
                  placeholder="按设备名称搜索"
                  prefix-icon="el-icon-search"
                />
              </el-form-item>
            </el-form> -->
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-row :gutter="10">
<!--          <el-col :span="6" style="overflow: hidden">
            <el-table
              highlight-current-row
              ref="tableSort"
              v-loading="listLoading"
              :data="listplan1"
              border
              :header-cell-style="{ background: '#e8f0ff' }"
              :element-loading-text="elementLoadingText"
              :height="table.tableHeight1"
              @row-click="CheckChoose"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
              style="margin-bottom: 10px"
            >
              <el-table-column
                show-overflow-tooltip
                label="计划日期"
                prop="plan_date"
                min-width="35%"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="plan_name"
                label="计划名称"
                min-width="65%"
              ></el-table-column>
            </el-table>
          </el-col> -->
          <el-col :span="24">
            <el-table
              ref="tableSort"
              v-loading="listCheckLoading"
              :data="listCheck"
              border
              :element-loading-text="elementLoadingText"
              highlight-current-row
              :height="table.tableHeight"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
              :header-cell-style="{ background: '#e8f0ff' }"
            >
              <el-table-column
                show-overflow-tooltip
                label="管理编号"
                prop="manage_pid"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="设备名称"
                prop="device_name"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="model"
                label="规格型号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="scope"
                label="测量范围"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="精度"
                prop="precision"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="check_date"
                label="核查日期"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="check_method"
                label="核查方式"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="核查实施人"
                prop="check_person"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="核查结果"
                prop="check_result"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="备注"
                prop="remark"
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="操作" width="100px">
                <template #default="{ row }">
                  <el-dropdown trigger="click" placement="left-start">
                    <el-button
                      icon="el-icon-s-fold"
                      class="el-dropdown-link"
                      type="primary"
                      style="padding: 4px 15px"
                    ></el-button>
                    <el-dropdown-menu slot="dropdown" class="more">
                      <el-button @click="handleEditRecord(row)">修改记录</el-button>
                      <el-button @click="handleDetail(row)">核查详情</el-button>
                      <el-button @click="handleDeleteRecord(row)">删除核查</el-button>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :background="background"
              :current-page="queryForm.pageNo"
              :layout="layout"
              :page-size="queryForm.pageSize"
              :total="total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <equipmentPeriodcheck ref="equipmentPeriodcheck"></equipmentPeriodcheck>
    <EquipmentList ref="EquipmentList" @fetchData1="fetchData1"></EquipmentList>
    <equipmentPeriodcheck1 ref="equipmentPeriodcheck1" @CheckChoose="CheckChoose"></equipmentPeriodcheck1>
    <equipmentPeriodcheck2 ref="equipmentPeriodcheck2" @CheckChoose="CheckChoose"></equipmentPeriodcheck2>
  </div>
</template>

<script>
	import {
		doEdit,
    ExecSql,
    QueryExec
	} from '@/api/table'
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
import equipmentPeriodcheck from '../components/equipmentPeriodcheck.vue'
import EquipmentList from '../components/equipment.vue'
import equipmentPeriodcheck1 from '../components/equipmentPeriodcheck1.vue'
import equipmentPeriodcheck2 from '../components/equipmentPeriodcheck2.vue'

import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    equipmentPeriodcheck,
    EquipmentList,
    equipmentPeriodcheck1,
    equipmentPeriodcheck2,
    treeData,
  },
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
      listPlanDetail: [],
      listplan: [],
      listplan1: [],
      listCheck: [],
      imageList: [],
      planname:'',
      listLoading: true,
      listCheckLoading: true,
      listPlanDetailLoading: true,
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
      dialogFormVisible: false,
      form: {
        name: '',
        region: 'qualified',
        startdate: '',
        enddate: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: ''
      },
      formLabelWidth: '120px',
      table: {
        tableHeight: this.$(window).height(),
        tableHeight1: this.$(window).height()
      }
    }
  },
  computed: {
    ...mapGetters({
      current_org: 'org/current_org',
    }),
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    this.fetchData()
    this.fetchData1([])
  },
  beforeDestroy() { },
  mounted: function () {
    this.$nextTick(function () {
      let exceptHeight = 350;
      let exceptHeight1 = 340;
      // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
      //tableSort为table中ref的值
      if (this.$refs.tableSort.$el) {
        this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
        this.table.tableHeight1 = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight1;
      }

      // 监听窗口大小变化
      let that = this;
      window.onresize = function () {
        if (that.$refs.tableSort.$el) {
          that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight;
          that.table.tableHeight1 = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight1;
        }
      }
    });
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
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
    handleDetail(row) {
      this.$refs['equipmentPeriodcheck2'].showEdit(row)
    },
    handleExecute(row) {
      this.$refs['equipmentPeriodcheck'].showEdit(row)
    },
    async CheckChoose(row) {
      this.listCheckLoading=true
      let sData='[Q]197{'+row.plan_id+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.listCheck=res.data
      setTimeout(() => {
        this.listCheckLoading = false
      }, 500)
    },
    async PlanChoose(row) {
      this.listPlanDetailLoading=true
      let sData='[Q]194{'+row.plan_id+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.listPlanDetail=res.data
      setTimeout(() => {
        this.listPlanDetailLoading = false
      }, 500)
    },
    DeviceAdd() {
      this.$refs['EquipmentList'].showEdit()
    },
    async saveplan() {
      var DateNow = new Date();
      var year = DateNow.getFullYear(); //获取当前年份(2位)
      var month = DateNow.getMonth(); //获取当前月份(0-11,0代表1月)
      var day = DateNow.getDate(); //获取当前日(1-31)
      var hour = DateNow.getHours(); //获取当前小时数(0-23)
      var minute = DateNow.getMinutes(); //获取当前分钟数(0-59)
      var second = DateNow.getSeconds(); //获取当前秒数(0-59)
      var date1=year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second
      let sData='[Q]191{'+this.current_org+'$`'+date1+'$`'+this.planname+'$`0}|^2|^SYS'
      let ncount=0;
      if(this.planname=='' || this.list.length==0)
      {
        this.$baseMessage('添加失败', 'error')
        return false
      }
      else{
        const res = await ExecSql(sData)
        if(res>0)
        {
          for(let i=0;i<this.list.length;i++)
          {
            let sData2='[Q]192{'+res+'$`'+this.list[i].device_id+'}|^2|^SYS'
            const res2 = await ExecSql(sData2)
            if(res2>0)
            {
              ncount++;
            }
          }
          if(ncount==this.list.length)
          {
            this.fetchData1([])
            this.$baseMessage('添加成功', 'success')
          }
          else{
            this.$baseMessage('添加失败', 'error')
          }
        }
        else{
          this.$baseMessage('添加失败', 'error')
        }
      }

    },
    handleEditRecord(row) {
      this.$refs['equipmentPeriodcheck1'].showEdit(row)
    },
    handleDeleteRecord(row) {
      if (row.check_id) {
        this.$baseConfirm('你确定要删除管理编号为'+row.manage_pid+'的设备的核查记录吗?', null, async () => {
          let sData = '[Q]199{'+row.check_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            this.$baseMessage("删除成功", 'success')
            this.CheckChoose(row)
            this.fetchData()
          }
          else{
            this.$baseMessage("删除失败", 'error')
          }
        })
      }
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
    DeviceDelete(row) {
      if (row.device_id) {
        this.$baseConfirm('你确定要移除管理编号为'+row.manage_pid+'的设备吗？', null, async () => {
          for(let i=0;i<this.list.length;i++)
          {
            if(this.list[i].device_id=row.device_id)
            {
              this.list.splice(i,1)
            }
          }
          this.fetchData1(this.list)
        })
      }
    },
    async fetchData1(val) {
      this.listLoading = true
      console.log(this.list)
      this.list=val
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    async fetchData() {
      this.listLoading = true
      this.listCheckLoading = true
      this.listPlanDetailLoading = true
      let st=this.form.startdate
      let en=this.form.enddate
      if(st === '')
      {
        st='1900-01-01'
      }
      if(en === '')
      {
        en='2050-01-01'
      }
      
      let sData3='[Q]197{'+this.current_org+'}|^SYS'
      const res3 = await QueryExec(sData3)
      console.log(res3)
      this.listCheck=res3.data
      let sData = '[Q]193{'+this.current_org+'$`'+st+'$`'+en+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(sData)
      this.listplan = res.data
      let sData1 = '[Q]196{'+this.current_org+'$`'+st+'$`'+en+'}|^SYS'
      const res1 = await QueryExec(sData1)
      this.listplan1 = res1.data

      setTimeout(() => {
        this.listLoading = false
      }, 500)
      setTimeout(() => {
        this.listCheckLoading = false
      }, 500)
      setTimeout(() => {
        this.listPlanDetailLoading = false
      }, 500)
    },
    testMessage() {
      this.$baseMessage('test1', 'success')
    },
    testALert() {
      this.$baseAlert('11')
      this.$baseAlert('11', '自定义标题', () => {
        /* 可以写回调; */
      })
      this.$baseAlert('11', null, () => {
        /* 可以写回调; */
      })
    },
    testConfirm() {
      this.$baseConfirm(
        '你确定要执行该操作?',
        null,
        () => {
          /* 可以写回调; */
        },
        () => {
          /* 可以写回调; */
        }
      )
    },
    testNotify() {
      this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
    },
  },
}
</script>

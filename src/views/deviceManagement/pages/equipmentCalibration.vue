<template>
  <div class="definition cailbration period calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="添加校检计划" class="center">
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
          <div style="width: 100%; margin: 10px 0">
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
                label="上次校检日期"
                prop="verify_date"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="周期"
                prop="calibrate_cycle"
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="操作" width="100px">
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    @click="DeviceDelete(row)"
                    style="padding: 4px 15px"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div
            style="width: 100%; display: flex; justify-content: space-around"
          >
            <el-button class="purchase_btn" type="primary" @click="saveplan()">保 存</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备检定计划">
        <vab-query-form style="margin-bottom: 11px">
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
            <el-button type="primary" style="margin: 0" @click="searchbutton">搜索</el-button>
            <el-button type="primary" @click="deviceExport">导出</el-button>
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
                  v-model="queryForm.device_name"
                  placeholder="按设备名称搜索"
                  prefix-icon="el-icon-search"
                >
                </el-input>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-row :gutter="10">
          <el-col :span="6" style="overflow: hidden">
            <el-table
              highlight-current-row
              ref="tableSort"
              v-loading="listPlanLoading"
              :data="listplan"
              border
              :header-cell-style="{ background: '#e8f0ff' }"
              :element-loading-text="elementLoadingText"
              :height="table.tableHeight1"
              @row-click="PlanChoose"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
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
              <el-table-column
                show-overflow-tooltip
                prop="scope"
                label="测量范围"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="precision"
                label="测量精度"
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="操作" width="100px">
                <template #default="{ row }">
                  <el-button
                    v-if="row.adjust_id===''"
                    @click="handleExecute(row)"
                    type="primary"
                    style="padding: 4px 15px"

                  >
                    执行校检
                  </el-button>
                  <el-button
                    v-else
                    type="primary"
                    style="padding: 4px 15px"
                    disabled
                  >
                    执行校检
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="校检记录">
        <vab-query-form style="margin-bottom: 11px">
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
            <el-button type="primary" style="margin: 0" @click="searchbutton">搜索</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel
            class="flex"
            style="width: 75%; padding-left: 5px"
          >
            <!-- <span class="headline">详细计划</span> -->
<!--            <el-form
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
              @row-click="CaliChoose"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
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
              v-loading="listCalibrateLoading"
              :data="listCalibrate"
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
                label="校检单位"
                prop="verify_org"
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
                label="校检日期"
                prop="verify_date"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="校检结果"
                prop="verify_result"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="证书确认"
                prop="cert_situation"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="证书编号"
                prop="cert_id"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="证书扫描件"
                prop="certificate_image"
                width="95px"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="送检人"
                prop="sender"
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="操作" width="80px">
                <template #default="{ row }">
                  <el-dropdown trigger="click" placement="left-start">
                    <el-button
                      icon="el-icon-s-fold"
                      class="el-dropdown-link"
                      type="primary"
                      style="padding: 4px 15px"
                    ></el-button>
                    <el-dropdown-menu slot="dropdown" class="more">
                      <el-button @click="handleCaliChange(row)">修改</el-button>
                      <el-button @click="handleCaliDetail(row)">详情</el-button>
                      <el-button @click="handleDelete(row)">删除</el-button>
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
    <CalibrationRecord ref="CalibrationRecord" @CaliChoose="CaliChoose"></CalibrationRecord>
    <deviceadd ref="deviceadd" @fetchData1="fetchData1"></deviceadd>
    <CalibrationExecute ref="CalibrationExecute"></CalibrationExecute>
    <CalibrationDetail ref="CalibrationDetail"></CalibrationDetail>
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
import deviceadd from '../components/devices.vue'
import CalibrationExecute from '../components/equipmentCalibration1.vue'
import CalibrationRecord from '../components/equipmentCalibrationrecord.vue'
import CalibrationDetail from '../components/equipmentCalibrationDetail.vue'
import CalibrationFrom from '../form/CalibrationForm.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    deviceadd,
    CalibrationExecute,
    CalibrationDetail,
    CalibrationRecord,
    CalibrationFrom,
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
      listCalibrateLoading: [],
      listCalibrate:[],
      listplan: [],
      listplan1: [],
      planname: '',
      imageList: [],
      listLoading: true,
      listPlanDetailLoading: true,
      listPlanLoading: true,
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
        startdate: '1900-01-01',
        enddate: '2050-01-01',
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
      },

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
  },
  beforeDestroy() { },
  mounted: function () {
    this.$nextTick(function () {
      let exceptHeight = 320;
      let exceptHeight1 = 320;
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
    searchbutton() {
      this.fetchData()
    },
    deviceExport() {
      let row = {}
      row.template_id = 1
      row.param = '@org_id$`'+this.current_org
      console.log(row)
      this.$refs['deviceExport'].showEdit(row)
    },
    searchdetail() {
      this.fetchData()
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    CalibrationFromAdd() {
      console.log(this.$refs['CalibrationFrom'].form);
    },
    tableSortChange() {
      const imageList = []
      this.$refs.tableSort.tableData.forEach((item, index) => {
        imageList.push(item.img)
      })
      this.imageList = imageList
    },
    async CaliChoose(row) {
      this.listCalibrateLoading=true
      let sData='[Q]159{'+row.plan_id+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.listCalibrate=res.data
      setTimeout(() => {
        this.listCalibrateLoading = false
      }, 500)
    },
    setSelectRows(val) {
      this.selectRows = val
    },
    async PlanChoose(row) {
      this.listPlanDetailLoading=true
      let sData='[Q]151{'+row.plan_id+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.listPlanDetail=res.data
      setTimeout(() => {
        this.listPlanDetailLoading = false
      }, 500)
    },
    setSelectRows(val) {
      this.selectRows = val
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
      let sData='[Q]143{'+this.current_org+'$`'+date1+'$`'+this.planname+'$`0}|^2|^SYS'
      let ncount=0;
      if(this.planname=='' || this.list.length==0)
      {
        return false
      }
      else{
        const res = await ExecSql(sData)
        if(res>0)
        {
          for(let i=0;i<this.list.length;i++)
          {
            let sData2='[Q]144{'+res+'$`'+this.list[i].device_id+'}|^2|^SYS'
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
    DeviceAdd() {
      this.$refs['deviceadd'].showEdit1()
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
    handleAdd31(row) {
      this.$refs['edit31'].showEdit(row)
    },
    handleExecute(row) {
      this.$refs['CalibrationExecute'].showEdit(row)
    },
    handleCaliChange(row) {
      this.$refs['CalibrationRecord'].showEdit(row)
    },
    handleCaliDetail(row) {
      this.$refs['CalibrationDetail'].showEdit(row)
    },

    handleDelete(row) {
      console.log(row)
      if (row.adjust_id) {
        this.$baseConfirm('你确定要删除管理编号为'+row.manage_pid+'的设备的校检记录吗?', null, async () => {
          let sData = '[Q]161{'+row.adjust_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            this.$baseMessage("删除成功", 'success')
            this.CaliChoose(row)
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
      this.listPlanLoading = true
      this.listPlanDetailLoading = true
      this.listCalibrateLoading=true
      let sDataca='[Q]159{'+this.current_org+'$`'+this.form.startdate+'$`'+this.form.enddate+'}|^SYS'
      const resca = await QueryExec(sDataca)
      console.log(resca)
      this.listCalibrate=resca.data

      let sData = '[Q]149{'+this.current_org+'$`'+this.form.startdate+'$`'+this.form.enddate+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(sData)
      this.listplan = res.data

      let sData1 = '[Q]156{'+this.current_org+'$`'+this.form.startdate+'$`'+this.form.enddate+'}|^SYS'
      const res1 = await QueryExec(sData1)
      this.listplan1 = res1.data
      setTimeout(() => {
        this.listLoading = false
      }, 500)
      setTimeout(() => {
        this.listPlanLoading = false
      }, 500)
      setTimeout(() => {
        this.listPlanDetailLoading = false
      }, 500)
      setTimeout(() => {
        this.listCalibrateLoading = false
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

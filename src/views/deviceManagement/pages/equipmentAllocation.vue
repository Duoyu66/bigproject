<template>
  <div class="definition equipment_btn calc">
    <el-tabs
      type="border-card"
      :value="this.$route.query.tabs ? this.$route.query.tabs : 1"
      class="box_center"
    >
      <el-tab-pane label="设备调拨申请" class="center">
        <div class="usage">
          <DeviceApplyForm ref="DeviceApplyForm" @transferTable="transferTable"></DeviceApplyForm>
          <div>
            <el-button class="purchase_btn" type="primary" @click="ApplyAdd">
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备调拨审批">
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%">
            <el-form
              ref="form"
              :model="queryFormApply"
              :inline="true"
              @submit.native.prevent
            >
              <el-form-item style="padding-right: 10px;">
                <el-input
                  style="border-radius: 30px"
                  v-model="queryFormApply.device_name"
                  placeholder="按管理编号搜索"
                ></el-input>
              </el-form-item>
              <el-form-item style="padding-right: 10px;">
                <el-input
                  style="border-radius: 30px"
                  v-model="queryFormApply.manage_pid"
                  placeholder="按设备名称搜索"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="searchbutton"
                ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :data="listApply"
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
            prop="apply_people"
            label="申请人"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="申请时间"
            prop="apply_date"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="申请人机构"
            prop="org_name_apply"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="设备来自机构"
            prop="org_name_from"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="调拨申请原因"
            prop="reason"
            width="250"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="100px">
            <template #default="{ row }">
              <el-button
                v-if="
                  row.allot_state === '1' && row.from_org === row.current_org
                "
                type="primary"
                class="normal"
                @click="handleApprove(row)"
              >
                审批申请
              </el-button>
              <el-button
                v-else-if="
                  row.allot_state === '1' && row.to_org === row.current_org
                "
                @click="handleDeleteApply(row)"
                class="danger"
              >
                撤销申请
              </el-button>
              <el-button
                v-else-if="
                  row.allot_state === '2' && row.from_org === row.current_org
                "
                @click="handleExpress(row)"
                class="normal"
              >
                快递录入
              </el-button>
              <el-button
                v-else-if="
                  row.allot_state === '3' && row.to_org === row.current_org
                "
                @click="handleAchieve(row)"
                class="normal"
              >
                快递接收
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :background="background"
          :current-page="queryFormApply.pageNo"
          :layout="layout"
          :page-size="queryFormApply.pageSize"
          :total="totalApply"
          @current-change="handleCurrentChangeApply"
          @size-change="handleSizeChangeApply"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="设备调拨登记" class="center">
        <div class="usage">
          <AllocationForm ref="AllocationForm" @transferTable="transferTable"></AllocationForm>
          <div>
            <el-button
              class="purchase_btn"
              type="primary"
              @click="handleAllocationAdd"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备调拨记录">
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%">
            <el-form
              ref="form"
              :model="queryForm"
              :inline="true"
              @submit.native.prevent
            >
              <el-form-item style="padding-right: 10px;">
                <el-input
                  style="border-radius: 30px"
                  v-model="queryForm.device_name"
                  placeholder="按设备名称搜索"
                ></el-input>
              </el-form-item>
              <el-form-item style="padding-right: 10px;">
                <el-input
                  style="border-radius: 30px"
                  v-model="queryForm.manage_pid"
                  placeholder="按管理编号搜索"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="searchbutton"
                ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :data="list"
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
            prop="manage_uid"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="device_name"
            label="设备名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="规格型号"
            prop="model"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="scope"
            label="测量范围"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="precision"
            label="精度"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="from_org_name"
            label="起始机构"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="目标机构"
            prop="to_org_name"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="经手人"
            prop="apply_people"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="调拨原因"
            prop="reason"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="100px">
            <template #default="{ row }">
              <el-dropdown trigger="click" placement="left-start">
                <el-button
                  icon="el-icon-s-fold"
                  class="el-dropdown-link"
                  type="primary"
                ></el-button>
                <el-dropdown-menu slot="dropdown" class="more">
                  <el-button @click="handleEdit(row)">修改记录</el-button>
                  <el-button @click="handleAllotDelete(row)">删除记录</el-button>
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
      </el-tab-pane>
    </el-tabs>
    <equipmentAllocation
      ref="equipmentAllocation"
      @fetchData="fetchData"
    ></equipmentAllocation>
    <equipmentAllocation1
      ref="equipmentAllocation1"
      @fetchData="fetchData"
    ></equipmentAllocation1>
    <equipmentAllocation2
      ref="equipmentAllocation2"
      @fetchData="fetchData"
    ></equipmentAllocation2>
  </div>
</template>

<script>
import { doEdit, getList, ExecSql, QueryExec } from '@/api/table'
import { mapActions, mapGetters } from 'vuex'
import equipmentAllocation from '../components/equipmentAllocation.vue'
import equipmentAllocation1 from '../components/equipmentAllocation1.vue'
import equipmentAllocation2 from '../components/equipmentAllocation2.vue'
// import TableEdit6 from '../components/equipmentAllocation1.vue'
import AllocationForm from '../form/AllocationForm.vue'
import DeviceApplyForm from '../form/DeviceApplyForm.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    equipmentAllocation,
    equipmentAllocation1,
    AllocationForm,
    DeviceApplyForm,
    treeData,
    equipmentAllocation2,
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
      listApply: [],
      imageList: [],
      search_date: '',
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      totalApply: 0,
      background: true,
      selectRows: '',
      elementLoadingText: '正在加载...',
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
        manage_pid: '',
        device_name: '',
      },
      queryFormApply: {
        pageNo: 1,
        pageSize: 20,
        title: '',
        manage_pid: '',
        device_name: '',
      },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: '',
      },
      formLabelWidth: '120px',
      table: {
        tableHeight: this.$(window).height(),
      },
    }
  },
  computed: {
    ...mapGetters({
      current_org: 'org/current_org',
      person_id: 'user/person_id',
    }),
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    this.fetchData()
  },
  beforeDestroy() {},
  mounted: function () {
    this.$nextTick(function () {
      let exceptHeight = 300
      // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
      //tableSort为table中ref的值
      if (this.$refs.tableSort.$el) {
        this.table.tableHeight =
          window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight
      }

      // 监听窗口大小变化
      let that = this
      window.onresize = function () {
        if (that.$refs.tableSort.$el) {
          that.table.tableHeight =
            window.innerHeight -
            that.$refs.tableSort.$el.offsetTop -
            exceptHeight
        }
      }
    })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    searchbutton() {
      this.fetchData()
    },
    handleAllocationAdd() {
      this.$refs['AllocationForm'].save()
    },
    handleApprove(row) {
      this.$refs['equipmentAllocation'].showEdit(row, '1')
    },
    transferTable() {
      this.$baseConfirm('是否跳转到维护保养记录?如果要继续添加请点击取消。', null, async () => {
        this.$router.push('/device/equipmentAllocation?tabs=3')
        this.fetchData()
      })
    },
    handleDeleteApprove(row) {
      console.log(row)
      if (row.allot_id) {
        this.$baseConfirm(
          '你确定要删除管理编号为' + row.manage_pid + '的设备的调拨申请吗?',
          null,
          async () => {
            let sData = '[Q]208{' + row.allot_id + '}|^1|^SYS'
            const res = await ExecSql(sData)
            if (res > 0) {
              this.$baseMessage('删除成功', 'success')
              this.fetchData()
            } else {
              this.$baseMessage('删除失败', 'error')
            }
          }
        )
      }
    },
    handleAchieve(row) {
      console.log(row)
      if (row.allot_id) {
        this.$baseConfirm(
          '你确定收到管理编号为' + row.manage_pid + '的设备的快递吗?',
          null,
          async () => {
            let sData = '[Q]296{' + row.allot_id + '}|^1|^SYS'
            const res = await ExecSql(sData)
            if (res > 0) {
              let sData =
                '[Q]368{' + row.current_org + '$`' + row.device_id + '}|^1|^SYS'
              const res = await ExecSql(sData)

              this.$baseMessage('接收成功', 'success')
              this.fetchData()
            } else {
              this.$baseMessage('接收失败', 'error')
            }
          }
        )
      }
    },
    tableSortChange() {
      const imageList = []
      this.$refs.tableSort.tableData.forEach((item, index) => {
        imageList.push(item.img)
      })
      this.imageList = imageList
    },
    ApplyAdd() {
      this.$refs['DeviceApplyForm'].save()
    },
    setSelectRows(val) {
      this.selectRows = val
    },
    handleEdit(row) {
      this.$refs['equipmentAllocation2'].showEdit(row, '1')
    },
    handleExpress(row) {
      this.$refs['equipmentAllocation1'].showEdit(row, '2')
    },
    handleDelete(row) {
      if (row.allot_id) {
        this.$baseConfirm(
          '你确定要删除采购日期为()的记录吗',
          null,
          async () => {
            let sData = '[Q]309{' + row.allot_id + '}|^1|^SYS'
            const res = await ExecSql(sData)
            if (res > 0) {
              this.$baseMessage('接收成功', 'success')
              this.fetchData()
            } else {
              this.$baseMessage('接收失败', 'error')
            }
          }
        )
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleDeleteApply(row) {
      if (row.allot_id) {
        this.$baseConfirm('你确定要撤销此设备调拨吗', null, async () => {
          let sData = '[Q]208{' + row.allot_id + '}|^1|^SYS'
          const res = await ExecSql(sData)
          if (res > 0) {
            this.$baseMessage('撤销成功', 'success')
            this.fetchData()
          } else {
            this.$baseMessage('撤销失败', 'error')
          }
        })
      }
    },
    handleAllotDelete(row) {
      if (row.allot_id) {
        this.$baseConfirm('你确定要撤销此设备调拨吗', null, async () => {
          let sData = '[Q]208{' + row.allot_id + '}|^1|^SYS'
          const res = await ExecSql(sData)
          if (res > 0) {
            this.$baseMessage('撤销成功', 'success')
            this.fetchData()
          } else {
            this.$baseMessage('撤销失败', 'error')
          }
        })
      }
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    handleSizeChangeApply(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChangeApply(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    handleQuery() {
      this.queryForm.pageNo = 1
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true

      let sDataApply =
        '[Q]207{' +
        this.current_org +
        '$`%' +
        this.queryFormApply.manage_pid +
        '%$`%' +
        this.queryFormApply.device_name +
        '%$`' +
        (
          (Number(this.queryFormApply.pageNo) - 1) *
          Number(this.queryFormApply.pageSize)
        ).toString() +
        '$`' +
        this.queryFormApply.pageSize +
        '}|^SYS'
      const resApply = await QueryExec(sDataApply)
      this.listApply = resApply.data
      for (let i = 0; i < resApply.totalCount; i++) {
        this.listApply[i].current_org = this.current_org
      }
      console.log(this.listApply)
      this.totalApply = resApply.totalCount

      let sData =
        '[Q]370{' +
        this.current_org +
        '$`%' +
        this.queryForm.device_name +
        '%$`%' +
        this.queryForm.manage_pid +
        '%$`' +
        (
          (Number(this.queryFormApply.pageNo) - 1) *
          Number(this.queryFormApply.pageSize)
        ).toString() +
        '$`' +
        this.queryFormApply.pageSize +
        '}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      this.list = res.data
      this.total = res.totalCount

      setTimeout(() => {
        this.listLoading = false
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

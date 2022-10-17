<template>
  <div class="definition cailbration period">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="添加核查计划" name='first'>
        <div class="usage" style="padding: 10px 30px;">
          <div style="width: 100%; display: flex; justify-content: flex-end;">
            <span style="width: 80px; line-height: 32px;">计划内容</span>
            <el-input></el-input>
            <el-button type="primary" @click="handleAdd1" style="margin-left: 10px;">添加设备</el-button>
          </div>
          <div style="width: 100%; margin: 20px 0;">
            <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list" border
              :header-cell-style="{background:'#e8f0ff' }" :element-loading-text="elementLoadingText" :height="table.tableHeight1"
              @selection-change="setSelectRows" @sort-change="tableSortChange">
              <el-table-column show-overflow-tooltip label="设备名称" prop="date"></el-table-column>
              <el-table-column show-overflow-tooltip label="管理编号" prop="number"></el-table-column>
              <el-table-column show-overflow-tooltip label="规格型号" prop="number1"></el-table-column>
              <el-table-column show-overflow-tooltip label="上次核查日期" prop="date1"></el-table-column>
              <el-table-column show-overflow-tooltip label="操作" width="100px">
                <template #default="{ row }">
                  <el-button type="primary" style="padding: 5px 15px;">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="width: 100%; display: flex; justify-content: space-around;">
            <el-button class="purchase_btn" type="primary">保 存</el-button>
            <el-button class="purchase_btn" type="danger">取 消</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备核查计划" name='second'>
        <vab-query-form>
          <vab-query-form-left-panel class="consumption" style="width: 25%; padding-right: 10px;">
            <el-row style="width: calc(100% - 66px); margin-right: 10px;">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col style="align-items: center; line-height: 32px" :span="2">——</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date2" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-row>
            <el-button type="primary" style="margin: 0;">搜索</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel class="flex" style="width: 75%; padding-left: 5px;">
            <span class="headline">详细计划</span>
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item>
                <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按设备名称搜索" prefix-icon="el-icon-search" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-row :gutter="10">
          <el-col :span="6" style="overflow: hidden;">
            <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list2" border
              :header-cell-style="{background:'#e8f0ff' }" :element-loading-text="elementLoadingText" :height="table.tableHeight1"
              @selection-change="setSelectRows" @sort-change="tableSortChange" style="margin-bottom: 10px;">
              <el-table-column show-overflow-tooltip label="计划日期" prop="date" min-width="35%"></el-table-column>
              <el-table-column show-overflow-tooltip prop="center" label="计划名称" min-width="65%"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="18">
            <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list1" border
              :header-cell-style="{background:'#e8f0ff' }" :element-loading-text="elementLoadingText" :height="table.tableHeight1"
              @selection-change="setSelectRows" @sort-change="tableSortChange">
              <el-table-column show-overflow-tooltip prop="number" label="管理编号"></el-table-column>
              <el-table-column show-overflow-tooltip label="设备名称" prop="equip"></el-table-column>
              <el-table-column show-overflow-tooltip prop="type" label="规格型号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="way" label="核查方式"></el-table-column>
              <el-table-column show-overflow-tooltip label="操作">
                <template #default="{ row }">
                  <el-button type="primary" @click="handleAdd" style="padding: 4px 15px;">
                    执行核查
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="设备核查记录" name ='three'>
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%;">
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item>
                <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按设备名称搜索" prefix-icon="el-icon-search" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table ref="tableSort" v-loading="listLoading" :data="list3" border :element-loading-text="elementLoadingText" highlight-current-row
          :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
          <el-table-column show-overflow-tooltip label="管理编号" prop="number"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="设备名称"></el-table-column>
          <el-table-column show-overflow-tooltip label="规格型号" prop="type"></el-table-column>
          <el-table-column show-overflow-tooltip prop="way" label="核查方式"></el-table-column>
          <el-table-column show-overflow-tooltip label="核查实施人" prop="people1"></el-table-column>
          <el-table-column show-overflow-tooltip label="核查结果" prop="result"></el-table-column>
          <el-table-column show-overflow-tooltip label="经手人" prop="people2"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="100px">
            <template #default="{ row }">
                  <el-dropdown trigger="click" placement="left-start">
                    <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                    <el-dropdown-menu slot="dropdown" class="more" >
                      <el-button @click="handleAdd2">修改记录</el-button>
                      <el-button >核查详情</el-button>
                    </el-dropdown-menu>
                  </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
          :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <table-edit ref="edit"></table-edit>
    <table-edit1 ref="edit1"></table-edit1>
    <table-edit2 ref="edit2"></table-edit2>
  </div>
</template>

<script>
  import {
      getList,
      doDelete
    } from '@/api/table'
    import TableEdit from '../components/equipmentPeriodcheck.vue'
    import TableEdit1 from '../components/equipment.vue'
    import TableEdit2 from '../components/equipmentPeriodcheck1.vue'
    import treeData from './../../vab/tree/index'
    export default {
      name: 'ComprehensiveTable',
      components: {
        TableEdit,
        TableEdit1,
        TableEdit2,
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
          activeName: 'three',
          imgShow: true,
          list: [],
          imageList: [],
          listLoading: true,
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
            date1: '',
            date2: '',
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
        height() {
          return this.$baseTableHeight()
        },
      },
      created() {
        this.fetchData()
      },
      beforeDestroy() {},
      mounted: function() {
        this.$nextTick(function() {
          let exceptHeight = 280;
          let exceptHeight1 = 260;
          // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
          //tableSort为table中ref的值
          if (this.$refs.tableSort.$el) {
            this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
            this.table.tableHeight1 = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight1;
          }

          // 监听窗口大小变化
          let that = this;
          window.onresize = function() {
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
        handleAdd() {
          this.$refs['edit'].showEdit()
        },
        handleAdd1() {
          this.$refs['edit1'].showEdit1()
        },
        handleAdd2() {
          this.$refs['edit2'].showEdit2()
        },
        handleDelete(row) {
          if (row.id) {
            this.$baseConfirm('你确定要删除采购日期为()的记录吗', null, async () => {
              const {
                msg
              } = await doDelete({
                ids: row.id
              })
              this.$baseMessage(msg, 'success')
              this.fetchData()
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
        async fetchData() {
          this.listLoading = true
          const {
            data,
            totalCount
          } = await getList(this.queryForm)
          this.list = [{
              "date": "电子天平",
              number: "GX-12",
              number1: "无",
              date1: "2020-05-23",
              time: "一年"
            },
            {
              "date": "显微镜",
              number: "GX-10",
              number1: "无",
              date1: "2020-08-23",
              time: "三年"
            },
            {
              "date": "温湿度监测仪",
              number: "GX-58",
              number1: "无",
              date1: "2020-05-12",
              time: "一年"
            },
            {
              "date": "透气仪",
              number: "GX-06",
              number1: "无",
              date1: "2020-07-23",
              time: "二年"
            },
            {
              "date": "千分尺",
              number: "GX-29",
              number1: "无",
              date1: "2020-11-06",
              time: "六月"
            },
            {
              "date": "高低温恒温水浴",
              number: "GX-01",
              number1: "无",
              date1: "2020-01-20",
              time: "三年"
            },
            {
              "date": "震击式标准振筛机",
              number: "GX-66",
              number1: "无",
              date1: "2020-10-01",
              time: "二年"
            }
          ]
          this.list1 = [{"number":"GX-01","equip":"高低温恒温水浴","type":"无","way":"普通核查"},
          {"number":"GX-15","equip":"千分尺","type":"无","way":"试验核查"},
          {"number":"GX-26","equip":"显微镜","type":"无","way":"普通核查"},
          {"number":"GX-08","equip":"电子天平","type":"无","way":"试验核查"},
          {"number":"GX-18","equip":"电子天平","type":"无","way":"试验核查"}]
          this.list3 = [{"number":"GX-01","name":"高低温恒温水浴","type":"无","way":"普通核查",
          "people1":"贺君天","result":"核查合格","people2":"胡雨佳"},
          {"number":"GX-15","name":"千分尺","type":"无","way":"试验核查",
          "people1":"王名扬","result":"核查合格","people2":"张华斌"},
          {"number":"GX-26","name":"显微镜","type":"无","way":"普通核查",
          "people1":"王兰乐","result":"核查合格","people2":"闫旭阳"},
          {"number":"GX-08","name":"电子天平","type":"无","way":"试验核查",
          "people1":"张子凡","result":"核查不合格","people2":"李星云"},
          {"number":"GX-18","name":"电子天平","type":"无","way":"试验核查",
          "people1":"张子凡","result":"核查不合格","people2":"李星云"}]
          this.list2 = [{
              date: "2020-06-16",
              center: "电子天平核查计划"
            },
            {
              date: "2020-06-16",
              center: "千分尺核查计划"
            },
            {
              date: "2020-06-16",
              center: "透气仪核查计划"
            },
            {
              date: "2020-06-16",
              center: "温湿度监测仪核查计划"
            },
            {
              date: "2020-06-16",
              center: "显微镜核查计划"
            }
          ]
          const imageList = []
          data.forEach((item, index) => {
            imageList.push(item.img)
          })
          this.imageList = imageList
          this.total = totalCount
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

<template>
  <div class="definition cailbration period">
    <el-tabs type="border-card" :value="this.$route.query.tabs?this.$route.query.tabs:1">
      <el-tab-pane label="添加校检计划" >
        <div class="usage" style="padding: 10px 30px;">
          <div style="width: 100%; display: flex; justify-content: flex-end;">
            <span style="width: 80px; line-height: 32px;">计划内容</span>
            <el-input></el-input>
            <el-button type="primary" @click="handleAdd1" style="margin-left: 10px;">添加设备</el-button>
          </div>
          <div style="width: 100%; margin: 20px 0;">
            <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list" border :header-cell-style="{background:'#e8f0ff' }"
              :element-loading-text="elementLoadingText" :height="table.tableHeight1" @selection-change="setSelectRows" @sort-change="tableSortChange">
              <el-table-column show-overflow-tooltip label="设备名称" prop="date"></el-table-column>
              <el-table-column show-overflow-tooltip label="管理编号" prop="number"></el-table-column>
              <el-table-column show-overflow-tooltip label="规格型号" prop="number1"></el-table-column>
              <el-table-column show-overflow-tooltip label="上次校检日期" prop="date1"></el-table-column>
              <el-table-column show-overflow-tooltip label="周期" prop="time"></el-table-column>
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
      <el-tab-pane label="设备检定计划">
      <vab-query-form style="margin-bottom: 11px;" >
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
          <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list3" border :header-cell-style="{background:'#e8f0ff' }"
            :element-loading-text="elementLoadingText" :height="table.tableHeight1" @selection-change="setSelectRows" @sort-change="tableSortChange">
            <el-table-column show-overflow-tooltip label="计划日期" prop="date" min-width="35%"></el-table-column>
              <el-table-column show-overflow-tooltip prop="name" label="计划名称" min-width="65%"></el-table-column>
            </el-table>
        </el-col>
        <el-col :span="18">
            <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list1" border :header-cell-style="{background:'#e8f0ff' }"
              :element-loading-text="elementLoadingText" :height="table.tableHeight1" @selection-change="setSelectRows" @sort-change="tableSortChange">
              <el-table-column show-overflow-tooltip prop="number" label="管理编号"></el-table-column>
              <el-table-column show-overflow-tooltip label="设备名称" prop="equip"></el-table-column>
              <el-table-column show-overflow-tooltip prop="way" label="规格型号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="way1" label="测量范围"></el-table-column>
              <el-table-column show-overflow-tooltip prop="way2" label="测量精度"></el-table-column>
              <el-table-column show-overflow-tooltip label="操作" width="100px">
                <template #default="{ row }">
                  <el-button @click="handleAdd2" type="primary" style="padding: 5px 15px;">
                    执行校检
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-col>
      </el-row>
      </el-tab-pane>
      <el-tab-pane label="设备校检记录">
        <vab-query-form>
          <vab-query-form-right-panel style="width: 100%;">
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item>
                <el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按设备名称搜索" prefix-icon="el-icon-search" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table ref="tableSort" v-loading="listLoading" :data="list2" border :element-loading-text="elementLoadingText"  highlight-current-row
          :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
          <el-table-column show-overflow-tooltip label="设备名称" prop="name"></el-table-column>
          <el-table-column show-overflow-tooltip prop="type1" label="规格型号"></el-table-column>
          <el-table-column show-overflow-tooltip label="生产厂家" prop="mill"></el-table-column>
          <el-table-column show-overflow-tooltip prop="range" label="测量范围"></el-table-column>
          <el-table-column show-overflow-tooltip label="精度" prop="accuracy"></el-table-column>
          <el-table-column show-overflow-tooltip label="出厂日期" prop="date1"></el-table-column>
          <el-table-column show-overflow-tooltip label="购置日期" prop="date2"></el-table-column>
          <el-table-column show-overflow-tooltip label="设备类型" prop="type2"></el-table-column>
          <el-table-column show-overflow-tooltip label="存放位置" prop="seat"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="100px">
            <template #default="{ row }">
                  <el-dropdown trigger="click" placement="left-start">
                    <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                    <el-dropdown-menu slot="dropdown" class="more" >
                      <el-button @click="handleAdd">修改</el-button>
                      <el-button >详情</el-button>
                      <el-button >删除</el-button>
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
  import TableEdit from '../components/equipmentCalibration.vue'
  import TableEdit1 from '../components/devices.vue'
  import TableEdit2 from '../components/equipmentCalibration1.vue'
  import CalibrationFrom from '../form/CalibrationForm.vue'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
      TableEdit1,
      TableEdit2,
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
          number:''
        },
        formLabelWidth: '120px',
        table: {
        	tableHeight: this.$(window).height()
        },
        table: {
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
    		let exceptHeight = 300;
        let exceptHeight1 = 340;
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
      CalibrationFromAdd(){
      	console.log(this.$refs['CalibrationFrom'].form);
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
      handleAdd1() {
        this.$refs['edit1'].showEdit1()
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
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
        this.list = [{"date":"电子天平",number:"GX-12",number1:"无",date1:"2020-05-23",time:"一年"},
        {"date":"显微镜",number:"GX-10",number1:"无",date1:"2020-08-23",time:"三年"},
        {"date":"温湿度监测仪",number:"GX-58",number1:"无",date1:"2020-05-12",time:"一年"},
        {"date":"透气仪",number:"GX-06",number1:"无",date1:"2020-07-23",time:"二年"},
        {"date":"千分尺",number:"GX-29",number1:"无",date1:"2020-11-06",time:"六月"},
        {"date":"高低温恒温水浴",number:"GX-01",number1:"无",date1:"2020-01-20",time:"三年"},
        {"date":"震击式标准振筛机",number:"GX-66",number1:"无",date1:"2020-10-01",time:"二年"},
        {"date":"电子天平"},
        {"date":"显微镜"},
        {"date":"温湿度监测仪"},{"date":"透气仪"},{"date":"千分尺"},{"date":"高低温恒温水浴"},
        {"date":"震击式标准振筛机"},{"date":"电子天平"},{"date":"显微镜"},{"date":"温湿度监测仪"},{"date":"透气仪"},
        {"date":"千分尺"},{"date":"高低温恒温水浴"},{"date":"震击式标准振筛机"}]
        this.list3=[{date:"2020-01-12",name:"电子天平校检计划"},
        {date:"2020-12-23",name:"千分尺校检计划"},
        {date:"2020-11-09",name:"显微镜校检计划"},
        {date:"2020-08-13",name:"温湿度监测仪校检计划"}]
        this.list1=[{"equip":"透气仪","way":"无",number:"GX-56",way1:"透气性",way2:"0.01"},
        {"equip":"电子天平","way":"无",number:"GX-25",way1:"质量",way2:"0.1"},
        {"equip":"千分尺","way":"无",number:"GX-08",way1:"长度",way2:"0.1"},
        {"equip":"显微镜","way":"无",number:"GX-13",way1:"/",way2:"0.001"},
        {"equip":"温湿度监测仪","way":"无",number:"GX-55",way1:"温度",way2:"0.01"}]
        this.list2 =  [{"name":"温湿度监测仪","type1":"无","mill":"河北厂家","range":"温度测量","accuracy":"0.01",
        "date1":"2020-02-03","date2":"2020-05-06","type2":"无","seat":"广汕铁路-GSSG6标项目经理部-中心试验室"},
        {"name":"温湿度监测仪","type1":"无","mill":"山东厂家","range":"温度测量","accuracy":"0.01",
        "date1":"2020-02-12","date2":"2020-12-06","type2":"无","seat":"广汕铁路-二工区-二工区试验室"},
        {"name":"温湿度监测仪","type1":"无","mill":"天津厂家","range":"湿度测量","accuracy":"0.01",
        "date1":"2020-04-08","date2":"2020-07-06","type2":"无","seat":"广汕铁路-二工区-二工区试验室"},
        {"name":"电子天平","type1":"无","mill":"河北厂家","range":"力学测量","accuracy":"0.01",
        "date1":"2020-02-28","date2":"2020-06-06","type2":"无","seat":"广汕铁路-GSSG6标项目经理部-1#站检测组"}]
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

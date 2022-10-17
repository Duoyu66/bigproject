<template>
  <!-- 个人积分界面 -->
  <div class="table-container definition" style="overflow: auto;">
<!--    <vab-query-form style="margin-bottom: 11px;" class="personallntegral">

    </vab-query-form> -->
    <el-row :gutter="10">
      <el-col :span="13">
        <div class="baseBox" style="height:calc(87.5vh)">
          <vab-query-form-left-panel style="width: 100%; flex-wrap: nowrap;" >
              <span class="definition_txt" style="margin-right: 10px;">姓名</span>
              <el-input v-model="form.name" style="width: 130px;margin-right: 10px;margin-bottom: 10px;" ></el-input>
              <span class="definition_txt" style="margin-right: 10px;">开始时间</span>
              <el-date-picker
                    v-model="value1"
                    type="date"
                    :picker-options="{
                      selectableRange: ''
                    }"
                    placeholder="任意时间点" style="margin-right: 10px;margin-bottom: 10px;"
                    >
                  </el-date-picker>
                  <span class="definition_txt" style="margin-right: 10px;">结束时间</span>
                  <el-date-picker
                    arrow-control
                    type="date"
                    v-model="value2"
                    :picker-options="{
                      selectableRange: ''}" style="margin-right: 10px;margin-bottom: 10px;"
                    placeholder="任意时间点">
                  </el-date-picker>
                <el-button type="primary">搜索</el-button>
          </vab-query-form-left-panel>
          <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list" border :header-cell-style="{background:'#e8f0ff' }"
            :element-loading-text="elementLoadingText" :height="table.tableHeight1" @selection-change="setSelectRows" @sort-change="tableSortChange" style="margin-bottom: 10px;">
            <el-table-column show-overflow-tooltip label="姓名" prop="name" min-width="35%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="date" label="日期" min-width="35%"></el-table-column>
            <el-table-column show-overflow-tooltip prop="integral" label="积分" min-width="30%"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="11" style="padding-left:10px!important;">
        <div class="baseBox" style="height:calc(87.5vh);margin-right:10px;">
          <vab-query-form-right-panel class="flex" style="width:100%;">
            <span class="headline" style="width: calc(100%);">积分明细</span>
          </vab-query-form-right-panel>
          <el-table highlight-current-row ref="tableSort" v-loading="listLoading" :data="list1" border :header-cell-style="{background:'#e8f0ff' }"
            :element-loading-text="elementLoadingText" :height="table.tableHeight1" @selection-change="setSelectRows" @sort-change="tableSortChange">
            <el-table-column show-overflow-tooltip label="积分日期" prop="date" min-width="30%"></el-table-column>
            <el-table-column show-overflow-tooltip label="积分增减内容" prop="center" min-width="40%"></el-table-column>
            <el-table-column show-overflow-tooltip label="积分增减数量" prop="number" min-width="30%"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
  import TableEdit from './../components/defaultEdit'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
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
        value1: new Date(),
        value2: new Date(),
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
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
          number:''
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
    		let exceptHeight = 208;
        let exceptHeight1 = 238;
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
        this.list = [{"name":"李华","date":"2020-11-09","integral":"9"},
        {"name":"张晨","date":"2020-10-09","integral":"6"},
        {"name":"胡雨佳","date":"2020-11-19","integral":"8.5"},
        {"name":"贺君天","date":"2020-12-29","integral":"9"}]
        this.list1=[{"date":"2020-08-02","center":"积分增减内容1","number":"积分增减数量1"},
        {"date":"2020-06-12","center":"积分增减内容2","number":"积分增减数量2"},
        {"date":"2020-08-22","center":"积分增减内容3","number":"积分增减数量3"},
        {"date":"2020-08-15","center":"积分增减内容4","number":"积分增减数量4"}]
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
<style type="text/css">
.el-row{margin-left: 0px!important;margin-right: 0px!important;}
.el-col{padding: 0px!important ;}
.el-date-editor.el-input, .el-date-editor.el-input__inner{width:130px;}

@media only screen and (max-width: 1366px) {
   .baseBox{height:calc(82.5vh)!important;}
}
</style>

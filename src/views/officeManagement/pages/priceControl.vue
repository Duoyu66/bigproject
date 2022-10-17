<template>
  <div class="table-container definition purchase equipment">
    <vab-query-form class="contral" style="margin-bottom: 17px;">
      <vab-query-form-left-panel style="width: 500px;">
        <el-row style="width: 100%;">
          <el-col
            :span="12"
            style="display: flex; justify-content: space-between; padding-right: 5px;"
          >
            <el-select v-model="value" style="width: 120px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input prefix-icon="el-icon-search" style="width: 110px;" placeholder="按试验名称搜索"></el-input>
          </el-col>
          <el-col :span="12" style="padding-left: 5px;">
            <el-input prefix-icon="el-icon-search" style="width: 100%;" placeholder="按参数名称搜索"></el-input>
          </el-col>
        </el-row>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel style="width: calc(100% - 520px); padding-left: 20px;">
        <el-button type="primary" @click="handleAdd">添加参数计价</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-container>
      <el-aside width="500px" style="overflow: hidden;">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-table
              ref="tableSort"
              v-loading="listLoading"
              :data="list1"
              border
              :element-loading-text="elementLoadingText"
              :height="table.tableHeight"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
              row-key="id"
              :header-cell-style="{background:'#e8f0ff','text-align':'left'}"
              highlight-current-row
              :cell-style="{'text-align':'left'}"
            >
              <el-table-column prop="date" label="试验"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12">
            <el-table
              ref="tableSort"
              v-loading="listLoading"
              :data="list2"
              border
              :element-loading-text="elementLoadingText"
              :height="table.tableHeight"
              @selection-change="setSelectRows"
              @sort-change="tableSortChange"
              row-key="id"
              :header-cell-style="{background:'#e8f0ff','text-align':'left'}"
              highlight-current-row
              :cell-style="{'text-align':'left'}"
              w
            >
              <el-table-column show-overflow-tooltip label="参数" prop="date"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :data="list"
          border
          :element-loading-text="elementLoadingText"
          :height="table.tableHeight"
          @selection-change="setSelectRows"
          @sort-change="tableSortChange"
          :header-cell-style="{background:'#e8f0ff' }"
          highlight-current-row
        >
          <el-table-column show-overflow-tooltip label="计价单位" prop="valunit"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip prop="norms" label="参数"></el-table-column> -->
          <el-table-column show-overflow-tooltip label="价格" prop="dosage"></el-table-column>
          <el-table-column show-overflow-tooltip label="价格单位" prop="unit"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="150px">
            <template #default="{ row }">
              <el-button @click="handleamend(row)" class="normal">修改</el-button>
              <el-button @click="handleDelete(row)" class="danger">删除</el-button>
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
        <table-edit ref="edit"></table-edit>
      </el-main>
    </el-container>

    <el-dialog title="修改参数计价" :visible.sync="dialogFormVisible2">
      <el-form :model="form2" style="margin-right:15px;">
        <el-form-item label="试验名称" :label-width="formLabelWidth">
          <el-cascader
            v-model="value"
            :options="options2"
            :props="{ expandTrigger: 'hover' }"
            style="width: 250px;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="参数" :label-width="formLabelWidth" style="margin-top:10px">
          <el-select v-model="form2.number" style="width:250px;">
            <el-option label="含水率" value="single"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计价单位" :label-width="formLabelWidth" style="margin-top:10px">
          <el-select v-model="form2.number1" style="width:250px;">
            <el-option label="次" value="a"></el-option>
            <el-option label="根" value="b"></el-option>
            <el-option label="块" value="c"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" style="margin-top:10px">
          <el-input v-model="form2.number3" style="width:250px;"></el-input>
        </el-form-item>
        <el-form-item label="价格单位" :label-width="formLabelWidth" style="margin-top:10px">
          <el-select v-model="form2.number4" style="width:250px;">
            <el-option label="元" value="single"></el-option>
            <el-option label="万元" value="tenth"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getList,
    doDelete
  } from '@/api/table'
  import TableEdit from '../components/priceControl.vue'
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
        list1:[{
                id: 1,
                date: '原材料',
                children: [{
                    id: 31,
                    date: '水泥试验',
                  }, {
                    id: 32,
                    date: '粗骨科',
                }],
                }],
                list2:[{
          date:"含水率"
        }],
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
        options: [{
          value: 'a1',
          label: '请选择行业'
        }, {
          value: 'a2',
          label: '铁路'
        }, {
          value: 'a3',
          label: '公路'
        }, {
          value: 'a4',
          label: '水利'
        }],
        options2:[{
          value:'material',
          label:'原材料',
          children:[{
            value:'cement',
            label:'水泥试验'
          },{
            value:'coarse',
            label:'粗骨料试验'
          }]
        }],
        value: 'a1',

        table: {
        	tableHeight: this.$(window).height(),
        },

        dialogFormVisible2: false,
        form2: {
          name: 'xst',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number:'含水率',
          norms:'rygz',
        },
        formLabelWidth: '120px',
        formLabelWidth: '120px',
        title: '',
        dialogFormVisible2: false,

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
    		let exceptHeight = 200;
    		// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
    		//tableSort为table中ref的值
    		if (this.$refs.tableSort.$el) {
    			this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
    		}

    		// 监听窗口大小变化
    		let that = this;
    		window.onresize = function() {
    			if (that.$refs.tableSort.$el) {
    				that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight;
    			}
    		}
    	});
    },
    methods: {
      load(tree, treeNode, resolve) {
              setTimeout(() => {
                resolve([
                  {
                    id: 31,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                  }, {
                    id: 32,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                  }
                ])
              }, 1000)

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
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除标准物质名称为()的记录吗', null, async () => {
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
      handleamend(row){
        this.form=row;
        this.dialogFormVisible2=true;
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
      handleFoldSideBar(){},
      async fetchData() {
        this.listLoading = true
        const {
          data,
          totalCount
        } = await getList(this.queryForm)
        this.list = [{"valunit":"根","dosage":"1500","unit":"元"},
        {"valunit":"根","dosage":"1000","unit":"元"},
        {"valunit":"块","dosage":"800","unit":"万元"},
        {"valunit":"根","dosage":"5800","unit":"元"}]
        // this.list1 = [{
        //         id: 1,
        //         date: '原材料',
        //         children: [{
        //             id: 31,
        //             date: '水泥试验',
        //           }, {
        //             id: 32,
        //             date: '粗骨科',
        //         }],
        //         }]
        // this.list2 = [{
        //   date:"含水率"
        // }]
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

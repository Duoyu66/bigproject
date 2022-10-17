<template>
<!-- 报告打印 -->
  <div class="table-container definition entru baseBox">
    <el-tabs tab-position="top" >

        <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input style="border-radius: 30px;" v-model="queryForm.order_id" placeholder="按照委托编号查询" prefix-icon="el-icon-search" />
          </el-form-item>
            <el-form-item label="" label-width="0px" style="width: 300px;">
            	<tree-select :options="selectData.object_idTree" :multiple="false" placeholder="请选择试验项目"
            		:normalizer="normalizer" v-model="queryForm.object_id" :show-count="true" style="height: 32px;"
            		:disable-branch-nodes="true" />
            </el-form-item>

          <el-form-item>
            <el-input style="border-radius: 30px;" v-model="queryForm.report_id" placeholder="按照报告编号查询" prefix-icon="el-icon-search" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>

      <el-tab-pane label="所有报告">

        <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
          :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff','text-align':'left'}">
          <el-table-column show-overflow-tooltip label="委托编号" prop="order_id" min-width="21%"></el-table-column>
          <el-table-column show-overflow-tooltip label="报告编号" prop="report_id" min-width="21%"></el-table-column>
          <el-table-column show-overflow-tooltip label="试验名称" prop="object_name" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="test_class" label="试验类别" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="order_agent" label="委托单位" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip label="参数" prop="test_params" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="tester" label="试验员" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip label="报告日期" prop="date" min-width="9%"></el-table-column>

          <el-table-column show-overflow-tooltip label="操作" width="120px">
            <template #default="{ row }">
              <el-button type="primary" class="normal"  @click="handleEdit(row)">打印报告</el-button>
            </template>

          </el-table-column>
        </el-table>

      </el-tab-pane>
<!--      <el-tab-pane label="未打印报告">
        <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
          :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff','text-align':'left'}">
          <el-table-column show-overflow-tooltip label="委托编号" prop="id" min-width="21%"></el-table-column>
          <el-table-column show-overflow-tooltip label="报告编号" prop="id" min-width="21%"></el-table-column>
          <el-table-column show-overflow-tooltip label="试验名称" prop="name" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="type" label="试验类别" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="unit" label="委托单位" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip label="参数" prop="type1" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="peo" label="试验员" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip label="完成时间" prop="date" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="90px">
            <template #default="{ row }">
              <el-button @click="handleEdit(row)">用印</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已打印报告">
        <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
          :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff','text-align':'left'}">
          <el-table-column show-overflow-tooltip label="委托编号" prop="id" min-width="21%"></el-table-column>
          <el-table-column show-overflow-tooltip label="报告编号" prop="id" min-width="21%"></el-table-column>
          <el-table-column show-overflow-tooltip label="试验名称" prop="name" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="type" label="试验类别" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="unit" label="委托单位" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip label="参数" prop="type1" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip prop="peo" label="试验员" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip label="完成时间" prop="date" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip label="用印情况" prop="situation" min-width="9%"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="200px">
            <template #default="{ row }">
              <el-button @click="handleDelete(row)">撤销用印</el-button>
              <el-button @click="handleEdit(row)">用印报告</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane> -->
    </el-tabs>

    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>

    <excel-edit ref="edit"></excel-edit>
  </div>
</template>

<script>
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
  import { QueryExec } from '@/api/table'
  import excelEdit from './../components/reportSeal'
  import TreeSelect from '@riophae/vue-treeselect'
  import testDataPrint from '../luckysheet/testDataPrint'
  import treeData from './../../vab/tree/index'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {
    name: 'ComprehensiveTable',
    components: {
      excelEdit,
      treeData,
      TreeSelect,
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
        	table_type: 0,
          order_id: '',
          object_id: '',
          report_id: '',
        	pageSize: 20,
        	pageNo: 1,
        },
        selectData: {
        	object_id: [],
        	object_idTree: [],
        	enable: [{
        		value: '',
        		label: '请选择'
        	}, {
        		value: 0,
        		label: '禁用'
        	}, {
        		value: 1,
        		label: '启用'
        	}]
        },
        iframe: {
        	approval: {
        		id: ''
        	},
          review: {
          	id: ''
          }
        },
        table: {
        	tableHeight: this.$baseTableHeight()
        }
      }
    },
    computed: {
      ...mapGetters({
      	current_org: 'org/current_org',
      }),
      height() {
        return this.$baseTableHeight()*1.1
      },
    },
    created() {
      this.fetchData()
      this.GetObjectName()
    },
    beforeDestroy() {},
    mounted() {},
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
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      normalizer(node) {
      	return {
      		id: node.object_id,
      		label: node.object_name,
      		children: node.children,
      	}
      },
      getELement(type, key) {
      	if (!type) {
      		type = 'ref'
      	}
      	let dom = ''
      	switch (type) {
      		case 'ref':
      			if (key) {
      				dom = this.$refs[key]
      			} else {
      				dom = this.$el
      			}
      			break
      		case 'id':
      			dom = dom.document.getElementById(id)
      			break
      		case 'html':
      			dom = document.documentElement
      			break
      	}
      	return dom
      },
      async GetObjectName() {
      	let data = await this.$store.dispatch('testObject/GetList')
      	this.$set(this.selectData, 'object_id', data)
      	let object_idTree = await this.$store.dispatch('testObject/GetTreeAll')
      	this.$set(this.selectData, 'object_idTree', object_idTree)
      	return 1;
      },
      getELementHeight(type, key) {
      	let dom = this.getELement(type, key)
      	return dom.offsetHeight
      },
      getELementWidth(type, key) {
      	let dom = this.getELement(type, key)
      	return dom.offsetWidth
      },
      handleEdit(row) {
        if (this.iframe.approval.id) {
        	let iframe = this.$layer.instancesVue[this.iframe.approval.id]
        	if (iframe) {
        		iframe.iframe.pushTestData(row)
        		return true
        	}

        }
        let area = ['1100px', '720px']

        if (this.getELementHeight('html') < 720) {
        	area[1] = '80%'
        }
        if (this.getELementWidth('html') < 1100) {
        	area[0] = '80%'
        }
        let iframe_approval_id = this.$layer.iframe({
        	content: {
        		content: testDataPrint,
        		parent: this,
        		data: {
        			TestData: row
        		}
        	},
        	btn: '确定',
        	area: area,
        	title: '批准试验',
        	maxmin: true,
        	shade: false,
        	shadeClose: false,
        	resize: true,
        	cancel: () => { //关闭弹窗事件
        		console.log('关闭iframe')
        	}
        });
        this.iframe.approval.id = iframe_approval_id
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要撤销用印吗？', null, async () => {

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
        let sData = '[Q]457{%'+this.queryForm.order_id+'%$`$`$`$`'+this.queryForm.object_id+'$`$`$`4$`'+this.current_org+'$`'+ ((Number(this.queryForm.pageNo) - 1) * Number(this.queryForm.pageSize)).toString() +
        	'$`' + this.queryForm.pageSize + '}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData,res)
        this.list = res.data
        this.total = res.total
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

<style>
  /* .el-dialog {
    margin-top: 100px!important;
  }
  .el-dialog__body {
    padding: 10px;
  } */
  .el-form-item--small.el-form-item{margin-bottom:10px;}
</style>

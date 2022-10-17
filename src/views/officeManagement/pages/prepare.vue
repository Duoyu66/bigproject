<template>

  <div class="table-container definition supervision prepare">
   <el-tabs class="prepare1" v-model="activeName" @tab-click="handleClick">
       <el-tab-pane label="拟文" name="first">
         <el-form :model="form">
           <el-row>
             <el-col :span="16">
              <el-form-item label="公文标题" :label-width="formLabelWidth" >
                <el-input v-model="form.number2" style="width: 100%;"></el-input>
              </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="发文编号" :label-width="formLabelWidth">
                 <el-input v-model="form.number" style="width: 100%;"></el-input>
               </el-form-item>
             </el-col>
           </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="密级程度" :label-width="formLabelWidth">
                <el-select v-model="form.degree" style="width: 100%;">
                  <el-option label="普通" value="a"></el-option>
                  <el-option label="秘密" value="b"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公文类别" :label-width="formLabelWidth">
                <el-select v-model="form.type1" style="width: 100%;">
                  <el-option label="通知" value="a"></el-option>
                  <el-option label="公告" value="b"></el-option>
                  <el-option label="通告" value="c"></el-option>
                  <el-option label="通报" value="d"></el-option>
                  <el-option label="请示" value="e"></el-option>
                  <el-option label="批复" value="f"></el-option>
                  <el-option label="意见" value="g"></el-option>
                  <el-option label="决定" value="h"></el-option>
                  <el-option label="报告" value="i"></el-option>
                  <el-option label="函" value="j"></el-option>
                  <el-option label="议案" value="k"></el-option>
                  <el-option label="会议纪要" value="l"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="紧急程度" :label-width="formLabelWidth">
                <el-select v-model="form.degree1" style="width: 100%;">
                  <el-option label="一般" value="a"></el-option>
                  <el-option label="紧急" value="b"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
           <el-form-item label="主送单位" :label-width="formLabelWidth">
             <el-select v-model="form.organization" style="width: 100%;">
               <el-option label="主送单位1" value="a"></el-option>
               <el-option label="主送单位2" value="b"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="抄送单位" :label-width="formLabelWidth">
             <el-select v-model="form.organization2" style="width: 100%;">
               <el-option label="抄送机构1" value="a"></el-option>
               <el-option label="抄送机构2" value="b"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="拟稿部门" :label-width="formLabelWidth">
             <el-select v-model="form.organization1" style="width: 100%;">
               <el-option label="部门1" value="a"></el-option>
               <el-option label="部门2" value="b"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="审批人" :label-width="formLabelWidth">
             <el-input v-model="form.number3" style="width: 100%;"></el-input>
           </el-form-item>
           <el-form-item label="正文" class="area" :label-width="formLabelWidth">
             <el-input v-model="form.number4" style="width: 100%;" type="textarea"></el-input>
           </el-form-item>
           <el-form-item label="附件" :label-width="formLabelWidth">
             <el-input v-model="form.number4" style="width: calc(100% - 56px);"></el-input>
             <el-button type="primary">上传</el-button>
           </el-form-item>
         </el-form>
         <div style="display: flex; justify-content: flex-end; padding: 30px 0px 0 0;">
           <el-button type="primary">确认</el-button>
           <el-button>取消</el-button>
         </div>
       </el-tab-pane>
       <el-tab-pane label="拟文记录" name="second">
         <el-table ref="tableSort" v-loading="listLoading" :data="list" border :element-loading-text="elementLoadingText"  highlight-current-row
           :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
           <el-table-column show-overflow-tooltip label="发文编号" prop="number"></el-table-column>
           <el-table-column show-overflow-tooltip label="公文标题" prop="title"></el-table-column>
           <el-table-column show-overflow-tooltip prop="organization" label="拟稿部门"></el-table-column>
           <el-table-column show-overflow-tooltip label="发文日期" prop="date"></el-table-column>
           <el-table-column show-overflow-tooltip label="公文类别" prop="type"></el-table-column>
           <el-table-column show-overflow-tooltip label="紧急程度" prop="urgent"></el-table-column>
           <el-table-column show-overflow-tooltip prop="concentrate" label="密级程度"></el-table-column>
           <el-table-column show-overflow-tooltip label="状态" prop="condition"></el-table-column>
           <el-table-column show-overflow-tooltip label="拟稿人" prop="people"></el-table-column>
           <el-table-column show-overflow-tooltip label="操作" width="100px">
             <template #default="{ row }">
               <el-dropdown trigger="click" placement="left-start">
                 <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                 <el-dropdown-menu slot="dropdown" class="more" >
                   <el-button @click="handleAdd">修改</el-button>
                   <el-button>待审</el-button>
                   <el-button @click="handleDelete(row)">删除</el-button>
                 </el-dropdown-menu>
               </el-dropdown>
             </template>
           </el-table-column>
         </el-table>
       </el-tab-pane>
       <el-tab-pane label="待审公文" name="third">
         <el-table ref="tableSort" v-loading="listLoading" :data="list1" border :element-loading-text="elementLoadingText"  highlight-current-row
           :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
           <el-table-column show-overflow-tooltip label="发文编号" prop="number"></el-table-column>
           <el-table-column show-overflow-tooltip label="公文标题" prop="title"></el-table-column>
           <el-table-column show-overflow-tooltip prop="organization" label="拟稿部门"></el-table-column>
           <el-table-column show-overflow-tooltip label="发文日期" prop="date"></el-table-column>
           <el-table-column show-overflow-tooltip label="公文类别" prop="type"></el-table-column>
           <el-table-column show-overflow-tooltip label="紧急程度" prop="urgent"></el-table-column>
           <el-table-column show-overflow-tooltip prop="concentrate" label="密级程度"></el-table-column>
           <el-table-column show-overflow-tooltip label="状态" prop="condition"></el-table-column>
           <el-table-column show-overflow-tooltip label="拟稿人" prop="people"></el-table-column>
           <el-table-column show-overflow-tooltip label="操作" width="100px">
             <template #default="{ row }">
               <el-dropdown trigger="click" placement="left-start">
                 <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                 <el-dropdown-menu slot="dropdown" class="more" >
                   <el-button @click="handleAdd1">修改</el-button>
                   <el-button>查看审批进度</el-button>
                   <el-button @click="handleDelete(row)">删除</el-button>
                 </el-dropdown-menu>
               </el-dropdown>
             </template>
           </el-table-column>
         </el-table>
       </el-tab-pane>
       <el-tab-pane label="退回公文" name="fourth">
         <el-table ref="tableSort" v-loading="listLoading" :data="list2" border :element-loading-text="elementLoadingText"  highlight-current-row
           :height="table.tableHeight" @selection-change="setSelectRows" @sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
           <el-table-column show-overflow-tooltip label="发文编号" prop="number"></el-table-column>
           <el-table-column show-overflow-tooltip label="公文标题" prop="title"></el-table-column>
           <el-table-column show-overflow-tooltip prop="organization" label="拟稿部门"></el-table-column>
           <el-table-column show-overflow-tooltip label="发文日期" prop="date"></el-table-column>
           <el-table-column show-overflow-tooltip label="公文类别" prop="type"></el-table-column>
           <el-table-column show-overflow-tooltip label="紧急程度" prop="urgent"></el-table-column>
           <el-table-column show-overflow-tooltip prop="concentrate" label="密级程度"></el-table-column>
           <el-table-column show-overflow-tooltip label="状态" prop="condition"></el-table-column>
		   <el-table-column show-overflow-tooltip label="退回原因" prop="cause"></el-table-column>
           <el-table-column show-overflow-tooltip label="拟稿人" prop="people"></el-table-column>
           <el-table-column show-overflow-tooltip label="操作" width="100px">
             <template #default="{ row }">
               <el-dropdown trigger="click" placement="left-start">
                 <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
                 <el-dropdown-menu slot="dropdown" class="more" >
                   <el-button @click="handleAdd2">修改</el-button>
                   <el-button @click="handleDelete(row)">删除</el-button>
                 </el-dropdown-menu>
               </el-dropdown>
             </template>
           </el-table-column>
         </el-table>
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
  import TableEdit from '../components/prepare.vue'
  import TableEdit1 from '../components/prepare1.vue'
  import TableEdit2 from '../components/prepare2.vue'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
      treeData,
      TableEdit1,
      TableEdit2,
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
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number:'',
          degree:'a',
          degree1:'a',
          type1:'b',
          organization:"a",
          organization1:"a",
          organization2:"a"
        },
        formLabelWidth: '120px',
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
        activeName: 'first',
        table: {
        	tableHeight: this.$(window).height()
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
    		let exceptHeight = 225;
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
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      handleClick(tab, event) {
        console.log(tab, event);
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
        this.list = [{number:"10001","title":"标题一","organization":"机构a","date":"2020-10-10",
        "type":"公告","urgent":"紧急",concentrate:"秘密",condition:"拟文",people:"张子文"},
        {number:"10002","title":"标题二","organization":"机构b","date":"2020-11-20",
        "type":"通知","urgent":"一般",concentrate:"噗通",condition:"拟文",people:"李星云"},
        {number:"10003","title":"标题三","organization":"机构c","date":"2020-06-18",
        "type":"会议纪要","urgent":"紧急",concentrate:"秘密",condition:"拟文",people:"张子凡"}]
        this.list1 = [{number:"10005","title":"标题五","organization":"机构a","date":"2020-05-10",
        "type":"公告","urgent":"紧急",concentrate:"秘密",condition:"待审",people:"王兰乐"},
        {number:"10008","title":"标题六","organization":"机构b","date":"2020-01-20",
        "type":"通知","urgent":"一般",concentrate:"噗通",condition:"待审",people:"张华斌"},
        {number:"10007","title":"标题七","organization":"机构c","date":"2020-08-18",
        "type":"会议纪要","urgent":"紧急",concentrate:"秘密",condition:"待审",people:"王名扬"}]
        this.list2 = [{number:"10006","title":"标题八","organization":"机构a","date":"2020-10-19",
        "type":"公告","urgent":"紧急",concentrate:"秘密",condition:"退回",people:"崔慧尧",cause:"原因a"},
        {number:"10004","title":"标题四","organization":"机构b","date":"2020-10-20",
        "type":"通知","urgent":"一般",concentrate:"噗通",condition:"退回",people:"巩福君",cause:"原因b"},
        {number:"10009","title":"标题十","organization":"机构c","date":"2019-06-18",
        "type":"会议纪要","urgent":"紧急",concentrate:"秘密",condition:"退回",people:"闫旭阳",cause:"原因c"}]
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

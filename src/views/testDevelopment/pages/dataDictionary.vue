<template>
   <!-- 去掉了class  table-container -->
  <div class="table-container definition2 purchase equipment equipment_btn parameterdictionary">
    <div class="baseBox" style="margin-bottom: 10px;">
    <vab-query-form>
      <vab-query-form-left-panel style="width: 20%;">
        <el-button type="primary" @click="handleAdd">添加数据字典</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel style="width: 80%">
        <el-form
          ref="form"
          :model="search"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="search.item_name" placeholder="按字典名称搜索">
            </el-input>
          </el-form-item>
          <el-form-item style="padding-left: 10px;">
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="meta_search"
            >
              查询
            </el-button>
          </el-form-item>

        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

		<el-table ref="tableSort" :data="list" border
			:element-loading-text="elementLoadingText" height="calc(100vh - 210px)" row-key="item_id"
			highlight-current-row :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy
      tooltip-effect="dark" :load="fetchData">
      <el-table-column show-overflow-tooltip prop="item_name" label="字典项名称" min-width="200px">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="字典项描述" prop="item_desc" min-width="200px" align="center">
      </el-table-column>
			<el-table-column show-overflow-tooltip label="字典项标识" prop="item_id" min-width="150px" align="center">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="item_class" label="字典项分组" min-width="100px" align="center">
			</el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="180px">
        <template #default="{ row }">
          <el-button type="primary" class="normal" @click="handleEdit(row)">
            修改
          </el-button>
          <el-button @click="handleDelete(row)" class="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination> -->
    <dataDictionary ref="dataDictionary" @fetchData="fetchData"></dataDictionary>
    <!-- <table-edit1 ref="edit1"></table-edit1> -->
  </div>
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
  import {
  	ViewfileUrl,
  	UploadFileNameUrl
  } from '@/utils/servicefile'
  import {
  	TreeDataDeal,
    TreeDataDealEx
  } from '@/global/tree_deal'
import dataDictionary from '../components/dataDictionary.vue'
// import TableEdit1 from '../components/dataDictionary1.vue'
import treeData from './../../vab/tree/index'
export default {
  name: 'ComprehensiveTable',
  components: {
    dataDictionary,
    // TableEdit1,
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
      search: {
        item_name: ''
      },
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
      },
      dialogFormVisible: false,
      item_class: '',
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
  beforeDestroy() { },
  mounted: function () {
    this.$nextTick(function () {
      let exceptHeight = 210;
      // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
      //tableSort为table中ref的值
      if (this.$refs.tableSort.$el) {
        this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop - exceptHeight;
      }

      // 监听窗口大小变化
      let that = this;
      window.onresize = function () {
        if (that.$refs.tableSort.$el) {
          that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop - exceptHeight;
        }
      }
    });
  },
  methods: {
    meta_search() {
      this.fetchData()
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
      this.$refs['dataDictionary'].showEdit()
    },
    handleEdit(row) {
      console.log(row)
      this.$refs['dataDictionary'].showEdit(row)
    },
    handleDelete(row) {
      if (row.item_id) {
        this.$baseConfirm('你确定要删除'+row.item_name+'字典吗', null, async () => {
          let sData = '[Q]607{'+row.item_id+'}|^1|^SYS'
          const res = await ExecSql(sData)
          if(res>0)
          {
            this.$baseMessage('删除成功', 'success')
            this.fetchData()
          }
          else {
            this.$baseMessage('删除失败', 'error')
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
    async fetchData(row, treeNode, resolve) {
      this.listLoading = true
      try {
        let sData;
        let form = Object.assign({}, this.queryForm)
        if (row) {
          form.item_class = row.item_id
        } else {
          form.item_class = 0
        }
        sData = '[Q]267{'+form.item_class+'$`%'+this.search.item_name+'%}|^SYS'
        console.log(sData)
        // console.log(row)
        if (row) {
          const res = await QueryExec(sData)
          const data = res.data

          // console.log(res)
          for (let i = 0; i < data.length; i++) {
            if (Number(data[i].children) > 0) {
              data[i].hasChildren = true
            } else {
              data[i].hasChildren = false
            }
          }
          if (resolve) {
            console.log('resolve')
            resolve(data)
          } else if (this.resolve && this.resolve[form.item_class]) {
            console.log('this.resolve')
            this.$set(this.$refs.tableSort.store.states.lazyTreeNodeMap, form.item_class, []);
            this.resolve[form.item_class](data)
          } else if (form.item_class == 0) {
            this.list = data
            //this.tableDataTemp = JSON.parse(JSON.stringify(data))
            return
          }

        } else {
          this.list = []
          const res = await QueryExec(sData)
          console.log(res)
          const data = TreeDataDealEx(res.data, 0,'item_id','item_class','hasChildren')
          console.log(data)
          this.list = data
        }
      } catch (e) {
        console.log(e)
      }
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },

  },
}
</script>

<template>
  <el-dialog :visible.sync="dialogFormVisible">
    <div slot="title" class="dialog-title">
      添加监督检查记录
    </div>
    <el-table :data="list" class="distribution_table" :header-cell-style="{background:'#e8f0ff' }" style="width: 1100px;"  highlight-current-row >
      <el-table-column show-overflow-tooltip label="被督察人" prop="people1"></el-table-column>
      <el-table-column show-overflow-tooltip prop="time" label="监督时间"></el-table-column>
      <el-table-column show-overflow-tooltip label="监督内容" prop="center"></el-table-column>
      <el-table-column show-overflow-tooltip label="监督结果" prop="result"></el-table-column>
      <el-table-column show-overflow-tooltip prop="people2" label="监督人"></el-table-column>
      <el-table-column show-overflow-tooltip label="纠正措施" prop="step"></el-table-column>
      <el-table-column show-overflow-tooltip prop="condition" label="验证情况"></el-table-column>
      <el-table-column show-overflow-tooltip label="验证人" prop="people3"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <el-button class="normal">添加</el-button>
            <el-button class="danger">取消</el-button>
          </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  import treeData from './../../vab/tree/index'
  export default {
    name: 'ComprehensiveTable',
    components: {
  
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
      }
    },
    created() {
      this.fetchData()
    },
  
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
  
      async fetchData() {
        this.listLoading = true
        const {
          data,
          totalCount
        } = await (this.queryForm)
       this.list = [{"people1":"胡雨佳","time":"2020-12-01","center":"实验操作流程","result":"合格",
       "people2":"贺君天","step":"无","condition":"验证合格","people3":"闫旭阳"},
       {"people1":"张华斌","time":"2020-12-01","center":"实验操作流程","result":"不合格",
       "people2":"李星云","step":"重新进行操作","condition":"验证合格","people3":"张子凡"},
       {"people1":"王名扬","time":"2020-12-01","center":"实验操作流程","result":"合格",
       "people2":"贺君天","step":"无","condition":"验证合格","people3":"闫旭阳"},
       {"people1":"王兰乐","time":"2020-12-01","center":"实验操作流程","result":"合格",
       "people2":"贺君天","step":"无","condition":"验证合格","people3":"闫旭阳"}]
  
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
  
    },
  }
</script>

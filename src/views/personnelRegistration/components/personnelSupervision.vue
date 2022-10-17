<template>
  <el-dialog width="500px" title="添加记录" :visible.sync="dialogFormVisible">
    <el-form :model="form" style="margin-right:15px">
      <el-form-item label="被督察人" :label-width="formLabelWidth">
        <el-input v-model="form.number1" placeholder="请输入" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="监督时间" :label-width="formLabelWidth" style="margin-top:10px">
        <el-date-picker style="width:300px" v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="监督内容" :label-width="formLabelWidth" style="margin-top:10px">
        <el-input v-model="form.number2" placeholder="请输入" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="监督结果" :label-width="formLabelWidth" style="margin-top:10px">
        <el-input v-model="form.number3" placeholder="请输入" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="监督人" :label-width="formLabelWidth" style="margin-top:10px">
        <el-input v-model="form.number4" placeholder="请输入" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="纠正措施" :label-width="formLabelWidth" style="margin-top:10px">
        <el-input v-model="form.number5" placeholder="请输入" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="验证情况" :label-width="formLabelWidth" style="margin-top:10px">
        <el-input v-model="form.number6" placeholder="请输入" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="验证人" :label-width="formLabelWidth" style="margin-top:10px">
        <el-input v-model="form.number7" placeholder="请输入" style="width:300px"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="dialogFormVisible = false"
        style="margin-left:100px;width:100px"
      >确 定</el-button>
      <el-button @click="dialogFormVisible = false" style="margin-left:100px;width:100px">取 消</el-button>
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
        form: {
          name: '',
          region: '',
          date: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        title: '',
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
        // data.forEach((item, index) => {
        //   imageList.push(item.img)
        // })
        this.imageList = imageList
        this.total = totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
  
    },
  }
</script>

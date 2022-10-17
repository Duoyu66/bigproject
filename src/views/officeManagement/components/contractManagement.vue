<template>
  <el-dialog title="添加合同" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="合同编号" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="合同名称" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="合同类型" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="签订日期" :label-width="formLabelWidth">
        <el-input v-model="form.number3" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" :label-width="formLabelWidth">
        <el-input v-model="form.number4" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="结束时间" :label-width="formLabelWidth">
        <el-input v-model="form.number5" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="合同状态" :label-width="formLabelWidth">
        <el-input v-model="form.number6" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="服务项目" :label-width="formLabelWidth">
        <el-input v-model="form.number7" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="折扣" :label-width="formLabelWidth">
        <el-input v-model="form.number8" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="信用额度" :label-width="formLabelWidth">
        <el-input v-model="form.number9" style="width: 250px;"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
  export default {
    name: 'TableEdit',
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: 'xst',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number:'',
          norms:'rygz',
        },
        formLabelWidth: '120px',
        formLabelWidth: '120px',
        title: '',
        dialogFormVisible: false,
      }
    },
   created() {},
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
     },
   }
</script>

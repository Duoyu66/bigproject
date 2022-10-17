<template>
  <el-dialog title="添加客户单位" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="客户名称" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="客户地址" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="邮编" :label-width="formLabelWidth">
        <el-input v-model="form.number3" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="信用代号" :label-width="formLabelWidth">
        <el-input v-model="form.number4" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="开户银行" :label-width="formLabelWidth">
        <el-input v-model="form.number5" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="银行账号" :label-width="formLabelWidth">
        <el-input v-model="form.number6" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="客户级别" :label-width="formLabelWidth">
        <el-input v-model="form.number7" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="营业执照" :label-width="formLabelWidth">
        <el-input v-model="form.number8" style="width: 195px;"></el-input>
        <el-button type="primary">上传</el-button>
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

<template>
  <el-dialog title="添加期间核查记录" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="管理编号" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;" ></el-input>
      </el-form-item>
      <el-form-item label="设备名称" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="核查方式" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="核查人员" :label-width="formLabelWidth">
        <el-input v-model="form.number3" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="核查结果" :label-width="formLabelWidth">
        <el-input v-model="form.number4" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="核查时间" :label-width="formLabelWidth">
        <el-input v-model="form.number5" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="form.desc"></el-input>
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

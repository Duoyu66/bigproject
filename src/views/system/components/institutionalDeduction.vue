<template>
  <el-dialog title="添加扣分记录" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="扣分名称" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="扣分描述" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 250px;" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="扣分项" :label-width="formLabelWidth">
        <el-input v-model="form.number3" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="扣除公式" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 250px;"></el-input>
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

<style>
</style>

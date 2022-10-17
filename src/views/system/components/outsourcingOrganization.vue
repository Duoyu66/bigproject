<template>
  <el-dialog title="添加外委机构" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="外委机构名称" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="送检检测项目" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="外委单位地址" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="联系人" :label-width="formLabelWidth">
        <el-input v-model="form.number3" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="form.number4" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="外委合同" :label-width="formLabelWidth">
        <el-input v-model="form.number5" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="外委资质文件" :label-width="formLabelWidth">
        <el-input v-model="form.number6" style="width: 250px;"></el-input>
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

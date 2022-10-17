<template>
  <el-dialog title="定制检测室" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="检测室类型" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 250px;">
          <el-option label="养护室" value="type"></el-option>
        </el-select>
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
       name: 'type',
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

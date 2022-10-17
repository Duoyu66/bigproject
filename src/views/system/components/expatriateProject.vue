<template>
  <el-dialog title="添加机构" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="机构名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="机构类型" :label-width="formLabelWidth">
        <el-select v-model="form.region" style="width: 250px;">
          <el-option label="项目" value="g"></el-option>
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
     name: '',
     region: 'g',
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

<template>
  <el-dialog title="添加印章使用记录" :visible.sync="dialogFormVisible">
    <!-- el-form :model="form">
      <el-form-item label="标准物质名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="标准物质规格" :label-width="formLabelWidth">
        <el-input v-model="form.norms" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="计量单位" :label-width="formLabelWidth">
        <el-select v-model="form.region" style="width: 250px;">
          <el-option label="g" value="g"></el-option>
          <el-option label="kg" value="kg"></el-option>
          <el-option label="ml" value="ml"></el-option>
          <el-option label="L" value="L"></el-option>
          <el-option label="mg" value="mg"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div> -->
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
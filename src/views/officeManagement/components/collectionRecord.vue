<template>
  <el-dialog title="添加" :visible.sync="dialogFormVisible">
   <!-- <el-form :model="form">
      <el-form-item label="化学物质名称" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 250px;">
          <el-option label="硝酸钾" value="xst"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="化学物质规格" :label-width="formLabelWidth">
        <el-select v-model="form.norms" style="width: 250px;">
          <el-option label="硝酸钾" value="rygz"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用量" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
  
    </el-form> -->
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

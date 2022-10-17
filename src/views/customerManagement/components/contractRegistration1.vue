<template>
  <el-dialog title="合同扫描件详情" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="合同扫描件" :label-width="formLabelWidth">
        <el-input v-model="form.number8" style="width: 250px;"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class=" el-dialog__footer" style="width: 100%;padding-right: 82px;">
      <el-button type="primary" @click="dialogFormVisible = false">查 看</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">下 载</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  export default {
    name: 'TableEdit1',
    data() {
      return {
        dialogFormVisible: false,
       form: {
         value1: '',
         value2: '',
         value3: '',
         norms:'cj',
         name: 'a',
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
        title: '',
        dialogFormVisible: false,
      }
    },
   created() {},
     methods: {
       showEdit1(row) {
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

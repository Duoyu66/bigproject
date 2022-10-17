<template>
  <el-dialog title="修改试验指标" :visible.sync="dialogFormVisible">
    <TestdictionaryForm  ref="TestdictionaryForm"></TestdictionaryForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  
    import TestdictionaryForm from '../form/TestdictionaryForm.vue'
    export default {
      name: 'TableEdit2',
      components: {
      	TestdictionaryForm,
      },
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: '',
          region: 'beijing',
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
       showEdit2(row) {
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

<template>
    <el-dialog title="添加数据字典" :visible.sync="dialogFormVisible">
        <DataDictonaryForm  ref="DataDictonaryForm"></DataDictonaryForm>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>

    </template>

    <script>
      import { doEdit } from '@/api/table'
      import DataDictonaryForm from '../form/DataDictonaryForm.vue'
      export default {
        name: 'TableEdit1',
        components: {
        	DataDictonaryForm,
        },
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
        number:'',
        norms:'tiaomu1',
      },

      formLabelWidth: '120px',
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

<style>
</style>

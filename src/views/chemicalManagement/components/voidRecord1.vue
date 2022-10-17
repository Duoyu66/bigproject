<template>
  <el-dialog title="修改作废记录" :visible.sync="dialogFormVisible">
    <RecordForm  ref="RecordForm"></RecordForm>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    
    </template>
    
    <script>
      import { doEdit } from '@/api/table'
      import RecordForm from '../form/RecordForm.vue'
      export default {
        name: 'TableEdit9',
        components: {
        	RecordForm,
        },
    data() {
      return {
        dialogFormVisible: false,
        form: {
          norms:'rygz',
          name: 'xst',
          region: 'g',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number:'',
          value1:''
        },
        formLabelWidth: '85px',
        title: '',
        dialogFormVisible: false,
      }
    },
   created() {},
     methods: {
       showEdit9(row) {
         if (!row) {
           this.title = '添加'
         } else {
           this.title = '编辑'
           this.form = Object.assign({}, row)
         }
         this.dialogFormVisible = true
       },
       handleClick(tab, event) {
         console.log(tab, event);
       },
     },
   }
</script>

<template>
  <el-dialog title="修改试验模板" :visible.sync="dialogFormVisible">
    <TemplateForm  ref="TemplateForm"></TemplateForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  import TemplateForm from '../form/TemplateForm.vue'
  export default {
    name: 'TableEdit1',
    components: {
    	TemplateForm,
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
       showEdit1(row) {
         if (!row) {
           this.title = '添加'
         } else {
           this.title = '编辑'
           this.form = Object.assign({}, row)
           if (this.$refs['PurchaseFrom']) {
           	this.$refs['PurchaseFrom'].form = Object.assign({}, row)
           }
         }
         this.dialogFormVisible = true
       },
     },
   }
</script>

<style>
</style>

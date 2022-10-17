<template>
  <el-dialog title="添加消费记录" :visible.sync="dialogFormVisible">
     <ConsumeForm  ref="ConsumeForm"></ConsumeForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
  import ConsumeForm from '../form/ConsumeForm.vue'
  export default {
    name: 'TableEdit2',
    components: {
    	ConsumeForm,
    },
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: 'a',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number:'',
          norms:'rygz',
        },
        formLabelWidth: '120px',
        formLabelWidth: '120px',
        title: '',
        dialogFormVisible: false,
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
           if (this.$refs['PurchaseFrom']) {
           	this.$refs['PurchaseFrom'].form = Object.assign({}, row)
           }
         }
         this.dialogFormVisible = true
       },
     },
   }
</script>

<template>
  <el-dialog title="添加充值记录" :visible.sync="dialogFormVisible">
    <ChargeForm  ref="ChargeForm"></ChargeForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
  import ChargeForm from '../form/ChargeForm.vue'
  export default {
    name: 'TableEdit1',
    components: {
    	ChargeForm,
    },
    data() {
      return {
        dialogFormVisible: false,
        form: {
          value1:'',
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

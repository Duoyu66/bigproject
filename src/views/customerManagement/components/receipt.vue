<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <ReceiptForm  ref="ReceiptForm" @close_comp="close_comp"></ReceiptForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
 import ReceiptForm from '../form/ReceiptForm.vue'
 export default {
   name: 'TableEdit8',
   components: {
   	ReceiptForm,
   },
    data() {
      return {
        dialogFormVisible: false,
        formLabelWidth: '120px',
        formLabelWidth: '120px',
        title: '',
        Contact: [],
        symbol: '1'
      }
    },
    created() {},
    methods: {
      showEdit(row, symbol) {
        if (!row && !symbol) {
          this.title = '添加购入记录'
        }
        else if(!symbol){
          this.title = '添加发票记录'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = '1'
          setTimeout(()=>{
            this.$refs['ReceiptForm'].display(this.Contact)
          },10)
        }
        else {
          this.title = '修改发票记录'
          this.Contact = Object.assign({}, row)
          console.log(symbol)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['ReceiptForm'].displayEdit(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='1')
        {
          this.$refs['ReceiptForm'].save()
        }
        else {
          this.$refs['ReceiptForm'].editsave()
        }
      },
      close_comp(){
        this.dialogFormVisible = false
        this.$emit('fetchDataChild',this.Contact)
        this.$emit('fetchData')
      }
    },
  }
</script>

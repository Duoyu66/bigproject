<template>
  <el-dialog :title='title' :visible.sync="dialogFormVisible" width="70%" style="margin-top: -50px;">
    <ContractForm  ref="ContractForm" @close_comp="close_comp"></ContractForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
 import ContractForm from '../form/ContractForm.vue'
 export default {
   name: 'TableEdit8',
   components: {
   	ContractForm,
   },
    data() {
      return {
        dialogFormVisible: false,
        formLabelWidth: '120px',
        formLabelWidth: '120px',
        title: '',
        Contact: [],
        symbol: '0'
      }
    },
    created() {},
    methods: {
      showEdit(row, symbol) {
        if (!row && !symbol) {
          this.title = '添加购入记录'
        }
        else if(!symbol){
          this.title = '添加合同'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          setTimeout(()=>{
            this.$refs['ContractForm'].displayCustomerContractAdd(this.Contact)
          },10)
        }
        else if(symbol === '1'){
          this.title = '修改合同'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['ContractForm'].displayContractEdit(this.Contact)
          },10)
        }
        else if(symbol === '2'){
          this.title = '合同详情'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['ContractForm'].displayContractDetail(this.Contact)
          },10)
        }
        else if(symbol === '3'){
          this.title = '添加委外合同'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['ContractForm'].displayEntrustadd(this.Contact)
          },10)
        }
        else if(symbol === '4'){
          this.title = '编辑委外合同'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['ContractForm'].displayEntrustEdit(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='0')
        {
          this.$refs['ContractForm'].save()
        }
        else if(this.symbol==='1'){
          this.$refs['ContractForm'].editsave()
        }
        else if(this.symbol==='3'){
          this.$refs['ContractForm'].save()
        }
        else if(this.symbol==='4'){
          this.$refs['ContractForm'].editsave()
        }
        else{
          this.close_comp()
        }
      },
      close_comp(){
        console.log(this.Contact)
        this.$emit('fetchDataChild',this.Contact)
        this.$emit('fetchData')
        this.dialogFormVisible = false
      }
    },
  }
</script>

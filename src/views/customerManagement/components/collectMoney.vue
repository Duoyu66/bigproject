<template>
  <el-dialog :title='title' :visible.sync="dialogFormVisible" >
    <CollectForm  ref="CollectForm" @close_comp="close_comp"></CollectForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
 import CollectForm from '../form/CollectForm.vue'
 export default {
   name: 'TableEdit8',
   components: {
   	CollectForm,
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
          this.title = '添加收款'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = '0'
          setTimeout(()=>{
            this.$refs['CollectForm'].display(this.Contact)
          },10)
        }
        else if(symbol === '1'){
          this.title = '收款'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['CollectForm'].displayAdd(this.Contact)
          },10)
        }
        else if(symbol === '2'){
          this.title = '修改收款'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['CollectForm'].displayEdit(this.Contact)
          },10)
        }
        else if(symbol === '3'){
          this.title = '修改收款'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['CollectForm'].displayReEdit(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='0')
        {
          this.$refs['CollectForm'].addsave()
          
        }
        else if(this.symbol==='1'){
          this.$refs['CollectForm'].save()
         
        }
        else if(this.symbol==='2'){
          this.$refs['CollectForm'].editsave()
          
        }
        else if(this.symbol==='3'){
          this.$refs['CollectForm'].editresave()
          
        }
        
      },
      close_comp(){
        this.$emit('fetchDataChild',this.Contact)
        this.$emit('fetchData')
        
        this.dialogFormVisible = false
      }
    },
  }
</script>

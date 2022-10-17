<template>
  <el-dialog :title='title' :visible.sync="dialogFormVisible" >
    <setProjectResponsible  ref="setProjectResponsible" @close_comp="close_comp"></setProjectResponsible>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
 import setProjectResponsible from '../form/setProjectResponsible.vue'
 export default {
   name: 'TableEdit8',
   components: {
   	setProjectResponsible,
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
          this.title = '项目负责人录入'
          setTimeout(()=>{
            this.$refs['setProjectResponsible'].display()
          },10)
        }
        else if(!symbol){
          this.title = '项目负责人录入'
          this.Contact = Object.assign({}, row)
          this.symbol = '0'
          console.log(Object.assign({}, row))
          setTimeout(()=>{
            this.$refs['setProjectResponsible'].displayAdd(this.Contact)
          },10)
        }
        else if(symbol === '2'){
          this.title = '项目负责人录入'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['setProjectResponsible'].displayEdit(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='0')
        {
          this.$refs['setProjectResponsible'].save()
        }
        // else if(this.symbol==='1'){
        //   this.$refs['ReceiveableForm'].save()
        // }
        else if(this.symbol==='2'){
          this.$refs['setProjectResponsible'].editsave()
        }
        // else if(this.symbol==='3'){
        //   this.$refs['ReceiveableForm'].editresave()
        // }
        else{
          this.close_comp()
        }
      },
      close_comp(){
        this.$emit('fetchDataChild')
        this.$emit('fetchData')
        this.dialogFormVisible = false
      }
    },
  }
</script>

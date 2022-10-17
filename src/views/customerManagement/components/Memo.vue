<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <MemoForm  ref="MemoForm" @close_comp="close_comp"></MemoForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
 import MemoForm from '../form/MemoForm.vue'
 export default {
   name: 'TableEdit8',
   components: {
   	MemoForm,
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
          this.title = '添加备忘录'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol='0'
          setTimeout(()=>{
            this.$refs['MemoForm'].display(this.Contact)
          },10)
        }
        else {
          this.title = '修改备忘录'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['MemoForm'].displayEdit(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='0')
        {
          this.$refs['MemoForm'].save()
          this.close_comp()
        }
        else {
          this.$refs['MemoForm'].editsave()
          this.close_comp()
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

<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <ContactForm  ref="ContactForm" @close_comp="close_comp"></ContactForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
 import ContactForm from '../form/ContactForm.vue'
 export default {
   name: 'TableEdit8',
   components: {
   	ContactForm,
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
          this.title = '添加客户联系人'
          this.Contact = Object.assign({}, row)
          this.symbol = '1'
          console.log(this.symbol)
          setTimeout(()=>{
            this.$refs['ContactForm'].display(this.Contact)
          },10)
        }
        else {
          this.title = '修改客户联系人'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['ContactForm'].displayEdit(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='0')
        {
          this.$refs['ContactForm'].editsave()
        }
        else {
          this.$refs['ContactForm'].save()
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

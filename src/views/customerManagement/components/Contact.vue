<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <ContactHistoryForm  ref="ContactHistoryForm" @close_comp="close_comp"></ContactHistoryForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
 import ContactHistoryForm from '../form/ContactHistoryForm.vue'
 export default {
   name: 'TableEdit8',
   components: {
   	ContactHistoryForm,
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
          this.title = '添加联系记录'
          this.Contact = Object.assign({}, row)
          this.symbol = '1'
          console.log(this.Contact)
          setTimeout(()=>{
            this.$refs['ContactHistoryForm'].display(this.Contact)
          },10)
        }
        else {
          this.title = '修改联系记录'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['ContactHistoryForm'].displayEdit(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='1')
        {
          this.$refs['ContactHistoryForm'].save()
          this.close_comp()
        }
        else {
          this.$refs['ContactHistoryForm'].editsave()
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

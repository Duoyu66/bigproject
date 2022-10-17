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
      showEdit(row) {
        if (!row) {
          this.title = '添加购入记录'
        }
        else{
          this.title = ''
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          setTimeout(()=>{
            this.$refs['ContactHistoryForm'].display(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        this.$refs['ContactHistoryForm'].save()
      },
      close_comp(){
        this.dialogFormVisible = false
        this.$emit('fetchDataChild',this.Contact)
      }
    },
  }
</script>

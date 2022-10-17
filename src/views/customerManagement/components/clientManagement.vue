<template>
  <el-dialog title="添加消费记录" :visible.sync="dialogFormVisible">
     <CustomerForm  ref="CustomerForm" @close_comp="close_comp"></CustomerForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="CustomerFormAdd">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
  import CustomerForm from '../form/CustomerForm.vue'
  export default {
    name: 'TableEdit2',
    components: {
    	CustomerForm,
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
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          setTimeout(()=>{
            this.$refs['CustomerForm'].display(Object.assign({}, row))
          },10)
        }
        this.dialogFormVisible = true
      },
      CustomerFormAdd() {
        this.$refs['CustomerForm'].editsave();
      },
      close_comp(){
        this.$emit('fetchData')
        this.dialogFormVisible = false
      }
    },
  }
</script>

<template>
  <el-dialog :title='title' :visible.sync="dialogFormVisible" >
    <workingStandardForm  ref="workingStandardForm" @close_comp="close_comp"></workingStandardForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'
import workingStandardForm from '../form/workingStandardForm.vue'
export default {
  name: 'TableEdit',
  components: {
    workingStandardForm,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        dialogFormVisible: false,
        formLabelWidth: '120px',
        title: '',
        Standard: [],
        symbol: '0'
      },
      title: '',
      formLabelWidth: '120px',
    }
  },
  created() { },
  methods: {
    showEdit(row, symbol) {
      if (!row && !symbol) {
        this.title = '添加试验标准'
        this.symbol = 0
      }
      else if(!symbol){
        this.title = '添加合同'
        this.Standard = Object.assign({}, row)
        this.symbol = 0
        console.log(this.Standard)
        setTimeout(()=>{
          this.$refs['workingStandardForm'].display(this.Standard)
        },10)
      }
      else if(symbol === '1'){
        this.title = '修改试验标准'
        this.Standard = Object.assign({}, row)
        console.log(this.Standard)
        this.symbol = symbol
        setTimeout(()=>{
          this.$refs['workingStandardForm'].displayEdit(this.Standard)
        },10)
      }
      else if(symbol === '2'){
        this.title = '试验标准详情'
        this.Standard = Object.assign({}, row)
        console.log(this.Standard)
        this.symbol = symbol
        setTimeout(()=>{
          this.$refs['workingStandardForm'].displayEdit(this.Standard)
        },10)
      }
      this.dialogFormVisible = true
    },
    editsave(){
      if(this.symbol==='0')
      {
        this.$refs['workingStandardForm'].save()
      }
      else if(this.symbol==='1'){
        this.$refs['workingStandardForm'].editsave()
      }
      else{
        this.$refs['workingStandardForm'].save()
      }
    },
    close_comp(){
      this.$emit('fetchData',this.Contact)
      this.dialogFormVisible = false
    }
  },
}
</script>

<style>
</style>

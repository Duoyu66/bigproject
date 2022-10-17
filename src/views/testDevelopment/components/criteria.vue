<template>
  <el-dialog :title='title' :visible.sync="dialogFormVisible" >
    <criteria  ref="criteria" @close_comp="close_comp"></criteria>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import criteria from '../form/criteriaForm.vue'
export default {
  name: 'TableEdit',
  components: {
    criteria,
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
      }
      else if(!symbol){
        this.title = '添加合同'
        this.Standard = Object.assign({}, row)
        console.log(this.Standard)
        setTimeout(()=>{
          this.$refs['criteria'].display(this.Standard)
        },10)
      }
      else if(symbol === '0'){
        this.title = '添加判定规则'
        this.Standard = Object.assign({}, row)
        console.log(this.Standard)
        this.symbol = symbol
        setTimeout(()=>{
          this.$refs['criteria'].display(this.Standard)
        },10)
      }
      else if(symbol === '1'){
        this.title = '修改判定规则'
        this.Standard = Object.assign({}, row)
        console.log(this.Standard)
        this.symbol = symbol
        setTimeout(()=>{
          this.$refs['criteria'].displayEdit(this.Standard)
        },10)
      }
      else if(symbol === '2'){
        this.title = '试验标准详情'
        this.Standard = Object.assign({}, row)
        console.log(this.Standard)
        this.symbol = symbol
        setTimeout(()=>{
          this.$refs['criteria'].displayEdit(this.Standard)
        },10)
      }
      this.dialogFormVisible = true
    },
    editsave(){
      if(this.symbol==='0')
      {
        this.$refs['criteria'].save()
      }
      else if(this.symbol==='1'){
        this.$refs['criteria'].editsave()
      }
      else{
        this.$refs['criteria'].save()
      }
    },
    close_comp(){
      this.$emit('fetchDataChildFile',this.Standard)
      this.dialogFormVisible = false
    }
  },
}
</script>

<style>
</style>

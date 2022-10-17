<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <valuation  ref="valuation" @close_comp="close_comp"></valuation>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
 import valuation from '../form/valuation.vue'
 export default {
   name: 'TableEdit8',
   components: {
   	valuation,
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
          this.title = '添加验工计价扫描件'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          setTimeout(()=>{
            this.$refs['valuation'].display(this.Contact)
          },10)
        }
        else {
          this.title = '修改客户联系人'
          this.Contact = Object.assign({}, row)
          console.log(symbol)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['valuation'].displayEdit(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='1')
        {
          this.$refs['valuation'].save()
        }
        else {
          this.$refs['valuation'].editsave()
        }
      },
      close_comp(){
        this.dialogFormVisible = false
        this.$emit('fetchDataChild',this.Contact)
      }
    },
  }
</script>

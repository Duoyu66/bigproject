<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <enclosure  ref="enclosure" @close_comp="close_comp"></enclosure>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import { doEdit } from '@/api/table'
 import enclosure from '../form/enclosure.vue'
 export default {
   name: 'TableEdit8',
   components: {
   	enclosure,
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
          this.title = '添加附件扫描件'
          this.Contact = Object.assign({}, row)
          console.log(this.Contact)
          setTimeout(()=>{
            this.$refs['enclosure'].display(this.Contact)
          },10)
        }
        else {
          this.title = '修改客户联系人'
          this.Contact = Object.assign({}, row)
          console.log(symbol)
          this.symbol = symbol
          setTimeout(()=>{
            this.$refs['enclosure'].displayEdit(this.Contact)
          },10)
        }
        this.dialogFormVisible = true
      },
      editsave(){
        if(this.symbol==='1')
        {
          this.$refs['enclosure'].save()
        }
        else {
          this.$refs['enclosure'].editsave()
        }
      },
      close_comp(){
        this.dialogFormVisible = false
        this.$emit('fetchDataChild',this.Contact)
      }
    },
  }
</script>

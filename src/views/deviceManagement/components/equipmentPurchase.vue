<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <PurchaseFrom :father="form" ref="PurchaseFrom" @close_comp="close_comp"></PurchaseFrom>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">
        确 定
      </el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  doEdit
} from '@/api/table'
import PurchaseFrom from '../form/equipmentPurchaseFrom.vue'
export default {
  name: 'TableEdit11',
  components: {
    PurchaseFrom,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: 'xst',
        norms: 'rygz',
        name1: 'a',
        name2: 'a',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: '',
      },
      Symbol: '',
      formLabelWidth: '120px',
      title: '购入记录',
      dialogFormVisible: false,
    }
  },
  created() { },
  methods: {
    showEdit(row,Symbol) {
      if (!row) {
        this.title = '添加购入记录'
      }
      else if(Symbol==='0') {
        this.title = '添加购入记录'
        const purchase = Object.assign({}, row)
        this.Symbol=Symbol
        setTimeout(()=>{
          this.$refs['PurchaseFrom'].displaycontract(purchase)
        },10)
      }
      else {
        this.title = '编辑购入记录'
        const purchase = Object.assign({}, row)
        setTimeout(()=>{
          this.$refs['PurchaseFrom'].display(purchase)
        },10)
      }
      this.dialogFormVisible = true
    },
    editsave(){
      if( this.Symbol==='0')
      {
        this.$refs['PurchaseFrom'].save()
      }
      else {
        this.$refs['PurchaseFrom'].editsave()
      }
    },
    close_comp(){
      this.$emit('fetchData')
      this.dialogFormVisible = false
    }
  },
}
</script>

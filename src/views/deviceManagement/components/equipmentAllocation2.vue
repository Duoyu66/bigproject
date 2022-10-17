<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" >
    <AllocationForm  ref="AllocationForm" @close_comp="close_comp"></AllocationForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">确 定</el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
  	doEdit,
    getList,
    ExecSql,
    QueryExec
  } from '@/api/table'
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
import AllocationForm from '../form/AllocationForm.vue'
import DeviceExpressForm from '../form/DeviceExpressForm.vue'
export default {
  name: 'TableEdit61',
  components: {
    AllocationForm,
    DeviceExpressForm
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: ''
      },
      formLabelWidth: '120px',
      title: '',
      Contact: [],
      symbol: '0'
    }
  },
  created() { },
  computed: { },
  methods: {
    showEdit(row,symbol) {
      if (!row) {
        this.title = '添加'
      }
      else if(symbol === '0'){
        this.title = '添加调拨记录'
        this.Contact = Object.assign({}, row)
        console.log(this.Contact)
        this.symbol = symbol
        setTimeout(()=>{
          this.$refs['AllocationForm'].displayadd(this.Contact)
        },10)
      }
      else if(symbol === '1'){
        this.title = '修改调拨记录'
        this.Contact = Object.assign({}, row)
        console.log(this.Contact)
        this.symbol = symbol
        setTimeout(()=>{
          this.$refs['AllocationForm'].display(this.Contact)
        },10)
      }
      else if(symbol === '2'){
        this.title = '快递信息录入'
        this.Contact = Object.assign({}, row)
        console.log(this.Contact)
        this.symbol = symbol
        setTimeout(()=>{
          this.$refs['DeviceExpressForm'].display(this.Contact)
        },10)
      }
      else if(symbol === '3'){
        this.title = '确认接收'
        this.Contact = Object.assign({}, row)
        console.log(this.Contact)
        this.symbol = symbol
        setTimeout(()=>{
          this.$refs['AllocationForm'].displayadd(this.Contact)
        },10)
      }

      // this.title += '调拨记录'
      this.dialogFormVisible = true
    },
    editsave(){
      if(this.symbol==='0')
      {
        this.$refs['AllocationForm'].save()
      }
      else if(this.symbol==='1'){
        this.$refs['AllocationForm'].editsave()
      }
      else if(this.symbol==='2'){
        this.$refs['DeviceExpressForm'].save()
      }
      else if(this.symbol==='3'){
        this.$refs['AllocationForm'].editsave()
      }
      else{
        this.close_comp()
      }
    },
    close_comp(){
      this.$emit('fetchDataChild',this.Contact)
      this.$emit('fetchData')
      this.dialogFormVisible = false
    }
  },
}
</script>

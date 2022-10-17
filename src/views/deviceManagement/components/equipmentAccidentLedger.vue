<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <AccidentFrom ref="AccidentFrom" @close_comp="close_comp"></AccidentFrom>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">
        确 定
      </el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'
import AccidentFrom from '../form/AccidentForm.vue'
export default {
  name: 'TableEdit71',
  components: {
    AccidentFrom,
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
        number: '',
        device_id: '',
        symbol: ''
      },
      formLabelWidth: '120px',
      title: '',
    }
  },
  created() { },
  methods: {
    showEdit(row,symbol) {
      if (!row) {
        this.title = '添加'
      }
      else if(symbol === '0')
      {
        this.form.symbol = '0'
        this.title = '添加'
        this.device_id = Object.assign({}, row).device_id
        console.log(Object.assign({}, row))
        setTimeout(()=>{
          this.$refs['AccidentFrom'].displayadd(Object.assign({}, row))
        },10)
      }
      else
      {
        this.title = '编辑'
        this.device_id = Object.assign({}, row).device_id
        this.form.symbol = '1'
        setTimeout(()=>{
          this.$refs['AccidentFrom'].display(Object.assign({}, row))
        },10)
      }

      this.title += '事故记录'
      this.dialogFormVisible = true
    },
    close_comp() {
      this.$emit('fetchDataChild',this.device_id)
      console.log(this.device_id)
      this.dialogFormVisible = false
    },
    editsave(){
      if(this.form.symbol === '0')
      {
        this.$refs['AccidentFrom'].save()
      }
      else{
        this.$refs['AccidentFrom'].editsave()
      }

    }
  },
}
</script>

<style>
</style>

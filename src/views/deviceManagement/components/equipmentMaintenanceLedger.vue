<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <RepairForm ref="RepairForm" @close_comp="close_comp"></RepairForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave">
        确 定
      </el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'
import RepairForm from '../form/RepairForm.vue'
export default {
  name: 'TableEdit81',
  components: {
    RepairForm,
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
        symbol: '1'
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
        this.title = '添加'
        this.device_id = Object.assign({}, row).device_id
        this.symbol=symbol
        setTimeout(()=>{
          this.$refs['RepairForm'].display(Object.assign({}, row))
        },10)
      }
      else
      {
        this.title = '编辑'
        this.device_id = Object.assign({}, row).device_id
        this.symbol=symbol
        setTimeout(()=>{
          this.$refs['RepairForm'].display(Object.assign({}, row))
        },10)
      }

      this.title += '维修记录'
      this.dialogFormVisible = true
    },
    close_comp() {
      this.$emit('fetchDataChild',this.device_id)
      console.log(this.device_id)
      this.dialogFormVisible = false
    },
    editsave(){
      if(this.symbol === '0')
      {
        this.$refs['RepairForm'].save()
      }
      else{
        this.$refs['RepairForm'].editsave()
      }
    }
  },
}
</script>

<style>
</style>

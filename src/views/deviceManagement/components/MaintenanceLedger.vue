<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <MaintenanceForm ref="MaintenanceForm" @close_comp="close_comp"></MaintenanceForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saverecord">
        确 定
      </el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'
import MaintenanceForm from '../form/MaintenanceForm.vue'
export default {
  name: 'TableEdit51',
  components: {
    MaintenanceForm,
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

      },
      symbol: '1',
      device_id: '',
      formLabelWidth: '120px',
      title: '',
    }
  },
  created() { },
  methods: {
    showEdit(row,symbol) {
      if (!symbol) {
        this.title = '编辑'
        this.symbol = '1'
        console.log(Object.assign({}, row))
        this.device_id=row.device_id
        setTimeout(()=>{
          this.$refs['MaintenanceForm'].display(Object.assign({}, row))
        },10)
      } else {
        this.symbol=symbol
        this.title = '添加'
        this.symbol = '0'
        console.log(Object.assign({}, row))
        this.device_id=row.device_id
        setTimeout(()=>{
          this.$refs['MaintenanceForm'].displayadd(Object.assign({}, row))
        },10)
      }
      this.title += '维护保养记录'
      this.dialogFormVisible = true


    },
    close() {
    	//this.$refs['MaintenanceForm'].close()
      this.$emit('fetchDataChild',this.device_id)
      this.dialogFormVisible=false

    },
    close_comp() {
    	//this.$refs['MaintenanceForm'].close()
      this.$emit('fetchDataChild',this.device_id)
      console.log(this.device_id)
      this.dialogFormVisible=false
    },
    saverecord() {
      if(this.symbol==='0')
      {
        this.$refs['MaintenanceForm'].save()
      }
      else
      {
        this.$refs['MaintenanceForm'].editsave()
      }
    }
  },
}
</script>

<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500">
    <DataDictonaryForm ref="DataDictonaryForm" @close_comp="close_comp"></DataDictonaryForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editsave()">
        确 定
      </el-button>
      <el-button @click="close_comp">取 消</el-button>
    </div>
  </el-dialog>
</template>

    <script>
import { doEdit } from '@/api/table'
import DataDictonaryForm from '../form/DataDictonaryForm.vue'
export default {
  name: 'TableEdit',
  components: {
    DataDictonaryForm,
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
        norms: 'tiaomu1',
      },
      title: '',
      addoredit: 0,
      DataDictonary: [],
      formLabelWidth: '120px',
    }
  },
  created() { },
  methods: {
    showEdit(row) {
      if (!row) {
        this.addoredit = 0
        this.title = '添加主字典'
      }
      else{
        this.title = '修改主字典'
        this.DataDictonary = Object.assign({}, row)
        console.log(this.DataDictonary)
        this.addoredit=1
        setTimeout(()=>{
          this.$refs['DataDictonaryForm'].display(this.DataDictonary)
        },10)
      }
      this.dialogFormVisible = true
    },
    editsave(){
      if(this.addoredit===0)
      {
        this.$refs['DataDictonaryForm'].save()
      }
      else{
        this.$refs['DataDictonaryForm'].editsave()
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

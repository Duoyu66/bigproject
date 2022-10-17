<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <exportStageForm ref="exportStageForm" @close_comp="close_comp"></exportStageForm>
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
import exportStageForm from '../form/exportStageForm.vue'
export default {
  name: 'TableEdit',
  components: {
    exportStageForm,
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
    showEdit(row,symbol) {
      if (symbol === '0') {
        this.addoredit = 0
        this.title = '添加导出步骤'
        this.DataDictonary = Object.assign({}, row)
        console.log(row)
        setTimeout(()=>{
          this.$refs['exportStageForm'].displayadd(this.DataDictonary)
        },10)
      }
      else{
        this.title = '修改导出步骤'
        this.DataDictonary = Object.assign({}, row)
        this.addoredit=1
        setTimeout(()=>{
          this.$refs['exportStageForm'].display(this.DataDictonary)
        },10)
      }
      this.dialogFormVisible = true
    },
    editsave(){
      if(this.addoredit===0)
      {
        this.$refs['exportStageForm'].save()
      }
      else{
        this.$refs['exportStageForm'].editsave()
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

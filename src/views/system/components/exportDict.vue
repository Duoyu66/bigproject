<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <exportDictForm ref="exportDictForm" @close_comp="close_comp"></exportDictForm>
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
import exportDictForm from '../form/exportDictForm.vue'
export default {
  name: 'TableEdit',
  components: {
    exportDictForm,
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
        this.title = '添加导出字典'
        this.DataDictonary = Object.assign({}, row)
        this.addoredit=0
        console.log(row)
        setTimeout(()=>{
          this.$refs['exportDictForm'].displayadd(this.DataDictonary)
        },10)
      }
      else{
        this.title = '修改导出字典'
        this.DataDictonary = Object.assign({}, row)
        this.addoredit=1
        setTimeout(()=>{
          this.$refs['exportDictForm'].display(this.DataDictonary)
        },10)
      }
      this.dialogFormVisible = true
    },
    editsave(){
      if(this.addoredit===0)
      {
        this.$refs['exportDictForm'].save()
      }
      else{
        this.$refs['exportDictForm'].editsave()
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

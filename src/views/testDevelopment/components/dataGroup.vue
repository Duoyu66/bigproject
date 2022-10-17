<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="70%">
    <DataGroup ref="DataGroup" @close_comp="close_comp"></DataGroup>
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
import DataGroup from '../form/DataGroup.vue'
export default {
  name: 'TableEdit',
  components: {
    DataGroup,
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
        this.title = '添加主字典'
      }
      else{
        this.title = '修改主字典'
        this.DataDictonary = Object.assign({}, row)
        console.log(this.DataDictonary)
        this.addoredit=1
        setTimeout(()=>{
          this.$refs['DataGroup'].display(this.DataDictonary)
        },10)
      }
      this.dialogFormVisible = true
    },
    editsave(){
      if(this.addoredit===0)
      {
        this.$refs['DataGroup'].save()
      }
      else{
        this.$refs['DataGroup'].editsave()
      }
    },
    close_comp(){
      setTimeout(()=>{
        this.$emit('fetchData',this.Contact)
      },10)
      
      this.dialogFormVisible = false
    }
  },
}
</script>

<style>
</style>

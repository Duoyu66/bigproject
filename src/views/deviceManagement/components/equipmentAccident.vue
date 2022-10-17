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
        number: ''
      },
      formLabelWidth: '120px',
      title: '',
    }
  },
  created() { },
  methods: {
    showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        setTimeout(()=>{
          this.$refs['AccidentFrom'].display(Object.assign({}, row))
        },10)
      }

      this.title += '事故记录'
      this.dialogFormVisible = true
    },
    editsave(){
      this.$refs['AccidentFrom'].editsave()
    },
    close_comp() {
      this.$emit('fetchDataChild')
      this.dialogFormVisible = false
    }
  },
}
</script>

<style>
</style>

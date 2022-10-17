<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <SealForm ref="SealForm" @close_comp="close_comp"></SealForm>
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
import SealForm from '../form/SealForm.vue'
export default {
  name: 'TableEdit71',
  components: {
    SealForm,
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
          this.$refs['SealForm'].display(Object.assign({}, row))
        },10)
      }

      this.title += '事故记录'
      this.dialogFormVisible = true
    },
    editsave(){
      this.$refs['SealForm'].editsave()
    },
    close_comp() {
      this.$emit('fetchData')
      this.dialogFormVisible = false
    }
  },
}
</script>

<style>
</style>

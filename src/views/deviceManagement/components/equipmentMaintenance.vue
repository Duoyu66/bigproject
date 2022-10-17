<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <RepairForm ref="RepairForm" @close_comp="close_comp"></RepairForm>
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
          this.$refs['RepairForm'].display(Object.assign({}, row))
        },10)
      }

      this.title += '维修记录'
      this.dialogFormVisible = true
    },
    editsave(){
      this.$refs['RepairForm'].editsave()

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

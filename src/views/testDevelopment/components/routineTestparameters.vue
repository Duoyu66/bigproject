<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <RoutineForm ref="RoutineForm"></RoutineForm>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">
        确 定
      </el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

    <script>
import { doEdit } from '@/api/table'
import RoutineForm from '../form/RoutineForm.vue'
export default {
  name: 'TableEdit',
  components: {
    RoutineForm,
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
      title: '',
      formLabelWidth: '120px',
    }
  },
  created() { },
  methods: {
    showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }

      this.title += '常规试验参数'
      this.dialogFormVisible = true
    },
  },
}
</script>

<style>
</style>

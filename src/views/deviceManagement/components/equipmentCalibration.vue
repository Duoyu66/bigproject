<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <CalibrationFrom ref="CalibrationFrom"></CalibrationFrom>
    <div slot="footer" class="dialog-footer">
      <div class="devides_btn">
        <el-button type="primary" @click="dialogFormVisible = false">
          确 定
        </el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'
import CalibrationFrom from '../form/CalibrationForm.vue'
export default {
  name: 'TableEdit31',
  components: {
    CalibrationFrom,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        region: 'qualified',
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
      dialogFormVisible: false,
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
        if (this.$refs['PurchaseFrom']) {
          this.$refs['PurchaseFrom'].form = Object.assign({}, row)
        }
      }

      this.title += '校检记录'
      this.dialogFormVisible = true
    },
  },
}
</script>

<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <!-- <RecordForm  ref="RecordForm"></RecordForm> -->
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="作废日期" :label-width="formLabelWidth">
        <el-date-picker
          style="width: 100%"
          v-model="form.value1"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="作废量" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="作废原因" :label-width="formLabelWidth">
        <el-input
          v-model="form.number1"
          style="width: 100%"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="处置人" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 100%"></el-input>
      </el-form-item>
    </el-form>
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
import RecordForm from '../form/RecordForm.vue'
export default {
  name: 'TableEdit6',
  components: {
    RecordForm,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        norms: 'rygz',
        name: 'xst',
        region: 'g',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: '',
        value1: ''
      },
      rules: {
        select: [{
          required: true,
          trigger: ["blur", "change"],
          message: '请选中'
        }

        ],
        name: [{
          required: true,
          trigger: 'blur',
          message: '请输入权限描述'
        }],


      },
      formLabelWidth: '85px',
      title: '',
      dialogFormVisible: false,
    }
  },
  created() { },
  methods: {
    showEdit6(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      this.title += '作废记录'
      this.dialogFormVisible = true
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
}
</script>

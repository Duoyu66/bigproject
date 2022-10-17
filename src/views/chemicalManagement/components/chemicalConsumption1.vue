<template>
  <el-dialog title="修改消耗溶液" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="消耗日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.value1"
          style="width: 250px"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="用量" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="使用场合" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="使用人" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 250px"></el-input>
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
export default {
  name: 'TableEdit1',
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      title: '',
      //dialogFormVisible: false,
    }
  },
  created() {},
  methods: {
    showEdit1(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      this.dialogFormVisible = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
}
</script>

<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item
        label="检测室编码"
        :label-width="formLabelWidth"
        style="padding-top: 10px"
      >
        <el-input v-model="form.number" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="检测室名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="检测室描述" :label-width="formLabelWidth">
        <el-input
          v-model="form.describe"
          style="width: 300px"
          type="textarea"
        ></el-input>
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
  name: 'TableEdit',
  data() {
    return {
      form: {
        name: 'a',
        norms: 'rygz',
        name1: 'a',
        name2: 'a',
        name3: 'a',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: '',
        mill: '',
        value1: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
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
        this.form = Object.assign({}, row)
      }
      this.title += '检测室'
      this.dialogFormVisible = true
    },
  },
}
</script>

<style>
</style>

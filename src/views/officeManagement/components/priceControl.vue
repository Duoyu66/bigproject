<template>
  <el-dialog title="添加参数计价" :visible.sync="dialogFormVisible">
    <el-form :model="form" style="margin-right:15px;">
      <el-form-item label="试验名称" :label-width="formLabelWidth">
        <el-input :disabled="true" v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="参数" :label-width="formLabelWidth" style="margin-top:10px">
        <el-select disabled v-model="form.number1" style="width:250px;">
          <el-option label="含水率" value="water-rate"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计价单位" :label-width="formLabelWidth" style="margin-top:10px">
        <el-select v-model="form.number2" style="width:250px;">
          <el-option label="次" value="times"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格" :label-width="formLabelWidth" style="margin-top:10px">
        <el-input v-model="form.number3" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="价格单位" :label-width="formLabelWidth" style="margin-top:10px">
        <el-select v-model="form.number4" style="width:250px;">
          <el-option label="元" value="single"></el-option>
          <el-option label="万元" value="tenth"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
        dialogFormVisible: false,
        form: {
          name: 'xst',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number:'粗骨料检测',
          number1:'含水率',
          norms:'rygz',
        },
        formLabelWidth: '120px',
        formLabelWidth: '120px',
        title: '',
        dialogFormVisible: false,

      }
    },
   created() {},
     methods: {
       showEdit(row) {
         if (!row) {
           this.title = '添加'
         } else {
           this.title = '编辑'
           this.form = Object.assign({}, row)
         }
         this.dialogFormVisible = true
       },
     },
   }
</script>

<template>
  <el-dialog title="修改合同台账" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="合同编号" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="合同名称" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="合同类型" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="签订日期" :label-width="formLabelWidth">
        <el-date-picker style="width: 250px;"
              v-model="form.value1"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
      </el-form-item>
      <el-form-item label="有效开始" :label-width="formLabelWidth">
        <el-date-picker style="width: 250px;"
              v-model="form.value2"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
      </el-form-item>
      <el-form-item label="有效结束" :label-width="formLabelWidth">
        <el-date-picker style="width: 250px;"
              v-model="form.value3"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
      </el-form-item>
      <el-form-item label="支付方式" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 250px;">
          <el-option label="现付" value="a"></el-option>
          <el-option label="预付" value="b"></el-option>
          <el-option label="月结" value="c"></el-option>
          <el-option label="季结" value="d"></el-option>
          <el-option label="年结" value="e"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词" :label-width="formLabelWidth">
        <el-input v-model="form.number7" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="合同扫描" :label-width="formLabelWidth">
        <el-input v-model="form.number8" style="width: 195px;"></el-input>
        <el-button type="primary">扫描</el-button>
      </el-form-item>
    </el-form>

    <div slot="footer" class=" el-dialog__footer" style="width: 100%; justify-content: flex-end;padding-right: 82px;">
      <el-button type="primary" @click="dialogFormVisible = false">确 认</el-button>
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
         value1: '',
         value2: '',
         value3: '',
         norms:'cj',
         name: 'a',
         region: 'g',
         date1: '',
         date2: '',
         delivery: false,
         type: [],
         resource: '',
         desc: '',
         number:''
       },
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

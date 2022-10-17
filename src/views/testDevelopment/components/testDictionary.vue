<template>
  <el-dialog title="映射旧版本指标" :visible.sync="dialogFormVisible">
    <!-- <el-form :model="form" style="width: 100%; padding: 0;">
      <el-form-item>
         <el-select v-model="form.region" style="float: left;">
              <el-option label="请选择模板映射版本" value="beijing"></el-option>
            </el-select>
            <el-button type="primary" style="float: right;">保存</el-button>
      </el-form-item>
    </el-form> -->
    <div class="border" style="width: 80%; height: 300px;"></div>
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
          name: '',
          region: 'beijing',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number:''
        },
        formLabelWidth: '120px',
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

<style>
</style>

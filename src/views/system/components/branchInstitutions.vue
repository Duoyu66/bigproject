<template>
  <el-dialog title="添加试验" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="试验名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="试验分组" :label-width="formLabelWidth">
        <el-select v-model="form.region" style="width: 250px;">
          <el-option label="金属" value="g"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批单位" :label-width="formLabelWidth">
        <el-input v-model="form.norms" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="平行率" :label-width="formLabelWidth">
        <el-input v-model="form.norms1" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="见证率" :label-width="formLabelWidth">
        <el-input v-model="form.name1" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="操作流程" :label-width="formLabelWidth">
        <el-select v-model="form.region1" style="width: 250px;">
          <el-option label="请选择" value="value1"></el-option>
          <el-option label="收样" value="value2"></el-option>
          <el-option label="试验" value="value3"></el-option>
          <el-option label="复核" value="value4"></el-option>
          <el-option label="批准" value="value5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属检测室" :label-width="formLabelWidth">
        <el-select v-model="form.region2" style="width: 250px;">
          <el-option label="无" value="wu"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属项目" :label-width="formLabelWidth">
        <el-select v-model="form.region3" style="width: 250px;">
          <el-option label="试验室检测" value="sysjc"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试验类型" :label-width="formLabelWidth">
        <el-select v-model="form.region4" style="width: 250px;">
          <el-option label="原材料试验" value="yclsy"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码前缀" :label-width="formLabelWidth">
        <el-input v-model="form.norms2" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="外部上传编码" :label-width="formLabelWidth">
        <el-input v-model="form.norms3" autocomplete="off" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="是否自动计算" :label-width="formLabelWidth">
          <el-radio-group v-model="form.resource">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
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
      name: '',
      region: 'g',
      region1:'value1',
      region2:'wu',
      region3:'sysjc',
      region4:'yclsy',
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

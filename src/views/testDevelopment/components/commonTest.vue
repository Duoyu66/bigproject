<template>
  <el-dialog title="添加试验" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <!-- <el-form-item label="试验名称" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="试验分组" :label-width="formLabelWidth">
        <el-select v-model="form.norms1" style="width: 250px;">
          <el-option label="根节点分组" value="norms1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批单位" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="平行率" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="见证率" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="操作流程" :label-width="formLabelWidth">
        <el-select v-model="form.norms" style="width: 250px;">
          <el-option label="请选择" value="xuanze"></el-option>
          <el-option label="收样" value="shouyang"></el-option>
          <el-option label="试验" value="shiyan"></el-option>
          <el-option label="复核" value="fuhe"></el-option>
          <el-option label="审批" value="shenpi"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属检测室" :label-width="formLabelWidth">
        <el-select v-model="form.norms2" style="width: 250px;">
          <el-option label="无" value="norms2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属项目" :label-width="formLabelWidth">
        <el-select v-model="form.norms3" style="width: 250px;">
          <el-option label="试验室检测" value="norms3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试验类型" :label-width="formLabelWidth">
        <el-select v-model="form.norms4" style="width: 250px;">
          <el-option label="原材料试验" value="norms4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码前缀" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="外部上传编码" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="是否自动计算" :label-width="formLabelWidth">
        <el-radio-group v-model="form.resource">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item> -->
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
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        number: '',
        norms: 'xuanze',
        norms1: 'norms1',
        norms2: 'norms2',
        norms3: 'norms3',
        norms4: 'norms4',
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

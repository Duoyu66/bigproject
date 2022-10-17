<template>
  <el-dialog title="他人审批意见" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="公文标题" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 540px;"></el-input>
      </el-form-item>
      <el-form-item label="发文编号" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 210px;"></el-input>
      </el-form-item>

      <el-form-item label="密级程度" :label-width="formLabelWidth">
        <el-select v-model="form.degree" style="width: 210px;">
          <el-option label="普通" value="a"></el-option>
          <el-option label="秘密" value="b"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公文类别" :label-width="formLabelWidth">
        <el-select v-model="form.type1" style="width: 210px;">
          <el-option label="通知" value="a"></el-option>
          <el-option label="公告" value="b"></el-option>
          <el-option label="通告" value="c"></el-option>
          <el-option label="通报" value="d"></el-option>
          <el-option label="请示" value="e"></el-option>
          <el-option label="批复" value="f"></el-option>
          <el-option label="意见" value="g"></el-option>
          <el-option label="决定" value="h"></el-option>
          <el-option label="报告" value="i"></el-option>
          <el-option label="函" value="j"></el-option>
          <el-option label="议案" value="k"></el-option>
          <el-option label="会议纪要" value="l"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="紧急程度" :label-width="formLabelWidth">
        <el-select v-model="form.degree1" style="width: 210px;">
          <el-option label="一般" value="a"></el-option>
          <el-option label="紧急" value="b"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主送单位" :label-width="formLabelWidth">
        <el-select v-model="form.organization" style="width: 870px;">
          <el-option label="主送单位1" value="a"></el-option>
          <el-option label="主送单位2" value="b"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="抄送机构" :label-width="formLabelWidth">
        <el-select v-model="form.organization2" style="width: 870px;">
          <el-option label="抄送机构1" value="a"></el-option>
          <el-option label="抄送机构2" value="b"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="拟稿部门" :label-width="formLabelWidth">
        <el-select v-model="form.organization1" style="width: 870px;">
          <el-option label="部门1" value="a"></el-option>
          <el-option label="部门2" value="b"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批人" :label-width="formLabelWidth">
        <el-input v-model="form.number3" style="width: 870px;"></el-input>
      </el-form-item>
      <el-form-item label="审批意见" class="area" :label-width="formLabelWidth">
        <el-input v-model="form.number4" style="width: 870px;" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="附件" :label-width="formLabelWidth">
        <el-input v-model="form.number4" style="width: 766px;"></el-input>
        <el-button type="primary">点击查看附件</el-button>
      </el-form-item>
    </el-form>

    <div slot="footer" class=" el-dialog__footer" style="width: 100%; justify-content: flex-end;padding-right: 82px;">
      <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
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
       form: {
         name: '',
         region: '',
         date1: '',
         date2: '',
         delivery: false,
         type: [],
         resource: '',
         desc: '',
         number:'',
         degree:'a',
         degree1:'a',
         type1:'b',
         organization:"a",
         organization1:"a",
         organization2:"a"
       },
       formLabelWidth: '120px',
        title: '',
        dialogFormVisible: false,
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
     },
   }
</script>

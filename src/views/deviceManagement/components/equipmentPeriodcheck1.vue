<template>
  <el-dialog title="执行核查" :visible.sync="dialogFormVisible">
    <span class="purchasefrom">
      <el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
        <el-form-item label="管理编号" :label-width="formLabelWidth">
          <el-input v-model="form.manage_pid" style="width: 100%" maxlength="16" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备名称" :label-width="formLabelWidth">
         	<el-input v-model="form.device_name" style="width: 100%" maxlength="16" disabled></el-input>
        </el-form-item>
        <el-form-item label="规格型号" :label-width="formLabelWidth">
         	<el-input v-model="form.model" style="width: 100%" maxlength="16" disabled></el-input>
        </el-form-item>
        <el-form-item label="测量范围" :label-width="formLabelWidth">
         	<el-input v-model="form.scope" style="width: 100%;" maxlength="16" disabled></el-input>
        </el-form-item>
        <el-form-item label="精度" :label-width="formLabelWidth">
         	<el-input v-model="form.precision" style="width: 100%" maxlength="16" disabled></el-input>
        </el-form-item>
        <el-form-item label="核查日期" prop="check_date" :label-width="formLabelWidth">
        	<el-date-picker
        	  v-model="form.check_date"
            style="width: 100%;"
        	  type="date"
        	  placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
        	</el-date-picker>
        </el-form-item>
        <el-form-item label="核查方式" prop="check_method" :label-width="formLabelWidth">
          <el-input v-model="form.check_method" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="核查实施人" prop="check_person" :label-width="formLabelWidth">
          <el-input v-model="form.check_person" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="核查结果" prop="check_result" :label-width="formLabelWidth">
          <el-input v-model="form.check_result" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <div slot="footer" class="dialog-footer">
      <div class="devides_btn">
        <el-button type="primary" @click="verify_confirm">
          确 定
        </el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
	import {
		doEdit,
    ExecSql,
    QueryExec
	} from '@/api/table'
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
import PeriodForm from '../form/PeriodForm.vue'
export default {
  name: 'TableEdit',
  components: {
    PeriodForm,
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        manage_pid: '',
        device_name: '',
        model: '',
        scope: '',
        precision: '',
        check_date: '',
        check_method: '',
        check_person: '',
        check_result: '',
        device_id: '',
        remark: '',
        check_id: '',
        plan_id: ''
      },
      rules: {
        check_date: [{ required: true, trigger: 'change', message: '请选择核查日期' }],
        check_method: [{ required: true, trigger: 'blur', message: '请输入核查方式' }],
        check_person: [{ required: true, trigger: 'blur', message: '请输入核查实施人' }],
        check_result: [{ required: true, trigger: 'blur', message: '请输入核查结果' }],
      },
      selectloading: true,
      formLabelWidth: '120px',
    }
  },
  created() { },
  computed: {
  	...mapGetters({
  		current_org: 'org/current_org',
  	}),
  },
  methods: {
    showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.selectloading=true

        this.form = Object.assign({}, row)
        console.log(this.form)
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      }
      this.dialogFormVisible = true
    },
    close() {
    	this.$refs['form'].resetFields()
      this.dialogFormVisible=false
    	//this.$emit('fetch-data')
    },
    verify_confirm() {
      let that=this;
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let sData = '[Q]198{'+that.form.check_date+'$`'+that.form.check_method+'$`'
          +that.form.check_person+'$`'+that.form.check_result+'$`'+that.form.remark+'$`'+that.form.check_id+'}|^1|^SYS'
          console.log(sData)
          const res = await ExecSql(sData)
          if(res>0)
          {
            that.$baseMessage('核查修改成功', 'success')
            this.$refs['form'].resetFields()
            this.$emit('CheckChoose',this.form)
            that.dialogFormVisible=false
          }
          else
          {
            that.$baseMessage('核查修改失败', 'error')
          }
        }
      })
    }
  },
}
</script>

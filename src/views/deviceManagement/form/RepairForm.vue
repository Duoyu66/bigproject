<template>
	<span class="purchasefrom">
      <el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
      	<el-form-item label="管理编号" prop="manage_pid" :label-width="formLabelWidth" v-if="displaymanage">
      		<el-select v-model="form.manage_pid" filterable placeholder="请输入或选择" @change="setoption" style="width: 100%;">
            <el-option
              v-for="item in form.manage_pid_array"
              :key="item.device_id"
              :label="item.manage_pid"
              :value="item.alldata">
            </el-option>
      		</el-select>
      	</el-form-item>
        <el-form-item label="管理编号" :label-width="formLabelWidth" v-else>
        	<el-input v-model="form.manage_pid" style="width: 100%;" disabled></el-input>
        </el-form-item>
      	<el-form-item label="设备名称" :label-width="formLabelWidth">
      		<el-input v-model="form.device_name" style="width: 100%;" disabled></el-input>
      	</el-form-item>
        <el-form-item label="规格型号" :label-width="formLabelWidth">
        	<el-input v-model="form.model" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="测量范围" :label-width="formLabelWidth">
        	<el-input v-model="form.scope" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="精度" :label-width="formLabelWidth">
        	<el-input v-model="form.precision" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="维修日期" prop="repair_date" :label-width="formLabelWidth" >
        	<el-date-picker
        	  v-model="form.repair_date"
        	  style="width: 100%;"
        	  type="date"
        	  placeholder="选择日期"
        	  format="yyyy 年 MM 月 dd 日"
        	  value-format="yyyy-MM-dd">
        	</el-date-picker>
        </el-form-item>
        <el-form-item label="修理类别" prop="repair_type" :label-width="formLabelWidth">
        	<el-input v-model="form.repair_type" style="width: 100%;" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="主修部分" prop="repair_main" :label-width="formLabelWidth">
        	<el-input v-model="form.repair_main" style="width: 100%;" maxlength="64"></el-input>
        </el-form-item>
      	<el-form-item label="维修方法" prop="repair_method" :label-width="formLabelWidth">
      		<el-input v-model="form.repair_method" style="width: 100%;" maxlength="64"></el-input>
      	</el-form-item>
        <el-form-item label="维修后情况" prop="repair_situation" :label-width="formLabelWidth">
        	<el-input v-model="form.repair_situation" style="width: 100%;" maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="承修单位" prop="repair_org" :label-width="formLabelWidth">
        	<el-input v-model="form.repair_org" style="width: 100%;" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="竣工时间" prop="completed_date" :label-width="formLabelWidth" >
        	<el-date-picker
        	  v-model="form.completed_date"
        	  style="width: 100%;"
        	  type="date"
        	  placeholder="选择日期"
        	  format="yyyy 年 MM 月 dd 日"
        	  value-format="yyyy-MM-dd">
        	</el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
        	<el-input v-model="form.remark" style="width: 100%;"></el-input>
        </el-form-item>
      </el-form>
    </span>


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
	export default {
		name: 'TableEdit',
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
    	}),
    },
		data() {
      var validate_date = (rule, value, callback) => {
        let startdate = new Date(this.form.repair_date)
        let enddate = new Date(value)
        if (startdate>enddate) {
          callback(new Error('维修日期应小于竣工日期'));
        } else {
          callback();
        }
      };
			return {
				form: {
					manage_pid_array: [],
          manage_pid:'',
					device_name: '',
          device_id: '',
          model:'',
          scope:'',
					precision: '',
          repair_date:'',
					repair_type: '',
					repair_main: '',
          repair_method: '',
					repair_situation: '',
					repair_org: '',
					completed_date: '',
          remark: '',
          repair_id: ''
				},
        rules: {
          manage_pid: [{ required: true, trigger: 'change', message: '请选择管理编号' }],
          repair_date: [{ required: true, trigger: 'blur', message: '请选择维修日期' }],
          repair_type: [{ required: true, trigger: 'blur', message: '请选择维修类别' }],
          repair_main: [{ required: true, trigger: 'change', message: '请输入维修的主要部分' }],
          repair_method: [{ required: true, trigger: 'change', message: '请输入维修方法' }],
          repair_situation: [{ required: true, trigger: 'blur', message: '请输入维修后情况' }],
          repair_org: [{ required: true, trigger: 'blur', message: '请输入维修机构' }],
          completed_date: [{ required: true, trigger: 'change', message: '请选择竣工时间' },{ validator: validate_date ,trigger: 'change'}],
        },
        selectloading: [],
				formLabelWidth: '100px',
				title: '',
        displaymanage: true
			}
		},
		created() {
			this.fetchData()
		},
		methods: {
      setoption(item)
      {
        this.form.device_name=item.split('^')[0] ;
        this.form.model=item.split('^')[1];
        this.form.scope=item.split('^')[2];
        this.form.precision=item.split('^')[3];
        this.form.device_id=item.split('^')[4];
      },
      display(item) {
        this.selectloading = true
        this.displaymanage = false
        this.form=item
        this.form.stop_days=Number(item.stop_days)
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      save()
      {
        let that=this;
        this.$refs['form'].validate(async (valid) => {
          if(valid)
          {
            let sData = '[Q]177{'+that.current_org+'$`'+that.form.device_id+'$`'+that.form.repair_date+'$`'+that.form.repair_type+'$`'
            +that.form.repair_main+'$`'+that.form.repair_method+'$`'+that.form.repair_situation+'$`'+that.form.repair_org+'$`'
            +that.form.completed_date+'$`'+that.form.remark+'}|^2|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('维修记录添加成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
              that.$emit('transferTable')
            }
            else
            {
              that.$baseMessage('维修记录添加失败', 'error')
            }
          }
          else {
            return false;
          }
        })
      },
      async fetchData() {
        this.selectloading = true
        let sData = '[Q]162{'+this.current_org+'}|^SYS'
        const res = await QueryExec(sData)
        if(res.data.length!==0)
        {
          res.data.forEach((item, index) => {
            item.alldata = item.device_name+'^'+item.model+'^'+item.scope+'^'+item.precision+'^'+item.device_id;
          })
        }
        console.log(sData)
        this.form.manage_pid_array = res.data
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      editsave()
      {
        let that=this;
        this.$refs['form'].validate(async (valid) => {
          if(valid)
          {
            let sData = '[Q]180{'+that.form.repair_date+'$`'+that.form.repair_type+'$`'+that.form.repair_main+'$`'
            +that.form.repair_method+'$`'+that.form.repair_situation+'$`'+that.form.repair_org+'$`'+that.form.completed_date+'$`'
            +that.form.remark+'$`'+that.form.repair_id+'}|^1|^SYS'
            const res = await ExecSql(sData)
            console.log(sData)
            if(res>0)
            {
              that.$baseMessage('维修记录编辑成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('维修记录编辑失败', 'error')
            }
          }
          else {
            return false;
          }
        })
      }
		},
	}
</script>

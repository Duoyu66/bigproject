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
        <el-form-item label="事故时间" prop="acc_date" :label-width="formLabelWidth" >
        	<el-date-picker
        	  v-model="form.acc_date"
        	  style="width: 100%;"
        	  type="date"
        	  placeholder="选择日期"
        	  format="yyyy 年 MM 月 dd 日"
        	  value-format="yyyy-MM-dd">
        	</el-date-picker>
        </el-form-item>
        <el-form-item label="破损情况" prop="situation" :label-width="formLabelWidth">
        	<el-input v-model="form.situation" style="width: 100%;" maxlength="64"></el-input>
        </el-form-item>
      	<el-form-item label="破损原因" prop="reason" :label-width="formLabelWidth">
      		<el-input v-model="form.reason" style="width: 100%;" type="textarea" maxlength="64"></el-input>
      	</el-form-item>
        <el-form-item label="停工天数" prop="stop_days" :label-width="formLabelWidth">
        	<el-input v-model.number="form.stop_days" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="leader" :label-width="formLabelWidth">
        	<el-input v-model="form.leader" style="width: 100%;" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="事故负责人" prop="liable_person" :label-width="formLabelWidth">
        	<el-input v-model="form.liable_person" style="width: 100%;" maxlength="8"></el-input>
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
      let validate_cycle = (rule, value, callback) => {
        let reg = /^[1-9]\d*$/
        if (!reg.test(value)) {
          callback(new Error('请输入正数'));
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
          acc_date:'',
					situation: '',
					reason: '',
					stop_days: '',
					leader: '',
					liable_person: '',
          trouble_id: ''
				},
        rules: {
          manage_pid: [{ required: true, trigger: 'change', message: '请选择管理编号' }],
          acc_date: [{ required: true, trigger: 'blur', message: '请选择事故日期' }],
          situation: [{ required: true, trigger: 'blur', message: '请输入破损情况' }],
          reason: [{ required: true, trigger: 'change', message: '请选择事故原因' }],
          stop_days: [{ required: true, trigger: 'blur', message: '请输入停工天数' },{ validator: validate_cycle ,trigger: 'blur'}],
          leader: [{ required: true, trigger: 'blur', message: '请输入负责人' }],
          liable_person: [{ required: true, trigger: 'blur', message: '请输入事故负责人' }],
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
      async fetchData() {
        this.selectloading = true
        let sData = '[Q]162{'+this.current_org+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData)
        if(res.data.length!==0)
        {
          res.data.forEach((item, index) => {
            item.alldata = item.device_name+'^'+item.model+'^'+item.scope+'^'+item.precision+'^'+item.device_id;
          })
        }
        this.form.manage_pid_array = res.data
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      display(item) {
        this.selectloading = true
        this.displaymanage = false
        console.log(item)
        this.form=item
        this.form.stop_days=Number(item.stop_days)
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displayadd(item) {
        this.selectloading = true
        this.displaymanage = false
        console.log(item)
        this.form=item
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
            let sData = '[Q]171{'+that.current_org+'$`'+that.form.device_id+'$`'+that.form.acc_date+'$`'+that.form.situation+'$`'
            +that.form.reason+'$`'+that.form.stop_days+'$`'+that.form.leader+'$`'+that.form.liable_person+'}|^2|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('事故添加成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
              this.$emit('transferTable')
            }
            else
            {
              that.$baseMessage('事故添加失败', 'error')
            }
          }
          else {
            return false;
          }
        })
      },
      editsave()
      {
        let that=this;
        this.$refs['form'].validate(async (valid) => {
          if(valid)
          {
            let sData = '[Q]173{'+that.form.acc_date+'$`'+that.form.situation+'$`'
            +that.form.reason+'$`'+that.form.stop_days+'$`'+that.form.leader+'$`'+that.form.liable_person+'$`'+that.form.trouble_id+'}|^1|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('事故编辑成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('事故编辑失败', 'error')
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

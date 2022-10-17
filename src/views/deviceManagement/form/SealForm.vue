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
        <el-form-item label="封存/启封类型" prop="seal_type" :label-width="formLabelWidth">
          <el-select v-model="form.seal_type" filterable placeholder="请输入或选择" style="width: 100%;" disabled>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封存/启封时间" prop="seal_date" :label-width="formLabelWidth" >
        	<el-date-picker
        	  v-model="form.seal_date"
        	  style="width: 100%;"
        	  type="date"
        	  placeholder="选择日期"
        	  format="yyyy 年 MM 月 dd 日"
        	  value-format="yyyy-MM-dd">
        	</el-date-picker>
        </el-form-item>
        <el-form-item label="封存/启封原因" prop="seal_reason" :label-width="formLabelWidth">
        	<el-input v-model="form.seal_reason" style="width: 100%;" maxlength="64"></el-input>
        </el-form-item>
      	<el-form-item label="状态" prop="seal_device_state" :label-width="formLabelWidth">
      		<el-input v-model="form.seal_device_state" style="width: 100%;" maxlength="16"></el-input>
      	</el-form-item>
        <el-form-item label="申请人" prop="seal_apply" :label-width="formLabelWidth">
        	<el-input v-model.number="form.seal_apply" style="width: 100%;" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="批准人" prop="seal_approve" :label-width="formLabelWidth">
        	<el-input v-model="form.seal_approve" style="width: 100%;" maxlength="8"></el-input>
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
			return {
				form: {
					manage_pid_array: [],
          manage_pid:'',
					device_name: '',
          device_id: '',
          model:'',
          scope:'',
					precision: '',
          seal_date:'',
					seal_reason: '',
					seal_device_state: '',
					seal_apply: '',
					seal_approve: '',
          seal_type: '',
          seal_id: ''
				},
        options: [{
          value: '1',
          label: '封存'
        }, {
          value: '0',
          label: '启封'
        }],
        rules: {
          manage_pid: [{ required: true, trigger: 'change', message: '请选择管理编号' }],
          //seal_type: [{ required: true, trigger: 'change', message: '请选择封存/启封类型' }],
          seal_date: [{ required: true, trigger: 'change', message: '请选择封存/启封日期' }],
          seal_reason: [{ required: true, trigger: 'blur', message: '请输入封存/启封原因' }],
          seal_device_state: [{ required: true, trigger: 'blur', message: '请输入设备状态' }],
          seal_apply: [{ required: true, trigger: 'blur', message: '请输入申请人' }],
          seal_approve: [{ required: true, trigger: 'blur', message: '请输入批准人' }],
        },
        selectloading: [],
				formLabelWidth: '120px',
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
        this.form.device_state=item.split('^')[5];
        console.log(item)
        if(this.form.device_state==='0')
        {
          this.options=[{value: '1',label: '封存'}]
          this.form.seal_type='1'
        }
        else if(this.form.device_state==='1')
        {
          this.options=[{value: '0',label: '启封'}]
          this.form.seal_type='0'
        }

      },
      async fetchData() {
        this.selectloading = true
        let sData = '[Q]162{'+this.current_org+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData)
        if(res.data.length!==0)
        {
          res.data.forEach((item, index) => {
            item.alldata = item.device_name+'^'+item.model+'^'+item.scope+'^'+item.precision+'^'+item.device_id+'^'+item.device_state;
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
            let sData = '[Q]200{'+that.current_org+'$`'+that.form.device_id+'$`'+that.form.seal_type+'$`'+that.form.seal_date+'$`'+that.form.seal_reason+'$`'
            +that.form.seal_device_state+'$`'+that.form.seal_apply+'$`'+that.form.seal_approve+'}|^2|^SYS'
            const res = await ExecSql(sData)
            if(res>0)
            {
              let sData1 = '[Q]201{'+that.form.seal_type+'$`'+that.form.device_id+'}|^1|^SYS'
              const res1 = await ExecSql(sData1)
              if(res1>0)
              {
                that.$baseMessage('封存/启封记录添加成功', 'success')
                that.$refs['form'].clearValidate()
                that.$emit('close_comp')
                that.$emit('transferTable')
              }
              else{
                that.$baseMessage('封存/启封记录添加失败', 'error')
              }
            }
            else
            {
              that.$baseMessage('封存/启封记录添加失败', 'error')
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
            let sData = '[Q]203{'+that.form.seal_date+'$`'+that.form.seal_reason+'$`'
            +that.form.seal_device_state+'$`'+that.form.seal_apply+'$`'+that.form.seal_approve+'$`'+that.form.seal_id+'}|^1|^SYS'
            const res = await ExecSql(sData)
            console.log(sData)
            if(res>0)
            {
              that.$refs['form'].clearValidate()
              that.$baseMessage('封存/启封记录编辑成功', 'success')

              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('封存/启封记录编辑失败', 'error')
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

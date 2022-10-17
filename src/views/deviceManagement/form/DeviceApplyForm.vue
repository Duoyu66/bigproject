<template>
	<span class="purchasefrom">
      <el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
      	<el-form-item label="管理编号" prop="manage_pid" :label-width="formLabelWidth" >
      		<el-select v-model="form.manage_pid" filterable placeholder="请输入或选择" v-if="displaymanage" @change="setoption" style="width: 100%;">
            <el-option
              v-for="item in form.manage_pid_array"
              :key="item.device_id"
              :label="item.displaydata"
              :value="item.alldata">
            </el-option>
      		</el-select>
        	<el-input v-model="form.manage_pid" style="width: 100%;" v-else disabled></el-input>
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
        <el-form-item label="申请原因" prop="reason" :label-width="formLabelWidth" >
        	<el-input v-model="form.reason" style="width: 100%;" type="textarea" maxlength="128" :autosize="{ minRows: 4, maxRows: 8}" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="apply_people" :label-width="formLabelWidth">
        	<el-input v-model="form.apply_people" style="width: 100%;" maxlength="8"></el-input>
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
          apply_people:'',
					reason: '',
          org_id: '',

				},
        rules: {
          manage_pid: [{ required: true, trigger: 'change', message: '请选择管理编号' }],
          reason: [{ required: true, trigger: 'blur', message: '请输入申请人' }],
          apply_people: [{ required: true, trigger: 'blur', message: '请输入申请原因' }],
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
        this.form.org_id=item.split('^')[5];
      },
      async fetchData() {
        this.selectloading = true
        let sData = '[Q]205{'+this.current_org+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(res)
        if(res.data.length!==0)
        {
          res.data.forEach((item, index) => {
            item.alldata = item.device_name+'^'+item.model+'^'+item.scope+'^'+item.precision+'^'+item.device_id+'^'+item.org_id;
            item.displaydata = item.device_name+'(管理编号'+item.manage_uid+';量程'+item.scope+';精度'+item.precision+')'
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
            let sData = '[Q]206{'+that.current_org+'$`'+that.form.device_id+'$`'+that.form.org_id+'$`'+that.current_org+'$`'
            +that.form.reason+'$`'+that.form.apply_people+'$`1}|^2|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('设备申请添加成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('设备申请添加失败', 'error')
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
            return false
          }
        })
      }
		},
	}
</script>

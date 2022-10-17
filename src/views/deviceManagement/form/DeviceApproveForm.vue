<template>
	<span class="purchasefrom">
      <el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
      	<el-form-item label="管理编号" prop="manage_pid" :label-width="formLabelWidth" >
      		<el-select v-model="form.manage_pid" filterable placeholder="请输入或选择" v-if="displaymanage" @change="setoption" style="width: 100%;">
            <el-option
              v-for="item in form.manage_pid_array"
              :key="item.device_id"
              :label="item.manage_pid"
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
        <el-form-item label="源自机构" :label-width="formLabelWidth">
        	<el-input v-model="form.from_org" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="目标机构" :label-width="formLabelWidth">
        	<el-input v-model="form.to_org" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请原因" prop="reason" :label-width="formLabelWidth" >
        	<el-input v-model="form.reason" style="width: 100%;" type="textarea" maxlength="128" :autosize="{ minRows: 4, maxRows: 8}" show-word-limit disabled></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="apply_people" :label-width="formLabelWidth">
        	<el-input v-model="form.apply_people" style="width: 100%;" maxlength="64" disabled></el-input>
        </el-form-item>
        <el-form-item label="审批结果" prop="approve_result" :label-width="formLabelWidth" >
        	<el-select v-model="form.approve_result" filterable placeholder="请输入或选择" style="width: 100%;">
        	  <el-option
        	    v-for="item in item_options"
        	    :key="item.item_id"
        	    :label="item.item_name"
        	    :value="item.item_id">
        	  </el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="审批人" prop="approve_person" :label-width="formLabelWidth">
        	<el-input v-model="form.approve_person" style="width: 100%;" maxlength="16"></el-input>
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
        displaymanage: true,
        item_options: [
          {
            "item_name":"同意","item_id":"0",
          },
          {
            "item_name":"否决","item_id":"1"
          },
        ],
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
        if(res.data.length!==0)
        {
          res.data.forEach((item, index) => {
            item.alldata = item.device_name+'^'+item.model+'^'+item.scope+'^'+item.precision+'^'+item.device_id+'^'+item.org_id;
          })
        }
        console.log(sData)
        this.form.manage_pid_array = res.data
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      display(item) {
        this.selectloading = true
        this.displaymanage = false
        this.form=item
        console.log(item)
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
            let sData = '[Q]294{'+that.form.approve_result+'$`'+that.form.approve_person+'$`'+that.form.allot_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('设备审批成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('设备审批失败', 'error')
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

<template>
	<span class="purchasefrom">
    <el-form :model="form" :rules="rules" ref="form" v-loading="formloading">
      <el-form-item label="客户名称" :label-width="formLabelWidth">
      	<el-input v-model="form.customer_name" style="width: 100%;" readonly></el-input>
      </el-form-item>
      <el-form-item label="合同名称" :label-width="formLabelWidth">
      	<el-input v-model="form.contract_name" style="width: 100%;" readonly></el-input>
      </el-form-item>
      <el-form-item label="合同编号" :label-width="formLabelWidth">
      	<el-input v-model="form.contract_no" style="width: 100%;" readonly></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact_name" :label-width="formLabelWidth">
      	<el-select v-model="form.contact_id" style="width: 100%" filterable placeholder="请选择">
      	  <el-option
      	    v-for="item in contact_name_options"
      	    :key="item.contact_id"
      	    :label="item.contact_name"
      	    :value="item.contact_id">
      	  </el-option>
      	</el-select>
      </el-form-item>
      <el-form-item label="实施人" prop="user_name" :label-width="formLabelWidth">
      	<el-input v-model="form.user_name" style="width: 100%;" maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contact_way" :label-width="formLabelWidth">
      	<el-select v-model="form.contact_way" style="width: 100%" filterable placeholder="请选择">
      	  <el-option
      	    v-for="item in contact_way_options"
      	    :key="item.contact_way"
      	    :label="item.contact_way"
      	    :value="item.contact_way">
      	  </el-option>
      	</el-select>
      </el-form-item>
      <el-form-item label="联系日期" prop="create_time1" :label-width="formLabelWidth">
      	<el-date-picker
      	  v-model="form.create_time1"
      	  style="width: 100%;"
      	  type="datetime"
      	  placeholder="选择时间"
          format="yyyy年MM月dd日 HH时mm分ss秒"
      	  value-format="yyyy-MM-dd HH:mm:ss">
      	</el-date-picker>
      </el-form-item>
<!--      <el-form-item label="下次联系日期" prop="next_time1" :label-width="formLabelWidth">
      	<el-date-picker
      	  v-model="form.next_time1"
      	  style="width: 100%;"
      	  type="datetime"
      	  placeholder="选择时间"
          format="yyyy年MM月dd日 HH时mm分ss秒"
      	  value-format="yyyy-MM-dd HH:mm:ss">
      	</el-date-picker>
      </el-form-item> -->
    	<el-form-item label="联系事由" prop="reason" :label-width="formLabelWidth">
    		<el-input v-model="form.reason" style="width: 100%;" type="textarea" maxlength="255"></el-input>
    	</el-form-item>
<!--      <el-form-item label="联系结果" prop="result" :label-width="formLabelWidth">
      	<el-input v-model="form.result" style="width: 100%;" type="textarea" maxlength="255"></el-input>
      </el-form-item> -->
      <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
      	<el-input v-model="form.remarks" style="width: 100%;" type="textarea" maxlength="255"></el-input>
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

  //合同扫描件
  import contractimageupload from '@/components/Upload/upload'

	export default {
		name: 'TableEdit',
    components: {
      contractimageupload
    },
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
        user_name: 'user/username'
    	}),
    },
		data() {
      var validate_email = (rule, value, callback) => {
        let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (value!=='' && !reg.test(value)) {
          callback(new Error('请输入正确电子邮箱地址'));
        } else {
          callback();
        }
      };
      var validate_QQ = (rule, value, callback) => {
        let reg = /[1-9][0-9]{4,}/
        if (value!=='' && !reg.test(value)) {
          callback(new Error('请输入正确qq号码'));
        } else {
          callback();
        }
      };
      var validate_mobile = (rule, value, callback) => {
        let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
			return {
        contact_way_options: [
          { "contact_way": "电话"},
          { "contact_way": "微信"},
          { "contact_way": "QQ"},
          { "contact_way": "短信"},
        ],
        contact_name_options: [],
				form: {
					customer_id:'',
          contact_id: '',
          contract_id: '',
					customer_name: '',
          contract_name: '',
          contract_no: '',
          contact_name: '',
          user_name: '',
          contact_way: '',
          create_time1: '',
          next_time1: '',
          reason: '',
          result: '',
          remarks: '',
          history_id: '',
          history_type: '0'
				},
        formloading: true,

        rules: {
          contact_id: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
          mobile: [{ validator: validate_mobile, trigger: 'blur' }],
          email: [{ validator: validate_email, trigger: 'blur' }],
          QQ: [{ validator: validate_QQ, trigger: 'blur'}],
        },
        span:12,
				formLabelWidth: '100px',
				title: '',
			}
		},
		created() {

		},
		methods: {
      async setContactNameOptions(value) {
        let sData = '[Q]235{'+value+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(res)
        this.contact_name_options = res.data
      },
      display(item) {
        this.formloading = true
        this.displaymanage = false
        this.setContactNameOptions(item.customer_id)
        this.form.user_name=this.user_name
        this.form.customer_name=item.customer_name
        this.form.contract_name=item.contract_name
        this.form.contract_no=item.contract_no
        this.form.contract_id=item.contract_id
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },
      displayEdit(item) {
        this.formloading = true
        this.displaymanage = false
        this.$refs['form'].clearValidate()
        this.form = item
        this.form.contact_name = item.name

        this.setContactNameOptions(item.customer_id)
        this.form.create_time1 = item.create_time1.toString()
        this.form.next_time1 = item.next_time1.toString()
        console.log(this.form.contact_name)
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },
      save() {
        let that=this
      	that.$refs['form'].validate(async (valid) => {
      		if (valid) {
            let sData = '[Q]234{'+that.form.reason+'$`'+that.form.result+'$`'+that.form.contact_id+'$`'+that.form.create_time1+'$`'
            +that.form.next_time1+'$`'+that.form.user_name+'$`'+that.form.remarks+'$`'+that.form.contract_id+'$`'+that.form.contact_way+'$`'+that.form.history_type+'}|^2|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('联系记录添加成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('联系记录添加失败', 'error')
            }
          }
        })
      },
      editsave() {
        let that=this
      	that.$refs['form'].validate(async (valid) => {
      		if (valid) {
            let sData = '[Q]355{'+that.form.reason+'$`'+that.form.result+'$`'+that.form.contact_id+'$`'+that.form.create_time1+'$`'
            +that.form.next_time1+'$`'+that.form.user_name+'$`'+that.form.remarks+'$`'+that.form.contact_way+'$`'+that.form.history_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('联系记录修改成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('联系记录修改失败', 'error')
            }
          }
        })
      }
		},
	}
</script>

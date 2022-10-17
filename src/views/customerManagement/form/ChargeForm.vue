<template>
	<span class="purchasefrom">
    <el-form :model="form" :rules="rules" ref="form" v-loading="formloading">
      <el-form-item label="客户名称" :label-width="formLabelWidth">
      	<el-input v-model="form.customer_name" style="width: 100%;" disabled></el-input>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="contact_name" :label-width="formLabelWidth">
      	<el-input v-model="form.contact_name" style="width: 100%;" maxlength="16"></el-input>
      </el-form-item>
    	<el-form-item label="联系人职务" prop="duty" :label-width="formLabelWidth">
    		<el-input v-model="form.duty" style="width: 100%;" type="textarea" maxlength="16"></el-input>
    	</el-form-item>
      <el-form-item label="手机" prop="mobile" :label-width="formLabelWidth">
      	<el-input v-model.number="form.mobile" style="width: 100%;" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email" :label-width="formLabelWidth">
      	<el-input v-model="form.email" style="width: 100%;" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="qq" prop="QQ" :label-width="formLabelWidth">
      	<el-input v-model="form.QQ" style="width: 100%;" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="微信" prop="WeChat" :label-width="formLabelWidth">
      	<el-input v-model="form.WeChat" style="width: 100%;" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="负责事务" prop="Responsible" :label-width="formLabelWidth">
      	<el-input v-model="form.Responsible" style="width: 100%;" maxlength="64"></el-input>
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
				form: {
					customer_id:'',
          contact_id: '',
					customer_name: '',
          contact_name: '',
          duty: '',
          mobile: '',
          email: '',
          WeChat: '',
          QQ: '',
          Responsible: '',


				},
        formloading: true,

        rules: {
          contact_name: [{ required: true, trigger: 'blur', message: '请输入联系人姓名' }],
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
      display(item) {
        this.formloading = true
        this.displaymanage = false
        this.form.customer_name=item.name
        this.form.customer_id=item.customer_id
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },
      displayEdit(item) {
        this.formloading = true
        this.displaymanage = false
        this.form = item
        this.form.contact_name = item.name
        console.log(this.form.contact_name)
        setTimeout(() => {
          this.formloading = false
        }, 500)
      },
      save() {
        let that=this
      	that.$refs['form'].validate(async (valid) => {
      		if (valid) {
            let sData = '[Q]215{'+that.form.customer_id+'$`'+that.form.contact_name+'$`'+that.form.duty+'$`'
            +that.form.mobile+'$`'+that.form.email+'$`'+that.form.QQ+'$`'+that.form.WeChat+'$`'
            +that.form.Responsible+'}|^2|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('联系人添加成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('联系人添加失败', 'error')
            }
          }
        })
      },
      editsave() {
        let that=this
      	that.$refs['form'].validate(async (valid) => {
      		if (valid) {
            let sData = '[Q]217{'+that.form.contact_name+'$`'+that.form.duty+'$`'
            +that.form.mobile+'$`'+that.form.email+'$`'+that.form.WeChat+'$`'+that.form.QQ+'$`'
            +that.form.Responsible+'$`'+that.form.contact_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('联系人修改成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('联系人修改失败', 'error')
            }
          }
        })
      }
		},
	}
</script>

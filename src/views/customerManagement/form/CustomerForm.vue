<template>
  <span class="purchasefrom">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="客户名称" prop="customer_name" :label-width="formLabelWidth">
        <el-input v-model="form.customer_name" style="width: 100%" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item
        label="客户住址"
        prop="address"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.address" style="width: 100%" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item
        label="客户邮编"
        prop="post_code"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.post_code" style="width: 100%" maxlength="8"></el-input>
      </el-form-item>
      <el-form-item label="开户银行" prop="bank" :label-width="formLabelWidth">
        <el-select v-model="form.bank" style="width: 100%">
          <el-option label="中国建设银行" value="中国建设银行"></el-option>
          <el-option label="中国农业银行" value="中国农业银行"></el-option>
          <el-option label="中国工商银行" value="中国工商银行"></el-option>
          <el-option label="中国银行" value="中国银行"></el-option>
          <el-option label="招商银行" value="招商银行"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="银行账号"
        prop="account"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.account" style="width: 100%" maxlength="24"></el-input>
      </el-form-item>
      <el-form-item
        label="信用代号"
        prop="license_id"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.license_id" style="width: 100%" maxlength="24"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="liaison" :label-width="formLabelWidth" >
        <el-input v-model="form.liaison" style="width: 100%" maxlength="8"></el-input>
      </el-form-item>
      <el-form-item
        label="联系电话"
        prop="telphone"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.telphone" style="width: 100%" maxlength="16"></el-input>
      </el-form-item>

      <el-form-item
        label="客户状态"
        prop="status"
        :label-width="formLabelWidth"
      >
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="在线" value="0"></el-option>
          <el-option label="不在线" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="客户级别"
        prop="sign_evel"
        :label-width="formLabelWidth"
      >
        <el-select v-model="form.sign_evel" style="width: 100%">
          <el-option label="签约" value="签约"></el-option>
          <el-option label="临时" value="临时"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="客户类型"
        prop="customer_type"
        :label-width="formLabelWidth"
      >
        <el-select v-model="form.customer_type" style="width: 100%" filterable placeholder="请选择客户类型">
          <el-option
            v-for="item in customer_type_options"
            :key="item.item_id"
            :label="item.item_name"
            :value="item.item_id">
          </el-option>
        </el-select>
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
  name: 'CustomerFrom',
  // inject: ['reload2'],
  props: { //props列表
    father: {
      type: Object,
      required: false
    }
  },
  data() {
    var validate_mobile = (rule, value, callback) => {
      let reg = /^1\d{10}$/
      if (!reg.test(value) && value !== '') {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };
    return {
      form: {
        customer_id: '',
        customer_name: '',
        address: '',
        telphone: '',
        post_code: '',
        license_id: '',
        bank: '',
        account: '',
        status: '',
        sign_evel: '',
        license_image: '',
        org_id: '',
        liaison: '',
        customer_id: '',

      },
      customer_type_options: [],
      rules: {
        select: [{
          required: true,
          trigger: ["blur", "change"],
          message: '请选中'
        }

        ],
        customer_name: [{
          required: true,
          trigger: 'blur',
          message: '请输入客户名'
        }],
        telphone: [{ validator: validate_mobile, trigger: 'blur' }],
        status: [{
          required: true,
          trigger: 'change',
          message: '请选择客户状态'
        }],
        sign_evel: [{
          required: true,
          trigger: 'change',
          message: '请选择客户登记'
        }],
        customer_type: [{
          required: true,
          trigger: 'change',
          message: '请选择客户类型'
        }],

      },
      formLabelWidth: '120px',
      title: '',
    }
  },
  created() {
    if (this.father) {
      this.form = Object.assign({}, this.father)
    }
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      current_org: 'org/current_org',
      person_id: 'user/person_id'
    }),
  },
  methods: {
    async fetchData() {
      let sData1 = '[Q]676{客户类型}|^SYS'
      const res1 = await QueryExec(sData1)
      res1.data.forEach((item, index) => {
        item.item_id=(index+1)
      })
      this.customer_type_options = res1.data
    },
    display(item) {
      this.selectloading = true
      this.displaymanage = false

      console.log(item)
      this.form=item
      setTimeout(() => {
        this.selectloading = false
      }, 500)
    },
    save() {
      let that = this
      console.log(that.form);
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let sData = '[Q]10{'+that.form.customer_name+'$`'+that.form.address+'$`'+that.form.telphone+'$`'+that.form.post_code+'$`'
          +that.form.license_id+'$`'+that.form.bank+'$`'+that.form.account+'$`'+that.form.status+'$`'+that.form.sign_evel+'$`'
          +that.current_org+'$`'+that.form.liaison+'$`'+that.form.customer_type+'}|^2|^SYS'
          console.log(sData)
          const res = await ExecSql(sData)
          if(res>0)
          {
            that.$baseMessage('客户添加成功', 'success')
            that.$refs['form'].resetFields()
            that.$emit('close_comp')
            that.$emit('transferTable')
          }
          else
          {
            that.$baseMessage('客户添加失败', 'error')
          }
        } else {
          return false
        }
      })
    },
    editsave() {
      let that = this
      console.log(that.form);
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let sData = '[Q]11{'+that.form.customer_name+'$`'+that.form.address+'$`'+that.form.telphone+'$`'+that.form.post_code+'$`'
          +that.form.license_id+'$`'+that.form.bank+'$`'+that.form.account+'$`'+that.form.status+'$`'+that.form.sign_evel+'$`'
          +that.form.liaison+'$`'+that.form.customer_id+'$`'+that.form.customer_type+'}|^1|^SYS'
          console.log(sData)
          const res = await ExecSql(sData)
          if(res>0)
          {
            that.$baseMessage('客户修改成功', 'success')
            that.$refs['form'].resetFields()
            that.$emit('close_comp')
          }
          else
          {
            that.$baseMessage('客户修改失败', 'error')
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>

<template>
	<span class="purchasefrom">
      <el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
<!--        <el-form-item label="客户名称" prop="customer_name" :label-width="formLabelWidth" >
        	<el-input v-model="form.data_id" style="width: 100%;" v-if="displayEntrust" disabled></el-input>
          <el-select v-model="form.object_id" v-else style="width: 100%" filterable placeholder="请选择试验名称">
            <el-option
              v-for="item in customer_name_options"
              :key="item.object_id"
              :label="item.object_name"
              :value="item.object_id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="合同编号" prop="contract_name" :label-width="formLabelWidth" >
        	<el-input v-model="form.contract_no" style="width: 100%;" v-if="displayContract" disabled></el-input>
          <el-select v-model="form.contract_no" v-else style="width: 100%" @change="contractchange"  filterable placeholder="请选择合同编号">
            <el-option
              v-for="item in contract_name_options"
              :key="item.contract_id"
              :label="item.contract_no"
              :value="item.contract_record">
            </el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item :label="data_name" prop="object_id" :label-width="formLabelWidth" >
        	<el-input v-model="form.order_id" style="width: 100%;" v-if="displayEntrust" disabled></el-input>
          <el-select v-model="form.object_id" v-else style="width: 100%" filterable placeholder="请选择试验名称">
            <el-option
              v-for="item in object_name_options"
              :key="item.object_id"
              :label="item.object_name"
              :value="item.object_id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="付款时间" prop="pay_time" :label-width="formLabelWidth">
      		<el-date-picker
      		  v-model="form.pay_time"
            style="width: 100%;"
      		  type="date"
      		  placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
      		</el-date-picker>
        </el-form-item>
        <el-form-item label="付款人" prop="payee" :label-width="formLabelWidth">
        	<el-input v-model="form.payee" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="amount" :label-width="formLabelWidth">
        	<el-input v-model="form.amount" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="付款类型" prop="channel" :label-width="formLabelWidth" v-if="!displayEntrust">
        	<el-select v-model="form.channel" style="width: 100%;">
        		<el-option label="现金" value="现金"></el-option>
            <el-option label="预付" value="预付"></el-option>
            <el-option label="支票" value="支票"></el-option>
            <el-option label="电子转账" value="电子转账"></el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="付款类型" :label-width="formLabelWidth" v-else>
        	<el-input v-model="form.channel" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="事由" :label-width="formLabelWidth">
        	<el-input v-model="form.memo" style="width: 100%;"></el-input>
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
		data() {
      var validate_receipt_cost = (rule, value, callback) => {
        let reg = /^((([^0][0-9]+|0)\.([0-9]{1,4}))$)|^(([1-9]+)\.([0-9]{1,4})$)/
        let reg1 = /^(([^0][0-9]+|0)$)|^(([1-9]+)$)/
        if (!reg.test(value) && !reg1.test(value)) {
          callback(new Error('请输入正确的金额'));
        } else {
          callback();
        }
      };
			return {
        displayEntrust: true,
        displayContract: true,
        data_name: '',
				form: {
          data_id: '',
          channel:'',
					payee: '',
          amount: '',
          channel: '',
          memo: '',
          pay_time: '',
          customer_id: '',
          contract_id: '',
          contract_no: '',
          receivable_id: '',
          receive_id: '',
          object_id: '',
          order_id: ''
				},
        customer_name_options: [],
        object_name_options:[],
        contract_name_options: [],
        amountRe: '',
        rules: {
          invoice_no: [{ required: true, trigger: 'blur', message: '请输入发票编号' }],
          pay_time: [{ required: true, trigger: 'change', message: '请选择付款日期' }],
          // contract_name: [{ required: true, trigger: 'blur', message: '请选择合同编号' }],
          // object_id: [{ required: true, trigger: 'blur', message: '请选择试验' }],
          payee: [{ required: true, trigger: 'blur', message: '请输入付款人' }],
          amount: [{ required: true, trigger: 'change', message: '请输入金额' },{ validator: validate_receipt_cost, trigger: 'blur' }],
        },
				formLabelWidth: '120px',
        selectloading: true,
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
    	}),
    },
		methods: {
      display(item) {
        this.selectloading = true
        this.displayContract = true
        this.displayEntrust = false
        this.data_name = '试验名称'
        console.log(item)
        this.form.customer_id=item.customer_id
        this.form.contract_id=item.contract_id
        this.form.contract_no=item.contract_no
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      contractchange(val) {
        console.log(val)
        this.form.contract_name = val.split('^')[2]
        this.form.contract_id = val.split('^')[1]
        this.form.customer_id = val.split('^')[0]
      },
      displayAdd(item) {
        this.selectloading = true
        this.displayEntrust = true
        this.displayContract = true
        console.log(item)
        this.data_name = '委托编号'
        this.form.order_id=item.order_id
        this.form.channel=item.pay_channel
        this.form.customer_id=item.customer_id
        this.form.contract_id=item.contract_id
        this.form.contract_no=item.contract_no
        this.form.receivable_id=item.receivable_id
        this.form.object_id=item.object_id

        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displayEdit(item) {
        this.selectloading = true
        this.displayContract = true
        this.displayEntrust = false
        this.data_name = '试验名称'
        this.form = item
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displayReEdit(item) {
        this.selectloading = true
        this.displayEntrust = true
        this.data_name = '委托编号'
        this.form = item
        this.amountRe=item.amount
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      async fetchData() {
        this.selectloading = true
        this.displayEntrust = false
        this.displayContract = false
        this.data_name = '试验名称'
        let sData = '[Q]349{}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData)
        this.object_name_options = res.data
        // this.data_name = '客户名称'
        // let sData = '[Q]349{}|^SYS'
        // const res = await QueryExec(sData)
        // console.log(sData)
        // this.customer_name_options = res.data

        let sDataContract = '[Q]386{'+this.current_org+'}|^SYS'
        const resContract = await QueryExec(sDataContract)
        console.log(sDataContract)
        this.contract_name_options = resContract.data
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      save() {
        let that = this
        console.log(that.form);
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let sData = '[Q]351{'+that.current_org+'$`'+that.form.receivable_id+'$`'+that.form.customer_id+'$`'+that.form.contract_id+'$`'
            +that.form.payee+'$`'+that.form.amount+'$`'+that.form.channel+'$`'+that.form.pay_time+'$`'+that.form.memo+'$`'+that.form.object_id+'}|^2|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              let sData2 = '[Q]225{'+that.form.amount+'$`'+that.form.receivable_id+'}|^1|^SYS'
              const res2 = await ExecSql(sData2)
              if(res2>0)
              {
                that.$baseMessage('付款添加成功', 'success')
                that.$refs['form'].clearValidate()
                that.$emit('close_comp')
                that.$emit('transferTable')
              }
              else
              {
                that.$baseMessage('付款添加失败', 'error')
              }
            }
            else
            {
              that.$baseMessage('付款添加失败', 'error')
            }
          } else {
            return false
          }
        })
      },
      addsave() {
        let that = this
        console.log(that.form);
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let sData = '[Q]351{'+that.current_org+'$`'+that.form.receivable_id+'$`'+that.form.customer_id+'$`'+that.form.contract_id+'$`'
            +that.form.payee+'$`'+that.form.amount+'$`'+that.form.channel+'$`'+that.form.pay_time+'$`'+that.form.memo+'$`'+that.form.object_id+'}|^2|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('付款添加成功', 'success')
              that.$refs['form'].resetFields()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('付款添加失败', 'error')
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
            let sData = '[Q]227{'+that.form.payee+'$`'+that.form.amount+'$`'+that.form.channel+'$`'+that.form.pay_time+'$`'
            +that.form.memo+'$`'+that.form.receive_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0 && that.form.receivable_id)
            {
              that.$baseMessage('付款添加成功', 'success')
              that.$refs['form'].clearValidate()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('付款添加失败', 'error')
            }
          } else {
            return false
          }
        })
      },
      editresave() {
        let that = this
        console.log(that.form);
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let sData = '[Q]227{'+that.form.payee+'$`'+that.form.amount+'$`'+that.form.channel+'$`'+that.form.pay_time+'$`'
            +that.form.memo+'$`'+that.form.receive_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              let sData2 = '[Q]228{'+this.amountRe+'$`'+that.form.amount+'$`'+that.form.receivable_id+'}|^1|^SYS'
              const res2 = await ExecSql(sData2)
              if(res2>0)
              {
                that.$baseMessage('收款添加成功', 'success')
                that.$refs['form'].clearValidate()
                that.$emit('close_comp')
              }
              else
              {
                that.$baseMessage('收款添加失败', 'error')
              }
            }
            else
            {
              that.$baseMessage('收款添加失败', 'error')
            }
          } else {
            return false
          }
        })
      },
		},
	}
</script>

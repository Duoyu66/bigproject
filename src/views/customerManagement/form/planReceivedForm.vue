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

        <el-form-item label="预计进款(万)" prop="plan_amount" :label-width="formLabelWidth">
        	<el-input v-model="form.plan_amount" style="width: 100%;"></el-input>
        </el-form-item>
<!--        <el-form-item label="保证进款(万)" prop="protectamount" :label-width="formLabelWidth">
        	<el-input v-model="form.protectamount" style="width: 100%;"></el-input>
        </el-form-item> -->


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
  import {
  	TreeDataDeal,
    TreeDataDealEx
  } from '@/global/tree_deal'
  import {
  	ViewfileUrl,
  	UploadFileNameUrl
  } from '@/utils/servicefile'
  import TreeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'


  const simulateAsyncOperation = fn => {
    setTimeout(fn, 2000)
  }
	export default {
		name: 'TableEdit',
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
    components: {
    	TreeSelect
    },
		data() {
      var validate_receipt_cost = (rule, value, callback) => {
        let reg = /^((([^0][0-9]+|0)\.([0-9]{1,6}))$)|^(([1-9]+)\.([0-9]{1,6})$)/
        let reg1 = /^(([^0][0-9]+|0)$)|^(([1-9]+)$)/
        if (!reg.test(value) && !reg1.test(value)) {
          callback(new Error('请输入正确的金额'));
        } else {
          callback();
        }
      };
      var validate_count = (rule, value, callback) => {
        let reg = /^\d{0,9}$/
        console.log(value)
        if (!reg.test(value)) {
          callback(new Error('请输入正确的数字x'));
        } else {
          callback();
        }
      };
      var validate_discount = (rule, value, callback) => {
        let reg = /^0\.\d*[1-9]\d*$/
        let reg1 = /1/
        if (!reg.test(value) && !reg1.test(value)) {
          callback(new Error('请输入小于1的小数或者1，来代表折扣'));
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
          pay_channel: '转账',
          memo: '',
          pay_time: '',
          customer_id: '',
          contract_id: '',
          contract_no: '',
          receivable_id: '',
          receive_id: '',
          object_id: '',
          order_id: '',
          count: '',
          unitprice: '',
          group_id: '0',
          discount: '1',
          charged_amt: '',
          object_id: '',
          valuation_id: '',
          receivable_time: '',
          protect_amount: '',
          plan_amount: '',
          year: '',
          planreceived_id: '',
				},
        customer_name_options: [],
        object_name_options:[],
        contract_name_options: [],
        search: {
          object_name: '',
          tpl_name: ''
        },
        amountRe: '',
        readonly: false,
        rules: {
          plan_amount: [{ validator: validate_receipt_cost, trigger: 'blur' },{ required: true, trigger: 'blur', message: '请输入金额' }],
          protect_amount: [{ validator: validate_receipt_cost, trigger: 'blur' }],
        },
				formLabelWidth: '120px',
        selectloading: true,
				title: '',
			}
		},
		created() {
			// if (this.father) {
			// 	this.form = Object.assign({}, this.father)
			// }
      this.fetchData()
		},
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
    	}),
    },
		methods: {
      display() {
        this.selectloading = true
        this.displayContract = false

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
        this.displayContract = true
        console.log(item)
        this.form.contract_id=item.contract_id
        this.form.contract_no=item.contract_no
        this.form.protect_amount=item.protect_amount
        if(this.form.plan_amount!='0')
        {
          this.form.plan_amount=item.plan_amount
        }

        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displayEdit(item) {
        this.selectloading = true
        this.displayContract = true
        console.log(item)
        this.form.contract_no=item.contract_no
        this.form = item
        console.log(this.form)
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
      async loadTree(group,id,parent_id) {
        let sData = '[Q]402{'+group+'}|^SYS'
        const res = await QueryExec(sData)
        const data = TreeDataDealEx(res.data, Number(group),id,parent_id,'hasChildren')
        if(res.data!=undefined)
        {
          res.data.forEach((item, index) => {
            item.children=null
          })
        }
        console.log(res)
        return data
      },
      async fetchData() {
        this.selectloading = true
        this.displayContract = false
        const data = await this.loadTree('0','id','p_id')
        console.log(data)
        this.object_name_options=data
        let sDataContract = '[Q]290{'+this.current_org+'}|^SYS'
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
        // that.form.amount = parseFloat(that.form.count) * parseFloat(that.form.unitprice)
        // that.form.charged_amt = parseFloat(that.form.count) * parseFloat(that.form.unitprice) * parseFloat(that.form.discount)

        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let sData = '[Q]845{'+that.current_org+'$`'+that.form.contract_id+'$`'+that.form.plan_amount+'$`'+that.form.protect_amount+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('力争进款添加成功', 'success')
              that.$refs['form'].resetFields()
              that.$emit('close_comp')
              that.$emit('transferTable')
            }
            else
            {
              that.$baseMessage('力争进款添加失败', 'error')
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
            let sData = '[Q]847{'+that.form.plan_amount+'$`'+that.form.protect_amount+'$`'+that.form.contract_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('力争进款修改成功', 'success')
              that.$refs['form'].resetFields()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('力争进款修改失败', 'error')
            }
          } else {
            return false
          }
        })
      },
		},
	}
</script>

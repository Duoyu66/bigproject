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
        	<tree-select :options="object_name_options" :multiple="false" :load-options="loadOptions"
        		:placeholder="isReadOnly('请选择调入机构...')" :disabled="readonly" v-model="form.object_id" />
        </el-form-item> -->
        <el-form-item label="计价时间" prop="receivable_time" :label-width="formLabelWidth">
      		<el-date-picker
      		  v-model="form.receivable_time"
            style="width: 100%;"
      		  type="date"
      		  placeholder="请输入此次计价时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
      		</el-date-picker>
        </el-form-item>
        <el-form-item label="计价金额(万)" prop="amount" :label-width="formLabelWidth">
        	<el-input v-model="form.amount" style="width: 100%;"></el-input>
        </el-form-item>
<!--        <el-form-item label="收款人" prop="payee" :label-width="formLabelWidth">
        	<el-input v-model="form.payee" maxlength="8" style="width: 100%;" placeholder="请输入收款人"></el-input>
        </el-form-item> -->
<!--        <el-form-item label="数量" prop="count"  :label-width="formLabelWidth">
        	<el-input v-model="form.count" maxlength="8" style="width: 100%;" placeholder="请输入数量"></el-input>
        </el-form-item>
        <el-form-item label="单价(元)" prop="unitprice" :label-width="formLabelWidth">
        	<el-input v-model="form.unitprice" maxlength="20" style="width: 100%;" placeholder="请输入单价"></el-input>
        </el-form-item>
        <el-form-item label="折扣" prop="discount" :label-width="formLabelWidth">
        	<el-input v-model="form.discount" maxlength="6" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="总金额" prop="amount" :label-width="formLabelWidth">
        	<el-input v-model="form.amount" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款类型" prop="pay_channel" :label-width="formLabelWidth">
        	<el-select v-model="form.pay_channel" style="width: 100%;">
        		<el-option label="现金" value="现金"></el-option>
            <el-option label="预付" value="预付"></el-option>
            <el-option label="支票" value="支票"></el-option>
            <el-option label="转账" value="转账"></el-option>
        	</el-select>
        </el-form-item> -->
<!--        <el-form-item label="事由" :label-width="formLabelWidth">
        	<el-input v-model="form.memo" style="width: 100%;"></el-input>
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
          receivable_time: ''
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
          invoice_no: [{ required: true, trigger: 'blur', message: '请输入发票编号' }],
          pay_time: [{ required: true, trigger: 'change', message: '请选择付款日期' }],
          // contract_name: [{ required: true, trigger: 'blur', message: '请选择合同编号' }],
          object_id: [{ required: true, trigger: 'change', message: '请选择试验' }],
          //receivable_time: [{ required: true, trigger: 'change', message: '请选择计价时间' }],
          count: [{ required: true, trigger: 'blur', message: '请输入数量' },{ validator: validate_count, trigger: 'blur' }],
          discount: [{ validator: validate_discount, trigger: 'blur' }],
          amount: [{ required: true, trigger: 'blur', message: '请输入金额' },{ validator: validate_receipt_cost, trigger: 'blur' }],
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
        this.displayEntrust = true
        this.displayContract = true
        console.log(item)
        this.form.contract_id=item.contract_id
        this.form.contract_no=item.contract_no
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      displayEdit(item) {
        this.selectloading = true
        this.displayContract = true
        this.displayEntrust = true
        console.log(item)
        this.form.contract_id=item.contract_id
        this.form.contract_no=item.contract_no
        this.form.receivable_time=item.date1
        this.form.amount=item.sumamount
        this.form.valuation_id=item.valuation_id
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
        this.displayEntrust = false
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
            let sData = '[Q]440{'+that.current_org+'$`'+that.form.contract_id+'$`'+that.form.receivable_time+'$`'+that.form.amount+'}|^2|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('验工计价添加成功', 'success')
              that.$refs['form'].resetFields()
              that.$emit('close_comp')
              that.$emit('transferTable')
            }
            else
            {
              that.$baseMessage('验工计价添加失败', 'error')
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
            let sData = '[Q]755{'+that.form.receivable_time+'$`'+that.form.amount+'$`'+that.form.valuation_id+'}|^1|^SYS'
            console.log(sData)
            const res = await ExecSql(sData)
            if(res>0)
            {
              that.$baseMessage('验工计价修改成功', 'success')
              that.$refs['form'].resetFields()
              that.$emit('close_comp')
            }
            else
            {
              that.$baseMessage('验工计价修改失败', 'error')
            }
          } else {
            return false
          }
        })
      },
		},
	}
</script>

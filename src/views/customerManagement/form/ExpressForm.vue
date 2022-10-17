<template>
	<span class="purchasefrom">
      <el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
        <el-form-item label="客户名称" :label-width="formLabelWidth">
        	<el-input v-model="form.customer_name" style="width: 100%;" readonly></el-input>
        </el-form-item>
        <el-form-item label="合同编号" :label-width="formLabelWidth">
        	<el-input v-model="form.contract_no" style="width: 100%;" readonly></el-input>
        </el-form-item>
        <el-form-item label="物品类型" prop="type" :label-width="formLabelWidth">
        	<el-select v-model="form.type" style="width: 100%" filterable placeholder="请选择">
        	  <el-option
        	    v-for="item in type_options"
        	    :key="item.type"
        	    :label="item.type"
        	    :value="item.type">
        	  </el-option>
        	</el-select>
        </el-form-item>
<!--        <el-form-item label="物品名称" :label-width="formLabelWidth">
        	<el-input v-model="form.post_name" style="width: 100%;"></el-input>
        </el-form-item> -->
        <el-form-item label="快递公司" :label-width="formLabelWidth">
          <el-autocomplete
            class="inline-input"
            style="width: 100%"
            v-model="form.express_company"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="快递编号" :label-width="formLabelWidth">
        	<el-input v-model="form.track_id" maxlength= '64' style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="邮寄地址" :label-width="formLabelWidth">
        	<el-input v-model="form.address" maxlength= '64' style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="发件人" :label-width="formLabelWidth">
        	<el-input v-model="form.sender" maxlength="16" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="收件人"  :label-width="formLabelWidth">
        	<el-input v-model="form.receiver" maxlength="16" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="收件电话" prop="telephone" :label-width="formLabelWidth">
        	<el-input v-model="form.telephone" maxlength="11" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="邮寄时间" prop="post_time" :label-width="formLabelWidth">
        	<el-date-picker
        	  v-model="form.post_time"
            style="width: 100%;"
        	  type="datetime"
        	  placeholder="选择时间"
            format="yyyy年MM月dd日 hh时mm分ss秒"
            value-format="yyyy-MM-dd hh:mm:ss">
        	</el-date-picker>
        </el-form-item>
        <el-form-item label="金额" prop="money" :label-width="formLabelWidth">
        	<el-input v-model="form.money" style="width: 100%;"></el-input>
        </el-form-item>
<!--        <el-form-item label="确认人" :label-width="formLabelWidth">
        	<el-input v-model="form.confirm_name" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="确认日期" :label-width="formLabelWidth">
        	<el-input v-model="form.confirm_date" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="确认结果" :label-width="formLabelWidth">
        	<el-input v-model="form.confirm_situation" type="textarea" style="width: 100%;"></el-input>
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
	export default {
		name: 'TableEdit',
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
		data() {
      var validate_receipt_file = (rule, value, callback) => {
        if (this.form.receipt==='') {
          callback(new Error('请上传发票扫描件'));
        } else {
          callback();
        }
      };
      var validate_receipt_cost = (rule, value, callback) => {
        let reg = /^((\-)?(([0-9]*)|(([0]\.\d{1,6}|[1-9][0-9]*\.\d{1,6}))))$/;
        if (value!=='' && !reg.test(value)) {
          callback(new Error('请输入正确的金额'));
        } else {
          callback();
        }
      };
      // var validate_tax_ratio = (rule, value, callback) => {
      //   let reg = /^(-?\d+)(\.\d+)?%$/
      //   if (value!=='' && !reg.test(value)) {
      //     callback(new Error('请输入正确的税率(带%符号)'));
      //   } else {
      //     callback();
      //   }
      // };
      var validate_mobile = (rule, value, callback) => {
        let reg = /^1\d{10}$/
        if (value!=='' && !reg.test(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
			return {

        type_options: [
          { "type": "发票"},
          { "type": "报告"},
          { "type": "合同"},
        ],
				form: {
          post_time: '',
          sender: '',
          contract_no: '',
          contract_name: '',
          contract_id: '',
          customer_id: '',
          customer_name: '',
          type: '',
          post_name: '',
          express_company: '',
          track_id: '',
          address: '',
          sender: '',
          receiver: '',
          telephone: '',
          money: '',
          express_id: ''
				},
        rules: {
          invoice_no: [{ required: true, trigger: 'blur', message: '请输入发票编号' }],
          invoice_date: [{ required: true, trigger: 'change', message: '请选择开票日期' }],
          type: [{ required: true, trigger: 'change', message: '请选择发票类型' }],
          money: [{ validator: validate_receipt_cost, trigger: 'blur' }],
          telephone: [{ validator: validate_mobile, trigger: 'blur' }],
          // tax_ratio: [{ required: true, trigger: 'change', message: '请输入税率' },{ validator: validate_tax_ratio, trigger: 'blur'}],
        },
				formLabelWidth: '90px',
				title: '',
        selectloading: '',
        restaurants: [],
			}
		},
    computed: {
    	...mapGetters({
    		current_org: 'org/current_org',
        username: 'user/username'
    	}),

    },
		created() {
			if (this.father) {
				this.form = Object.assign({}, this.father)
			}
      this.setUsername()
		},
		methods: {
      setUsername() {
        this.form.sender=this.username
      },

		  display(item) {
		    this.selectloading = true
		    this.displaymanage = false
		    console.log(this.form.post_time)
		    this.form.contract_no=item.contract_no
		    this.form.contract_name=item.contract_name
		    this.form.contract_id=item.contract_id
		    this.form.customer_id=item.customer_id
        this.form.customer_name=item.customer_name
		    setTimeout(() => {
		      this.selectloading = false
		    }, 500)
		  },
		  displayEdit(item) {
		    this.selectloading = true
		    this.displaymanage = false
		    console.log(item)
		    this.form=item
		    this.form.contract_no=item.contract_no
		    this.form.contract_name=item.contract_name
		    this.form.contract_id=item.contract_id
		    this.form.customer_id=item.customer_id
		    setTimeout(() => {
		      this.selectloading = false
		    }, 500)
		  },
		  save() {
		  	let that = this
		    console.log(that.form.receipt)
		  	that.$refs['form'].validate(async (valid) => {
		  		if (valid) {
		        let sData = '[Q]230{'+that.current_org+'$`'+that.form.customer_id+'$`'+that.form.address+'$`'+that.form.receiver+'$`'+that.form.telephone+'$`'
		        +that.form.post_time+'$`'+that.form.sender+'$`'+that.form.express_company+'$`'+that.form.track_id+'$`'+that.form.type
		        +'$`'+that.form.contract_id+'$`'+that.form.money+'}|^2|^SYS'
		        console.log(sData)
		        const res = await ExecSql(sData)
		        if (res > 0) {
		          that.$baseMessage('快递添加成功', 'success')
		          that.$refs['form'].resetFields()
		          that.$emit('close_comp')
              // that.$emit('transferTable')
		        } else {
		          that.$baseMessage('快递添加失败', 'error')
		        }
		      } else {
		        return false
		      }
		  	})

		  },
		  editsave() {
		  	let that = this
		    console.log(that.form.receipt)
		  	that.$refs['form'].validate(async (valid) => {
		  		if (valid) {
		        let sData = '[Q]232{'+that.form.address+'$`'+that.form.telephone+'$`'+that.form.receiver+'$`'
            +that.form.post_time+'$`'+that.form.sender+'$`'+that.form.express_company+'$`'+that.form.track_id+'$`'+that.form.type
            +'$`'+that.form.money+'$`'+that.form.express_id+'}|^1|^SYS'
		        console.log(sData)
		        const res = await ExecSql(sData)
		        if (res > 0) {
		          that.$baseMessage('修改成功', 'success')
		          that.$refs['form'].resetFields()
		          that.$emit('close_comp')
		        } else {
		          that.$baseMessage('修改失败', 'error')
		        }
		      } else {
		        return false
		      }
		  	})

		  },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          { "value": "京东快递"},
          { "value": "中通快递"},
          { "value": "顺丰快递"},
          { "value": "圆通快递"},
          { "value": "韵达快递"},
          { "value": "申通快递"},
        ];
      },
      handleSelect(item) {

      },
		},
    mounted() {
      this.restaurants = this.loadAll();
    }
	}
</script>

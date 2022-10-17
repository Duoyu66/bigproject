<template>
  <span class="purchasefrom">
    <el-form :model="form" :rules="rules" ref="form" v-loading="selectloading">
      <el-form-item label="合同编号" prop="contract_no" :label-width="formLabelWidth">
        <el-select v-model="form.contract_no" v-if='displaymanage' style="width: 100%" @change="contractchange" filterable placeholder="请选择合同编号">
          <el-option
            v-for="item in contract_no_options"
            :key="item.contract_id"
            :label="item.contract_no"
            :value="item.contract_record">
          </el-option>
        </el-select>
      	<el-input v-model="form.contract_no" style="width: 100%;" v-else disabled></el-input>
      </el-form-item>
      <el-form-item label="合同名称" prop="contract_name" :label-width="formLabelWidth">
      	<el-input v-model="form.contract_name" style="width: 100%;" disabled></el-input>
      </el-form-item>
      <el-form-item label="发票代码" prop="invoice_no" :label-width="formLabelWidth">
      	<el-input v-model="form.invoice_no" maxlength= '64'  style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="开票日期" prop="invoice_date" :label-width="formLabelWidth">
      		<el-date-picker
      		  v-model="form.invoice_date"
            style="width: 100%;"
      		  type="date"
      		  placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
      		</el-date-picker>
      </el-form-item>
      <el-form-item label="付款日期" prop="billing_date" :label-width="formLabelWidth">
      		<el-date-picker
      		  v-model="form.billing_date"
            style="width: 100%;"
      		  type="date"
      		  placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
      		</el-date-picker>
      </el-form-item>
      <el-form-item label="开票人" prop="operator" :label-width="formLabelWidth">
      	<el-input v-model="form.operator" maxlength= '16'  style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="发票类型" prop="type" :label-width="formLabelWidth">
        <el-select v-model="form.type" style="width: 100%">
          <el-option label="普通发票" value="普通发票"></el-option>
          <el-option label="增值税专用发票" value="增值税专用发票"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额(万)" prop="amount" :label-width="formLabelWidth">
        <el-input v-model="form.amount" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="税率(%)" prop="tax_ratio" :label-width="formLabelWidth">
        <el-input v-model="form.tax_ratio" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="税金(万)" prop="tax" :label-width="formLabelWidth">
        <el-input v-model="form.tax" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="发票扫描件" prop="receipt" :label-width="formLabelWidth">
        <receiptupload ref="receipt" :tip_show="upload.tip_show"
        	:upload_type="upload.upload_type.receipt" :original_name_json="upload.original_name.receipt" :fileName="upload.fileName.receipt"
        	:type_str="upload.type_str" :type_array="upload.type_array"
        	:success_status.sync="upload.success.receipt" v-model="form.receipt"
        	:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.receipt">
        </receiptupload>
      </el-form-item>
    </el-form>
  </span>
</template>
<script>
  import {
  	mapActions,
  	mapGetters
  } from 'vuex'
	import {
		doEdit,
    ExecSql,
    QueryExec
	} from '@/api/table'
  import receiptupload from '@/components/Upload/uploadNameDivide'
  export default {
    name: 'TableEdit',
    props: { //props列表
      father: {
        type: Object,
        required: false
      }
    },
    components: {
      receiptupload,
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
        if (!reg.test(value)) {
          callback(new Error('请输入正确的金额'));
        } else {
          if(this.form.tax_ratio.length !== 0)
          {
            let taxratio = this.form.tax_ratio
            taxratio = taxratio.substr(0,taxratio.length-1)
            console.log(this.form.tax_ratio)
            this.form.tax = (parseFloat(taxratio)*0.01*parseFloat(value)).toFixed(4)
          }
          callback();
        }
      };
      var validate_tax_ratio = (rule, value, callback) => {
        let reg = /^(\d+)(\.\d+)?%$/
        if (value!=='' && !reg.test(value)) {
          callback(new Error('请输入正确的税率(带%符号)'));
        } else {
          if(this.form.amount !== '' && value !== '')
          {
            let amountmoney = this.form.amount
            let taxratio = value.substr(0,value.length-1)
            this.form.tax = (parseFloat(taxratio)*0.01*parseFloat(amountmoney)).toFixed(4)
          }
          callback();
        }
      };
      var validate_tax = (rule, value, callback) => {
        let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/;
        if (value!=='' && !reg.test(value)) {
          callback(new Error('请输入正确的金额'));
        } else {
          callback();
        }
      };
      var validate_billing_date = (rule, value, callback) => {
        let startdate = new Date(this.form.invoice_date)
        let enddate = new Date(value)
        if (startdate>enddate) {
          callback(new Error('开票日期应小于付款日期'));
        } else {
          callback();
        }
      };
      return {
        form: {
          contract_id: '',
          contract_name: '',
          contract_no: '',
          invoice_no: '',
          invoice_date: '',
          billing_date: '',
          operator: '',
          type: '',
          amount: '',
          tax_ratio: '',
          tax: '',
          receipt: '',
          customer_id: '',
          invoice_id: '',
          contract_record: ''
        },
        upload: {
          tip_show: false,
          delte_service: false,
          upload_type: {
            receipt: 18
          },
          type_str: 'jpg/pdf/png/jpeg',
          type_array: ['image/jpeg', 'image/png', 'application/pdf'],
          file_size: '4',
          size_unit: 'MB',
          original_name: {
            receipt: {}
          },
          success: {
            receipt: false
          },
          old_delete: {
            receipt: false
          },
          fill_data:{
            receipt:[]
          },
          fileName:{
            receipt:''
          }
        },
        rules: {
          // invoice_no: [{ required: true, trigger: 'blur', message: '请输入发票编号' }],
          // invoice_date: [{ required: true, trigger: 'change', message: '请选择开票日期' }],
          // type: [{ required: true, trigger: 'change', message: '请选择发票类型' }],
          amount: [{ required: true, trigger: 'change', message: '请输入金额' },{ validator: validate_receipt_cost, trigger: 'blur' }],
          tax_ratio: [{ validator: validate_tax_ratio, trigger: 'blur'}],
          tax: [{ validator: validate_tax, trigger: 'blur' }],
          billing_date: [{ validator: validate_billing_date, trigger: 'blur'}],
          //receipt: [{ validator: validate_receipt_file, trigger: 'blur'}],
        },
        contract_no_options: [],
        contract_name_options: [],
        displaymanage: true,
        selectloading: true,
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
    	}),
    },
    methods: {
      fileUploadRefs() {
        return ["receipt",
        ]
      },
      contractchange(val) {
        console.log(val)
        this.form.contract_name = val.split('^')[2]
        this.form.contract_id = val.split('^')[1]
        this.form.customer_id = val.split('^')[0]
      },

      display(item) {
        this.selectloading = true
        this.displaymanage = false
        console.log(item)
        this.form.contract_no=item.contract_no
        this.form.contract_name=item.contract_name
        this.form.contract_id=item.contract_id
        this.form.customer_id=item.customer_id
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
      async fetchData() {
        this.selectloading = true
        this.displaymanage = true
        let sData = '[Q]290{'+this.current_org+'}|^SYS'
        const res = await QueryExec(sData)
        console.log(sData)
        this.contract_no_options = res.data
        console.log(res.data)
        this.contract_name_options = res.data
        setTimeout(() => {
          this.selectloading = false
        }, 500)
      },
      fileUpload(callback) {
        try {
          let that = this
          const refs = that.fileUploadRefs()

          let check_list = []
          const length = refs.length
          that.loading = true
          that.loadingText = '上传文件中'
          for (let i = 0; i < length; i++) {
            try {
              if (that.$refs[refs[i]].submitUpload() === 1) {
                check_list.push(refs[i]);
              }
            } catch (e) {
              console.log(e)
            }
          }
          let index = setInterval(function() {
            let flag = true
            let length = check_list.length
            while (--length > -1) {
              if (!that.upload.success[check_list[length]] && !that.$refs[check_list[length]]
                .error) {
                flag = false
                break
              }

            }
            if (flag) {
              flag = true
              length = check_list.length
              while (--length > -1) {
                if (that.$refs[check_list[length]].error) {
                  flag = false
                }
              }

              clearInterval(index)
              callback(flag)
            } else {
              that.$baseMessage('文件上传失败', 'error')
            }
          }, 500)
        } catch (e) {
          console.log(e)
        }
      },
      save() {
      	let that = this
        console.log(that.form.contract_no)
        // that.form.contract_id=that.form.contract_no
      	that.$refs['form'].validate(async (valid) => {
          await that.$refs['receipt'].setFileName(that.form.invoice_no)
      		if (valid) {

            that.fileUpload(async function(status) {

              let sData = '[Q]220{'+that.form.contract_id+'$`'+that.form.customer_id+'$`'+that.form.invoice_no+'$`'+that.form.invoice_date+'$`'
              +that.form.billing_date+'$`'+that.form.operator+'$`'+that.form.type+'$`'+that.form.amount+'$`'+that.form.tax_ratio
              +'$`'+that.form.tax+'$`'+that.form.receipt+'$`0}|^2|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if (res > 0) {
                that.$baseMessage('发票添加成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
                that.$emit('transferTable')
              } else {
                that.$baseMessage('发票添加失败', 'error')
              }

            })

          } else {
            return false
          }
      	})

      },
      editsave() {
      	let that = this
        console.log(that.form.receipt)
      	that.$refs['form'].validate(async (valid) => {
          await that.$refs['receipt'].setFileName(that.form.invoice_no)
      		if (valid) {

            that.fileUpload(async function(status) {

              let sData = '[Q]221{'+that.form.invoice_no+'$`'+that.form.invoice_date+'$`'
              +that.form.billing_date+'$`'+that.form.operator+'$`'+that.form.type+'$`'+that.form.amount+'$`'+that.form.tax_ratio
              +'$`'+that.form.tax+'$`'+that.form.receipt+'$`'+that.form.invoice_id+'}|^1|^SYS'
              console.log(sData)
              const res = await ExecSql(sData)
              if (res > 0) {
                that.$baseMessage('修改成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
              } else {
                that.$baseMessage('修改失败', 'error')
              }

            })

          } else {
            return false
          }
      	})

      },
    },
  }
</script>
